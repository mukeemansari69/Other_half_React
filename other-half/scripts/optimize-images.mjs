import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(rootDir, "public");
const manifestPath = path.join(rootDir, "src", "generated", "image-metadata.json");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);
const maxPhotoWidth = 1400;
const maxIconWidth = 512;

const isImageFile = (filePath) => sourceExtensions.has(path.extname(filePath).toLowerCase());

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    })
  );

  return files.flat();
};

const getTargetWidth = ({ width, height }) => {
  const largestSide = Math.max(width || 0, height || 0);

  if (largestSide <= maxIconWidth) {
    return undefined;
  }

  return largestSide > 900 ? maxPhotoWidth : maxIconWidth;
};

const toPublicPath = (filePath) =>
  `/${path.relative(publicDir, filePath).replace(/\\/g, "/")}`;

const optimize = async () => {
  const files = (await walk(publicDir)).filter(isImageFile);
  const metadata = {};
  let sourceBytes = 0;
  let webpBytes = 0;

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  for (const filePath of files) {
    const input = sharp(filePath, { animated: false }).rotate();
    const imageMetadata = await input.metadata();
    const width = imageMetadata.width || 0;
    const height = imageMetadata.height || 0;
    const targetWidth = getTargetWidth({ width, height });
    const outputPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");
    const originalStats = await fs.stat(filePath);

    const pipeline = sharp(filePath, { animated: false }).rotate();

    if (targetWidth && width > targetWidth) {
      pipeline.resize({
        width: targetWidth,
        withoutEnlargement: true,
      });
    }

    await pipeline
      .webp({
        quality: originalStats.size > 300_000 ? 68 : 82,
        effort: 6,
      })
      .toFile(outputPath);

    const optimizedStats = await fs.stat(outputPath);
    const optimizedMetadata = await sharp(outputPath).metadata();
    const publicPath = toPublicPath(filePath);
    const webpPublicPath = toPublicPath(outputPath);

    sourceBytes += originalStats.size;
    webpBytes += optimizedStats.size;
    metadata[publicPath] = {
      src: webpPublicPath,
      width: optimizedMetadata.width || width,
      height: optimizedMetadata.height || height,
      bytes: optimizedStats.size,
    };
  }

  await fs.writeFile(`${manifestPath}.tmp`, `${JSON.stringify(metadata, null, 2)}\n`);
  await fs.rename(`${manifestPath}.tmp`, manifestPath);

  console.log(`Optimized ${files.length} images.`);
  console.log(`Original total: ${(sourceBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP total: ${(webpBytes / 1024 / 1024).toFixed(2)} MB`);
};

optimize().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
