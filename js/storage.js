export const STORAGE_KEY = "referenceInterviewProgress_v1";

const DEFAULT_PROGRESS = Object.freeze({
  completedCases: [],
  bestScores: {},
  variantHistory: {},
  volume: 1,
  endingSeen: false,
  endingUnlockedNoticed: false,
});

function normalizeScore(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(Math.min(100, Math.max(0, value)));
}

function normalizeBestScores(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([caseId, valueScore]) => {
      const score = normalizeScore(valueScore);
      const unsafeKey = ["__proto__", "constructor", "prototype"].includes(caseId);
      return score === null || unsafeKey ? [] : [[caseId, score]];
    }),
  );
}

function normalizeVariantHistory(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([caseId, variants]) => {
      const unsafeKey = ["__proto__", "constructor", "prototype"].includes(caseId);
      if (unsafeKey || !Array.isArray(variants)) return [];
      const normalizedVariants = [
        ...new Set(variants.filter((variantId) => typeof variantId === "string")),
      ].slice(-10);
      return normalizedVariants.length > 0 ? [[caseId, normalizedVariants]] : [];
    }),
  );
}

function normalizeProgress(value) {
  return {
    completedCases: Array.isArray(value?.completedCases)
      ? [...new Set(value.completedCases.filter((id) => typeof id === "string"))]
      : [],
    bestScores: normalizeBestScores(value?.bestScores),
    variantHistory: normalizeVariantHistory(value?.variantHistory),
    volume: Number.isFinite(value?.volume)
      ? Math.min(1, Math.max(0, value.volume))
      : 1,
    endingSeen: value?.endingSeen === true,
    endingUnlockedNoticed: value?.endingUnlockedNoticed === true,
  };
}

export function loadProgress(storage = globalThis.localStorage) {
  if (!storage) return normalizeProgress(DEFAULT_PROGRESS);

  try {
    const stored = storage.getItem(STORAGE_KEY);
    return stored
      ? normalizeProgress(JSON.parse(stored))
      : normalizeProgress(DEFAULT_PROGRESS);
  } catch {
    return normalizeProgress(DEFAULT_PROGRESS);
  }
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  const normalized = normalizeProgress(progress);
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // 保存できない環境でもゲーム本体は継続する。
  }
  return normalized;
}

export function recordResult(progress, caseId, score, storage) {
  const next = normalizeProgress(progress);
  if (!next.completedCases.includes(caseId)) {
    next.completedCases.push(caseId);
  }
  const normalizedScore = normalizeScore(score) ?? 0;
  next.bestScores[caseId] = Math.max(
    next.bestScores[caseId] ?? 0,
    normalizedScore,
  );
  return saveProgress(next, storage);
}

export function recordVariant(
  progress,
  caseId,
  variantId,
  historySize = 1,
  storage,
) {
  const next = normalizeProgress(progress);
  if (typeof caseId !== "string" || typeof variantId !== "string") return next;
  const safeHistorySize = Math.min(
    10,
    Math.max(1, Number.isFinite(historySize) ? Math.floor(historySize) : 1),
  );
  const previous = next.variantHistory[caseId] ?? [];
  next.variantHistory[caseId] = [
    ...previous.filter((storedVariantId) => storedVariantId !== variantId),
    variantId,
  ].slice(-safeHistorySize);
  return saveProgress(next, storage);
}

export function setVolume(progress, volume, storage) {
  return saveProgress({ ...progress, volume }, storage);
}

export function markEndingSeen(progress, storage) {
  return saveProgress({ ...progress, endingSeen: true }, storage);
}

export function markEndingUnlockedNoticed(progress, storage) {
  return saveProgress({ ...progress, endingUnlockedNoticed: true }, storage);
}

export function isCaseUnlocked(cases, caseId, progress) {
  const index = cases.findIndex((item) => item.id === caseId);
  if (index <= 0) return index >= 0;

  const unlockAfter = cases[index].unlockAfter;
  if (Array.isArray(unlockAfter) && unlockAfter.length > 0) {
    return unlockAfter.every((requiredCaseId) =>
      progress.completedCases.includes(requiredCaseId),
    );
  }

  return progress.completedCases.includes(cases[index - 1].id);
}

export function isCaseVisible(caseData, progress) {
  const revealAfter = caseData.revealAfter;
  if (!Array.isArray(revealAfter) || revealAfter.length === 0) return true;

  return revealAfter.every((requiredCaseId) =>
    progress.completedCases.includes(requiredCaseId),
  );
}

export function clearProgress(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // 操作不可の環境では何もしない。
  }
  return normalizeProgress(DEFAULT_PROGRESS);
}
