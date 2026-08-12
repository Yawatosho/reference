const CUTIN_ASSETS = Object.freeze({
  blue: new URL("../assets/cutin/cutin_blue.webp", import.meta.url).href,
  gold: new URL("../assets/cutin/cutin_gold.webp", import.meta.url).href,
  rainbow: new URL("../assets/cutin/cutin_rainbow.webp", import.meta.url).href,
});

const CUTIN_IDS = new Set(["blue", "gold", "rainbow", "answer"]);

const CUTIN_LABELS = Object.freeze({
  blue: "回答を受け取りました",
  gold: "よく整理できています",
  rainbow: "完璧な回答です",
  answer: "回答全文の演出",
});

const DEBUG_LABELS = Object.freeze({
  blue: "BLUE",
  gold: "GOLD",
  rainbow: "RAINBOW",
  answer: "FULL TEXT",
});

export function selectCutin(score, random = Math.random) {
  const correctCount = score.segments.filter(
    ({ ratio }) => ratio === 1,
  ).length;
  const roll = Math.min(Math.max(Number(random()) || 0, 0), 0.999999);

  if (correctCount === score.segments.length) {
    if (roll < 0.1) return "answer";
    if (roll < 0.2) return "rainbow";
    if (roll < 0.7) return "gold";
    return "blue";
  }
  if (correctCount >= 3 && roll < 0.5) {
    return "gold";
  }
  return "blue";
}

export function showCutin(cutinId, { duration = 1300 } = {}) {
  const id = CUTIN_ASSETS[cutinId] ? cutinId : "blue";
  const previous = document.querySelector("[data-cutin-overlay]");
  previous?.remove();

  const overlay = document.createElement("div");
  overlay.className = `cutin-overlay cutin-overlay--${id}`;
  overlay.dataset.cutinOverlay = "";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "assertive");
  overlay.innerHTML = `<img src="${CUTIN_ASSETS[id]}" alt="${CUTIN_LABELS[id]}" />`;
  document.body.append(overlay);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      overlay.classList.add("cutin-overlay--leaving");
      window.setTimeout(() => {
        overlay.remove();
        resolve(id);
      }, 180);
    }, duration);
  });
}

export async function showAnswerSequence(answerText) {
  const previous = document.querySelector("[data-cutin-overlay]");
  previous?.remove();

  const overlay = document.createElement("div");
  overlay.className = "answer-sequence";
  overlay.dataset.cutinOverlay = "";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "assertive");

  const typing = document.createElement("p");
  typing.className = "answer-sequence__typing";
  const full = document.createElement("p");
  full.className = "answer-sequence__full";
  full.textContent = answerText;
  overlay.append(typing, full);
  document.body.append(overlay);

  const { startAnswerTypingSound, stopAnswerTypingSound, playAnswerRevealSound } =
    await import("./audio.js?v=20260812-answersequence1");
  const characters = Array.from(answerText);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    typing.textContent = characters.at(-1) ?? "";
  } else {
    startAnswerTypingSound();
    for (let index = 0; index < characters.length; index += 1) {
      typing.textContent = characters[index] === " " ? " " : characters[index];
      typing.classList.remove("answer-sequence__typing--visible");
      void typing.offsetWidth;
      typing.classList.add("answer-sequence__typing--visible");
      await new Promise((resolve) => window.setTimeout(resolve, 118));
      typing.textContent = "";
      await new Promise((resolve) => window.setTimeout(resolve, 36));
    }
    stopAnswerTypingSound();
  }

  await new Promise((resolve) => window.setTimeout(resolve, 420));
  overlay.classList.add("answer-sequence--complete");
  playAnswerRevealSound();
  await new Promise((resolve) => window.setTimeout(resolve, 1550));
  overlay.classList.add("answer-sequence--leaving");
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  overlay.remove();
}

export function isCutinDebugMode() {
  return new URLSearchParams(window.location.search).has("debug-cutin");
}

export function getDebugCutin() {
  const cutinId = new URLSearchParams(window.location.search).get(
    "debug-cutin",
  );
  return CUTIN_IDS.has(cutinId) ? cutinId : null;
}

export function setDebugCutin(cutinId) {
  const url = new URL(window.location.href);
  if (CUTIN_IDS.has(cutinId)) {
    url.searchParams.set("debug-cutin", cutinId);
  } else {
    url.searchParams.set("debug-cutin", "1");
  }
  window.history.replaceState({}, "", url);
  return getDebugCutin();
}

export function cutinDebugMarkup() {
  if (!isCutinDebugMode()) return "";
  const selectedCutin = getDebugCutin();
  const selectedLabel = selectedCutin ? DEBUG_LABELS[selectedCutin] : null;
  return `
    <aside class="cutin-debug" aria-label="カットイン確認用">
      <strong>回答演出の指定</strong>
      <span class="cutin-debug__status" data-cutin-debug-status>${selectedLabel ? `${selectedLabel} を指定中` : "AUTO（通常抽選）"}</span>
      <div>
        <button type="button" data-action="set-cutin-debug" data-cutin="" aria-pressed="${String(!selectedCutin)}">AUTO</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="blue" aria-pressed="${String(selectedCutin === "blue")}">BLUE</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="gold" aria-pressed="${String(selectedCutin === "gold")}">GOLD</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="rainbow" aria-pressed="${String(selectedCutin === "rainbow")}">RAINBOW</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="answer" aria-pressed="${String(selectedCutin === "answer")}">FULL TEXT</button>
      </div>
    </aside>`;
}
