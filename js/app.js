import { CASES } from "../data/cases.js?v=20260812-sourceclarity1";
import {
  playScreenMusic,
  setAudioVolume,
  playChoiceSound,
  playQuestionSound,
  playDecisionSound,
  startMessageSound,
  stopMessageSound,
  stopScreenMusic,
} from "./audio.js?v=20260815-interaction1";
import {
  cutinDebugMarkup,
  getDebugCutin,
  selectCutin,
  setDebugCutin,
  showCutin,
} from "./cutin.js?v=20260812-timing1";
import { trackPageView } from "./analytics.js?v=20260812-analytics1";
import { GameSession } from "./game.js?v=20260812-recoveryrandom1";
import {
  clearProgress,
  isCaseUnlocked,
  isCaseVisible,
  loadProgress,
  recordResult,
  recordVariant,
  setVolume,
} from "./storage.js?v=20260811-case3multi1";
import {
  answerChoiceDialog,
  caseSelectScreen,
  confirmDialog,
  deductionScreen,
  howToDialog,
  interviewScreen,
  resultScreen,
  topScreen,
} from "./ui.js?v=20260815-interaction1";

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");

let progress = loadProgress();
setAudioVolume(progress.volume);
let currentCase = null;
let session = null;
const lastVariantIds = new Map();
let typingTimer = null;
let activeTypingController = null;
let questionFeedbackTimer = null;
let resultRevealController = null;
let resultRevealFrame = null;
const resultRevealTimers = new Set();
let renderVersion = 0;
const mobileInterviewQuery = "(max-width: 760px)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function announce(message) {
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
  }, 30);
}

function mount(markup, { focus = true, preserveScroll = false } = {}) {
  const scrollPosition = preserveScroll
    ? { left: window.scrollX, top: window.scrollY }
    : null;
  renderVersion += 1;
  stopMessageSound();
  activeTypingController = null;
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }
  if (questionFeedbackTimer !== null) {
    window.clearTimeout(questionFeedbackTimer);
    questionFeedbackTimer = null;
  }
  cancelResultReveal();
  app.innerHTML = `${markup}${howToDialog()}${confirmDialog()}${answerChoiceDialog()}${cutinDebugMarkup()}`;
  if (focus) app.focus({ preventScroll: true });
  window.scrollTo({
    ...(scrollPosition ?? { left: 0, top: 0 }),
    behavior: "instant",
  });
}

function renderTop() {
  currentCase = null;
  session = null;
  stopScreenMusic();
  mount(topScreen(progress));
  trackPageView("title", document.title);
}

function renderCases() {
  const caseView = CASES.filter((data) => isCaseVisible(data, progress)).map(
    (data) => ({
      data,
      unlocked: isCaseUnlocked(CASES, data.id, progress),
    }),
  );
  stopScreenMusic();
  mount(caseSelectScreen(caseView, progress));
  trackPageView("cases", `ケースファイル｜${document.title}`);
}

