import { CASES } from "../data/cases.js?v=20260822-ex5-year1";
import {
  playScreenMusic,
  setAudioVolume,
  playChoiceSound,
  playQuestionSound,
  playDecisionSound,
  playPageSound,
  getRequestedMusicScreen,
  startMessageSound,
  stopMessageSound,
  stopScreenMusic,
} from "./audio.js?v=20260821-afterstory2";
import {
  getAfterStory,
  isAfterStoryUnlocked,
  loadAfterStory,
} from "../data/afterstories.js?v=20260822-afterstories11-lines22";
import {
  cutinDebugMarkup,
  getDebugCutin,
  selectCutin,
  setDebugCutin,
  showCutin,
} from "./cutin.js?v=20260812-timing1";
import { trackPageView } from "./analytics.js?v=20260812-analytics1";
import {
  ENDING_DIALOGUE_LINES,
  getEndingIllustration,
  isEndingUnlocked,
} from "./ending.js?v=20260815-ending-dialogue5";
import {
  createNextPhaseSession,
  GameSession,
} from "./game.js?v=20260820-ex5-1";
import {
  clearProgress,
  isCaseUnlocked,
  isCaseVisible,
  loadProgress,
  markEndingSeen,
  markEndingUnlockedNoticed,
  recordResult,
  recordVariant,
  setVolume,
} from "./storage.js?v=20260815-ending1";
import {
  answerChoiceDialog,
  afterStoryDialog,
  afterStoryPageMarkup,
  caseSelectScreen,
  confirmDialog,
  deductionScreen,
  endingIllustrationScreen,
  howToDialog,
  interviewScreen,
  resultScreen,
  topScreen,
} from "./ui.js?v=20260822-afterstories11-lines22";

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");

let progress = loadProgress();
setAudioVolume(progress.volume);
let currentCase = null;
let session = null;
const lastVariantIds = new Map();
let typingTimer = null;
let activeTypingController = null;
let endingTypingTimer = null;
let endingTypingController = null;
let endingCreditsFallbackTimer = null;
let questionFeedbackTimer = null;
let phaseTransitionTimer = null;
let resultRevealController = null;
let resultRevealFrame = null;
let activeAfterStory = null;
let afterStoryPageIndex = 0;
let afterStoryPreviousMusicScreen = null;
const resultRevealTimers = new Set();
let renderVersion = 0;
let endingState = null;
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

function setConversationScrollTop(conversation, top) {
  const previousInlineBehavior = conversation.style.scrollBehavior;
  conversation.style.scrollBehavior = "auto";
  conversation.scrollTop = Math.max(0, top);
  conversation.style.scrollBehavior = previousInlineBehavior;
}

function mount(markup, { focus = true, preserveScroll = false } = {}) {
  const scrollPosition = preserveScroll
    ? { left: window.scrollX, top: window.scrollY }
    : null;
  renderVersion += 1;
  stopMessageSound();
  activeTypingController = null;
  endingTypingController = null;
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }
  if (endingTypingTimer !== null) {
    window.clearTimeout(endingTypingTimer);
    endingTypingTimer = null;
  }
  if (endingCreditsFallbackTimer !== null) {
    window.clearTimeout(endingCreditsFallbackTimer);
    endingCreditsFallbackTimer = null;
  }
  if (questionFeedbackTimer !== null) {
    window.clearTimeout(questionFeedbackTimer);
    questionFeedbackTimer = null;
  }
  if (phaseTransitionTimer !== null) {
    window.clearTimeout(phaseTransitionTimer);
    phaseTransitionTimer = null;
  }
  cancelResultReveal();
  app.innerHTML = `${markup}${howToDialog()}${confirmDialog()}${answerChoiceDialog()}${afterStoryDialog()}${cutinDebugMarkup()}`;
  if (focus) app.focus({ preventScroll: true });
  window.scrollTo({
    ...(scrollPosition ?? { left: 0, top: 0 }),
    behavior: "instant",
  });
}

