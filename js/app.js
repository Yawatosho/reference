import { CASES } from "../data/cases.js?v=20260812-sourceclarity1";
import {
  playScreenMusic,
  setAudioVolume,
  startMessageSound,
  stopMessageSound,
  stopScreenMusic,
} from "./audio.js?v=20260811-copy";
import { trackPageView } from "./analytics.js?v=20260812-analytics1";
import { GameSession } from "./game.js?v=20260811-optionshuffle1";
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
  caseSelectScreen,
  confirmDialog,
  deductionScreen,
  howToDialog,
  interviewScreen,
  resultScreen,
  topScreen,
} from "./ui.js?v=20260812-sourceclarity1";

const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");

let progress = loadProgress();
setAudioVolume(progress.volume);
let currentCase = null;
let session = null;
const lastVariantIds = new Map();
let typingTimer = null;
let renderVersion = 0;
const mobileInterviewQuery = "(max-width: 760px)";

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
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }
  app.innerHTML = `${markup}${howToDialog()}${confirmDialog()}`;
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

function animateConversation(conversation) {
  const recoveryNotice = document.querySelector("[data-recovery-notice]");
  const revealRecoveryNotice = () => {
    if (!recoveryNotice?.hidden) return;
    recoveryNotice.hidden = false;
    announce(
      recoveryNotice.textContent.replace(/\s+/g, " ").trim(),
    );
  };
  const targets = [...conversation.querySelectorAll("[data-typing-text]")];
  if (targets.length === 0) {
    conversation.scrollTop = conversation.scrollHeight;
    revealRecoveryNotice();
    return;
  }

  const isMobileInterview = window.matchMedia(mobileInterviewQuery).matches;
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !isMobileInterview
  ) {
    conversation.scrollTop = conversation.scrollHeight;
    revealRecoveryNotice();
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

  let targetIndex = 0;
  let characterIndex = 0;

  const startCurrentMessage = () => {
    if (version !== renderVersion) return;
    startMessageSound(messages[targetIndex]?.dataset.messageSound);
    typeNextCharacter();
  };

  const typeNextCharacter = () => {
    if (version !== renderVersion) return;

    const target = targets[targetIndex];
    const characters = Array.from(target.dataset.typingText ?? "");
    characterIndex += 1;
    target.textContent = characters.slice(0, characterIndex).join("");
    conversation.scrollTop = conversation.scrollHeight;

    if (characterIndex >= characters.length) {
      stopMessageSound();
      targetIndex += 1;
      characterIndex = 0;
      if (targetIndex >= targets.length) {
        conversation.removeAttribute("aria-busy");
        revealRecoveryNotice();
        questionButtons.forEach((button) => {
          button.disabled = false;
        });
        newQuestionButtons.forEach((button) => {
          button.hidden = false;
        });
        typingTimer = null;
        return;
      }

      typingTimer = window.setTimeout(() => {
        if (version !== renderVersion) return;
        messages[targetIndex].hidden = false;
        messages[targetIndex].classList.add("message--turn-enter");
        conversation.scrollTop = conversation.scrollHeight;
        startCurrentMessage();
      }, 360);
      return;
    }

    typingTimer = window.setTimeout(typeNextCharacter, 18);
  };

  typingTimer = window.setTimeout(startCurrentMessage, 120);
}

function moveConversationIntoViewOnMobile(conversation) {
  if (!window.matchMedia(mobileInterviewQuery).matches) return;

  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  window.requestAnimationFrame(() => {
    conversation.scrollIntoView({ block: "start", behavior });
  });
}

function renderInterview(options = {}) {
  const {
    preserveScroll = false,
    moveToConversation = false,
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
    animateConversation(conversation);
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
}

function openDialog(id) {
  const dialog = document.querySelector(id);
  if (dialog?.showModal) dialog.showModal();
}

function closeDialog(button) {
  button.closest("dialog")?.close();
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

function beginSelectedCase() {
  if (!session || session.caseData.id !== currentCase.id) {
    session = createSession();
  }
  renderInterview({ typingFrom: 0 });
  announce(
    `${currentCase.title}、${currentCase.presentation?.startLabel ?? "インタビュー"}を開始しました。`,
  );
}

app.addEventListener("click", (event) => {
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
    const typingFrom = session.state.conversation.length;
    const result = session.askQuestion(button.dataset.questionId);
    if (result.reachedLimit) {
      renderInterview({
        limitNotice: true,
        typingFrom,
        preserveScroll: true,
        moveToConversation: true,
      });
      const limitButton =
        session.caseData.presentation?.limitButton ?? "回答をまとめる";
      announce(`質問は${session.getQuestionLimit()}回で終了です。最後の返答を確認してから、「${limitButton}」へ進んでください。`);
    } else {
      renderInterview({
        recoveredQuestions: result.recoveredQuestions,
        typingFrom,
        preserveScroll: true,
        moveToConversation: true,
      });
      const unlockedCopy = result.newlyUnlocked.length
        ? ` 新しい質問が${result.newlyUnlocked.length}件解放されました。`
        : "";
      const respondentLabel =
        session.caseData.presentation?.respondentLabel ?? "利用者";
      announce(`${respondentLabel}から回答がありました。${unlockedCopy}`);
    }
    return;
  }

  if (action === "deduce") return openDialog("#confirm-dialog");

  if (action === "continue-deduction") return renderDeduction();

  if (action === "confirm-deduce") {
    session.startDeduction();
    return renderDeduction();
  }

  if (action === "submit-answer") {
    const score = session.submitDeduction();
    progress = recordResult(progress, currentCase.id, score.total);
    renderResult();
    announce(`採点結果は${score.total}点、ランク${score.rank}です。`);
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

app.addEventListener("change", (event) => {
  const target = event.target;
  const action = target.dataset.action;

  if (action === "select-slot") {
    session.setSelection(target.dataset.slotId, target.value);
    const sentence = document.querySelector(".sentence-preview p");
    const answerButton = document.querySelector(".answer-button");
    if (sentence) sentence.textContent = session.getDeductionSentence();
    if (answerButton) answerButton.disabled = !session.isDeductionComplete();
    return;
  }

});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelector("dialog[open]")?.close();
});

renderTop();