function animateConversation(conversation, conversationView = null) {
  const recoveryNotice = document.querySelector("[data-recovery-notice]");
  const limitNotice = document.querySelector("[data-limit-notice]");
  const revealRecoveryNotice = () => {
    if (!recoveryNotice?.hidden) return;
    recoveryNotice.hidden = false;
    announce(
      recoveryNotice.textContent.replace(/\s+/g, " ").trim(),
    );
  };
  const revealLimitNotice = () => {
    if (!limitNotice?.hidden) return;
    limitNotice.hidden = false;
    announce(limitNotice.textContent.replace(/\s+/g, " ").trim());
  };
  const revealConversationNotices = () => {
    revealLimitNotice();
    revealRecoveryNotice();
  };
  const targets = [...conversation.querySelectorAll("[data-typing-text]")];
  if (targets.length === 0) {
    conversation.scrollTop = conversation.scrollHeight;
    revealConversationNotices();
    return;
  }

  const isMobileInterview = window.matchMedia(mobileInterviewQuery).matches;
  if (
    prefersReducedMotion() &&
    !isMobileInterview
  ) {
    conversation.scrollTop = conversation.scrollHeight;
    revealConversationNotices();
    return;
  }

  const version = renderVersion;
  const messages = targets.map((target) => target.closest(".message"));
  const questionButtons = [
    ...document.querySelectorAll(".question-button:not(:disabled)"),
  ];
  const newQuestionButtons = [
    ...document.querySelectorAll(".question-button--new"),
  ];
  conversation.setAttribute("aria-busy", "true");
  questionButtons.forEach((button) => {
    button.disabled = true;
  });
  newQuestionButtons.forEach((button) => {
    button.hidden = true;
  });
  targets.forEach((target) => {
    target.textContent = "";
  });
  messages.slice(1).forEach((message) => {
    message.hidden = true;
  });

  const previousBottomOffset = Math.max(
    0,
    Number(conversationView?.bottomOffset ?? 0),
  );
  conversation.scrollTop = Math.max(
    0,
    conversation.scrollHeight - conversation.clientHeight - previousBottomOffset,
  );

  const scrollToLatestMessage = () => {
    conversation.scrollTop = conversation.scrollHeight;
  };

  let targetIndex = 0;
  let characterIndex = 0;
  let canSkipCurrent = false;

  const finishConversation = () => {
    conversation.removeAttribute("aria-busy");
    revealConversationNotices();
    questionButtons.forEach((button) => {
      button.disabled = false;
    });
    newQuestionButtons.forEach((button) => {
      button.hidden = false;
    });
    activeTypingController = null;
    typingTimer = null;
    window.requestAnimationFrame(scrollToLatestMessage);
  };

  const finishCurrentMessage = (skipped = false) => {
    if (!canSkipCurrent || version !== renderVersion) return false;
    canSkipCurrent = false;
    if (typingTimer !== null) {
      window.clearTimeout(typingTimer);
      typingTimer = null;
    }

    const target = targets[targetIndex];
    target.textContent = target.dataset.typingText ?? "";
    scrollToLatestMessage();
    if (skipped || messages[targetIndex]?.dataset.messageLoop !== "false") {
      stopMessageSound();
    }

    targetIndex += 1;
    characterIndex = 0;
    if (targetIndex >= targets.length) {
      finishConversation();
      return true;
    }

    typingTimer = window.setTimeout(() => {
      if (version !== renderVersion) return;
      messages[targetIndex].hidden = false;
      messages[targetIndex].classList.add("message--turn-enter");
      scrollToLatestMessage();
      startCurrentMessage();
    }, 360);
    return true;
  };

  const startCurrentMessage = () => {
    if (version !== renderVersion) return;
    canSkipCurrent = true;
    startMessageSound(
      messages[targetIndex]?.dataset.messageSound,
      Number(messages[targetIndex]?.dataset.messageRate ?? 1),
      messages[targetIndex]?.dataset.messageLoop !== "false",
    );
    typeNextCharacter();
  };

  const typeNextCharacter = () => {
    if (version !== renderVersion) return;

    const target = targets[targetIndex];
    const characters = Array.from(target.dataset.typingText ?? "");
    characterIndex += 1;
    target.textContent = characters.slice(0, characterIndex).join("");
    scrollToLatestMessage();

    if (characterIndex >= characters.length) return finishCurrentMessage();

    typingTimer = window.setTimeout(typeNextCharacter, 18);
  };

  activeTypingController = {
    skipCurrent: () => finishCurrentMessage(true),
  };
  typingTimer = window.setTimeout(startCurrentMessage, 120);
}

function moveConversationIntoViewOnMobile(conversation) {
  if (!window.matchMedia(mobileInterviewQuery).matches) return;

  const behavior = prefersReducedMotion()
    ? "auto"
    : "smooth";
  window.requestAnimationFrame(() => {
    const margin = 12;
    const rect = conversation.getBoundingClientRect();
    const visibleHeight = window.innerHeight - margin * 2;
    let scrollDelta = 0;

    if (rect.height > visibleHeight || rect.top < margin) {
      scrollDelta = rect.top - margin;
    } else if (rect.bottom > window.innerHeight - margin) {
      scrollDelta = rect.bottom - (window.innerHeight - margin);
    }

    if (Math.abs(scrollDelta) > 1) {
      window.scrollBy({ top: scrollDelta, behavior });
    }
  });
}

