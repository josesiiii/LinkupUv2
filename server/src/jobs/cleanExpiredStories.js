import cron from "node-cron";
import Story from "../models/Story.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const startCleanupJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const expired = await Story.find({ expiresAt: { $lte: new Date() } });

      if (expired.length === 0) return;

      const authorIds = [...new Set(expired.map((s) => s.author.toString()))];

      for (const story of expired) {
        try {
          await cloudinary.uploader.destroy(story.mediaPublicId, {
            resource_type: story.mediaType === "video" ? "video" : "image"
          });
        } catch {
          // Si falla la eliminación en Cloudinary, continuar con el resto
        }
        await story.deleteOne();
      }

      for (const authorId of authorIds) {
        const remaining = await Story.countDocuments({
          author: authorId,
          expiresAt: { $gt: new Date() }
        });
        if (remaining === 0) {
          await User.findByIdAndUpdate(authorId, { hasActiveStory: false });
        }
      }

      console.log(`[Stories] Limpieza completada: ${expired.length} stories expiradas eliminadas`);
    } catch (error) {
      console.error("[Stories] Error en limpieza de stories:", error.message);
    }
  });

  console.log("[Stories] Cron de limpieza registrado (cada hora)");
};
