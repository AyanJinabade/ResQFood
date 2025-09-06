import fs from "fs";
import path from "path";

function scanDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else {
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        const match = line.match(/\[0-9A-Fa-f]{0,3}/g);
        if (match) {
          console.log(`${fullPath}:${index + 1} → ${match.join(", ")}`);
        }
      });
    }
  }
}

// Start from current folder
scanDir("./");