function renderInterview(options = {}) {
  const {
    preserveScroll = false,
    moveToConversation = false,
    conversationView = null,
    ...screenOptions
  } = options;
  mount(
    interviewScreen(session, { ...screenOptions, volume: progress.volume }),
    { focus: !preserveScroll, preserveScroll },
  );
  playScreenMusic("interview");
  trackPageView(
    `cases/${currentCase.id}/interview`,
    `${currentCase.title}｜インタビュー｜${document.title}`,
  );
  const conversation = document.querySelector("#conversation");
  if (conversation) {
    if (moveToConversation) moveConversationIntoViewOnMobile(conversation);
    animateConversation(conversation, conversationView);
  }
}

function renderDeduction() {
  mount(deductionScreen(session, progress.volume));
  playScreenMusic("deduction");
  trackPageView(
    `cases/${currentCase.id}/answer`,
    `${currentCase.title}｜回答作成｜${document.title}`,
  );
}

function renderResult() {
  const currentIndex = CASES.findIndex((item) => item.id === currentCase.id);
  mount(resultScreen(session, progress, currentIndex < CASES.length - 1));
  playScreenMusic("result");
  trackPageView(
    `cases/${currentCase.id}/result`,
    `${currentCase.title}｜結果｜${document.title}`,
  );
  startResultReveal(() => {
    const score = session.state.score;
    announce(`採点結果は${score.total}点、ランク${score.rank}です。`);
  });
}

function scheduleResultStep(callback, delay) {
  const timer = window.setTimeout(() => {
    resultRevealTimers.delete(timer);
    callback();
  }, delay);
  resultRevealTimers.add(timer);
}

function cancelResultReveal() {
  resultRevealTimers.forEach((timer) => window.clearTimeout(timer));
  resultRevealTimers.clear();
  if (resultRevealFrame !== null) {
    window.cancelAnimationFrame(resultRevealFrame);
    resultRevealFrame = null;
  }
  resultRevealController = null;
}

function startResultReveal(onComplete) {
  const root = document.querySelector("[data-result-reveal]");
  if (!root) return;
  const segments = [...root.querySelectorAll("[data-result-segment]")];
  const totalParts = [...root.querySelectorAll("[data-result-total]")];
  const rankParts = [...root.querySelectorAll("[data-result-rank]")];
  const actions = root.querySelector("[data-result-actions]");
  const scoreElement = root.querySelector("[data-result-score]");
  const finalScore = Number(scoreElement?.dataset.resultScore ?? 0);
  const scorePrecision = Number.isInteger(finalScore) ? 1 : 10;
  const actionButtons = [...(actions?.querySelectorAll("button") ?? [])];
  let completed = false;

  root.classList.add("result-page--revealing");
  root.setAttribute("aria-busy", "true");
  segments.forEach((item) => item.removeAttribute("data-revealed"));
  totalParts.forEach((item) => item.removeAttribute("data-revealed"));
  rankParts.forEach((item) => item.removeAttribute("data-revealed"));
  actionButtons.forEach((button) => {
    button.disabled = true;
  });
  if (scoreElement) scoreElement.textContent = "0";

  const finish = () => {
    if (completed) return;
    completed = true;
    resultRevealTimers.forEach((timer) => window.clearTimeout(timer));
    resultRevealTimers.clear();
    if (resultRevealFrame !== null) {
      window.cancelAnimationFrame(resultRevealFrame);
      resultRevealFrame = null;
    }
    segments.forEach((item) => item.setAttribute("data-revealed", "true"));
    totalParts.forEach((item) => item.setAttribute("data-revealed", "true"));
    rankParts.forEach((item) => item.setAttribute("data-revealed", "true"));
    if (scoreElement) scoreElement.textContent = String(finalScore);
    actionButtons.forEach((button) => {
      button.disabled = false;
    });
    root.classList.remove("result-page--revealing");
    root.classList.add("result-page--revealed");
    root.removeAttribute("aria-busy");
    resultRevealController = null;
    onComplete?.();
  };

  resultRevealController = { finish };
  if (prefersReducedMotion()) {
    finish();
    return;
  }

  const initialDelay = 180;
  const segmentInterval = 260;
  segments.forEach((segment, index) => {
    scheduleResultStep(
      () => segment.setAttribute("data-revealed", "true"),
      initialDelay + index * segmentInterval,
    );
  });

  const totalDelay = initialDelay + segments.length * segmentInterval;
  scheduleResultStep(() => {
    totalParts.forEach((item) => item.setAttribute("data-revealed", "true"));
    const startedAt = performance.now();
    const countDuration = 650;
    const countScore = (now) => {
      if (completed) return;
      const progress = Math.min(1, (now - startedAt) / countDuration);
      const eased = 1 - (1 - progress) ** 3;
      if (scoreElement) {
        scoreElement.textContent = String(
          Math.round(finalScore * eased * scorePrecision) / scorePrecision,
        );
      }
      if (progress < 1) {
        resultRevealFrame = window.requestAnimationFrame(countScore);
        return;
      }
      resultRevealFrame = null;
      rankParts.forEach((item) => item.setAttribute("data-revealed", "true"));
      scheduleResultStep(finish, 320);
    };
    resultRevealFrame = window.requestAnimationFrame(countScore);
  }, totalDelay);
}

