import assert from "node:assert/strict";
import test from "node:test";

import { CASES } from "../data/cases.js";
import { GameSession, isQuestionUnlocked } from "../js/game.js";
import { calculateScore } from "../js/scoring.js";
import {
  STORAGE_KEY,
  isCaseUnlocked,
  loadProgress,
  recordResult,
  recordVariant,
} from "../js/storage.js";
import {
  caseSelectScreen,
  deductionScreen,
  interviewScreen,
  resultScreen,
} from "../js/ui.js";

const case01 = CASES.find((item) => item.id === "case01");

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }
  getItem(key) {
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    this.values.set(key, value);
  }
  removeItem(key) {
    this.values.delete(key);
  }
}

test("CASE 01: 初期質問と条件解放がデータだけで判定される", () => {
  const session = new GameSession(case01);
  const initial = session
    .getQuestionStates()
    .filter(({ status }) => status === "available")
    .map(({ question }) => question.id);

  assert.deepEqual(initial, [
    "q_period",
    "q_newspaper",
    "q_specific",
    "q_use",
    "q01_plausible",
    "q01_irrelevant",
  ]);
  assert.equal(
    isQuestionUnlocked(
      case01.questions.find((question) => question.id === "q_shop_name"),
      [],
    ),
    false,
  );

  const answer = session.askQuestion("q_specific");
  assert.deepEqual(answer.newlyUnlocked.sort(), [
    "q_article_detail",
    "q_location",
    "q_shop_name",
    "q_source",
  ]);
  assert.equal(
    session.getQuestionStates().find(({ question }) => question.id === "q_shop_name")
      .status,
    "new",
  );
  assert.throws(() => session.askQuestion("q_specific"), /質問済み/);
});

test("CASE 01: 返答を質問ごとに独立してランダム選択する", () => {
  const randomValues = [0, 0, 0.999999];
  const session = new GameSession(case01, {
    random: () => randomValues.shift(),
  });
  const periodQuestion = session.caseData.questions.find(
    (question) => question.id === "q_period",
  );
  const newspaperQuestion = session.caseData.questions.find(
    (question) => question.id === "q_newspaper",
  );

  const firstAnswer = session.askQuestion("q_period");
  const secondAnswer = session.askQuestion("q_newspaper");

  assert.equal(firstAnswer.response, periodQuestion.response);
  assert.equal(secondAnswer.response, newspaperQuestion.responseVariants.at(-1));
  assert.equal(session.state.conversation.at(-1).text, secondAnswer.response);
});

test("CASE 01: 再プレイでは異なる4文節の組み合わせを選択する", () => {
  const firstSession = new GameSession(case01, { random: () => 0 });
  const replaySession = new GameSession(case01, {
    random: () => 0,
    excludeVariantId: firstSession.state.variantId,
  });

  assert.notEqual(firstSession.state.variantId, replaySession.state.variantId);
  assert.notEqual(
    firstSession.caseData.correctSentence,
    replaySession.caseData.correctSentence,
  );
  assert.notDeepEqual(
    firstSession.caseData.activeCombination,
    replaySession.caseData.activeCombination,
  );
});

test("CASE 01: 直近履歴を避けて前回から最も異なる組み合わせを選ぶ", () => {
  const firstSession = new GameSession(case01, { random: () => 0 });
  const secondSession = new GameSession(case01, {
    random: () => 0,
    excludeVariantIds: [firstSession.state.variantId],
    preferDifferentDimensions: true,
  });
  const changedDimensions = Object.keys(firstSession.caseData.activeCombination).filter(
    (slotId) =>
      firstSession.caseData.activeCombination[slotId] !==
      secondSession.caseData.activeCombination[slotId],
  );

  assert.equal(changedDimensions.length, 4);
  assert.notEqual(firstSession.state.variantId, secondSession.state.variantId);

  const thirdSession = new GameSession(case01, {
    random: () => 0,
    excludeVariantIds: [
      firstSession.state.variantId,
      secondSession.state.variantId,
    ],
    preferDifferentDimensions: true,
  });
  assert.equal(
    [firstSession.state.variantId, secondSession.state.variantId].includes(
      thirdSession.state.variantId,
    ),
    false,
  );
});

