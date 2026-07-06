import fs from "node:fs";
import path from "node:path";

export function resolveContentFile(contentDir, urlPath) {
  const normalized = urlPath.replace(/^\/+|\/+$/g, "");

  if (!normalized || normalized.includes("..")) {
    return null;
  }

  const markdownPath = path.resolve(contentDir, normalized, "index.md");
  const resolvedContentDir = path.resolve(contentDir);

  if (!markdownPath.startsWith(resolvedContentDir + path.sep)) {
    return null;
  }

  if (!fs.existsSync(markdownPath)) {
    return null;
  }

  return markdownPath;
}

export function discoverContentPaths(contentDir, relativeDir = "") {
  const absoluteDir = path.join(contentDir, relativeDir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const relativePath = relativeDir
      ? `${relativeDir}/${entry.name}`
      : entry.name;
    const indexPath = path.join(contentDir, relativePath, "index.md");

    if (fs.existsSync(indexPath)) {
      paths.push(`/${relativePath}`);
    }

    paths.push(...discoverContentPaths(contentDir, relativePath));
  }

  return paths.sort();
}

export function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Acme Co.";
}
