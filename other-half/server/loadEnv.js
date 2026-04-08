import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ENV_LOADER_FLAG = "__OTHER_HALF_ENV_LOADED__";

if (!globalThis[ENV_LOADER_FLAG]) {
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(serverDir, "..");
  const envFiles = [".env", ".env.local"];

  envFiles.forEach((fileName) => {
    const filePath = path.join(rootDir, fileName);

    if (!fs.existsSync(filePath)) {
      return;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");

    fileContents.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        return;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      let value = trimmedLine.slice(separatorIndex + 1).trim();

      if (!key || process.env[key] !== undefined) {
        return;
      }

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    });
  });

  globalThis[ENV_LOADER_FLAG] = true;
}
