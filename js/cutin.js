const CUTIN_ASSETS = Object.freeze({
  blue: new URL("../assets/cutin/cutin_blue.webp", import.meta.url).href,
  gold: new URL("../assets/cutin/cutin_gold.webp", import.meta.url).href,
  rainbow: new URL("../assets/cutin/cutin_rainbow.webp", import.meta.url).href,
});

const CUTIN_LABELS = Object.freeze({
  blue: "回答を受け取りました",
  gold: "よく整理できています",
  rainbow: "完璧な回答です",
});

export function selectCutin(score, random = Math.random) {
  const correctCount = score.segments.filter(
    ({ ratio }) => ratio === 1,
  ).length;
  const roll = Math.min(Math.max(Number(random()) || 0, 0), 0.999999);

  if (correctCount === score.segments.length && roll < 0.1) {
    return "rainbow";
  }
  if (correctCount >= 3 && roll < 0.6) {
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

export function isCutinDebugMode() {
  return new URLSearchParams(window.location.search).has("debug-cutin");
}

export function cutinDebugMarkup() {
  if (!isCutinDebugMode()) return "";
  return `
    <aside class="cutin-debug" aria-label="カットイン確認用">
      <strong>演出確認</strong>
      <div>
        <button type="button" data-action="preview-cutin" data-cutin="blue">BLUE</button>
        <button type="button" data-action="preview-cutin" data-cutin="gold">GOLD</button>
        <button type="button" data-action="preview-cutin" data-cutin="rainbow">RAINBOW</button>
      </div>
    </aside>`;
}
