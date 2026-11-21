import { cp, mkdir, rm } from "node:fs/promises";

const files = ["index.html", "styles.css", "app.js", "books.json", "manifest.webmanifest"];
await rm("www", { recursive: true, force: true });
await mkdir("www", { recursive: true });
for (const file of files) {
  await cp(file, `www/${file}`);
}
console.log(`Prepared ${files.length} local web assets in www/`);