function patchInterview(markup, conversationView = null) {
  const currentHeader = app.querySelector(".interview-header");
  const currentLayout = app.querySelector(".interview-layout");
  const currentConversation = app.querySelector("#conversation");
  if (!currentHeader || !currentLayout || !currentConversation) return false;

  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const nextHeader = template.content.querySelector(".interview-header");
  const nextLayout = template.content.querySelector(".interview-layout");
  const nextConversation = template.content.querySelector("#conversation");
  if (!nextHeader || !nextLayout || !nextConversation) return false;

  const windowScroll = { left: window.scrollX, top: window.scrollY };
  const previousMessageCount = currentConversation.children.length;
  const nextMessages = [...nextConversation.children];

  renderVersion += 1;
  stopMessageSound();
  activeTypingController = null;
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }

  currentConversation
    .querySelectorAll(".message--latest")
    .forEach((message) => message.classList.remove("message--latest"));
  nextMessages.slice(previousMessageCount).forEach((message) => {
    currentConversation.append(message);
  });
  nextConversation.replaceWith(currentConversation);
  currentHeader.replaceWith(nextHeader);
  currentLayout.replaceWith(nextLayout);

  const previousBottomOffset = Math.max(
    0,
    Number(conversationView?.bottomOffset ?? 0),
  );
  setConversationScrollTop(
    currentConversation,
    currentConversation.scrollHeight -
      currentConversation.clientHeight -
      previousBottomOffset,
  );
  window.scrollTo({ ...windowScroll, behavior: "instant" });
  return true;
}

function renderTop() {
  endingState = null;
  currentCase = null;
  session = null;
  stopScreenMusic();
  mount(topScreen(progress));
  trackPageView("title", document.title);
}

function renderCases() {
  endingState = null;
  const shouldShowEndingNotice =
    isEndingUnlocked(progress) && progress.endingUnlockedNoticed !== true;
  const caseView = CASES.filter((data) => isCaseVisible(data, progress)).map(
    (data) => ({
      data,
      unlocked: isCaseUnlocked(CASES, data.id, progress),
    }),
  );
  stopScreenMusic();
  mount(
    caseSelectScreen(caseView, progress, {
      showEndingUnlockedNotice: shouldShowEndingNotice,
    }),
  );
  trackPageView("cases", `ケースファイル｜${document.title}`);
  if (shouldShowEndingNotice) {
    window.requestAnimationFrame(showEndingUnlockedNotice);
  }
}

function animateConversation(
  conversation,
  conversationView = null,
  onComplete = null,
) {
  const version = renderVersion;
  let didComplete = false;
  const notifyComplete = () => {
    if (didComplete || typeof onComplete !== "function") return;
    didComplete = true;
    window.requestAnimationFrame(() => {
      if (version === renderVersion) onComplete();
    });
  };
  const recoveryNotice = document.querySelector("[data-recovery-notice]");
  const limitNotice = document.querySelector("[data-limit-notice]");
  const phaseChoiceActions = document.querySelector(
    "[data-phase-choice-actions]",
  );
  const revealRecoveryNotice = () => {
    if (!recoveryNotice?.hidden) return;
    recoveryNotice.hidden = false;
    announce(
      recoveryNotice.textContent.replace(/\s+/g, " ").trim(),
    );
  };
  const revealLimitNotice = () => {
    if (limitNotice?.hidden) {
      limitNotice.hidden = false;
      announce(limitNotice.textContent.replace(/\s+/g, " ").trim());
    }
    if (phaseChoiceActions?.hidden) {
      phaseChoiceActions.hidden = false;
    }
  };
  const revealConversationNotices = () => {
    revealLimitNotice();
    revealRecoveryNotice();
  };
  const targets = [...conversation.querySelectorAll("[data-typing-text]")];
  const completeTypingTarget = (target) => {
    const fullText = target.dataset.typingText ?? target.textContent ?? "";
    target.textContent = fullText;
    target.removeAttribute("data-typing-text");
    target.removeAttribute("aria-hidden");
    const accessibleCopy = target.nextElementSibling;
    if (accessibleCopy?.classList.contains("sr-only")) {
      accessibleCopy.remove();
    }
  };
  if (targets.length === 0) {
    setConversationScrollTop(conversation, conversation.scrollHeight);
    revealConversationNotices();
    notifyComplete();
    return;
  }

  const isMobileInterview = window.matchMedia(mobileInterviewQuery).matches;
  if (
    prefersReducedMotion() &&
    !isMobileInterview
  ) {
    targets.forEach(completeTypingTarget);
    setConversationScrollTop(conversation, conversation.scrollHeight);
    revealConversationNotices();
    notifyComplete();
    return;
  }

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
  setConversationScrollTop(
    conversation,
    conversation.scrollHeight - conversation.clientHeight - previousBottomOffset,
  );

  const scrollToLatestMessage = () => {
    setConversationScrollTop(conversation, conversation.scrollHeight);
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
    window.requestAnimationFrame(() => {
      scrollToLatestMessage();
      notifyComplete();
    });
  };

  const finishCurrentMessage = (skipped = false) => {
    if (!canSkipCurrent || version !== renderVersion) return false;
    canSkipCurrent = false;
    if (typingTimer !== null) {
      window.clearTimeout(typingTimer);
      typingTimer = null;
    }

    const target = targets[targetIndex];
    completeTypingTarget(target);
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
    startMessageSound(messages[targetIndex]?.dataset.messageSound,
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
    conversation.scrollIntoView({ block: "start", behavior });
  });
}

