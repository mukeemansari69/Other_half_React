import fs from "node:fs/promises";
import path from "node:path";
import imageMetadata from "../src/generated/image-metadata.json" with { type: "json" };

const rootDir = path.resolve(import.meta.dirname, "..");
const targetDirs = ["src", "public"].map((dir) => path.join(rootDir, dir));
const targetExtensions = new Set([".js", ".jsx", ".css", ".html", ".json"]);

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

const replaceReferences = async () => {
  const files = (await Promise.all(targetDirs.map(walk)))
    .flat()
    .filter((filePath) => targetExtensions.has(path.extname(filePath).toLowerCase()))
    .filter((filePath) => !filePath.endsWith(path.join("generated", "image-metadata.json")));
  const replacements = Object.entries(imageMetadata).sort((a, b) => b[0].length - a[0].length);
  let changedFiles = 0;

  for (const filePath of files) {
    let contents = await fs.readFile(filePath, "utf8");
    const originalContents = contents;

    for (const [sourcePath, optimized] of replacements) {
      contents = contents.split(sourcePath).join(optimized.src);
    }

    if (contents !== originalContents) {
      await fs.writeFile(filePath, contents);
      changedFiles += 1;
    }
  }

  console.log(`Updated image references in ${changedFiles} files.`);
};

replaceReferences().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
