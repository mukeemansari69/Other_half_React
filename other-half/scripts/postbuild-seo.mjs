import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CANONICAL_PUBLIC_ROUTES,
  DEFAULT_SITE_URL,
  NON_INDEXABLE_ROUTES,
  SEO_HEAD_END,
  SEO_HEAD_START,
  renderSeoHead,
} from "../shared/seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DIST_INDEX_PATH = path.join(DIST_DIR, "index.html");
const SITE_URL = String(process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const ROUTE_PRIORITIES = {
  "/": "1.0",
  "/collection": "0.95",
  "/product": "0.9",
  "/doggie-dental": "0.9",
  "/daily-duo": "0.9",
  "/quiz": "0.85",
  "/science": "0.8",
  "/integrity": "0.8",
  "/our-story": "0.75",
  "/clinical-studies": "0.75",
  "/faq": "0.7",
  "/blog": "0.7",
  "/contact": "0.65",
};

const ensureSeoBlock = (html, routePath) => {
  const startIndex = html.indexOf(SEO_HEAD_START);
  const endIndex = html.indexOf(SEO_HEAD_END);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(`SEO head block markers are missing for route ${routePath}.`);
  }

  const seoHead = `${SEO_HEAD_START}\n${renderSeoHead(routePath, SITE_URL)}\n    ${SEO_HEAD_END}`;
  return `${html.slice(0, startIndex)}${seoHead}${html.slice(endIndex + SEO_HEAD_END.length)}`;
};

const writeRouteHtml = async (templateHtml, routePath) => {
  const html = ensureSeoBlock(templateHtml, routePath);

  if (routePath === "/") {
    await fs.writeFile(DIST_INDEX_PATH, html, "utf8");
    return;
  }

  const relativeRoutePath = routePath.replace(/^\//, "");
  const routeDir = path.join(DIST_DIR, relativeRoutePath);
  await fs.mkdir(routeDir, { recursive: true });
  await fs.writeFile(path.join(routeDir, "index.html"), html, "utf8");
};

const buildSitemapXml = () => {
  const lastModifiedDate = new Date().toISOString().slice(0, 10);
  const sitemapEntries = CANONICAL_PUBLIC_ROUTES.map((routePath) => {
    const absoluteUrl =
      routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${routePath}`;

    return [
      "  <url>",
      `    <loc>${absoluteUrl}</loc>`,
      `    <lastmod>${lastModifiedDate}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      `    <priority>${ROUTE_PRIORITIES[routePath] || "0.6"}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapEntries,
    "</urlset>",
    "",
  ].join("\n");
};

const buildRobotsTxt = () =>
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

const main = async () => {
  const templateHtml = await fs.readFile(DIST_INDEX_PATH, "utf8");
  const allStaticRoutes = [...new Set(["/", ...CANONICAL_PUBLIC_ROUTES, ...NON_INDEXABLE_ROUTES])];

  await Promise.all(allStaticRoutes.map((routePath) => writeRouteHtml(templateHtml, routePath)));
  await fs.writeFile(
    path.join(DIST_DIR, "404.html"),
    ensureSeoBlock(templateHtml, "/404"),
    "utf8"
  );
  await fs.writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemapXml(), "utf8");
  await fs.writeFile(path.join(DIST_DIR, "robots.txt"), buildRobotsTxt(), "utf8");
};

main().catch((error) => {
  console.error("[postbuild-seo] Failed to generate SEO assets.");
  console.error(error);
  process.exitCode = 1;
});