function getInterviewMusicScreen(caseDataOrId) {
  const caseId =
    typeof caseDataOrId === "string" ? caseDataOrId : caseDataOrId?.id;
  const isDetectivePhase = caseDataOrId?.phaseMeta?.player === "detective";
  return caseId === "case05" || caseId === "extra01" || isDetectivePhase
    ? "interviewDetective"
    : "interview";
}

function renderInterview(options = {}) {
  const {
    preserveScroll = false,
    moveToConversation = false,
    conversationView = null,
    onConversationComplete = null,
    ...screenOptions
  } = options;
  const markup = interviewScreen(session, {
    ...screenOptions,
    volume: progress.volume,
  });
  const patched =
    preserveScroll && patchInterview(markup, conversationView);
  if (!patched) {
    mount(markup, { focus: !preserveScroll, preserveScroll });
  }
  playScreenMusic(getInterviewMusicScreen(session?.caseData ?? currentCase));
  trackPageView(
    `cases/${currentCase.id}/interview`,
    `${currentCase.title}｜インタビュー｜${document.title}`,
  );
  const conversation = document.querySelector("#conversation");
  if (conversation) {
    if (moveToConversation) moveConversationIntoViewOnMobile(conversation);
    animateConversation(
      conversation,
      conversationView,
      onConversationComplete,
    );
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

function showEndingUnlockedNotice() {
  const dialog = document.querySelector("#ending-unlocked-dialog");
  if (!dialog?.showModal) return;
  progress = markEndingUnlockedNoticed(progress);
  dialog.showModal();
  trackPageView("ending/unlocked", `エンディング解放｜${document.title}`);
  announce("エンディングが解放されました。CASE 01から10のベストスコアが、すべて100点になりました。");
}

function typeEndingMessage(message) {
  const text = document.querySelector("[data-ending-text]");
  if (!text) return;
  const fullText = `「${message.text}」`;
  if (endingTypingTimer !== null) {
    window.clearTimeout(endingTypingTimer);
    endingTypingTimer = null;
  }
  stopMessageSound();

  const finish = () => {
    if (endingTypingTimer !== null) {
      window.clearTimeout(endingTypingTimer);
      endingTypingTimer = null;
    }
    text.textContent = fullText;
    stopMessageSound();
    endingTypingController = null;
    if (endingState) endingState.typing = false;
    return true;
  };

  if (prefersReducedMotion()) {
    finish();
    return;
  }

  const characters = Array.from(fullText);
  let characterIndex = 0;
  let soundStarted = false;
  text.textContent = "";
  if (endingState) endingState.typing = true;
  endingTypingController = { skipCurrent: finish };

  const typeNextCharacter = () => {
    if (!soundStarted) {
      soundStarted = true;
      startMessageSound(message.role === "detective" ? "message3" : "message2");
    }
    characterIndex += 1;
    text.textContent = characters.slice(0, characterIndex).join("");
    if (characterIndex >= characters.length) {
      finish();
      return;
    }
    endingTypingTimer = window.setTimeout(typeNextCharacter, 24);
  };
  const openingDelay = endingState?.dialogueIndex === 0 ? 700 : 100;
  endingTypingTimer = window.setTimeout(typeNextCharacter, openingDelay);
}

function renderEnding(dialogueIndex = 0) {
  if (!isEndingUnlocked(progress)) return renderCases();
  currentCase = null;
  session = null;
  const lastIndex = ENDING_DIALOGUE_LINES.length - 1;
  const safeIndex = Math.min(Math.max(dialogueIndex, 0), lastIndex);
  endingState = { phase: "illustration", dialogueIndex: safeIndex, complete: false };
  mount(endingIllustrationScreen(progress, safeIndex, false));
  playScreenMusic("ending");
  trackPageView("ending", `閉館後の会話｜${document.title}`);
  const message = ENDING_DIALOGUE_LINES[safeIndex];
  announce(`${message.speaker}、${message.text}`);
  typeEndingMessage(message);
}

function showEndingLine(dialogueIndex) {
  if (!endingState) return;
  const lastIndex = ENDING_DIALOGUE_LINES.length - 1;
  const safeIndex = Math.min(Math.max(dialogueIndex, 0), lastIndex);
  const message = ENDING_DIALOGUE_LINES[safeIndex];
  const screen = document.querySelector(".ending-screen--illustration");
  const dialogue = document.querySelector("[data-ending-dialogue]");
  const portrait = document.querySelector("[data-ending-portrait]");
  const speaker = document.querySelector("[data-ending-speaker]");
  if (!screen || !dialogue || !portrait || !speaker) return;

  const activeIllustration = getEndingIllustration(safeIndex);
  document.querySelectorAll("[data-ending-illustration]").forEach((illustration) => {
    illustration.classList.toggle(
      "ending-illustration__scene--active",
      Number(illustration.dataset.endingIllustration) === activeIllustration,
    );
  });

  dialogue.classList.remove(
    "ending-illustration-dialogue--detective",
    "ending-illustration-dialogue--librarian",
  );
  dialogue.classList.add(`ending-illustration-dialogue--${message.role}`);
  portrait.src = message.portrait ?? (message.role === "detective"
    ? "./assets/characters/extra-detective-reaction-medium-portrait.webp"
    : "./assets/characters/extra-librarian-portrait.webp");
  speaker.textContent = message.speaker;
  endingState = {
    phase: "illustration",
    dialogueIndex: safeIndex,
    complete: false,
    typing: false,
  };
  announce(`${message.speaker}、${message.text}`);
  typeEndingMessage(message);
}

function showEndingCredits() {
  const screen = document.querySelector(".ending-screen--illustration");
  const dialogue = document.querySelector("[data-ending-dialogue]");
  const credits = document.querySelector("[data-ending-credits]");
  const roll = document.querySelector("[data-ending-credits-roll]");
  const thanks = document.querySelector("[data-ending-credits-thanks]");
  const exit = document.querySelector("[data-ending-credits-exit]");
  if (!screen || !dialogue || !credits || !roll || !thanks || !exit) return;

  endingState = {
    phase: "credits",
    dialogueIndex: ENDING_DIALOGUE_LINES.length - 1,
    complete: true,
  };
  screen.removeAttribute("data-ending-advance-area");
  dialogue.hidden = true;
  stopMessageSound();
  credits.hidden = false;
  trackPageView("ending/credits", `スタッフロール｜${document.title}`);
  announce("スタッフロール。Illustration ChatGPT、Programming Codex、BGM Suno、効果音 効果音ラボ、Produce やわらか図書館学。");

  let creditsFinished = false;
  const finishCredits = () => {
    if (creditsFinished) return;
    creditsFinished = true;
    if (endingCreditsFallbackTimer !== null) {
      window.clearTimeout(endingCreditsFallbackTimer);
      endingCreditsFallbackTimer = null;
    }
    credits.dataset.complete = "true";
    roll.hidden = true;
    thanks.hidden = false;
    exit.hidden = false;
    if (progress.endingSeen !== true) progress = markEndingSeen(progress);
    announce("Thank you for Playing! エンディングを最後まで視聴しました。");
  };
  const handleRollEnd = (event) => {
    if (
      event.target !== roll ||
      event.animationName !== "ending-credits-roll"
    ) {
      return;
    }
    roll.removeEventListener("animationend", handleRollEnd);
    finishCredits();
  };
  roll.addEventListener("animationend", handleRollEnd);
  // iOS Safariでは hidden 解除と同時に定義済みの animation が開始しない場合がある。
  // レイアウト確定後にクラスを付け、終了通知が欠落した場合にも備える。
  void roll.offsetWidth;
  window.requestAnimationFrame(() => {
    credits.classList.add("ending-credits--rolling");
    endingCreditsFallbackTimer = window.setTimeout(finishCredits, 23000);
  });
}

function advanceEnding() {
  if (!endingState || endingState.complete) return;
  if (endingState.dialogueIndex >= ENDING_DIALOGUE_LINES.length - 1) {
    showEndingCredits();
    return;
  }
  showEndingLine(endingState.dialogueIndex + 1);
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
  const patronParts = [...root.querySelectorAll("[data-result-patron]")];
  const rankPanels = [...root.querySelectorAll("[data-result-rank-panel]")];
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
  patronParts.forEach((item) => item.removeAttribute("data-revealed"));
  rankPanels.forEach((item) => item.removeAttribute("data-revealed"));
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
    patronParts.forEach((item) => item.setAttribute("data-revealed", "true"));
    rankPanels.forEach((item) => item.setAttribute("data-revealed", "true"));
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

  const patronDelay = initialDelay + segments.length * segmentInterval;
  scheduleResultStep(() => {
    patronParts.forEach((item) => item.setAttribute("data-revealed", "true"));
  }, patronDelay);

  const rankDelay = patronDelay + 340;
  scheduleResultStep(() => {
    rankPanels.forEach((item) => item.setAttribute("data-revealed", "true"));
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
  }, rankDelay);
}

function openDialog(id) {
  const dialog = document.querySelector(id);
  if (dialog?.showModal) dialog.showModal();
}

function closeDialog(button) {
  button.closest("dialog")?.close();
}

function renderAfterStoryPage() {
  if (!activeAfterStory) return;
  const content = document.querySelector("[data-after-story-content]");
  const pageNumber = document.querySelector("[data-after-story-page-number]");
  const previousButton = document.querySelector(
    '[data-action="previous-after-story"]',
  );
  const nextButton = document.querySelector('[data-action="next-after-story"]');
  const totalPages = activeAfterStory.pages.length + 1;
  afterStoryPageIndex = Math.min(
    Math.max(0, afterStoryPageIndex),
    totalPages - 1,
  );
  if (content) {
    content.innerHTML = afterStoryPageMarkup(
      activeAfterStory,
      afterStoryPageIndex,
    );
    content.scrollTop = 0;
  }
  if (pageNumber) {
    pageNumber.textContent = `${afterStoryPageIndex + 1} / ${totalPages}`;
  }
  if (previousButton) {
    const isCoverPage = afterStoryPageIndex === 0;
    previousButton.disabled = isCoverPage;
    previousButton.classList.toggle("is-concealed", isCoverPage);
    previousButton.setAttribute("aria-hidden", String(isCoverPage));
  }
  if (nextButton) nextButton.disabled = afterStoryPageIndex >= totalPages - 1;
}

function restoreMusicAfterAfterStory() {
  const previousScreen = afterStoryPreviousMusicScreen;
  activeAfterStory = null;
  afterStoryPageIndex = 0;
  afterStoryPreviousMusicScreen = null;
  if (previousScreen) {
    playScreenMusic(previousScreen);
  } else {
    stopScreenMusic();
  }
}

async function openAfterStory(caseId) {
  const configuredStory = getAfterStory(caseId);
  if (!isAfterStoryUnlocked(configuredStory, progress)) return;
  const dialog = document.querySelector("#after-story-dialog");
  if (!dialog?.showModal) return;
  playPageSound();
  const story = await loadAfterStory(configuredStory);

  activeAfterStory = story;
  afterStoryPageIndex = 0;
  afterStoryPreviousMusicScreen = getRequestedMusicScreen();
  renderAfterStoryPage();
  dialog.addEventListener("close", restoreMusicAfterAfterStory, { once: true });
  dialog.showModal();
  playScreenMusic("afterstory");
  trackPageView(
    `cases/${caseId}/after-story`,
    `${story.title}｜After Story｜${document.title}`,
  );
  announce(`CASE ${story.caseNumber}の後日談「${story.title}」を開きました。`);
}

function moveAfterStoryPage(offset) {
  if (!activeAfterStory) return;
  afterStoryPageIndex += offset;
  renderAfterStoryPage();
  playPageSound();
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

function advanceInterviewPhase() {
  const previousSession = session;
  const previousConversationLength = previousSession.state.conversation.length;
  const transition = previousSession.caseData.phaseTransition;
  const version = renderVersion;
  const delay = Number(transition?.delayBeforeNextPhaseMs ?? 0);

  const completeTransition = () => {
    phaseTransitionTimer = null;
    if (session !== previousSession || version !== renderVersion) return;
    const nextSession = createNextPhaseSession(previousSession);
    if (!nextSession) return;

    session = nextSession;
    renderInterview({
      typingFrom: previousConversationLength,
      preserveScroll: true,
      moveToConversation: true,
    });
    const nextPlayer =
      nextSession.caseData.presentation?.playerLabel ?? "司書さん";
    announce(
      `${nextPlayer}が聞き取りを引き継ぎました。質問回数は${nextSession.getQuestionLimit()}回です。`,
    );
  };

  if (delay <= 0) return completeTransition();
  phaseTransitionTimer = window.setTimeout(completeTransition, delay);
}

function getResultBand(total) {
  return total >= 85 ? "high" : total >= 50 ? "medium" : "low";
}

function normalizeResultTransitionMessage(entry, transition) {
  if (entry.speaker === "detective") {
    return {
      ...entry,
      speaker: "librarian",
      playerAvatar:
        session.caseData.presentation?.playerAvatar ??
        "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
      messageSound:
        session.caseData.presentation?.playerMessageSound ?? "message3",
    };
  }
  if (entry.speaker === "librarian") {
    return {
      ...entry,
      speaker: "librarian",
      playerAvatar: "",
      messageSound:
        transition.nextCaseData?.presentation?.playerMessageSound ?? "message2",
    };
  }
  return { ...entry };
}

function continueFromResultToNextPhase(button) {
  const transition = session.caseData.phaseTransition;
  if (
    transition?.trigger !== "after-result" ||
    !transition.nextCaseData ||
    !session.state.score
  ) {
    return;
  }

  button.disabled = true;
  const resultBand = getResultBand(session.state.score.total);
  const transitionMessages = [
    ...(transition.resultMessagesByBand?.[resultBand] ?? []),
    ...(transition.commonMessages ?? []),
  ].map((entry) => normalizeResultTransitionMessage(entry, transition));
  const typingFrom = session.state.conversation.length;
  session.state.conversation.push(...transitionMessages);
  renderInterview({
    transitioning: true,
    typingFrom,
    moveToConversation: true,
    onConversationComplete: advanceInterviewPhase,
  });
  announce("まだ依頼は終わっていません。会話の続きを確認してください。");
}

function continueToNextInterviewPhase() {
  const transition = session.caseData.phaseTransition;
  if (!transition?.nextCaseData) return;

  const conversation = document.querySelector("#conversation");
  const conversationView = conversation
    ? {
        bottomOffset: Math.max(
          0,
          conversation.scrollHeight -
            conversation.clientHeight -
            conversation.scrollTop,
        ),
      }
    : null;
  const typingFrom = session.state.conversation.length;
  if (transition.beforeSwitchMessage) {
    session.state.conversation.push({ ...transition.beforeSwitchMessage });
  }
  renderInterview({
    transitioning: true,
    typingFrom,
    preserveScroll: true,
    moveToConversation: true,
    conversationView,
    onConversationComplete: advanceInterviewPhase,
  });
  announce("司書さんは、相談に残る違和感をもう一度考えています。");
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
    const phaseChoiceCopy =
      session.caseData.phaseTransition?.nextCaseData &&
      session.caseData.phaseTransition?.trigger !== "after-result"
      ? `「${limitButton}」または「まだ何か引っかかる……」を選んでください。`
      : `「${limitButton}」へ進んでください。`;
    announce(`質問は${session.getQuestionLimit()}回で終了です。最後の返答を確認してから、${phaseChoiceCopy}`);
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

const interviewStartActions = new Set(["select-case", "replay", "next-case"]);

function primeInterviewMusicFromControl(target) {
  const button = target.closest?.("button");
  if (
    !button ||
    button.disabled ||
    !interviewStartActions.has(button.dataset.action)
  ) {
    return;
  }
  let targetCaseData = session?.caseData ?? currentCase;
  if (button.dataset.action === "select-case") {
    targetCaseData = findCase(button.dataset.caseId);
  } else if (button.dataset.action === "next-case") {
    const currentIndex = CASES.findIndex((item) => item.id === currentCase?.id);
    targetCaseData = CASES[currentIndex + 1];
  } else if (button.dataset.action === "replay") {
    targetCaseData = currentCase;
  }
  playScreenMusic(getInterviewMusicScreen(targetCaseData));
}

app.addEventListener("pointerdown", (event) => {
  primeInterviewMusicFromControl(event.target);
});

app.addEventListener("keydown", (event) => {
  if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
  primeInterviewMusicFromControl(event.target);
});

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

  if (
    endingState &&
    event.target.closest("[data-ending-advance-area]") &&
    !event.target.closest("button, a, input, select, textarea, [contenteditable='true']")
  ) {
    if (endingTypingController?.skipCurrent()) {
      event.preventDefault();
      return;
    }
    advanceEnding();
    return;
  }

  const button = event.target.closest("button");
  if (!button || button.disabled) return;

  const action = button.dataset.action;

  if (action === "home") return renderTop();
  if (action === "cases") return renderCases();
  if (action === "howto") return openDialog("#howto-dialog");
  if (action === "close-dialog") return closeDialog(button);
  if (action === "open-after-story") {
    return openAfterStory(button.dataset.caseId);
  }
  if (action === "close-after-story") {
    return button.closest("dialog")?.close();
  }
  if (action === "previous-after-story") return moveAfterStoryPage(-1);
  if (action === "next-after-story") return moveAfterStoryPage(1);
  if (action === "view-ending") {
    button.closest("dialog")?.close();
    return renderEnding(0);
  }
  if (action === "ending-later") {
    button.closest("dialog")?.close();
    return renderCases();
  }
  if (action === "advance-ending") return advanceEnding();
  if (action === "exit-ending") return renderCases();

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

  if (action === "continue-next-phase") {
    return continueToNextInterviewPhase();
  }

  if (action === "continue-result-phase") {
    return continueFromResultToNextPhase(button);
  }

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
    const continuesAfterResult =
      session.caseData.phaseTransition?.trigger === "after-result";
    if (!continuesAfterResult) {
      progress = recordResult(progress, currentCase.id, score.total);
    }
    button.disabled = true;
    const cutin = getDebugCutin() ?? selectCutin(score);
    playDecisionSound(cutin);
    const presentation = showCutin(cutin, {
      assetVariant: session.caseData.presentation?.cutinAssetVariant,
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

  if (activeAfterStory && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    moveAfterStoryPage(event.key === "ArrowLeft" ? -1 : 1);
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

  if (endingState && !endingState.complete) {
    event.preventDefault();
    if (endingTypingController?.skipCurrent()) return;
    advanceEnding();
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
