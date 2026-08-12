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

export function getDebugCutin() {
  const cutinId = new URLSearchParams(window.location.search).get(
    "debug-cutin",
  );
  return CUTIN_ASSETS[cutinId] ? cutinId : null;
}

export function setDebugCutin(cutinId) {
  const url = new URL(window.location.href);
  if (CUTIN_ASSETS[cutinId]) {
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
  return `
    <aside class="cutin-debug" aria-label="カットイン確認用">
      <strong>回答演出の指定</strong>
      <span class="cutin-debug__status" data-cutin-debug-status>${selectedCutin ? `${selectedCutin.toUpperCase()} を指定中` : "AUTO（通常抽選）"}</span>
      <div>
        <button type="button" data-action="set-cutin-debug" data-cutin="" aria-pressed="${String(!selectedCutin)}">AUTO</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="blue" aria-pressed="${String(selectedCutin === "blue")}">BLUE</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="gold" aria-pressed="${String(selectedCutin === "gold")}">GOLD</button>
        <button type="button" data-action="set-cutin-debug" data-cutin="rainbow" aria-pressed="${String(selectedCutin === "rainbow")}">RAINBOW</button>
      </div>
    </aside>`;
}
