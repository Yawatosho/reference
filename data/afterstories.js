import { GENERATED_AFTER_STORIES } from "./afterstory/afterstories.generated.js?v=20260822-afterstories11-lines22";
import { parseAfterStoryMarkdown } from "./afterstory/markdown.js?v=20260821-afterstory2";

export const AFTER_STORIES = Object.freeze(
  GENERATED_AFTER_STORIES.map((story) =>
    Object.freeze({
      ...story,
      unlock: Object.freeze({ ...story.unlock }),
      pagination: Object.freeze({ ...story.pagination }),
      pages: Object.freeze(
        story.pages.map((page) => Object.freeze([...page])),
      ),
    }),
  ),
);

export function getAfterStory(caseId) {
  return AFTER_STORIES.find((story) => story.caseId === caseId) ?? null;
}

export async function loadAfterStory(story) {
  if (!story) return null;
  const markdownPath = story.markdownPath.replace(/^\.\/data\//, "./");
  const markdownUrl = new URL(markdownPath, import.meta.url);
  try {
    const response = await fetch(markdownUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    const content = parseAfterStoryMarkdown(
      markdown,
      story.caseNumber,
      story.pagination,
    );
    return Object.freeze({
      ...story,
      ...content,
      pages: Object.freeze(
        content.pages.map((page) => Object.freeze([...page])),
      ),
    });
  } catch (error) {
    console.warn("After StoryのMarkdownを直接読み込めませんでした。", error);
    return story;
  }
}

export function isAfterStoryUnlocked(story, progress) {
  if (!story) return false;
  if (story.unlock?.type === "bestScore") {
    return (progress?.bestScores?.[story.caseId] ?? 0) >= story.unlock.minimum;
  }
  return false;
}
