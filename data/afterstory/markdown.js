export function extractAfterStoryTitle(heading, caseNumber) {
  const prefix = new RegExp(
    `^Case\\s*0?${Number(caseNumber)}\\s+After Story[\\s　:：-]*`,
    "i",
  );
  return heading.replace(prefix, "").trim() || heading.trim();
}

function textWidth(text) {
  return [...text].reduce(
    (width, character) => width + (/^[\x00-\x7f]$/.test(character) ? 0.5 : 1),
    0,
  );
}

function estimateParagraphLines(paragraph, charactersPerLine) {
  return paragraph.split("\n").reduce(
    (lines, line) =>
      lines + Math.max(1, Math.ceil(textWidth(line) / charactersPerLine)),
    0,
  );
}

function paginateByFixedLines(paragraphs, pagination) {
  const linesPerPage = Math.max(1, Number(pagination?.linesPerPage) || 22);
  const charactersPerLine = Math.max(
    1,
    Number(pagination?.charactersPerLine) || 34,
  );
  const pages = [];
  let page = [];
  let usedLines = 0;

  paragraphs.forEach((paragraph) => {
    const paragraphLines = estimateParagraphLines(paragraph, charactersPerLine);
    const separatorLines = page.length > 0 ? 1 : 0;
    if (page.length > 0 && usedLines + separatorLines + paragraphLines > linesPerPage) {
      pages.push(page);
      page = [];
      usedLines = 0;
    }
    usedLines += (page.length > 0 ? 1 : 0) + paragraphLines;
    page.push(paragraph);
  });

  if (page.length > 0) pages.push(page);
  return pages;
}

export function parseAfterStoryMarkdown(markdown, caseNumber, pagination) {
  const normalized = markdown.replace(/\r\n?/g, "\n").trim();
  const headingMatch = normalized.match(/^#\s+(.+)$/m);
  if (!headingMatch) throw new Error("After StoryのH1見出しがありません。");

  const title = extractAfterStoryTitle(headingMatch[1], caseNumber);
  const body = normalized.slice(headingMatch.index + headingMatch[0].length).trim();
  const paragraphs = body
    .replace(/\n?\s*<!--\s*pagebreak\s*-->\s*\n?/gi, "\n\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const pages = paginateByFixedLines(paragraphs, pagination);

  if (pages.length === 0) throw new Error("After Storyの本文がありません。");
  return { title, pages };
}
