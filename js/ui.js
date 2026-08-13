import { GAME_CONFIG } from "../data/cases.js?v=20260812-sourceclarity1";

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => escapeMap[character]);
}

export function shell(content, options = {}) {
  const { compact = false, header = true, volume = 1 } = options;
  const soundOn = volume > 0;
  const soundButton = `<button class="sound-toggle" data-action="sound-toggle" aria-pressed="${soundOn}" aria-label="音声を${soundOn ? "オフ" : "オン"}にする">
    <span aria-hidden="true">${soundOn ? "♪" : "×"}</span><strong>SOUND ${soundOn ? "ON" : "OFF"}</strong>
  </button>`;
  return `
    <div class="site-shell ${compact ? "site-shell--compact" : ""} ${header ? "" : "site-shell--headerless"}">
      ${header ? `<header class="topbar">
        <button class="wordmark" data-action="home" aria-label="トップへ戻る">
          <span class="wordmark__mark" aria-hidden="true">RI</span>
          <span><strong>${GAME_CONFIG.title}</strong><small>${GAME_CONFIG.subtitle}</small></span>
        </button>
        <div class="topbar__actions">
          ${soundButton}
          <button class="text-button" data-action="howto">遊び方 <span aria-hidden="true">↗</span></button>
        </div>
      </header>` : ""}
      ${header ? "" : soundButton}
      ${content}
      <footer class="footer-line"><span>REFERENCE DESK / SESSION 001</span><span>LISTEN · ASK · CONNECT</span></footer>
    </div>`;
}

export function topScreen(progress) {
  return shell(`
    <section class="title-cover" aria-labelledby="hero-title">
      <img class="title-cover__image" src="./assets/characters/title.png" alt="図書館のカウンターでメモを取る司書さん" decoding="async" fetchpriority="high" />
      <div class="title-cover__content">
        <h1 id="hero-title" class="title-cover__logo"><img src="./assets/characters/logo.png" alt="${escapeHtml(GAME_CONFIG.title)}　${escapeHtml(GAME_CONFIG.subtitle)}" decoding="async" fetchpriority="high" /></h1>
        <p class="title-cover__tagline">聞くことから、レファレンスは始まる。</p>
        <ol class="title-cover__flow" aria-label="ゲームの流れ">
          <li><span>01</span><div><strong>LISTEN</strong><small>言葉を聞く</small></div></li>
          <li><span>02</span><div><strong>ASK</strong><small>質問する</small></div></li>
          <li><span>03</span><div><strong>SUMMARIZE</strong><small>依頼をまとめる</small></div></li>
        </ol>
        <div class="title-cover__actions">
          <button class="primary-button primary-button--large" data-action="cases">インタビューを始める <span aria-hidden="true">→</span></button>
          <button class="secondary-button" data-action="howto">遊び方を見る</button>
        </div>
        <div class="title-cover__credit">
          <small>作成：やわらか図書館学</small>
          <a class="title-cover__games-link" href="https://yawatosho.github.io/">
            <span>YAWATOSHO GAMES</span><span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>`, { header: false, volume: progress.volume });
}

