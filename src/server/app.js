import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { marked } from "marked";
import { renderToString } from "react-dom/server";
import React from "react";
import {
  discoverContentPaths,
  extractTitle,
  resolveContentFile,
} from "./content.js";
import { SiteNav } from "../shared/SiteNav.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

export function createApp({
  contentDir = path.join(projectRoot, "content"),
  templatePath = path.join(projectRoot, "template.html"),
  assetsDir = path.join(projectRoot, "dist/client"),
} = {}) {
  const app = express();
  const template = fs.readFileSync(templatePath, "utf-8");

  app.use("/assets", express.static(assetsDir));

  app.get("*", (req, res) => {
    const contentPaths = discoverContentPaths(contentDir);
    const markdownFile = resolveContentFile(contentDir, req.path);

    if (!markdownFile) {
      res.status(404).send(renderNotFoundPage(template, contentPaths, req.path));
      return;
    }

    const markdown = fs.readFileSync(markdownFile, "utf-8");
    const htmlContent = marked.parse(markdown);
    const title = extractTitle(markdown);
    const nav = renderToString(
      React.createElement(SiteNav, {
        paths: contentPaths,
        currentPath: req.path,
      }),
    );

    const page = template
      .replaceAll("{{title}}", escapeHtml(title))
      .replaceAll("{{paths}}", escapeHtml(JSON.stringify(contentPaths)))
      .replaceAll("{{currentPath}}", escapeHtml(req.path))
      .replaceAll("{{nav}}", nav)
      .replaceAll("{{content}}", htmlContent);

    res.status(200).type("html").send(page);
  });

  return app;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderNotFoundPage(template, contentPaths, currentPath) {
  const nav = renderToString(
    React.createElement(SiteNav, {
      paths: contentPaths,
      currentPath,
    }),
  );

  const content = `
    <section class="not-found">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
    </section>
  `;

  return template
    .replaceAll("{{title}}", "Not Found")
    .replaceAll("{{paths}}", escapeHtml(JSON.stringify(contentPaths)))
    .replaceAll("{{currentPath}}", escapeHtml(currentPath))
    .replaceAll("{{nav}}", nav)
    .replaceAll("{{content}}", content);
}