test("CASE 01: 全質問が3種類の返答を持つ", () => {
  const session = new GameSession(case01, { random: () => 0 });
  session.caseData.questions.forEach((question) => {
    assert.equal(question.responseOptions.length, 3, question.id);
  });
});

test("CASE 01: 6問目の回答と時間案内の後に質問受付を終了する", () => {
  const session = new GameSession(case01);
  ["q_period", "q_newspaper", "q_specific", "q_use", "q_article_detail", "q_location"].forEach(
    (questionId) => session.askQuestion(questionId),
  );

  assert.equal(session.state.questionsUsed, 6);
  assert.equal(session.state.phase, "deduction");
  assert.equal(session.state.conversation.at(-1).text, case01.patron.timeLimitLine);
  assert.throws(() => session.askQuestion("q_location"), /質問フェイズ/);
});

test("CASE 01: 店名が未確認でも全候補を同じ見た目で選べる", () => {
  const session = new GameSession(case01, { random: () => 0 });
  assert.equal(session.startDeduction(), false);
  session.askQuestion("q_specific");
  assert.equal(session.startDeduction(), true);

  const targetState = session
    .getDeductionSlotStates()
    .find(({ slot }) => slot.id === "target");
  assert.equal(targetState.fullyUnlocked, false);
  assert.equal(targetState.partiallyUnlocked, true);
  assert.deepEqual(
    targetState.availableOptions.map((option) => option.id),
    targetState.slot.options.map((option) => option.id),
  );
  assert.equal(session.setSelection("period", "period_30"), true);
  assert.equal(session.setSelection("location", "loc_yokohama"), true);
  assert.equal(session.setSelection("target", "target_hikari"), true);
  assert.equal(session.setSelection("need", "need_article"), true);

  const screen = deductionScreen(session);
  assert.match(screen, /祖父の洋菓子店/);
  assert.match(screen, /ひかり洋菓子店/);
  assert.doesNotMatch(
    screen,
    /一部確認済み|未確認：質問していません|回答候補は質問後に表示されます/,
  );

  const score = session.submitDeduction();
  assert.equal(score.accuracy, 50);
  assert.equal(score.total, 50);
  assert.deepEqual(
    score.segments.map((segment) => segment.mark),
    ["incorrect", "incorrect", "correct", "correct"],
  );
});

test("CASE 01: 十分に質問した完全正解は100点", () => {
  const score = calculateScore(
    case01,
    {
      period: "period_40",
      location: "loc_nakano",
      target: "target_hikari",
      need: "need_article",
    },
  );
  assert.equal(score.accuracy, 100);
  assert.equal(score.total, 100);
  assert.equal(score.rank, "S");
});

test("CASE 01: 部分正解は1文節12.5点", () => {
  const score = calculateScore(case01, {
    period: "period_old",
    location: "loc_unknown",
    target: "target_aoba",
    need: "need_newspaper",
  });
  assert.equal(score.segments[0].mark, "partial");
  assert.equal(score.segments[0].points, 12.5);
  assert.equal(score.total, 12.5);
});

test("進行状況とベストスコアを保存・再読込できる", () => {
  const storage = new MemoryStorage();
  const initial = loadProgress(storage);
  const saved = recordResult(initial, "case01", 80, storage);
  recordResult(saved, "case01", 65, storage);
  const restored = loadProgress(storage);

  assert.equal(storage.getItem(STORAGE_KEY) !== null, true);
  assert.deepEqual(restored.completedCases, ["case01"]);
  assert.equal(restored.bestScores.case01, 80);
  assert.equal(isCaseUnlocked(CASES, "case01", restored), true);
});

test("CASE 01の直近3プレイを保存・再読込できる", () => {
  const storage = new MemoryStorage();
  let progress = loadProgress(storage);
  ["variant-a", "variant-b", "variant-c", "variant-d"].forEach(
    (variantId) => {
      progress = recordVariant(progress, "case01", variantId, 3, storage);
    },
  );
  const restored = loadProgress(storage);

  assert.deepEqual(restored.variantHistory.case01, [
    "variant-b",
    "variant-c",
    "variant-d",
  ]);
});