export function caseSelectScreen(cases, progress) {
  const completed = cases.filter(({ data }) =>
    progress.completedCases.includes(data.id),
  ).length;
  return shell(`
    <section class="page-heading">
      <p class="eyebrow"><span></span> CASE FILES</p>
      <h1>ケースファイルを選ぶ</h1>
      <p>ケースは順番に解放されます。相手の言葉をよく聞き、質問を重ねて答えを見つけてください。</p>
    </section>
    <section class="case-grid" aria-label="ケース一覧">
      ${cases
        .map(({ data, unlocked }) => {
          const isComplete = progress.completedCases.includes(data.id);
          const best = progress.bestScores[data.id];
          const cardPortraitStyles = [];
          if (data.patron.cardPortraitPosition) {
            cardPortraitStyles.push(
              `--card-portrait-position:${escapeHtml(data.patron.cardPortraitPosition)}`,
            );
          }
          if (data.patron.cardPortraitScale) {
            cardPortraitStyles.push(
              `--card-portrait-scale:${escapeHtml(data.patron.cardPortraitScale)}`,
            );
          }
          const cardPortraitStyle = cardPortraitStyles.length
            ? ` style="${cardPortraitStyles.join(";")}"`
            : "";
          return `
            <article class="case-card ${unlocked ? "" : "case-card--locked"} ${isComplete ? "case-card--complete" : ""}">
              <div class="case-card__top">
                <span class="case-number">CASE ${escapeHtml(data.number)}</span>
                <span class="case-status">${isComplete ? "COMPLETE" : unlocked ? "AVAILABLE" : "LOCKED"}</span>
              </div>
              <div class="case-card__visual">
                <span class="case-card__index" aria-hidden="true">${escapeHtml(data.number)}</span>
                <div class="case-card__portrait"${cardPortraitStyle}>
                  <img src="${escapeHtml(data.patron.image)}" alt="${escapeHtml(data.patron.name)}の顔" loading="lazy" decoding="async" />
                </div>
              </div>
              <p class="case-card__category">${escapeHtml(data.category)}</p>
              <h2>${escapeHtml(data.title)}</h2>
              <blockquote>「${escapeHtml(data.cardOpening ?? data.opening)}」</blockquote>
              <div class="case-card__meta">
                <span>${escapeHtml(data.difficulty)}</span>
                ${best !== undefined ? `<span>BEST ${escapeHtml(best)}</span>` : ""}
              </div>
              <button class="case-card__button" data-action="select-case" data-case-id="${escapeHtml(data.id)}" ${unlocked ? "" : "disabled"}>
                ${unlocked ? (isComplete ? "もう一度プレイ" : "ケースを開く") : escapeHtml(data.unlockHint ?? "前のケースをクリア")}
                <span aria-hidden="true">${unlocked ? "→" : "⌑"}</span>
              </button>
            </article>`;
        })
        .join("")}
    </section>
    <section class="progress-panel" aria-label="進行状況">
      <div><span class="progress-panel__value">${String(completed).padStart(2, "0")}<small>/${String(cases.length).padStart(2, "0")}</small></span><span>COMPLETED CASES</span></div>
      <button class="text-button text-button--danger" data-action="reset-progress">進行状況をリセット</button>
    </section>`, { compact: true, volume: progress.volume });
}

const defaultPresentation = Object.freeze({
  playerLabel: "あなた",
  respondentLabel: "利用者",
  respondentRole: "PATRON",
  respondentInfoLabel: "利用者情報",
  playerAvatar: "",
  playerMessageSound: GAME_CONFIG.messageSounds.librarian,
  resultPlayerName: GAME_CONFIG.resultPlayer.name,
  resultPlayerPortraits: GAME_CONFIG.resultPlayer.portraits,
  logTitle: "INTERVIEW LOG",
  logSubtitle: "会話の記録",
  deductionLogTitle: "インタビューログ",
  deductionPrompt: "インタビューログをもとに、利用者の依頼を整理します。",
  limitStatus: "利用者はそろそろ時間のようです。",
  limitPrompt: "最後の回答を確認できましたか？",
  deduceButton: "わかった！ 回答をまとめる",
  limitButton: "回答をまとめる",
  deductionEyebrow: "REFERENCE RESPONSE",
  deductionTitle: "利用者の依頼を、一文にまとめましょう",
  deductionLead:
    "インタビューログを振り返り、4つの文節から利用者が必要としている情報を整理してください。",
  answerButton: "この内容で回答する",
  completionEyebrow: "INTERVIEW COMPLETE",
  resultHeadlineHigh: "すごい！ 利用者さんの気持ちに届きました。",
  resultHeadlineMedium: "いい感じ！ 本当の問いが見えてきました。",
  resultHeadlineLow: "ナイスチャレンジ！ もう一度手がかりをたどろう。",
  reactionLabelEnglish: "PATRON RESPONSE",
  reactionLabelJapanese: "利用者の反応",
  answerLabelEnglish: "REFERENCE ANSWER",
  answerLabelJapanese: "利用者の本当の問い",
  adviceLabel: "INTERVIEW NOTE",
});

function getPresentation(caseData) {
  return { ...defaultPresentation, ...(caseData.presentation ?? {}) };
}

