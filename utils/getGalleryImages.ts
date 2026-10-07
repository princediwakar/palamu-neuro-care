import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function getGalleryImages() {
  const galleryDir = path.join(process.cwd(), "public/_static/gallery");
  const files = fs.readdirSync(galleryDir).filter((f) =>
    /\.(jpe?g|png|webp|avif)$/i.test(f)
  );

  const images = await Promise.all(
    files.map(async (file) => {
      const imagePath = path.join(galleryDir, file);
      const metadata = await sharp(imagePath).metadata();
      const stats = fs.statSync(imagePath); // Get file creation date

      return {
        src: `/_static/gallery/${encodeURIComponent(file)}`,
        alt: `Gallery Image - ${file.split(".")[0]}`,
        width: metadata.width || 400, // Use actual width or default
        height: metadata.height || 600, // Use actual height or default
        createdAt: stats.birthtime, // File creation date
      };
    })
  );

  // Sort images by creation date (most recent first)
  // images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return images;
}