function openDialog(id) {
  const dialog = document.querySelector(id);
  if (dialog?.showModal) dialog.showModal();
}

function closeDialog(button) {
  button.closest("dialog")?.close();
}

function updateDeductionSelection() {
  const sentence = document.querySelector(".sentence-preview p");
  const answerButton = document.querySelector(".answer-button");
  document.querySelectorAll("[data-slot-choice-value]").forEach((value) => {
    const { slotId } = value.closest("[data-slot-id]")?.dataset ?? {};
    const slotState = session
      .getDeductionSlotStates()
      .find(({ slot }) => slot.id === slotId);
    const selected = slotState?.availableOptions.find(
      (option) => option.id === session.state.deductionSelections[slotId],
    );
    value.textContent = selected?.text ?? "選択してください";
    value.closest(".slot-choice-button")?.classList.toggle(
      "is-selected",
      Boolean(selected),
    );
  });
  if (sentence) sentence.textContent = session.getDeductionSentence();
  if (answerButton) answerButton.disabled = !session.isDeductionComplete();
}

function openAnswerChoice(slotId) {
  const slotState = session
    .getDeductionSlotStates()
    .find(({ slot }) => slot.id === slotId);
  const dialog = document.querySelector("#answer-choice-dialog");
  const title = dialog?.querySelector("#answer-choice-title");
  const options = dialog?.querySelector("[data-answer-choice-options]");
  if (!slotState || !dialog || !title || !options) return;

  title.textContent = `${slotState.slot.label}を選ぶ`;
  options.replaceChildren(
    ...slotState.availableOptions.map((option) => {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = "answer-choice-card";
      choice.dataset.action = "choose-slot-option";
      choice.dataset.slotId = slotId;
      choice.dataset.optionId = option.id;
      choice.setAttribute(
        "aria-pressed",
        String(session.state.deductionSelections[slotId] === option.id),
      );
      const text = document.createElement("strong");
      text.textContent = option.text;
      choice.append(text);
      return choice;
    }),
  );
  dialog.showModal();
}

function findCase(caseId) {
  return CASES.find((item) => item.id === caseId);
}

