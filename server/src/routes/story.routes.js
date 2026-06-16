import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import { storyUpload } from "../middleware/storyUpload.middleware.js";
import {
  createStory,
  getStoriesFeed,
  getUserStories,
  markStoryAsViewed,
  getStoryViewers,
  deleteStory
} from "../controllers/story.controller.js";

const router = express.Router();

router.post("/",                  protegerRuta, storyUpload.single("media"), createStory);
router.get("/feed",               protegerRuta, getStoriesFeed);
router.get("/user/:userId",       protegerRuta, getUserStories);
router.post("/:storyId/view",     protegerRuta, markStoryAsViewed);
router.get("/:storyId/viewers",   protegerRuta, getStoryViewers);
router.delete("/:storyId",        protegerRuta, deleteStory);

export default router;
