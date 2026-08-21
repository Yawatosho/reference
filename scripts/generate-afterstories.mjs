import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAfterStoryMarkdown } from "../data/afterstory/markdown.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(
  projectRoot,
  "data/afterstory/afterstories.manifest.json",
);
const outputPath = resolve(
  projectRoot,
  "data/afterstory/afterstories.generated.js",
);

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const stories = await Promise.all(
  manifest.map(async (entry) => {
    const markdownFile = resolve(projectRoot, entry.markdownPath.replace(/^\.\//, ""));
    const markdown = await readFile(markdownFile, "utf8");
    const content = parseAfterStoryMarkdown(
      markdown,
      entry.caseNumber,
      entry.pagination,
    );
    return { ...entry, ...content };
  }),
);

const source = `// このファイルは scripts/generate-afterstories.mjs により生成されます。\n// 通常表示ではMarkdownを直接読み込み、この内容は読み込み失敗時の予備データとして使われます。\n\nexport const GENERATED_AFTER_STORIES = ${JSON.stringify(stories, null, 2)};\n`;

await writeFile(outputPath, source, "utf8");
console.log(`Generated ${stories.length} After Story: ${outputPath}`);