function conversationMarkup(
  conversation,
  {
    typingFrom = conversation.length,
    messageSounds = {},
    playerAvatar = "",
    respondentAvatar = "",
  } = {},
) {
  return conversation
    .map(
      (entry, index) => {
        const shouldType = index >= typingFrom;
        const messageSoundConfig =
          messageSounds[entry.speaker] ?? messageSounds.default ?? "message1";
        const messageSound =
          typeof messageSoundConfig === "string"
            ? messageSoundConfig
            : messageSoundConfig.id ?? "message1";
        const messageRate =
          typeof messageSoundConfig === "string"
            ? 1
            : messageSoundConfig.playbackRate ?? 1;
        const messageLoop =
          typeof messageSoundConfig === "string"
            ? true
            : messageSoundConfig.loop !== false;
        return `
      <div class="message message--${entry.speaker} ${index === conversation.length - 1 ? "message--latest" : ""}" data-message-sound="${escapeHtml(messageSound)}" data-message-rate="${escapeHtml(messageRate)}" data-message-loop="${escapeHtml(messageLoop)}">
        <div class="message__content">
          <span class="message__speaker">${escapeHtml(entry.label)}</span>
          <p>${entry.speaker === "patron" && respondentAvatar ? `<span class="message-patron-icon" aria-hidden="true"><img src="${escapeHtml(respondentAvatar)}" alt="" /></span>` : ""}<span class="message__text"${shouldType ? ` data-typing-text="${escapeHtml(entry.text)}" aria-hidden="true"` : ""}>${escapeHtml(entry.text)}</span>${shouldType ? `<span class="sr-only">${escapeHtml(entry.text)}</span>` : ""}${entry.speaker === "librarian" ? playerAvatar ? `<span class="librarian-avatar message-librarian-icon message-player-icon--custom" aria-hidden="true"><img src="${escapeHtml(playerAvatar)}" alt="" /></span>` : '<span class="librarian-avatar message-librarian-icon" aria-hidden="true"></span>' : ""}</p>
        </div>
      </div>`;
      },
    )
    .join("");
}

