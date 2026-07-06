import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/server/app.js";

describe("Acme CMS", () => {
  let tempDir;
  let contentDir;
  let templatePath;
  let app;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "acme-cms-test-"));
    contentDir = path.join(tempDir, "content");
    templatePath = path.join(tempDir, "template.html");

    fs.writeFileSync(
      templatePath,
      `<!doctype html><html><body><div id="root" data-paths="{{paths}}" data-current-path="{{currentPath}}">{{nav}}</div>{{content}}</body></html>`,
    );

    const nestedDir = path.join(contentDir, "updates", "launch");
    fs.mkdirSync(nestedDir, { recursive: true });
    fs.writeFileSync(
      path.join(nestedDir, "index.md"),
      "# Product Launch\n\nWe are **thrilled** to announce our latest widget.",
    );

    app = createApp({
      contentDir,
      templatePath,
      assetsDir: path.join(tempDir, "assets"),
    });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns 200 for valid content URLs", async () => {
    const response = await request(app).get("/updates/launch");

    expect(response.status).toBe(200);
  });

  it("returns HTML generated from the matching index.md file", async () => {
    const response = await request(app).get("/updates/launch");

    expect(response.text).toContain("<h1>Product Launch</h1>");
    expect(response.text).toContain("<strong>thrilled</strong>");
    expect(response.text).toContain("latest widget");
  });

  it("returns 404 for URLs that do not map to content folders", async () => {
    const response = await request(app).get("/missing-page");

    expect(response.status).toBe(404);
  });
});
