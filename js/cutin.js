const CUTIN_ASSETS = Object.freeze({
  default: Object.freeze({
    blue: new URL("../assets/cutin/cutin_blue.webp", import.meta.url).href,
    gold: new URL("../assets/cutin/cutin_gold.webp", import.meta.url).href,
    rainbow: new URL("../assets/cutin/cutin_rainbow.webp", import.meta.url).href,
  }),
  det: Object.freeze({
    blue: new URL("../assets/cutin/cutin_blue_det.webp", import.meta.url).href,
    gold: new URL("../assets/cutin/cutin_gold_det.webp", import.meta.url).href,
    rainbow: new URL("../assets/cutin/cutin_rainbow_det.webp", import.meta.url).href,
  }),
});

const CUTIN_IDS = new Set(["blue", "gold", "rainbow"]);

const CUTIN_LABELS = Object.freeze({
  blue: "回答を受け取りました",
  gold: "よく整理できています",
  rainbow: "完璧な回答です",
});

const DEBUG_LABELS = Object.freeze({
  blue: "BLUE",
  gold: "GOLD",
  rainbow: "RAINBOW",
});

export function selectCutin(score, random = Math.random) {
  const correctCount = score.segments.filter(
    ({ ratio }) => ratio === 1,
  ).length;
  const roll = Math.min(Math.max(Number(random()) || 0, 0), 0.999999);

  if (correctCount === score.segments.length) {
    if (roll < 0.1) return "rainbow";
    if (roll < 0.6) return "gold";
    return "blue";
  }
  if (correctCount >= 3 && roll < 0.5) {
    return "gold";
  }
  return "blue";
}

export function showCutin(cutinId, { duration = 1300, assetVariant = "default" } = {}) {
  const assets = CUTIN_ASSETS[assetVariant] ?? CUTIN_ASSETS.default;
  const id = assets[cutinId] ? cutinId : "blue";
  const previous = document.querySelector("[data-cutin-overlay]");
  previous?.remove();

  const overlay = document.createElement("div");
  overlay.className = `cutin-overlay cutin-overlay--${id}`;
  overlay.dataset.cutinOverlay = "";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "assertive");
  overlay.innerHTML = `<img src="${assets[id]}" alt="${CUTIN_LABELS[id]}" />`;
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
      </div>
    </aside>`;
}