export function interviewScreen(
  session,
  { limitNotice = false, recoveredQuestions = 0, typingFrom, volume = 1 } = {},
) {
  const { caseData, state } = session;
  const presentation = getPresentation(caseData);
  const available = session
    .getQuestionStates()
    .filter(({ status }) => status !== "locked");
  const questionLimit = session.getQuestionLimit();
  const askableStatuses = new Set(["available", "new"]);
  const askableCount = available.filter(({ status }) =>
    askableStatuses.has(status),
  ).length;
  const canDeduce = state.questionsUsed > 0;
  const firstTypingMessage = Number.isInteger(typingFrom)
    ? typingFrom
    : state.conversation.length;
  const patronImage =
    caseData.patron.reactions?.[state.patronExpression]?.image ??
    caseData.patron.image;
  const patronImageAlt =
    state.patronExpression === "high"
      ? `${caseData.patron.name}の笑顔のイラスト`
      : `${caseData.patron.name}のイラスト`;

  return shell(`
    <section class="interview-header">
      <div><span>CASE ${escapeHtml(caseData.number)}</span><strong>${escapeHtml(caseData.title)}</strong></div>
      <div class="question-meter" aria-label="質問回数 ${state.questionsUsed} / ${questionLimit}" style="--question-limit:${questionLimit}">
        <span>QUESTIONS${state.questionBonus ? `<em>CHAT +${state.questionBonus}</em>` : ""}</span>
        <strong>${state.questionsUsed}<small> / ${questionLimit}</small></strong>
        <div>${Array.from({ length: questionLimit }, (_, index) => `<i class="${index < state.questionsUsed ? "used" : ""}"></i>`).join("")}</div>
      </div>
    </section>
    <section class="interview-layout" style="--case-accent:${escapeHtml(caseData.patron.accent)}">
      <aside class="patron-panel" aria-label="${escapeHtml(presentation.respondentInfoLabel)}">
        <div class="patron-portrait"><img src="${escapeHtml(patronImage)}" alt="${escapeHtml(patronImageAlt)}" /><span class="patron-portrait__badge" aria-hidden="true">${escapeHtml(caseData.patron.initials)}</span></div>
        <p class="patron-panel__role">${escapeHtml(presentation.respondentRole)}</p>
        <h2>${escapeHtml(caseData.patron.name)}</h2>
        <p>${escapeHtml(caseData.patron.descriptor)}</p>
        <div class="listening-indicator"><span></span> LISTENING</div>
      </aside>
      <div class="dialogue-panel">
        <div class="section-label"><span>01</span><div><strong>${escapeHtml(presentation.logTitle)}</strong><small>${escapeHtml(presentation.logSubtitle)}</small></div></div>
        <div class="conversation" id="conversation" tabindex="-1">${conversationMarkup(state.conversation, {
          typingFrom: firstTypingMessage,
          messageSounds: {
            librarian: {
              id: presentation.playerMessageSound,
              playbackRate: presentation.playerMessagePlaybackRate,
              loop: presentation.playerMessageLoop,
            },
            patron: {
              id:
                caseData.patron.messageSound ??
                GAME_CONFIG.messageSounds.defaultPatron,
              playbackRate: caseData.patron.messagePlaybackRate,
              loop: caseData.patron.messageLoop,
            },
          },
          playerAvatar: presentation.playerAvatar,
          respondentAvatar: patronImage,
        })}</div>
        ${limitNotice ? `<div class="limit-notice" role="status" data-limit-notice hidden><strong>${escapeHtml(presentation.limitStatus)}</strong><span>最後の言葉を確認したら、「${escapeHtml(presentation.limitButton)}」を押してください。</span></div>` : ""}
        ${recoveredQuestions > 0 ? `<div class="recovery-notice" role="status" data-recovery-notice hidden><strong>会話が弾みました。</strong><span>質問できる回数が${escapeHtml(recoveredQuestions)}回分回復しました。</span></div>` : ""}
        ${
          limitNotice
            ? ""
            : `<div class="question-area">
          <div class="question-area__heading"><h2>次は、どんなことを聞いてみる？</h2><span>${askableCount} QUESTIONS AVAILABLE</span></div>
          <div class="question-list">
            ${available
              .map(
                ({ question, status }) => `
                <button class="question-button ${status === "new" ? "question-button--new" : ""}" data-action="ask" data-question-id="${escapeHtml(question.id)}" ${status === "asked" ? "disabled" : ""}>
                  <span>${escapeHtml(question.text)}</span>
                  ${status === "new" ? '<em>NEW</em>' : status === "asked" ? '<em class="asked">ASKED</em>' : '<b aria-hidden="true">→</b>'}
                </button>`,
              )
              .join("")}
          </div>
        </div>`
        }
        <div class="deduce-box">
          <p>${escapeHtml(limitNotice ? presentation.limitPrompt : presentation.deductionPrompt)}</p>
          <button class="deduce-button" data-action="${limitNotice ? "continue-deduction" : "deduce"}" ${canDeduce ? "" : "disabled"}>${escapeHtml(limitNotice ? presentation.limitButton : presentation.deduceButton)} <span aria-hidden="true">${limitNotice ? "→" : "✦"}</span></button>
          <small>${state.questionsUsed === 0 ? "1問以上の質問で解放" : limitNotice ? "押すまでは回答を確認できます" : "聞き取った内容を振り返って回答しましょう"}</small>
        </div>
      </div>
    </section>`, { compact: true, volume });
}

export function deductionScreen(session, volume = 1) {
  const { caseData, state } = session;
  const presentation = getPresentation(caseData);
  const respondentAvatar =
    caseData.patron.reactions?.[state.patronExpression]?.image ??
    caseData.patron.image;
  const sentence = session.getDeductionSentence();
  const slotStates = session.getDeductionSlotStates();
  return shell(`
    <section class="deduction-page" style="--case-accent:${escapeHtml(caseData.patron.accent)}">
      <div class="deduction-heading">
        <p class="eyebrow"><span></span> ${escapeHtml(presentation.deductionEyebrow)}</p>
        <h1>${escapeHtml(presentation.deductionTitle)}</h1>
        <p>${escapeHtml(presentation.deductionLead)}</p>
      </div>
      <div class="deduction-board">
        <div class="deduction-board__meta"><span>CASE ${escapeHtml(caseData.number)}</span><span>ASKED ${state.questionsUsed} / ${session.getQuestionLimit()}</span></div>
        <section class="deduction-log" aria-labelledby="deduction-log-title">
          <div class="deduction-log__heading">
            <div><span>${escapeHtml(presentation.logTitle)}</span><h2 id="deduction-log-title">${escapeHtml(presentation.deductionLogTitle)}</h2></div>
            <small>${state.questionsUsed} QUESTIONS</small>
          </div>
          <div class="deduction-log__conversation" tabindex="0" aria-label="${escapeHtml(presentation.deductionLogTitle)}">
            ${conversationMarkup(state.conversation, {
              playerAvatar: presentation.playerAvatar,
              respondentAvatar,
            })}
          </div>
        </section>
        <div class="slot-grid">
          ${slotStates
            .map(
              ({ slot, availableOptions }, index) => `
              <section class="slot-card">
                <span class="slot-card__number">0${index + 1}</span>
                <span class="slot-card__label">${escapeHtml(slot.label)}</span>
                <button class="slot-choice-button ${state.deductionSelections[slot.id] ? "is-selected" : ""}" type="button" data-action="open-slot-choice" data-slot-id="${escapeHtml(slot.id)}">
                  <span data-slot-choice-value="${escapeHtml(slot.id)}">${escapeHtml(availableOptions.find((option) => option.id === state.deductionSelections[slot.id])?.text ?? "選択してください")}</span>
                  <b aria-hidden="true">→</b>
                </button>
              </section>`,
            )
            .join("")}
        </div>
        <div class="sentence-preview" aria-live="polite">
          <span>YOUR RESPONSE</span>
          <p>${escapeHtml(sentence)}</p>
        </div>
        <button class="primary-button primary-button--large answer-button" data-action="submit-answer" ${session.isDeductionComplete() ? "" : "disabled"}>${escapeHtml(presentation.answerButton)} <span aria-hidden="true">→</span></button>
      </div>
    </section>`, { compact: true, volume });
}