test("壊れた保存値を安全なスコア範囲へ正規化する", () => {
  const storage = new MemoryStorage();
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      completedCases: ["case01", null, "case01"],
      bestScores: {
        case01: '<img src=x onerror="alert(1)">',
        case02: 120,
        case03: -5,
        case04: 84.6,
      },
      volume: 3,
    }),
  );

  const restored = loadProgress(storage);
  assert.deepEqual(restored.completedCases, ["case01"]);
  assert.deepEqual(restored.bestScores, {
    case02: 100,
    case03: 0,
    case04: 85,
  });
  assert.equal(restored.volume, 1);
});

test("ベストスコアは画面出力時にもHTMLエスケープする", () => {
  const maliciousScore = '<img src=x onerror="alert(1)">';
  const markup = caseSelectScreen(
    [{ data: case01, unlocked: true }],
    {
      completedCases: ["case01"],
      bestScores: { case01: maliciousScore },
      volume: 1,
    },
  );

  assert.equal(markup.includes(maliciousScore), false);
  assert.equal(markup.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"), true);
});

test("回答をまとめるボタンをインタビュー中央カラムの末尾に表示する", () => {
  const markup = interviewScreen(new GameSession(case01));
  const dialoguePosition = markup.indexOf('<div class="dialogue-panel">');
  const deducePosition = markup.indexOf('<div class="deduce-box">');

  assert.ok(dialoguePosition < deducePosition);
  assert.equal(markup.match(/class="deduce-box"/g)?.length, 1);
  assert.doesNotMatch(markup, /facts-panel|KNOWN FACTS|判明したこと/);
});

test("回答選択画面では判明事項を隠し、インタビューログを表示する", () => {
  const session = new GameSession(case01, { random: () => 0 });
  session.askQuestion("q_specific");
  session.startDeduction();

  const markup = deductionScreen(session);
  const logPosition = markup.indexOf('class="deduction-log"');
  const slotsPosition = markup.indexOf('class="slot-grid"');

  assert.ok(logPosition > 0);
  assert.ok(logPosition < slotsPosition);
  assert.match(markup, /id="deduction-log-title">インタビューログ/);
  session.state.conversation.forEach((entry) => {
    assert.ok(markup.includes(entry.text));
  });
  assert.doesNotMatch(markup, /KNOWN FACTS|判明したこと/);
});

test("インタビューの新しい発言だけを文字送り対象として出力する", () => {
  const session = new GameSession(case01, { random: () => 0 });
  const openingMarkup = interviewScreen(session, { typingFrom: 0 });

  assert.match(openingMarkup, /data-typing-text=/);
  assert.match(openingMarkup, /class="sr-only"/);
  assert.match(openingMarkup, /aria-hidden="true"/);

  const previousLength = session.state.conversation.length;
  session.askQuestion("q_specific");
  const responseMarkup = interviewScreen(session, { typingFrom: previousLength });
  assert.equal(responseMarkup.match(/data-typing-text=/g)?.length, 2);
});

test("評価に応じた利用者の表情と感謝のセリフを結果画面に表示する", () => {
  const renderAtScore = (total, rank) => {
    const session = new GameSession(case01, { random: () => 0 });
    session.state.questionsUsed = 6;
    session.state.score = {
      total,
      rank,
      accuracy: total,
      segments: [],
    };
    return resultScreen(
      session,
      { bestScores: { case01: total } },
      false,
    );
  };

  const high = renderAtScore(95, "S");
  const medium = renderAtScore(70, "B");
  const low = renderAtScore(40, "D");

  assert.match(high, /patron-reaction--high/);
  assert.match(high, /patron-01-reaction-high\.webp/);
  assert.match(high, /extra-librarian-reaction-high-portrait\.webp/);
  assert.match(medium, /patron-reaction--medium/);
  assert.match(medium, /patron-01-reaction-medium\.webp/);
  assert.match(medium, /extra-librarian-reaction-medium-portrait\.webp/);
  assert.match(low, /patron-reaction--low/);
  assert.match(low, /patron-01-reaction-low\.webp/);
  assert.match(low, /extra-librarian-reaction-low-portrait\.webp/);
  assert.match(high, /司書さんが満足して喜んでいる表情/);
  assert.match(low, /ありがとうございます/);
  assert.doesNotMatch(low, /怒|責め|役に立た/);
});