function createSession() {
  const replayVariation = currentCase.replayVariation;
  if (replayVariation) {
    const recentVariantIds = progress.variantHistory[currentCase.id] ?? [];
    const nextSession = new GameSession(currentCase, {
      excludeVariantIds: recentVariantIds,
      preferDifferentDimensions:
        replayVariation.preferDifferentDimensions === true,
    });
    progress = recordVariant(
      progress,
      currentCase.id,
      nextSession.state.variantId,
      replayVariation.recentHistorySize,
    );
    return nextSession;
  }

  const previousVariantId = lastVariantIds.get(currentCase.id);
  const nextSession = new GameSession(currentCase, {
    excludeVariantId: previousVariantId,
  });
  lastVariantIds.set(currentCase.id, nextSession.state.variantId);
  return nextSession;
}

function updateSoundToggle(button) {
  const soundOn = progress.volume > 0;
  button.setAttribute("aria-pressed", String(soundOn));
  button.setAttribute("aria-label", `音声を${soundOn ? "オフ" : "オン"}にする`);
  const icon = button.querySelector("span");
  const label = button.querySelector("strong");
  if (icon) icon.textContent = soundOn ? "♪" : "×";
  if (label) label.textContent = `SOUND ${soundOn ? "ON" : "OFF"}`;
}

function updateCutinDebugControls(selectedCutin) {
  document.querySelectorAll("[data-action=\"set-cutin-debug\"]").forEach((control) => {
    const selected = control.dataset.cutin === (selectedCutin ?? "");
    control.setAttribute("aria-pressed", String(selected));
  });
  const status = document.querySelector("[data-cutin-debug-status]");
  if (status) {
    status.textContent = selectedCutin
      ? `${selectedCutin.toUpperCase()} を指定中`
      : "AUTO（通常抽選）";
  }
}

function beginSelectedCase() {
  if (!session || session.caseData.id !== currentCase.id) {
    session = createSession();
  }
  renderInterview({ typingFrom: 0 });
  announce(
    `${currentCase.title}、${currentCase.presentation?.startLabel ?? "インタビュー"}を開始しました。`,
  );
}

function askSelectedQuestion(questionId) {
  const previousConversation = document.querySelector("#conversation");
  const conversationView = previousConversation
    ? {
        bottomOffset: Math.max(
          0,
          previousConversation.scrollHeight -
            previousConversation.clientHeight -
            previousConversation.scrollTop,
        ),
      }
    : null;
  const typingFrom = session.state.conversation.length;
  const result = session.askQuestion(questionId);
  if (result.reachedLimit) {
    renderInterview({
      limitNotice: true,
      typingFrom,
      preserveScroll: true,
      moveToConversation: true,
      conversationView,
    });
    const limitButton =
      session.caseData.presentation?.limitButton ?? "回答をまとめる";
    announce(`質問は${session.getQuestionLimit()}回で終了です。最後の返答を確認してから、「${limitButton}」へ進んでください。`);
    return;
  }

  renderInterview({
    recoveredQuestions: result.recoveredQuestions,
    typingFrom,
    preserveScroll: true,
    moveToConversation: true,
    conversationView,
  });
  const unlockedCopy = result.newlyUnlocked.length
    ? ` 新しい質問が${result.newlyUnlocked.length}件解放されました。`
    : "";
  const respondentLabel =
    session.caseData.presentation?.respondentLabel ?? "利用者";
  announce(`${respondentLabel}から回答がありました。${unlockedCopy}`);
}

function beginQuestionFeedback(button) {
  if (questionFeedbackTimer !== null) return;
  const questionId = button.dataset.questionId;
  const version = renderVersion;
  button.classList.add("question-button--pressed");
  document.querySelectorAll(".question-button:not(:disabled)").forEach((item) => {
    item.disabled = true;
  });
  playQuestionSound();
  questionFeedbackTimer = window.setTimeout(() => {
    questionFeedbackTimer = null;
    if (version !== renderVersion) return;
    askSelectedQuestion(questionId);
  }, prefersReducedMotion() ? 0 : 140);
}