const markCopy = {
  correct: { symbol: "○", text: "正解" },
  partial: { symbol: "△", text: "部分正解" },
  incorrect: { symbol: "×", text: "不正解" },
};

function getPatronReaction(patron, total) {
  const level = total >= 85 ? "high" : total >= 50 ? "medium" : "low";
  const expressionLabels = {
    high: "満足して喜んでいる",
    medium: "穏やかにほほえんでいる",
    low: "少し考え込みながらも前向きな",
  };
  const reaction = patron.reactions?.[level] ?? {};

  return {
    level,
    image: reaction.image ?? patron.image,
    line: reaction.line ?? "調べてくださって、ありがとうございます。",
    expressionLabel: expressionLabels[level],
  };
}

export function resultScreen(session, progress, hasNextCase) {
  const { caseData, state } = session;
  const presentation = getPresentation(caseData);
  const score = state.score;
  const reaction = getPatronReaction(caseData.patron, score.total);
  const resultPlayerPortrait =
    presentation.resultPlayerPortraits?.[reaction.level];
  return shell(`
    <section class="result-page" style="--case-accent:${escapeHtml(caseData.patron.accent)}">
      <div class="result-hero">
        <p class="eyebrow"><span></span> ${escapeHtml(presentation.completionEyebrow)}</p>
        <div class="rank-badge"><small>RANK</small><strong>${score.rank}</strong></div>
        <div class="score-block"><strong>${score.total}</strong><span>/ 100</span></div>
        <h1>${escapeHtml(score.rank === "S" ? presentation.resultHeadlineHigh : score.total >= 70 ? presentation.resultHeadlineMedium : presentation.resultHeadlineLow)}</h1>
        <figure class="result-player-portrait result-player-portrait--${reaction.level}"><img src="${escapeHtml(resultPlayerPortrait)}" alt="${escapeHtml(presentation.resultPlayerName)}が${reaction.expressionLabel}表情" /></figure>
      </div>
      <section class="patron-reaction patron-reaction--${reaction.level}" aria-labelledby="patron-reaction-title">
        <figure class="patron-reaction__portrait"><img src="${escapeHtml(reaction.image)}" alt="${escapeHtml(caseData.patron.name)}が${reaction.expressionLabel}表情" /></figure>
        <div class="patron-reaction__copy">
          <p class="patron-reaction__label">${escapeHtml(presentation.reactionLabelEnglish)} <span>${escapeHtml(presentation.reactionLabelJapanese)}</span></p>
          <h2 id="patron-reaction-title">${escapeHtml(caseData.patron.name)}</h2>
          <blockquote>「${escapeHtml(reaction.line)}」</blockquote>
        </div>
      </section>
      <div class="result-grid">
        <section class="result-card">
          <div class="section-label"><span>01</span><div><strong>YOUR ANSWER</strong><small>文節ごとの採点</small></div></div>
          <div class="segment-results">
            ${score.segments
              .map((segment) => {
                const mark = markCopy[segment.mark];
                return `<div class="segment-result segment-result--${segment.mark}"><span class="segment-result__mark">${mark.symbol}</span><div><small>${escapeHtml(segment.label)} · ${mark.text}</small><strong>${escapeHtml(segment.selectedText)}</strong></div><b>+${segment.points}</b></div>`;
              })
              .join("")}
          </div>
        </section>
        <section class="result-card result-card--answer">
          <div class="section-label"><span>02</span><div><strong>${escapeHtml(presentation.answerLabelEnglish)}</strong><small>${escapeHtml(presentation.answerLabelJapanese)}</small></div></div>
          <blockquote>${escapeHtml(caseData.correctSentence)}</blockquote>
          <p>${escapeHtml(caseData.explanation)}</p>
          <div class="advice"><span>${escapeHtml(presentation.adviceLabel)}</span><p>${escapeHtml(caseData.advice)}</p></div>
          <p class="best-score">BEST SCORE <strong>${escapeHtml(progress.bestScores[caseData.id])}</strong></p>
        </section>
      </div>
      <div class="result-actions">
        ${hasNextCase ? '<button class="primary-button primary-button--large" data-action="next-case">次のケースへ <span aria-hidden="true">→</span></button>' : '<button class="primary-button primary-button--large" data-action="cases">ケース一覧へ <span aria-hidden="true">→</span></button>'}
        <button class="secondary-button" data-action="replay">もう一度</button>
        ${hasNextCase ? '<button class="text-button" data-action="cases">ケース一覧へ</button>' : ""}
      </div>
    </section>`, { compact: true, volume: progress.volume });
}

