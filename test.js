const fs = require("fs");
const path = require("path");

const OUTDIR = "./public/";
const EXPECTED_POSTS = 37;

const files = fs.readdirSync(OUTDIR).filter((x) => !x.endsWith(".map"));
const posts = files.filter((x) => /\d{4}-\d{2}-\d{2}-/.test(x));

if (posts.length < EXPECTED_POSTS) {
  console.error(
    `Did not find at least ${EXPECTED_POSTS} posts, only found ${posts.length}.`
  );
  process.exit(1);
}

const noIndex = posts.filter(
  (x) => !fs.existsSync(path.join(OUTDIR, x, "index.html"))
);

if (noIndex.length) {
  console.error(`Found ${noIndex.length} posts without an index file.`);
  process.exit(1);
}

const missingPostData = posts.filter(
  (x) => !fs.existsSync(path.join(OUTDIR, "page-data", x, "page-data.json"))
);

if (missingPostData.length) {
  console.error(`Missing page data for ${missingPostData.length} posts.`);
  process.exit(1);
}

const requiredFiles = [
  // Structure
  "index.html",
  "_headers",
  "_redirects",
  "404.html",
  "manifest.json",
  "robots.txt",
  "rss.xml",
  "sitemap.xml",
  // Pages
  "cv/index.html",
  "projects/index.html",
];

const missingRequiredFiles = requiredFiles.filter(
  (x) => !fs.existsSync(OUTDIR, x)
);

if (missingRequiredFiles.length) {
  console.error(`Missing required files ${missingRequiredFiles}.`);
  process.exit(1);
}