app.addEventListener("click", (event) => {
  if (resultRevealController && event.target.closest("[data-result-reveal]")) {
    event.preventDefault();
    resultRevealController.finish();
    return;
  }

  if (
    activeTypingController &&
    event.target.closest("#conversation") &&
    !event.target.closest("button, a, input, select, textarea, [contenteditable='true']")
  ) {
    if (activeTypingController.skipCurrent()) event.preventDefault();
    return;
  }

  const button = event.target.closest("button");
  if (!button || button.disabled) return;

  const action = button.dataset.action;

  if (action === "home") return renderTop();
  if (action === "cases") return renderCases();
  if (action === "howto") return openDialog("#howto-dialog");
  if (action === "close-dialog") return closeDialog(button);

  if (action === "sound-toggle") {
    progress = setVolume(progress, progress.volume > 0 ? 0 : 1);
    setAudioVolume(progress.volume);
    updateSoundToggle(button);
    announce(progress.volume > 0 ? "音声をオンにしました。" : "音声をオフにしました。");
    return;
  }

  if (action === "select-case") {
    const selected = findCase(button.dataset.caseId);
    if (!selected || !isCaseUnlocked(CASES, selected.id, progress)) return;
    currentCase = selected;
    session = createSession();
    return beginSelectedCase();
  }

  if (action === "ask") {
    return beginQuestionFeedback(button);
  }

  if (action === "deduce") return openDialog("#confirm-dialog");

  if (action === "continue-deduction") return renderDeduction();

  if (action === "confirm-deduce") {
    session.startDeduction();
    return renderDeduction();
  }

  if (action === "open-slot-choice") {
    return openAnswerChoice(button.dataset.slotId);
  }

  if (action === "choose-slot-option") {
    const slotState = session
      .getDeductionSlotStates()
      .find(({ slot }) => slot.id === button.dataset.slotId);
    if (!session.setSelection(button.dataset.slotId, button.dataset.optionId)) return;
    playChoiceSound();
    button.closest("dialog")?.close();
    updateDeductionSelection();
    announce(`${slotState?.slot.label ?? "回答"}を選択しました。`);
    return;
  }

  if (action === "set-cutin-debug") {
    const selectedCutin = setDebugCutin(button.dataset.cutin);
    updateCutinDebugControls(selectedCutin);
    announce(
      selectedCutin
        ? `回答時の演出を${selectedCutin.toUpperCase()}に指定しました。`
        : "回答時の演出を通常抽選に戻しました。",
    );
    return;
  }

  if (action === "submit-answer") {
    const score = session.submitDeduction();
    progress = recordResult(progress, currentCase.id, score.total);
    button.disabled = true;
    const cutin = getDebugCutin() ?? selectCutin(score);
    playDecisionSound(cutin);
    const presentation = showCutin(cutin, {
      assetVariant: currentCase.presentation?.cutinAssetVariant,
    });
    presentation.then(() => {
      renderResult();
    });
    return;
  }

  if (action === "replay") {
    session = createSession();
    return renderInterview({ typingFrom: 0 });
  }

  if (action === "next-case") {
    const currentIndex = CASES.findIndex((item) => item.id === currentCase.id);
    const next = CASES[currentIndex + 1];
    if (!next || !isCaseUnlocked(CASES, next.id, progress)) return renderCases();
    currentCase = next;
    session = createSession();
    return beginSelectedCase();
  }

  if (action === "reset-progress") {
    if (window.confirm("クリア状況とベストスコアをリセットしますか？")) {
      progress = clearProgress();
      renderCases();
      announce("進行状況をリセットしました。");
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector("dialog[open]")?.close();
    return;
  }

  if (!['Enter', ' ', 'Spacebar'].includes(event.key)) return;
  if (document.querySelector("dialog[open]")) return;
  const target = event.target;
  if (
    target instanceof Element &&
    target.closest("button, a, input, select, textarea, summary, [contenteditable='true']")
  ) {
    return;
  }

  if (resultRevealController) {
    event.preventDefault();
    resultRevealController.finish();
    return;
  }

  if (activeTypingController?.skipCurrent()) {
    event.preventDefault();
  }
});

renderTop();