export function howToDialog() {
  return `
    <dialog class="modal" id="howto-dialog" aria-labelledby="howto-title">
      <div class="modal__header"><span>HOW TO PLAY</span><button data-action="close-dialog" aria-label="閉じる">×</button></div>
      <div class="modal__content">
        <p class="eyebrow"><span></span> ${GAME_CONFIG.title}</p>
        <h2 id="howto-title">良い答えは、良い質問から。</h2>
        <ol>
          <li><span>01</span><div><strong>質問を選ぶ</strong><p>質問は基本${GAME_CONFIG.maxQuestions}回。楽しい雑談を深掘りすると、1〜3回分回復します。</p></div></li>
          <li><span>02</span><div><strong>手がかりをつなぐ</strong><p>判明した事実を整理し、利用者の目的を見極めます。</p></div></li>
          <li><span>03</span><div><strong>問いを組み立てる</strong><p>4つの文節を選び、本当に知りたいことを完成させます。</p></div></li>
        </ol>
        <p class="modal__note">1問以上聞けば、いつでも回答をまとめられます。回答画面では4文節すべてに複数の候補が表示されます。インタビューログを根拠に、利用者の依頼に合うものを選びましょう。</p>
        <p class="modal__privacy">このゲームでは、改善のためGoogle Analyticsを使用して匿名の利用状況を計測しています。会話内容・回答内容・個人を特定する情報は送信しません。</p>
      </div>
      <button class="primary-button modal__close" data-action="close-dialog">ゲームへ戻る</button>
    </dialog>`;
}

export function confirmDialog() {
  return `
    <dialog class="modal modal--confirm" id="confirm-dialog" aria-labelledby="confirm-title">
      <div class="modal__content">
        <p class="eyebrow"><span></span> FINAL CHECK</p>
        <h2 id="confirm-title">ここまでの情報で回答をまとめますか？</h2>
        <p>回答画面へ進むと質問には戻れません。</p>
      </div>
      <div class="modal__actions">
        <button class="primary-button" data-action="confirm-deduce">回答をまとめる</button>
        <button class="secondary-button" data-action="close-dialog">まだ質問する</button>
      </div>
    </dialog>`;
}

export function answerChoiceDialog() {
  return `
    <dialog class="modal modal--answer-choice" id="answer-choice-dialog" aria-labelledby="answer-choice-title">
      <div class="modal__header"><span>CHOOSE A PHRASE</span><button data-action="close-dialog" aria-label="閉じる">×</button></div>
      <div class="modal__content">
        <p class="eyebrow"><span></span> ANSWER PART</p>
        <h2 id="answer-choice-title">回答の文節を選ぶ</h2>
        <div class="answer-choice-grid" data-answer-choice-options></div>
      </div>
    </dialog>`;
}
