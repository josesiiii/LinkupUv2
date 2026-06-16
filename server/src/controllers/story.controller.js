import Story from "../models/Story.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import cloudinary from "../config/cloudinary.js";
import { uploadStoryToCloudinary } from "../utils/uploadStory.js";

const getConnections = async (userId) => {
  const conversations = await Conversation.find({
    $or: [{ participantA: userId }, { participantB: userId }]
  });
  return conversations.map((c) =>
    c.participantA.toString() === userId.toString() ? c.participantB : c.participantA
  );
};

// POST /api/stories
export const createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debes subir un archivo de imagen o video" });
    }

    const { mediaUrl, mediaPublicId, mediaType } = await uploadStoryToCloudinary(
      req.file.buffer,
      req.file.mimetype
    );

    const story = await Story.create({
      author: req.usuario._id,
      mediaUrl,
      mediaPublicId,
      mediaType,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await User.findByIdAndUpdate(req.usuario._id, { hasActiveStory: true });

    res.status(201).json({ message: "Story publicada", story });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/feed
export const getStoriesFeed = async (req, res) => {
  try {
    const connections = await getConnections(req.usuario._id);

    const stories = await Story.find({
      author: { $in: connections },
      expiresAt: { $gt: new Date() }
    })
      .populate("author", "fullName profilePicture hasActiveStory")
      .sort({ createdAt: 1 });

    const grouped = {};
    for (const story of stories) {
      const authorId = story.author._id.toString();
      if (!grouped[authorId]) {
        grouped[authorId] = { author: story.author, stories: [] };
      }
      const seen = story.viewers.some(
        (v) => v.user.toString() === req.usuario._id.toString()
      );
      grouped[authorId].stories.push({
        _id: story._id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        expiresAt: story.expiresAt,
        viewerCount: story.viewers.length,
        seen
      });
    }

    res.status(200).json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/user/:userId
export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const isOwn = userId === req.usuario._id.toString();

    if (!isOwn) {
      const connections = await getConnections(req.usuario._id);
      const isConnection = connections.some((id) => id.toString() === userId);
      if (!isConnection) {
        return res.status(403).json({ message: "No tienes permiso para ver estas stories" });
      }
    }

    const stories = await Story.find({
      author: userId,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: 1 });

    const result = stories.map((story) => {
      const seen = story.viewers.some(
        (v) => v.user.toString() === req.usuario._id.toString()
      );
      return {
        _id: story._id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        expiresAt: story.expiresAt,
        viewerCount: story.viewers.length,
        seen,
        ...(isOwn && { viewers: story.viewers })
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories/:storyId/view
export const markStoryAsViewed = async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      expiresAt: { $gt: new Date() }
    });

    if (!story) {
      return res.status(404).json({ message: "Story no encontrada o expirada" });
    }

    const alreadySeen = story.viewers.some(
      (v) => v.user.toString() === req.usuario._id.toString()
    );

    if (!alreadySeen) {
      await Story.findByIdAndUpdate(req.params.storyId, {
        $push: { viewers: { user: req.usuario._id, viewedAt: new Date() } }
      });
    }

    res.status(200).json({ message: "Vista registrada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories/:storyId/viewers
export const getStoryViewers = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId).populate(
      "viewers.user",
      "fullName profilePicture"
    );

    if (!story) {
      return res.status(404).json({ message: "Story no encontrada" });
    }

    if (story.author.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: "Solo el autor puede ver quién vio la story" });
    }

    res.status(200).json(story.viewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/stories/:storyId
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: "Story no encontrada" });
    }

    if (story.author.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: "No puedes eliminar una story ajena" });
    }

    await cloudinary.uploader.destroy(story.mediaPublicId, {
      resource_type: story.mediaType === "video" ? "video" : "image"
    });

    await story.deleteOne();

    const remaining = await Story.countDocuments({
      author: req.usuario._id,
      expiresAt: { $gt: new Date() }
    });

    if (remaining === 0) {
      await User.findByIdAndUpdate(req.usuario._id, { hasActiveStory: false });
    }

    res.status(200).json({ message: "Story eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
