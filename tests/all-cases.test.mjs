import assert from "node:assert/strict";
import test from "node:test";

import { CASES } from "../data/cases.js";
import { GameSession, getCaseCombinations } from "../js/game.js";
import { interviewScreen, resultScreen } from "../js/ui.js";
import {
  isCaseUnlocked,
  isCaseVisible,
  loadProgress,
  recordResult,
  recordVariant,
} from "../js/storage.js";

const sixQuestionRoutes = {
  case01: ["q_period", "q_specific", "q_shop_name", "q_location", "q_use", "q_newspaper"],
  case02: ["q02_author", "q02_page", "q02_use", "q02_need", "q02_exact_book", "q02_source"],
  case03: ["q03_field", "q03_use", "q03_technology", "q03_recent", "q03_presentation", "q03_report"],
  case04: ["q04_period", "q04_range", "q04_goal", "q04_place", "q04_reason", "q04_building"],
  case05: ["q05_use", "q05_target", "q05_explain", "q05_span", "q05_series", "q05_compare"],
  case06: ["q06_name", "q06_look", "q06_use", "q06_want", "q06_read", "q06_keep"],
  case07: ["q07_appearance", "q07_use", "q07_deadline", "q07_goal", "q07_language", "q07_visual"],
  case08: ["q08_error", "q08_scope", "q08_purpose", "q08_want", "q08_level", "q08_visual"],
  case09: ["q09_where", "q09_look", "q09_use", "q09_want", "q09_format", "q09_season"],
  case10: ["q10_seen", "q10_target", "q10_purpose", "q10_want", "q10_visual", "q10_exact"],
  extra01: [
    "q_extra_object",
    "q_extra_condition",
    "q_extra_access",
    "q_extra_trace",
    "q_extra_confirm",
    "q_extra_when",
  ],
};

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

function randomSequence(values, fallback = 0) {
  let index = 0;
  return () => values[index++] ?? fallback;
}

function unlockQuestion(session, questionId, path = new Set()) {
  const questionState = session
    .getQuestionStates()
    .find(({ question }) => question.id === questionId);
  assert.ok(questionState, `${session.caseData.id}/${questionId}: question exists`);
  if (questionState.status !== "locked") return;
  assert.equal(
    path.has(questionId),
    false,
    `${session.caseData.id}/${questionId}: prerequisites are not circular`,
  );

  const target = questionState.question;
  while (
    session.getQuestionStates().find(({ question }) => question.id === questionId)
      .status === "locked"
  ) {
    const knownFacts = session.state.knownFacts;
    const missingFacts = [
      ...(target.requiresAll ?? []).filter((factId) => !knownFacts.has(factId)),
      ...((target.requiresAny ?? []).some((factId) => knownFacts.has(factId))
        ? []
        : target.requiresAny ?? []),
    ];
    const prerequisite = session.getQuestionStates().find(
      ({ question, status }) =>
        question.id !== questionId &&
        status !== "asked" &&
        question.reveals.some((factId) => missingFacts.includes(factId)),
    );

    assert.ok(
      prerequisite,
      `${session.caseData.id}/${questionId}: prerequisite is reachable`,
    );
    unlockQuestion(
      session,
      prerequisite.question.id,
      new Set([...path, questionId]),
    );
    session.askQuestion(prerequisite.question.id);
  }
}

function askWithPrerequisites(session, questionId) {
  unlockQuestion(session, questionId);

  assert.ok(
    session.state.questionsUsed < session.caseData.maxQuestions,
    `${session.caseData.id}/${questionId}: remains within question limit`,
  );
  return session.askQuestion(questionId);
}

test("通常10ケースとエクストラケースが共通スキーマで定義されている", () => {
  assert.equal(CASES.length, 11);
  assert.equal(new Set(CASES.map((caseData) => caseData.id)).size, 11);

  CASES.forEach((caseData) => {
    assert.equal(typeof caseData.title, "string", `${caseData.id}: title`);
    assert.equal(
      Object.hasOwn(caseData, "cardTitle"),
      false,
      `${caseData.id}: title is managed in one field`,
    );
    assert.equal(caseData.questions.length >= 8, true, `${caseData.id}: questions`);
    assert.equal(caseData.maxQuestions, 6);
    assert.equal(typeof caseData.patron.timeLimitLine, "string");
    assert.ok(caseData.patron.timeLimitLine.length > 0);
    assert.equal(caseData.deduction.slots.length, 4);
    assert.deepEqual(
      Object.keys(caseData.composition.dimensions),
      caseData.deduction.slots.map((slot) => slot.id),
      `${caseData.id}: composition dimensions`,
    );
    caseData.questions.forEach((question) => {
      assert.equal(Array.isArray(question.requiresAll), true);
      assert.equal(Array.isArray(question.requiresAny), true);
      assert.equal(typeof question.response, "string");
      assert.equal(
        Array.isArray(question.responseVariants) && question.responseVariants.length >= 1,
        true,
        `${caseData.id}/${question.id}: responseVariants`,
      );
      question.reveals.forEach((factId) => {
        assert.ok(caseData.facts[factId], `${caseData.id}: unknown fact ${factId}`);
      });
    });
    caseData.deduction.slots.forEach((slot) => {
      assert.equal(Array.isArray(slot.requiresAll), true);
      slot.requiresAll.forEach((factId) => {
        assert.ok(caseData.facts[factId], `${caseData.id}: unknown slot fact ${factId}`);
      });
      [
        ...(slot.partialRequiresAll ?? []),
        ...(slot.partialRequiresAny ?? []),
      ].forEach((factId) => {
        assert.ok(
          caseData.facts[factId],
          `${caseData.id}: unknown partial slot fact ${factId}`,
        );
      });
      assert.equal(slot.options.some((option) => option.score === 1), true);
      assert.equal(slot.options.some((option) => option.score === 0.5), true);
      assert.equal(slot.options.some((option) => option.score === 0), true);
    });
    Object.entries(caseData.composition.dimensions).forEach(
      ([slotId, choices]) => {
        const slot = caseData.deduction.slots.find((item) => item.id === slotId);
        assert.equal(choices.length >= 2, true, `${caseData.id}/${slotId}: choices`);
        choices.forEach((choice) => {
          const partialIds = [choice.partialOptionIds ?? choice.partialOptionId]
            .flat()
            .filter(Boolean);
          assert.equal(
            slot.options.some((option) => option.id === choice.optionId),
            true,
            `${caseData.id}/${slotId}/${choice.optionId}: answer`,
          );
          partialIds.forEach((partialId) => {
            assert.equal(
              slot.options.some((option) => option.id === partialId),
              true,
              `${caseData.id}/${slotId}/${partialId}: partial`,
            );
          });
        });
      },
    );
    getCaseCombinations(caseData).forEach((combination) => {
      Object.entries(combination).forEach(([slotId, choice]) => {
        assert.equal(
          caseData.deduction.slots
            .find((slot) => slot.id === slotId)
            .options.some((option) => option.id === choice.optionId),
          true,
          `${caseData.id}/${slotId}: combination answer`,
        );
      });
    });
  });
});

test("全返答が本文と、その返答で判明する情報を個別に保持する", () => {
  CASES.forEach((caseData) => {
    getCaseCombinations(caseData).forEach((_, index, combinations) => {
      const session = new GameSession(caseData, {
        random: () => (index + 0.1) / combinations.length,
      });

      session.caseData.questions.forEach((question) => {
        assert.equal(question.responseOptions.length >= 2, true);
        question.responseOptions.forEach((response) => {
          assert.equal(typeof response.text, "string");
          assert.ok(response.text.length > 0);
          assert.equal(Array.isArray(response.reveals), true);
          response.reveals.forEach((factId) => {
            assert.ok(
              session.caseData.facts[factId],
              `${caseData.id}/${question.id}: unknown response fact ${factId}`,
            );
          });
        });
      });
    });
  });
});

test("全ケースの冒頭は固定し、広い対象だけを伝えて具体的な正解は伏せる", () => {
  const broadSubjects = {
    case01: /新聞/,
    case02: /色/,
    case03: /AI/,
    case04: /地図/,
    case05: /統計/,
    case06: /石/,
    case07: /Japanese object/i,
    case08: /ニホンゴ.*コトバ/,
    case09: /鳥/,
    case10: /季節の行事/,
    extra01: /絵本コーナー/,
  };

  CASES.forEach((caseData) => {
    const openings = new Set();
    getCaseCombinations(caseData).forEach((_, index, combinations) => {
      const session = new GameSession(caseData, {
        random: () => (index + 0.1) / combinations.length,
      });
      openings.add(session.caseData.opening);
      assert.match(
        session.caseData.opening,
        broadSubjects[caseData.id],
        `${caseData.id}: opening names the broad subject`,
      );

      session.caseData.deduction.slots.forEach((slot) => {
        const correctOption = slot.options.find((option) => option.score === 1);
        assert.equal(
          session.caseData.opening.includes(correctOption.text),
          false,
          `${caseData.id}: opening reveals ${slot.id}`,
        );
      });
      assert.doesNotMatch(session.caseData.opening, /\{[a-zA-Z0-9_]+\}/);
    });
    assert.equal(openings.size, 1, `${caseData.id}: opening is fixed across combinations`);
  });
});

test("CASE 05は冒頭で大学に関係する人数だと分かり、対象確認へ自然につながる", () => {
  const case05 = CASES.find((caseData) => caseData.id === "case05");

  getCaseCombinations(case05).forEach((_, index, combinations) => {
    const session = new GameSession(case05, {
      random: () => (index + 0.1) / combinations.length,
    });
    const targetQuestion = session.caseData.questions.find(
      (question) => question.id === "q05_target",
    );

    assert.match(session.caseData.opening, /大学に関係する人数/);
    assert.match(targetQuestion.text, /どの人の人数/);
    assert.equal(
      session.caseData.opening.includes(session.caseData.facts.university_students),
      false,
      "opening must not reveal which target is correct",
    );
  });
});

test("CASE 05は毎年の推移と代表年の比較を明確に区別する", () => {
  const case05 = CASES.find((caseData) => caseData.id === "case05");
  const statisticDimension = case05.composition.dimensions.statistic;
  const statisticSlot = case05.deduction.slots.find(
    (slot) => slot.id === "statistic",
  );
  const seriesOption = statisticSlot.options.find(
    (option) => option.id === "stat_series",
  );
  const comparisonOption = statisticSlot.options.find(
    (option) => option.id === "stat_compare",
  );

  assert.match(statisticDimension[0].values.statisticNeedFact, /各年/);
  assert.match(statisticDimension[1].values.statisticNeedFact, /代表的な複数年/);
  assert.match(seriesOption.text, /各年の数値/);
  assert.match(comparisonOption.text, /代表的な複数年/);
  assert.notEqual(seriesOption.text, comparisonOption.text);
});

test("返答で述べた正解情報は、その返答を選んだ時点で判明する", () => {
  const casesById = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));

  const case02 = new GameSession(casesById.case02, {
    random: randomSequence([0, 0]),
  });
  const case02Result = case02.askQuestion("q02_need");
  assert.deepEqual(
    new Set(case02Result.reveals),
    new Set(["need_color_names", "need_swatches"]),
  );

  const case05Year = new GameSession(casesById.case05, {
    random: randomSequence([0.999999, 0]),
  });
  case05Year.askQuestion("q05_year");
  assert.equal(case05Year.state.knownFacts.has("twenty_years"), true);

  const case05Use = new GameSession(casesById.case05, {
    random: randomSequence([0, 0]),
  });
  case05Use.askQuestion("q05_use");
  assert.equal(case05Use.state.knownFacts.has("report"), true);
  assert.equal(case05Use.state.knownFacts.has("university_students"), false);

  const case05Compare = new GameSession(casesById.case05, {
    random: randomSequence([0, 0]),
  });
  case05Compare.state.knownFacts.add("report");
  case05Compare.askQuestion("q05_compare");
  assert.equal(case05Compare.state.knownFacts.has("time_series"), true);

  const case06 = new GameSession(casesById.case06, {
    random: randomSequence([0, 0]),
  });
  case06.state.knownFacts.add("appearance");
  case06.askQuestion("q06_keep");
  assert.equal(case06.state.knownFacts.has("keep_intact"), true);
  assert.equal(case06.state.knownFacts.has("desired_knowledge"), false);

  const case07First = new GameSession(casesById.case07, {
    random: randomSequence([0.999999, 0]),
  });
  case07First.state.knownFacts.add("appearance");
  case07First.askQuestion("q07_visual");
  assert.equal(case07First.state.knownFacts.has("language"), true);

  const case07Second = new GameSession(casesById.case07, {
    random: randomSequence([0.999999, 0.999999]),
  });
  case07Second.state.knownFacts.add("appearance");
  case07Second.askQuestion("q07_visual");
  assert.equal(case07Second.state.knownFacts.has("visual_need"), true);
  assert.equal(case07Second.state.knownFacts.has("language"), false);

  const case08First = new GameSession(casesById.case08, {
    random: randomSequence([0, 0]),
  });
  case08First.state.knownFacts.add("target_expression");
  case08First.askQuestion("q08_exact");
  assert.equal(case08First.state.knownFacts.has("visual_need"), true);

  const case08Second = new GameSession(casesById.case08, {
    random: randomSequence([0, 0.999999]),
  });
  case08Second.state.knownFacts.add("target_expression");
  case08Second.askQuestion("q08_exact");
  assert.equal(case08Second.state.knownFacts.has("visual_need"), false);

  const case10First = new GameSession(casesById.case10, {
    random: randomSequence([0, 0]),
  });
  case10First.state.knownFacts.add("target_custom");
  case10First.askQuestion("q10_exact");
  assert.equal(case10First.state.knownFacts.has("visual_need"), true);

  const case10Second = new GameSession(casesById.case10, {
    random: randomSequence([0, 0.999999]),
  });
  case10Second.state.knownFacts.add("target_custom");
  case10Second.askQuestion("q10_exact");
  assert.equal(case10Second.state.knownFacts.has("visual_need"), false);
});

test("会話で述べた情報と判明事項が、監査対象ケースで一致する", () => {
  const casesById = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));

  getCaseCombinations(casesById.case01).forEach((_, index, combinations) => {
    const session = new GameSession(casesById.case01, {
      random: () => (index + 0.1) / combinations.length,
    });
    const source = session.caseData.questions.find(({ id }) => id === "q_source");
    source.responseOptions.forEach(({ text, reveals }) => {
      assert.match(text, /新聞名|紙名/);
      assert.ok(reveals.includes("newspaper_unknown"));
    });
  });

  getCaseCombinations(casesById.case02).forEach((combination, index, combinations) => {
    const session = new GameSession(casesById.case02, {
      random: () => (index + 0.1) / combinations.length,
    });
    const page = session.caseData.questions.find(({ id }) => id === "q02_page");
    page.responseOptions.forEach(({ reveals }) => {
      assert.equal(reveals.includes("need_swatches"), false);
    });

    const need = session.caseData.questions.find(({ id }) => id === "q02_need");
    need.responseOptions.forEach(({ text, reveals }) => {
      assert.ok(reveals.includes("need_swatches"));
      assert.equal(reveals.includes("course_assignment"), false);
      assert.equal(reveals.includes("traditional_colors"), false);
      assert.match(
        text,
        combination.information.optionId === "info_names"
          ? /不要|見本ではなく/
          : combination.information.optionId === "info_contrast"
            ? /見分け|区別しやすい|組み合わせ|使用例/
            : /両方|見比べ/,
      );
      assert.doesNotMatch(text, /課題|イラスト|伝統色|流行色/);
    });

    const use = session.caseData.questions.find(({ id }) => id === "q02_use");
    use.responseOptions.forEach(({ text, reveals }) => {
      assert.deepEqual(reveals, ["course_assignment"]);
      assert.doesNotMatch(text, /伝統色|流行色|色名|色見本/);
    });
  });

  getCaseCombinations(casesById.case06).forEach((_, index, combinations) => {
    const randomValue = (index + 0.1) / combinations.length;
    const session = new GameSession(casesById.case06, {
      random: randomSequence([randomValue, 0, 0]),
    });
    const targetSlot = () => session
      .getDeductionSlotStates()
      .find(({ slot }) => slot.id === "target");

    const nameResult = session.askQuestion("q06_name");
    assert.match(nameResult.response, /(?:名前はわかんない|なんていう石か(?:は)?知らない)/);
    assert.equal(session.state.knownFacts.has("appearance"), false);
    assert.equal(session.state.knownFacts.has("found_place"), true);
    assert.equal(targetSlot().fullyUnlocked, false);
    assert.equal(targetSlot().partiallyUnlocked, false);
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === "q06_look").status,
      "new",
    );

    session.askQuestion("q06_look");
    assert.equal(session.state.knownFacts.has("appearance"), true);
    assert.equal(targetSlot().fullyUnlocked, true);
  });

  getCaseCombinations(casesById.case08).forEach((combination, index, combinations) => {
    const session = new GameSession(casesById.case08, {
      random: () => (index + 0.1) / combinations.length,
    });
    const scope = session.caseData.questions.find(({ id }) => id === "q08_scope");
    const formatQuestions = ["q08_level", "q08_visual"].map((questionId) =>
      session.caseData.questions.find(({ id }) => id === questionId),
    );
    const targetPatterns = {
      target_body: /カラダ/,
      target_weather: /テンキ/,
      target_onomatopoeia: /ギオンゴ|ギタイゴ/,
    };
    const formatPatterns = {
      format_dictionary: /ショキュウ.*ジテン|ショキュウシャムケ.*ジテン/,
      format_illustrated: /エ.*カイワ レイ/,
      format_audio: /オンセイ|オト.*バメン/,
    };
    const targetPattern = targetPatterns[combination.target.optionId];
    const formatPattern = formatPatterns[combination.format.optionId];

    scope.responseOptions.forEach(({ text, reveals }) => {
      assert.match(text, targetPattern);
      assert.ok(reveals.includes("target_expression"));
    });
    formatQuestions.forEach((question) => {
      question.responseOptions.forEach(({ text, reveals }) => {
        assert.match(text, formatPattern);
        assert.ok(reveals.includes("visual_need"));
      });
    });
    assert.deepEqual(
      session.caseData.deduction.slots.find(({ id }) => id === "format").requiresAll,
      ["visual_need"],
    );
  });

  getCaseCombinations(casesById.case10).forEach((_, index, combinations) => {
    const randomValue = (index + 0.1) / combinations.length;
    const session = new GameSession(casesById.case10, {
      random: () => randomValue,
    });
    const plausible = session.caseData.questions.find(({ id }) => id === "q10_plausible");
    assert.doesNotMatch(plausible.text, /花見|月見|弁当/);
    plausible.responseOptions.forEach(({ text }) => {
      assert.doesNotMatch(text, /花見|月見|弁当/);
    });

    ["q10_visual", "q10_exact"].forEach((questionId) => {
      const question = session.caseData.questions.find(({ id }) => id === questionId);
      const response = question.responseOptions[0];
      assert.match(response.text, /ヤサシイ ニホンゴ|やさしい日本語/);
      assert.ok(response.reveals.includes("language_level"));
    });

    const visual = session.caseData.questions.find(({ id }) => id === "q10_visual");
    const formatSlot = session.caseData.deduction.slots.find(({ id }) => id === "format");
    const correctFormat = formatSlot.options.find(({ score }) => score === 1);
    const partialFormat = formatSlot.options.find(({ score }) => score === 0.5);
    assert.equal(partialFormat.text, "やさしい日本語の年中行事入門資料");
    if (correctFormat.id === "format_photo") {
      assert.equal(correctFormat.text, "現地写真が多く、やさしい日本語の入門資料");
      visual.responseOptions.forEach(({ text }) => {
        assert.match(text, /写真.*やさしい日本語|やさしい日本語.*写真/);
        assert.doesNotMatch(text, /子ども向け/);
      });
    } else if (correctFormat.id === "format_children") {
      assert.equal(correctFormat.id, "format_children");
      assert.equal(correctFormat.text, "やさしい日本語で、行事の流れを絵で追える子ども向け年中行事資料");
      visual.responseOptions.forEach(({ text }) => {
        assert.match(text, /子ども向け.*絵|絵.*子ども向け/);
        assert.doesNotMatch(text, /現地写真/);
      });
    } else {
      assert.equal(correctFormat.id, "format_multilingual");
      assert.match(correctFormat.text, /多言語.*写真・図解/);
      visual.responseOptions.forEach(({ text }) => {
        assert.match(text, /多言語.*写真|写真.*多言語|複数言語.*図/);
        assert.doesNotMatch(text, /現地写真|子ども向け/);
      });
    }
  });
});

test("CASE 01は対象を聞いてから、用途または紙面内容で確認したいことを特定する", () => {
  const case01 = CASES.find(({ id }) => id === "case01");
  const combinations = getCaseCombinations(case01);

  combinations.forEach((combination, index) => {
    const session = new GameSession(case01, {
      random: () => (index + 0.1) / combinations.length,
    });
    const use = session.caseData.questions.find(({ id }) => id === "q_use");
    const specific = session.caseData.questions.find(({ id }) => id === "q_specific");
    const articleDetail = session.caseData.questions.find(
      ({ id }) => id === "q_article_detail",
    );
    const needSlot = session.caseData.deduction.slots.find(({ id }) => id === "need");
    const expectedNeed = {
      need_article: /記事/,
      need_newspaper: /(?:街の様子|地域面|街の雰囲気|地域の記事や広告|商店街の記事)/,
      need_advertisement: /開店.*広告/,
    }[combination.need.optionId];

    use.responseOptions.forEach(({ text }) => {
      assert.match(text, /家族/);
      assert.match(text, expectedNeed);
    });
    specific.responseOptions.forEach(({ text, reveals }) => {
      assert.match(text, /祖父/);
      assert.match(text, /新聞/);
      assert.doesNotMatch(text, /紹介記事|開店広告|街の様子|地域面/);
      assert.deepEqual(reveals, ["grandfather_shop"]);
    });
    use.responseOptions.forEach(({ reveals }) => {
      assert.deepEqual(reveals, ["family_history", "specific_article"]);
    });
    articleDetail.responseOptions.forEach(({ text, reveals }) => {
      assert.match(text, expectedNeed);
      assert.deepEqual(reveals, ["article_content", "specific_article"]);
    });
    assert.deepEqual(articleDetail.requiresAll, ["grandfather_shop"]);
    assert.equal(needSlot.label, "確認したいこと");
    assert.doesNotMatch(session.caseData.correctSentence, /があった当時の新聞/);
    assert.match(session.caseData.correctSentence, /について、.+たい。$/);

    const useRoute = new GameSession(case01, {
      random: () => (index + 0.1) / combinations.length,
    });
    useRoute.askQuestion("q_use");
    assert.equal(useRoute.state.knownFacts.has("specific_article"), true);

    const detailRoute = new GameSession(case01, {
      random: () => (index + 0.1) / combinations.length,
    });
    detailRoute.askQuestion("q_specific");
    assert.equal(detailRoute.state.knownFacts.has("specific_article"), false);
    assert.equal(
      detailRoute
        .getQuestionStates()
        .find(({ question }) => question.id === "q_article_detail").status,
      "new",
    );
    detailRoute.askQuestion("q_article_detail");
    assert.equal(detailRoute.state.knownFacts.has("specific_article"), true);
  });
});

test("CASE 01は36通りの正解と各文節3候補の主要軸を持つ", () => {
  const case01 = CASES.find(({ id }) => id === "case01");
  const dimensions = case01.composition.dimensions;

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(dimensions).map(([slotId, choices]) => [
        slotId,
        choices.length,
      ]),
    ),
    { period: 2, location: 2, target: 3, need: 3 },
  );
  assert.equal(getCaseCombinations(case01).length, 36);
  assert.equal(case01.deduction.slots.find(({ id }) => id === "target").options.length, 4);
  assert.equal(case01.deduction.slots.find(({ id }) => id === "need").options.length, 4);
});

test("各ケースに手がかりを増やさない2種類の寄り道質問が1問ずつある", () => {
  CASES.forEach((caseData) => {
    const distractors = caseData.questions.filter(
      ({ distractor }) => distractor,
    );
    assert.deepEqual(
      distractors.map(({ distractor }) => distractor).sort(),
      ["irrelevant", "plausible"],
      `${caseData.id}: one plausible and one irrelevant question`,
    );

    distractors.forEach((question) => {
      assert.deepEqual(question.requiresAll, [], `${question.id}: initially available`);
      assert.deepEqual(question.requiresAny, [], `${question.id}: initially available`);
      assert.deepEqual(
        question.reveals,
        question.distractorTone === "cheerful" ? ["smalltalk_followup"] : [],
        `${question.id}: reveals no answer facts`,
      );
      assert.ok(question.response.length > 0, `${question.id}: response`);
      assert.ok(question.responseVariants.length > 0, `${question.id}: variants`);
    });
  });
});

test("CASE 06の寄り道質問は、石の資料相談として意味が通る", () => {
  const case06 = CASES.find(({ id }) => id === "case06");
  const question = case06.questions.find(({ id }) => id === "q06_plausible");

  assert.match(question.text, /本の表紙.*石の写真/);
  assert.doesNotMatch(
    [question.text, question.response, ...question.responseVariants].join("\n"),
    /パン/,
  );
  assert.deepEqual(question.reveals, []);
});

test("CASE 06の石についての返答は小学2年生らしい具体的な言葉を使う", () => {
  const case06 = CASES.find((caseData) => caseData.id === "case06");

  getCaseCombinations(case06).forEach((_, index, combinations) => {
    const session = new GameSession(case06, {
      random: () => (index + 0.1) / combinations.length,
    });
    const wantQuestion = session.caseData.questions.find(
      (question) => question.id === "q06_want",
    );
    const replies = [wantQuestion.response, ...wantQuestion.responseVariants].join("\n");

    assert.doesNotMatch(replies, /何者|生まれ方/);
    assert.match(replies, /名前|どうやってできた|とくちょう|かせき|見わけ/);
  });
});

test("CASE 06の資料条件は知りたいことの確認後に一度だけ尋ねる", () => {
  const case06 = CASES.find((caseData) => caseData.id === "case06");
  const purposeSession = new GameSession(case06, { random: () => 0 });

  purposeSession.askQuestion("q06_use");
  assert.equal(
    purposeSession.getQuestionStates().find(({ question }) => question.id === "q06_read").status,
    "locked",
  );

  const needSession = new GameSession(case06, { random: () => 0 });
  needSession.askQuestion("q06_name");
  needSession.askQuestion("q06_look");
  needSession.askQuestion("q06_want");
  const readQuestion = needSession
    .getQuestionStates()
    .find(({ question }) => question.id === "q06_read");

  assert.equal(readQuestion.status, "new");
  assert.match(readQuestion.question.text, /どんな本なら.*じぶんで読みやすそう/);
  assert.equal(
    needSession.caseData.questions.some((question) => question.id === "q06_help"),
    false,
  );
});

test("CASE 06の使い道は、これから話したり見せたりする相手から尋ねる", () => {
  const case06 = CASES.find((caseData) => caseData.id === "case06");
  const useQuestion = case06.questions.find(({ id }) => id === "q06_use");

  assert.match(useQuestion.text, /これから誰かに話したり、見せたりする/);
  assert.doesNotMatch(useQuestion.text, /もう誰かに話した/);
});

test("CASE 09の用途は鳥を見た後の行動から分かる", () => {
  const case09 = CASES.find((caseData) => caseData.id === "case09");

  getCaseCombinations(case09).forEach((_, index, combinations) => {
    const session = new GameSession(case09, {
      random: () => (index + 0.1) / combinations.length,
    });
    const useQuestion = session.caseData.questions.find(
      (question) => question.id === "q09_use",
    );

    assert.match(useQuestion.text, /その鳥を見たあと、いつも何をしているの/);
    assert.doesNotMatch(useQuestion.text, /何に使う|何をしたい/);
    useQuestion.responseOptions.forEach(({ reveals }) => {
      assert.ok(reveals.includes("purpose"));
    });
  });
});

test("ランダムな相談内容でも、未登場の固有名詞や前提を会話に持ち込まない", () => {
  const casesById = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));
  const resolvedCases = {};

  ["case02", "case03", "case06", "case07", "case08", "case09", "case10"].forEach(
    (caseId) => {
      const sourceCase = casesById[caseId];
      const combinations = getCaseCombinations(sourceCase);
      resolvedCases[caseId] = combinations.map((_, index) =>
        new GameSession(sourceCase, {
          random: () => (index + 0.1) / combinations.length,
        }).caseData,
      );
    },
  );

  resolvedCases.case02.forEach((caseData) => {
    const author = caseData.questions.find(({ id }) => id === "q02_author");
    assert.match(author.text, /書名.*著者名/);
    author.responseOptions.forEach(({ text }) => {
      assert.doesNotMatch(text, /『日本の色』/);
    });
    const sourceSlot = caseData.deduction.slots.find(({ id }) => id === "source");
    sourceSlot.options.forEach(({ text }) => assert.doesNotMatch(text, /『日本の色』/));
  });

  resolvedCases.case03.forEach((caseData) => {
    const irrelevant = caseData.questions.find(({ id }) => id === "q03_irrelevant");
    irrelevant.responseOptions.forEach(({ text }) => {
      assert.doesNotMatch(text, /発表|レポート|就職|企業研究/);
    });
  });

  resolvedCases.case07.forEach((caseData) => {
    const plausible = caseData.questions.find(({ id }) => id === "q07_plausible");
    const exact = caseData.questions.find(({ id }) => id === "q07_exact");
    assert.match(plausible.text, /If we find a book/);
    exact.responseOptions.forEach(({ text }) => {
      assert.doesNotMatch(text, /uchiwa|furoshiki/i);
    });
  });

  resolvedCases.case08.forEach((caseData) => {
    const plausible = caseData.questions.find(({ id }) => id === "q08_plausible");
    const exact = caseData.questions.find(({ id }) => id === "q08_exact");
    assert.match(plausible.text, /^モシ ホン/);
    assert.match(exact.responseOptions[0].text, /(?:ジテン|シリョウ) ナラ/);
  });

  resolvedCases.case09.forEach((caseData) => {
    const safe = caseData.questions.find(({ id }) => id === "q09_safe");
    const plausible = caseData.questions.find(({ id }) => id === "q09_plausible");
    assert.deepEqual(safe.requiresAll, ["purpose", "seen_place"]);
    assert.match(plausible.text, /空/);
    [plausible.text, ...plausible.responseOptions.map(({ text }) => text)].forEach(
      (text) => assert.doesNotMatch(text, /窓|窓枠/),
    );
  });

  resolvedCases.case10.forEach((caseData) => {
    const exact = caseData.questions.find(({ id }) => id === "q10_exact");
    assert.match(exact.responseOptions[0].text, /やさしい日本語/);
    assert.doesNotMatch(exact.responseOptions[0].text, /ヤサシイ ニホンゴ/);
  });
});

test("CASE 03のツール比較は、利用者自身の導入選択ではなく調査対象として表す", () => {
  const case03 = CASES.find(({ id }) => id === "case03");
  const combinations = getCaseCombinations(case03);

  combinations.forEach((combination, index) => {
    if (combination.focus.optionId !== "focus_tools") return;

    const session = new GameSession(case03, {
      random: () => (index + 0.1) / combinations.length,
    });
    const focusOption = session.caseData.deduction.slots
      .find(({ id }) => id === "focus")
      .options.find(({ id }) => id === "focus_tools");
    const focusQuestions = ["q03_technology", "q03_viewpoint"].map((questionId) =>
      session.caseData.questions.find(({ id }) => id === questionId),
    );

    assert.equal(focusOption.text, "ツールや活用方法を比較したい");
    assert.match(session.caseData.correctSentence, /ツールや活用方法を比較したい/);
    assert.doesNotMatch(session.caseData.correctSentence, /ツールを選びたい/);
    focusQuestions.forEach((question) => {
      question.responseOptions.forEach(({ text }) => {
        assert.match(text, /比べ|比較|活用|機能/);
        assert.doesNotMatch(text, /選びたい/);
      });
    });
  });
});

test("CASE 03は自然な質問から複数文節の手がかりが交差して得られる", () => {
  const case03 = CASES.find(({ id }) => id === "case03");
  const combinations = getCaseCombinations(case03);
  const factGroups = {
    purpose: new Set(["class_presentation"]),
    audience: new Set(["university_students"]),
    theme: new Set(["generative_ai", "text_generation", "report_use"]),
    focus: new Set(["wants_social_issue", "problems_debate"]),
    recency: new Set(["recent_sources"]),
  };
  const crossingQuestionIds = [
    "q03_field",
    "q03_use",
    "q03_technology",
    "q03_recent",
    "q03_presentation",
  ];

  combinations.forEach((_, index) => {
    const session = new GameSession(case03, {
      random: () => (index + 0.1) / combinations.length,
    });
    const questionMap = new Map(
      session.caseData.questions.map((question) => [question.id, question]),
    );

    crossingQuestionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      question.responseOptions.forEach(({ reveals }) => {
        const revealedGroups = Object.values(factGroups).filter((facts) =>
          reveals.some((factId) => facts.has(factId)),
        );
        assert.ok(
          revealedGroups.length >= 2,
          `${session.caseData.activeVariantId}/${questionId}`,
        );
      });
    });

    const independentSources = {
      purpose: ["q03_use", "q03_recent"],
      audience: ["q03_field", "q03_presentation"],
      theme: ["q03_technology", "q03_report"],
      focus: ["q03_use", "q03_technology", "q03_presentation", "q03_viewpoint"],
    };
    const answerFact = {
      purpose: "class_presentation",
      audience: "university_students",
      theme: "report_use",
      focus: "problems_debate",
    };

    Object.entries(independentSources).forEach(([slotId, questionIds]) => {
      questionIds.forEach((questionId) => {
        const reveals = questionMap
          .get(questionId)
          .responseOptions.flatMap((response) => response.reveals);
        assert.ok(
          reveals.includes(answerFact[slotId]),
          `${session.caseData.activeVariantId}/${slotId}/${questionId}`,
        );
      });
    });

    assert.match(questionMap.get("q03_field").text, /きっかけ|場面/);
    assert.match(questionMap.get("q03_use").text, /最後|形/);
    assert.match(questionMap.get("q03_presentation").text, /問い/);
  });
});

test("CASE 03のテーマ3種は具体的な作業の返答で明確に判別できる", () => {
  const case03 = CASES.find(({ id }) => id === "case03");
  const combinations = getCaseCombinations(case03);
  const expectations = {
    theme_writing: {
      option: "生成AIで文章の下書きを作る",
      includes: /下書き|たたき台/,
      excludes: /情報を集め|考えの候補|手がかり|アイデア/,
    },
    theme_research: {
      option: "生成AIで情報収集・アイデア出しをする",
      includes: /情報を集め|考えの候補|手がかり|アイデア/,
      excludes: /下書き|たたき台/,
    },
    theme_feedback: {
      option: "生成AIで課題へのフィードバックを作る",
      includes: /フィードバック|コメント案|提出物/,
      excludes: /情報を集め|アイデア|レポートや文書の下書き/,
    },
  };

  combinations.forEach((_, index) => {
    const session = new GameSession(case03, {
      random: () => (index + 0.1) / combinations.length,
    });
    const themeId = session.caseData.activeCombination.theme;
    const expected = expectations[themeId];
    const themeSlot = session.caseData.deduction.slots.find(
      ({ id }) => id === "theme",
    );
    const correct = themeSlot.options.find(({ score }) => score === 1);
    const partial = themeSlot.options.find(({ score }) => score === 0.5);
    const otherSpecific = themeSlot.options.filter(
      ({ id }) => id in expectations && id !== themeId,
    );

    assert.equal(correct.text, expected.option);
    assert.equal(partial.id, "theme_general");
    otherSpecific.forEach(({ score }) => assert.equal(score, 0));

    ["q03_technology", "q03_report"].forEach((questionId) => {
      const question = session.caseData.questions.find(
        ({ id }) => id === questionId,
      );
      question.responseOptions.forEach(({ text }) => {
        assert.match(text, expected.includes, `${themeId}/${questionId}`);
        assert.doesNotMatch(text, expected.excludes, `${themeId}/${questionId}`);
      });
    });
  });
});

test("好意的な雑談返答だけが、採点と無関係な深掘り質問を1問解放する", () => {
  const cheerfulCases = [];
  const reservedCases = [];
  const answerFactFields = [
    "requiresAll",
    "requiresAny",
    "partialRequiresAll",
    "partialRequiresAny",
  ];

  CASES.forEach((caseData) => {
    const cheerful = caseData.questions.find(
      ({ distractor, distractorTone }) =>
        distractor === "irrelevant" && distractorTone === "cheerful",
    );
    const followUps = caseData.questions.filter(({ smallTalkFollowUp }) =>
      smallTalkFollowUp,
    );

    if (!cheerful) {
      reservedCases.push(caseData.id);
      assert.deepEqual(followUps, [], `${caseData.id}: no cheerful follow-up`);
      return;
    }

    cheerfulCases.push(caseData.id);
    assert.deepEqual(cheerful.reveals, ["smalltalk_followup"]);
    assert.equal(followUps.length, 1, `${caseData.id}: one cheerful follow-up`);

    const followUp = followUps[0];
    assert.deepEqual(followUp.requiresAll, ["smalltalk_followup"]);
    assert.deepEqual(followUp.requiresAny, []);
    assert.deepEqual(followUp.reveals, []);
    assert.match(followUp.text, /!|！/, `${caseData.id}: librarian enjoys small talk`);
    assert.equal(caseData.facts.smalltalk_followup.label, "");
    assert.equal(caseData.facts.smalltalk_followup.display, "");

    caseData.questions
      .filter(({ id }) => id !== followUp.id)
      .forEach((question) => {
        assert.equal(
          [...question.requiresAll, ...question.requiresAny].includes(
            "smalltalk_followup",
          ),
          false,
          `${caseData.id}/${question.id}: independent from small talk`,
        );
      });
    caseData.deduction.slots.forEach((slot) => {
      answerFactFields.forEach((field) => {
        assert.equal(
          (slot[field] ?? []).includes("smalltalk_followup"),
          false,
          `${caseData.id}/${slot.id}: score ignores small talk`,
        );
      });
    });

    const session = new GameSession(caseData, { random: () => 0 });
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === followUp.id)
        .status,
      "locked",
    );
    const result = session.askQuestion(cheerful.id);
    assert.ok(result.newlyUnlocked.includes(followUp.id));
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === followUp.id)
        .status,
      "new",
    );
    assert.equal(
      session.getKnownFacts().some(({ id }) => id === "smalltalk_followup"),
      false,
    );
    const knownBeforeFollowUp = new Set(session.state.knownFacts);
    const followUpResult = session.askQuestion(followUp.id);
    assert.deepEqual(followUpResult.reveals, []);
    assert.deepEqual(session.state.knownFacts, knownBeforeFollowUp);
  });

  assert.deepEqual(cheerfulCases, [
    "case01",
    "case02",
    "case03",
    "case04",
    "case05",
    "case06",
    "case07",
    "case08",
    "case09",
    "case10",
    "extra01",
  ]);
  assert.deepEqual(reservedCases, []);
});

test("雑談の深掘りは、各ケースの相談内容や正答を話題にしない", () => {
  const forbiddenTopics = {
    case01: /新聞|祖父|洋菓子店|記事|中野|昭和/,
    case02: /本|色|課題|資料|書名/,
    case03: /AI|生成|発表|レポート|企業|大学|資料|テーマ/,
    case04: /地図|昭和|建物|映画館|図書館|祖母/,
    case05: /統計|数字|大学|人数|レポート|グラフ|全国/,
    case06: /石|本|自由研究|発表|資料/,
    case07: /object|fan|furoshiki|research|presentation|source|history|traditional/i,
    case08: /コトバ|ニホンゴ|カンヨウク|ラクゴ|シリョウ|ジテン|カイワ|プログラム/,
    case09: /鳥|観察|庭|図鑑|季節|鳴き声|窓/,
    case10: /花見|月見|行事|文化|資料|写真|日本語|レポート/,
  };

  Object.entries(forbiddenTopics).forEach(([caseId, forbidden]) => {
    const caseData = CASES.find(({ id }) => id === caseId);
    getCaseCombinations(caseData).forEach((_, index, combinations) => {
      const session = new GameSession(caseData, {
        random: () => (index + 0.1) / combinations.length,
      });
      const followUp = session.caseData.questions.find(
        ({ smallTalkFollowUp }) => smallTalkFollowUp,
      );
      [followUp.text, ...followUp.responseOptions.map(({ text }) => text)].forEach(
        (text) => assert.doesNotMatch(text, forbidden, `${caseId}: ${text}`),
      );
    });
  });
});

test("CASE 10の雑談で、CASE 06の子どもが拾った石の由来が分かる", () => {
  const case06 = CASES.find(({ id }) => id === "case06");
  const case10 = CASES.find(({ id }) => id === "case10");
  const case06Targets = getCaseCombinations(case06).map(
    ({ target }) => target.optionId,
  );

  assert.ok(case06Targets.includes("target_holey"));
  assert.ok(case06Targets.includes("target_rainbow"));

  getCaseCombinations(case10).forEach((_, index, combinations) => {
    const session = new GameSession(case10, {
      random: () => (index + 0.1) / combinations.length,
    });
    const followUp = session.caseData.questions.find(
      ({ id }) => id === "q10_smalltalk_followup",
    );

    followUp.responseOptions.forEach(({ text }) => {
      assert.match(text, /観測石/);
      assert.match(text, /学校.*河原/);
      assert.match(text, /子ども/);
    });
    assert.deepEqual(followUp.reveals, []);
  });
});

test("CASE 04・07・08の雑談から、先行ケースの利用者とのつながりが分かる", () => {
  const connections = [
    {
      sourceId: "case01",
      targetId: "case04",
      followUpId: "q04_smalltalk_followup",
      sourcePatterns: [/店/, /新聞/],
      responsePatterns: [/古い新聞/, /地域のお店/, /記事|広告|街の様子/],
      forbiddenResponsePattern: /相談|利用者|探していた人|探す方|方の話/,
    },
    {
      sourceId: "case02",
      targetId: "case07",
      followUpId: "q07_smalltalk_followup",
      sourcePatterns: [/色/],
      responsePatterns: [/student/i, /(?:color names|names for colors)/i, /book/i],
    },
    {
      sourceId: "case03",
      targetId: "case08",
      followUpId: "q08_smalltalk_followup",
      sourcePatterns: [/生成AI/],
      responsePatterns: [/AI/, /ダイガクセイ/, /シラベル/],
    },
  ];

  connections.forEach(
    ({
      sourceId,
      targetId,
      followUpId,
      sourcePatterns,
      responsePatterns,
      forbiddenResponsePattern,
    }) => {
      const sourceCase = CASES.find(({ id }) => id === sourceId);
      const targetCase = CASES.find(({ id }) => id === targetId);

      getCaseCombinations(sourceCase).forEach((_, index, combinations) => {
        const sourceSession = new GameSession(sourceCase, {
          random: () => (index + 0.1) / combinations.length,
        });
        const sourceContext = [
          sourceCase.category,
          sourceCase.opening,
          sourceSession.caseData.correctSentence,
        ].join(" ");
        sourcePatterns.forEach((pattern) =>
          assert.match(sourceContext, pattern),
        );
      });

      getCaseCombinations(targetCase).forEach((_, index, combinations) => {
        const targetSession = new GameSession(targetCase, {
          random: () => (index + 0.1) / combinations.length,
        });
        const followUp = targetSession.caseData.questions.find(
          ({ id }) => id === followUpId,
        );

        followUp.responseOptions.forEach(({ text }) => {
          responsePatterns.forEach((pattern) => assert.match(text, pattern));
          if (forbiddenResponsePattern) {
            assert.doesNotMatch(text, forbiddenResponsePattern);
          }
        });
        assert.deepEqual(followUp.reveals, []);
      });
    },
  );
});

test("楽しい雑談の後はケース終了まで笑顔だけが続き、返答と採点には影響しない", () => {
  CASES.forEach((caseData) => {
    const session = new GameSession(caseData, { random: () => 0 });
    const plainSession = new GameSession(caseData, { random: () => 0 });
    const cheerful = session.caseData.questions.find(
      ({ distractor, distractorTone }) =>
        distractor === "irrelevant" && distractorTone === "cheerful",
    );
    const followUp = session.caseData.questions.find(
      ({ smallTalkFollowUp }) => smallTalkFollowUp,
    );

    assert.equal(session.state.conversationMood, "default");
    session.askQuestion(cheerful.id);
    assert.equal(session.state.conversationMood, "warm");
    assert.equal(session.state.patronExpression, "high");
    let markup = interviewScreen(session, {});
    assert.match(markup, new RegExp(session.caseData.patron.reactions.high.image));
    assert.match(markup, /笑顔のイラスト/);

    session.askQuestion(followUp.id);
    assert.equal(session.state.conversationMood, "warm");
    assert.equal(session.state.patronExpression, "high");
    markup = interviewScreen(session, {});
    assert.match(markup, new RegExp(session.caseData.patron.reactions.high.image));

    const regularQuestion = session
      .getQuestionStates()
      .find(
        ({ question, status }) =>
          status === "available" &&
          !question.distractor &&
          !question.smallTalkFollowUp,
      ).question;
    const warmResult = session.askQuestion(regularQuestion.id);
    const plainResult = plainSession.askQuestion(regularQuestion.id);
    assert.deepEqual(warmResult.reveals, plainResult.reveals);
    assert.equal(warmResult.response, plainResult.response);
    assert.equal(session.state.conversationMood, "warm");
    assert.equal(session.state.patronExpression, "high");
    assert.equal(session.state.conversation.at(-1).text, warmResult.response);
    markup = interviewScreen(session, {});
    assert.match(markup, new RegExp(session.caseData.patron.reactions.high.image));
    assert.match(markup, /笑顔のイラスト/);

    [session, plainSession].forEach((targetSession) => {
      targetSession.startDeduction();
      targetSession.caseData.deduction.slots.forEach((slot) => {
        targetSession.setSelection(
          slot.id,
          slot.options.find((option) => option.score === 1).id,
        );
      });
    });
    assert.equal(session.submitDeduction().total, plainSession.submitDeduction().total);

    const nextSession = new GameSession(caseData, { random: () => 0 });
    assert.equal(nextSession.state.conversationMood, "default");
    assert.equal(nextSession.state.patronExpression, "default");
    const nextMarkup = interviewScreen(nextSession, {});
    assert.match(nextMarkup, new RegExp(nextSession.caseData.patron.image));
    assert.doesNotMatch(nextMarkup, /笑顔のイラスト/);
  });
});

test("雑談を6問目より前に深掘りすると質問回数が2回復し、合計8問まで続けられる", () => {
  CASES.forEach((caseData) => {
    const route = sixQuestionRoutes[caseData.id];
    const cheerful = caseData.questions.find(
      ({ distractor, distractorTone }) =>
        distractor === "irrelevant" && distractorTone === "cheerful",
    );
    const followUp = caseData.questions.find(({ smallTalkFollowUp }) =>
      smallTalkFollowUp,
    );

    const recoveredSession = new GameSession(caseData, { random: () => 0 });
    recoveredSession.askQuestion(cheerful.id);
    const recoveryResult = recoveredSession.askQuestion(followUp.id);
    assert.equal(recoveryResult.recoveredQuestions, 2);
    assert.equal(recoveredSession.state.questionBonus, 2);
    assert.equal(recoveredSession.getQuestionLimit(), 8);
    assert.equal(recoveredSession.state.questionsUsed, 2);

    const persistentMarkup = interviewScreen(recoveredSession, {});
    assert.match(persistentMarkup, /CHAT \+2/);
    assert.doesNotMatch(persistentMarkup, /質問できる回数が2回分回復しました/);

    const recoveryMarkup = interviewScreen(recoveredSession, {
      recoveredQuestions: recoveryResult.recoveredQuestions,
      typingFrom: 0,
    });
    assert.match(recoveryMarkup, /data-recovery-notice hidden/);
    assert.match(recoveryMarkup, /質問できる回数が2回分回復しました/);
    assert.match(recoveryMarkup, /質問回数 2 \/ 8/);

    route.forEach((questionId, index) => {
      const result = recoveredSession.askQuestion(questionId);
      assert.equal(result.reachedLimit, index === route.length - 1);
    });
    assert.equal(recoveredSession.state.questionsUsed, 8);
    assert.equal(recoveredSession.state.phase, "deduction");
    assert.equal(
      recoveredSession.state.conversation.at(-1).text,
      recoveredSession.caseData.patron.timeLimitLine,
    );

    recoveredSession.caseData.deduction.slots.forEach((slot) => {
      recoveredSession.setSelection(
        slot.id,
        slot.options.find((option) => option.score === 1).id,
      );
    });
    assert.equal(recoveredSession.submitDeduction().total, 100);

    const edgeSession = new GameSession(caseData, { random: () => 0 });
    route.slice(0, 5).forEach((questionId) => edgeSession.askQuestion(questionId));
    const fifthResult = edgeSession.askQuestion(cheerful.id);
    assert.equal(fifthResult.reachedLimit, true);
    assert.equal(edgeSession.state.questionsUsed, 6);
    assert.equal(edgeSession.getQuestionLimit(), 6);
    assert.equal(edgeSession.state.phase, "deduction");
    assert.equal(edgeSession.state.questionBonus, 0);
    assert.equal(
      edgeSession.state.conversation.at(-1).text,
      edgeSession.caseData.patron.timeLimitLine,
    );
    const edgeMarkup = interviewScreen(edgeSession, { limitNotice: true });
    assert.equal(edgeMarkup.includes(followUp.text), false);
    assert.doesNotMatch(edgeMarkup, /CHAT \+2|回復しました/);
    assert.throws(
      () => edgeSession.askQuestion(followUp.id),
      /質問フェイズではありません/,
    );
  });
});

test("全ケースがそれぞれ独立した応対相手の画像を参照する", () => {
  const images = new Set();

  CASES.forEach((caseData) => {
    const { image } = caseData.patron;
    if (caseData.id === "extra01") {
      assert.equal(
        image,
        "./assets/characters/extra-librarian-portrait.webp",
      );
      assert.equal(
        caseData.presentation.playerAvatar,
        "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
      );
    } else if (caseData.id === "case05") {
      assert.equal(
        image,
        "./assets/characters/extra-detective-reaction-medium-portrait.webp",
      );
    } else {
      assert.match(image, /^\.\/assets\/characters\/patron-(?:0[1-9]|10)\.webp$/);
    }
    images.add(image);

    const markup = interviewScreen(
      new GameSession(caseData, { random: () => 0 }),
    );
    assert.ok(markup.includes(`src="${image}"`), caseData.id);

    ["high", "medium", "low"].forEach((level) => {
      const reaction = caseData.patron.reactions[level];
      assert.ok(reaction, `${caseData.id}/${level}`);
      assert.match(
        reaction.image,
        caseData.id === "extra01"
          ? new RegExp(`extra-librarian-reaction-${level}-portrait\\.webp$`)
          : caseData.id === "case05"
            ? new RegExp(`extra-detective-reaction-${level}-portrait\\.webp$`)
            : new RegExp(`patron-${caseData.number}-reaction-${level}\\.webp$`),
      );
      assert.match(reaction.line, /ありがとう|アリガトウ|Thank you/i);
    });
    assert.doesNotMatch(caseData.patron.reactions.low.line, /怒|責め|役に立た/);
  });

  assert.equal(images.size, CASES.length);
});

test("CASE 05は統計シナリオを保ったまま、明るい大学生探偵が相談する", () => {
  const case05 = CASES.find(({ id }) => id === "case05");
  assert.equal(case05.patron.name, "探偵さん");
  assert.match(case05.patron.descriptor, /明るい大学生探偵/);
  assert.equal(case05.patron.messageSound, "message3");
  assert.equal(case05.patron.cardPortraitPosition, "center 4%");
  assert.equal(case05.patron.cardPortraitScale, "1.08");
  assert.match(case05.cardOpening, /統計/);
  assert.match(case05.opening, /司書さん、手を貸してもらえる？/);
  assert.doesNotMatch(case05.cardOpening, /レポート執筆者/);

  getCaseCombinations(case05).forEach((_, index, combinations) => {
    const session = new GameSession(case05, {
      random: () => (index + 0.1) / combinations.length,
    });
    const patronSpeech = [
      session.caseData.opening,
      session.caseData.patron.timeLimitLine,
      ...Object.values(session.caseData.patron.reactions).map(({ line }) => line),
      ...session.caseData.questions.flatMap(({ responseOptions }) =>
        responseOptions.map(({ text }) => text),
      ),
    ];
    patronSpeech.forEach((line) =>
      assert.doesNotMatch(line, /です|ます|でした|ません/, line),
    );
  });

  const smallTalk = case05.questions.find(({ id }) => id === "q05_irrelevant");
  const followUp = case05.questions.find(
    ({ id }) => id === "q05_smalltalk_followup",
  );
  assert.match(smallTalk.text, /調査のない日/);
  assert.match(
    `${smallTalk.response}\n${smallTalk.responseVariants.join("\n")}`,
    /商店街|喫茶店/,
  );
  assert.match(followUp.text, /街歩き|喫茶店/);
  assert.deepEqual(followUp.reveals, []);
});

test("ケース選択カードとインタビュー画面で同じケース名を表示する", () => {
  CASES.forEach((caseData) => {
    const session = new GameSession(caseData, { random: () => 0 });
    const screen = interviewScreen(session);
    assert.match(
      screen,
      new RegExp(`<strong>${caseData.title}</strong>`),
      `${caseData.id}: matching display title`,
    );
  });
});

test("CASE 01は組み合わせ生成、CASE 02〜10とEXは固定シナリオから正解を生成する", () => {
  CASES.forEach((caseData) => {
    const combinations = getCaseCombinations(caseData);
    const firstSession = new GameSession(caseData, { random: () => 0 });
    const lastSession = new GameSession(caseData, { random: () => 0.999999 });
    const expectedCount =
      caseData.id === "case01" ? 36 : 3;

    assert.equal(combinations.length, expectedCount, caseData.id);
    if (/^case(?:0[2-9]|10)$/.test(caseData.id)) {
      assert.equal(caseData.composition.scenarios.length, 3, caseData.id);
      assert.equal(caseData.replayVariation.recentHistorySize, 1, caseData.id);
      assert.equal(
        firstSession.caseData.activeScenarioId,
        caseData.composition.scenarios[0].id,
        caseData.id,
      );
      assert.equal(
        lastSession.caseData.activeScenarioId,
        caseData.composition.scenarios.at(-1).id,
        caseData.id,
      );
    }
    assert.notDeepEqual(
      firstSession.caseData.activeCombination,
      lastSession.caseData.activeCombination,
      caseData.id,
    );
  });
});

test("CASE 02〜10は4軸を組み替えた疑似差分ではなく、独立した3シナリオを持つ", () => {
  CASES.filter(({ id }) => /^case(?:0[2-9]|10)$/.test(id)).forEach((caseData) => {
    const scenarios = caseData.composition.scenarios;
    const slotIds = Object.keys(caseData.composition.dimensions);

    assert.equal(scenarios.length, 3, caseData.id);
    slotIds.forEach((slotId) => {
      const exactOptionIds = scenarios.map(({ selections }) => selections[slotId]);
      assert.equal(
        new Set(exactOptionIds).size,
        3,
        `${caseData.id}/${slotId}: each scenario has its own authored answer`,
      );

      const partialOptionIds = caseData.composition.dimensions[slotId].map(
        ({ partialOptionId }) => partialOptionId,
      );
      assert.equal(
        new Set(partialOptionIds).size,
        1,
        `${caseData.id}/${slotId}: scenarios share one broad partial answer`,
      );

      const slot = caseData.deduction.slots.find(({ id }) => id === slotId);
      assert.equal(slot.options.length, 4, `${caseData.id}/${slotId}: four choices`);
      exactOptionIds.forEach((optionId) => {
        assert.ok(
          slot.options.some(({ id }) => id === optionId),
          `${caseData.id}/${slotId}/${optionId}`,
        );
      });
      assert.ok(
        slot.options.some(({ id }) => id === partialOptionIds[0]),
        `${caseData.id}/${slotId}: partial option is shown`,
      );
    });

    const sentences = getCaseCombinations(caseData).map((_, index, combinations) =>
      new GameSession(caseData, {
        random: () => (index + 0.1) / combinations.length,
      }).caseData.correctSentence,
    );
    assert.equal(new Set(sentences).size, 3, `${caseData.id}: three distinct answers`);
  });
});

test("回答の4択はシナリオ位置と切り離してプレイごとに並び替える", () => {
  CASES.filter(({ id }) => /^case(?:0[2-9]|10)$/.test(id)).forEach((caseData) => {
    caseData.composition.scenarios.forEach((scenario, scenarioIndex) => {
      const correctPositions = Object.fromEntries(
        caseData.deduction.slots.map(({ id }) => [id, new Set()]),
      );

      for (let sample = 0; sample < 12; sample += 1) {
        const randomValue = (scenarioIndex + (sample + 0.5) / 12) / 3;
        const session = new GameSession(caseData, { random: () => randomValue });
        assert.equal(session.caseData.activeScenarioId, scenario.id);

        session.caseData.deduction.slots.forEach((slot) => {
          assert.deepEqual(
            new Set(slot.options.map(({ id }) => id)),
            new Set(caseData.deduction.slots.find(({ id }) => id === slot.id).options.map(({ id }) => id)),
          );
          correctPositions[slot.id].add(
            slot.options.findIndex(({ score }) => score === 1),
          );
        });
      }

      Object.entries(correctPositions).forEach(([slotId, positions]) => {
        assert.ok(
          positions.size > 1,
          `${caseData.id}/${scenario.id}/${slotId}: correct answer position varies`,
        );
      });
    });
  });
});

test("並び替え後も表示中の順番と採点は安定する", () => {
  CASES.forEach((caseData) => {
    const session = new GameSession(caseData, { random: () => 0.731 });
    const firstOrder = session.caseData.deduction.slots.map((slot) =>
      slot.options.map(({ id }) => id),
    );
    const secondOrder = session.getDeductionSlotStates().map(({ slot }) =>
      slot.options.map(({ id }) => id),
    );
    assert.deepEqual(secondOrder, firstOrder, `${caseData.id}: stable option order`);

    session.state.phase = "deduction";
    session.caseData.deduction.slots.forEach((slot) => {
      session.setSelection(
        slot.id,
        slot.options.find(({ score }) => score === 1).id,
      );
    });
    assert.equal(session.submitDeduction().total, 100, `${caseData.id}: scoring`);
  });
});

test("CASE 02〜10は保存済みの直前シナリオを次のプレイで選ばない", () => {
  CASES.filter(({ id }) => /^case(?:0[2-9]|10)$/.test(id)).forEach(
    (caseData) => {
      const storage = new MemoryStorage();
      const first = new GameSession(caseData, { random: () => 0 });
      let progress = loadProgress(storage);
      progress = recordVariant(
        progress,
        caseData.id,
        first.state.variantId,
        caseData.replayVariation.recentHistorySize,
        storage,
      );
      const reloaded = loadProgress(storage);
      const next = new GameSession(caseData, {
        random: () => 0,
        excludeVariantIds: reloaded.variantHistory[caseData.id],
      });

      assert.notEqual(next.state.variantId, first.state.variantId, caseData.id);
    },
  );
});

test("CASE 02〜10は固定シナリオ内でも返答の言い回しをランダムに選ぶ", () => {
  CASES.filter(({ id }) => /^case(?:0[2-9]|10)$/.test(id)).forEach(
    (caseData) => {
      const first = new GameSession(caseData, {
        random: randomSequence([0, 0]),
      });
      const second = new GameSession(caseData, {
        random: randomSequence([0, 0.999999]),
      });
      const question = first
        .getQuestionStates()
        .find(
          ({ question: item, status }) =>
            status === "available" &&
            !item.distractor &&
            new Set(item.responseOptions.map(({ text }) => text)).size > 1,
        ).question;

      assert.equal(first.state.variantId, second.state.variantId, caseData.id);
      const firstResponse = first.askQuestion(question.id).response;
      const secondResponse = second.askQuestion(question.id).response;
      assert.notEqual(firstResponse, secondResponse, `${caseData.id}/${question.id}`);
    },
  );
});

test("CASE 02〜10はケースごとに異なる手がかりの展開を持つ", () => {
  const byId = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));
  const question = (caseId, questionId) =>
    byId[caseId].questions.find(({ id }) => id === questionId);

  assert.ok(question("case02", "q02_page").requiresAny.includes("page_memory"));
  assert.ok(question("case03", "q03_technology").reveals.length >= 3);
  assert.deepEqual(question("case04", "q04_name").requiresAll, [
    "building_type_checked",
  ]);
  const case05Use = new GameSession(byId.case05, { random: () => 0 }).caseData.questions.find(
    ({ id }) => id === "q05_use",
  );
  case05Use.responseOptions.forEach(({ reveals }) => {
    assert.deepEqual(reveals, ["report"]);
  });
  assert.ok(question("case05", "q05_explain").reveals.includes("comparison"));
  assert.equal(question("case06", "q06_name").reveals.includes("appearance"), false);
  assert.ok(question("case06", "q06_look").requiresAny.includes("found_place"));
  assert.deepEqual(question("case06", "q06_want").requiresAll, ["appearance"]);
  assert.deepEqual(question("case07", "q07_use").reveals, ["audience_context"]);
  assert.deepEqual(question("case07", "q07_deadline").requiresAll, [
    "audience_context",
  ]);
  assert.deepEqual(question("case07", "q07_goal").requiresAny, [
    "appearance",
    "seen_place",
  ]);
  assert.deepEqual(question("case08", "q08_scope").requiresAll, [
    "error_phrase",
  ]);
  assert.deepEqual(question("case08", "q08_purpose").requiresAll, [
    "error_phrase",
  ]);
  assert.deepEqual(question("case09", "q09_want").requiresAll, ["purpose"]);
  assert.deepEqual(question("case10", "q10_target").requiresAll, [
    "observed_scene",
  ]);
  assert.deepEqual(question("case10", "q10_purpose").requiresAll, [
    "observed_scene",
  ]);
  assert.deepEqual(question("case10", "q10_want").requiresAll, [
    "target_custom",
  ]);
});

test("CASE 06〜10は目的と必要情報を異なる会話経路から特定する", () => {
  const byId = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));

  const case06 = new GameSession(byId.case06, { random: () => 0 });
  assert.equal(
    case06.getQuestionStates().find(({ question }) => question.id === "q06_want").status,
    "locked",
  );
  case06.askQuestion("q06_name");
  case06.askQuestion("q06_look");
  assert.equal(
    case06.getQuestionStates().find(({ question }) => question.id === "q06_want").status,
    "new",
  );

  const case07 = new GameSession(byId.case07, { random: () => 0 });
  const audienceResult = case07.askQuestion("q07_use");
  assert.deepEqual(audienceResult.reveals, ["audience_context"]);
  assert.equal(case07.state.knownFacts.has("purpose"), false);
  const deadlineResult = case07.askQuestion("q07_deadline");
  assert.deepEqual(new Set(deadlineResult.reveals), new Set(["deadline", "purpose"]));

  const case08Purpose = new GameSession(byId.case08, { random: () => 0 });
  assert.equal(
    case08Purpose.getQuestionStates().find(({ question }) => question.id === "q08_purpose").status,
    "locked",
  );
  case08Purpose.askQuestion("q08_error");
  case08Purpose.askQuestion("q08_purpose");
  assert.equal(case08Purpose.state.knownFacts.has("purpose"), true);

  const case08Need = new GameSession(byId.case08, { random: () => 0 });
  case08Need.askQuestion("q08_error");
  case08Need.askQuestion("q08_scope");
  const exampleResult = case08Need.askQuestion("q08_example");
  assert.ok(exampleResult.reveals.includes("desired_knowledge"));

  const case09 = new GameSession(byId.case09, { random: () => 0 });
  assert.equal(
    case09.getQuestionStates().find(({ question }) => question.id === "q09_want").status,
    "locked",
  );
  case09.askQuestion("q09_use");
  assert.equal(
    case09.getQuestionStates().find(({ question }) => question.id === "q09_want").status,
    "new",
  );

  const case10 = new GameSession(byId.case10, { random: () => 0 });
  assert.equal(
    case10.getQuestionStates().find(({ question }) => question.id === "q10_purpose").status,
    "locked",
  );
  case10.askQuestion("q10_seen");
  const newlyUnlocked = case10.getQuestionStates()
    .filter(({ status }) => status === "new")
    .map(({ question }) => question.id);
  assert.ok(newlyUnlocked.includes("q10_target"));
  assert.ok(newlyUnlocked.includes("q10_purpose"));
  assert.equal(
    case10.getQuestionStates().find(({ question }) => question.id === "q10_want").status,
    "locked",
  );
  case10.askQuestion("q10_target");
  assert.equal(
    case10.getQuestionStates().find(({ question }) => question.id === "q10_want").status,
    "new",
  );
});

test("生成可能な全組み合わせで会話・判明事項・正解文・6問採点が成立する", () => {
  CASES.forEach((caseData) => {
    const combinations = getCaseCombinations(caseData);

    combinations.forEach((combination, index) => {
      const randomValue = (index + 0.1) / combinations.length;
      const session = new GameSession(caseData, { random: () => randomValue });
      const textToValidate = [
        session.caseData.opening,
        session.caseData.correctSentence,
        session.caseData.explanation,
        ...Object.values(session.caseData.facts).map((fact) => fact.display),
        ...session.caseData.questions.flatMap((question) => [
          question.text,
          question.response,
          ...question.responseVariants,
        ]),
        ...Object.values(session.caseData.patron.reactions).map(
          (reaction) => reaction.line,
        ),
        session.caseData.patron.timeLimitLine,
      ].join("\n");

      assert.equal(/\{[a-zA-Z0-9_]+\}/.test(textToValidate), false, caseData.id);
      assert.deepEqual(
        session.caseData.activeCombination,
        Object.fromEntries(
          Object.entries(combination).map(([slotId, choice]) => [
            slotId,
            choice.optionId,
          ]),
        ),
      );

      sixQuestionRoutes[caseData.id].forEach((questionId) =>
        session.askQuestion(questionId),
      );
      session.caseData.deduction.slots.forEach((slot) => {
        assert.equal(
          slot.options.filter((option) => option.score === 1).length,
          1,
          `${caseData.id}/${session.state.variantId}/${slot.id}`,
        );
        assert.equal(
          slot.options.some((option) => option.score === 0.5),
          true,
          `${caseData.id}/${session.state.variantId}/${slot.id}: partial`,
        );
        session.setSelection(
          slot.id,
          slot.options.find((option) => option.score === 1).id,
        );
      });
      assert.equal(session.areAllDeductionSlotsUnlocked(), true);
      assert.equal(session.submitDeduction().total, 100);
    });
  });
});

test("高評価は簡潔に保ち、中評価は全組み合わせの変数を反映する", () => {
  const alternateExpectations = {
    case01: { includes: ["あおば喫茶店"], excludes: ["ひかり洋菓子店"] },
    case02: { includes: ["大学祭の案内表示づくり", "見分けやすさに配慮した配色"], excludes: ["授業の課題"] },
    case03: { includes: ["生成AI利用ガイドライン案", "課題へのフィードバック作成"], excludes: ["大学の授業発表"] },
    case04: { includes: ["みどり市場"], excludes: ["中央映画劇場"] },
    case05: { includes: ["女性研究者", "直近約10年間"], excludes: ["大学生数", "直近約20年間"] },
    case06: { includes: ["貝がら模様", "科学クラブ"], excludes: ["穴だらけの石"] },
    case07: { includes: ["tenugui", "community event"], excludes: ["uchiwa"] },
    case08: { includes: ["ギオンゴ", "ジマク"], excludes: ["カラダ ノ ブブン"] },
    case09: { includes: ["夜の庭に来る丸い目の鳥"], excludes: ["お腹が赤い小鳥"] },
    case10: { includes: ["七夕"], excludes: ["花見"] },
    extra01: { includes: [], excludes: [] },
  };
  const highSpecificWords = {
    case01: /昭和|東京|横浜|新聞|洋菓子店|喫茶店|ひかり|あおば/,
    case02: /課題|イラスト|大学祭|伝統色|流行色|色見本/,
    case03: /授業|就職|生成AI|企業|大学生|ガイドライン/,
    case04: /昭和|映画劇場|市立図書館|みどり市場|所在地/,
    case05: /レポート|予算|広報|大学生|卒業者|女性研究者|時系列|複数年/,
    case06: /石|自由研究|発表|科学クラブ/,
    case07: /fan|furoshiki|tenugui|presentation|family|community/i,
    case08: /カンヨウク|コトワザ|ギオンゴ|ラクゴ|セッキャク|ジマク/,
    case09: /鳥|観察|庭|見回り/,
    case10: /花見|月見|七夕|レポート|クイズ|会議/,
    extra01: /雨|おはなし会|クッション|フクロウ|清掃|学生スタッフ/,
  };

  CASES.forEach((caseData) => {
    const combinations = getCaseCombinations(caseData);
    const first = new GameSession(caseData, { random: () => 0 });
    const alternate = new GameSession(caseData, { random: () => 0.999999 });
    const highLines = new Set();
    const mediumLines = new Set();

    combinations.forEach((_, index) => {
      const session = new GameSession(caseData, {
        random: () => (index + 0.1) / combinations.length,
      });
      const reactions = session.caseData.patron.reactions;
      ["high", "medium", "low"].forEach((level) => {
        assert.doesNotMatch(
          reactions[level].line,
          /\{[a-zA-Z0-9_]+\}/,
          `${caseData.id}/${session.state.variantId}/${level}`,
        );
        assert.match(reactions[level].line, /ありがとう|アリガトウ|Thank you/i);
      });
      highLines.add(reactions.high.line);
      mediumLines.add(reactions.medium.line);
    });

    assert.equal(highLines.size, 1, `${caseData.id}: high reaction stays broad`);
    if (caseData.id === "extra01") {
      assert.equal(mediumLines.size, 1, `${caseData.id}: medium reaction stays broad`);
    } else {
      assert.ok(mediumLines.size > 1, `${caseData.id}: medium reactions vary`);
    }
    assert.equal(
      first.caseData.patron.reactions.high.line,
      alternate.caseData.patron.reactions.high.line,
    );
    assert.doesNotMatch(
      alternate.caseData.patron.reactions.high.line,
      highSpecificWords[caseData.id],
    );

    const alternateLine = alternate.caseData.patron.reactions.medium.line;
    alternateExpectations[caseData.id].includes.forEach((text) =>
      assert.match(alternateLine, new RegExp(text)),
    );
    alternateExpectations[caseData.id].excludes.forEach((text) =>
      assert.doesNotMatch(alternateLine, new RegExp(text)),
    );
  });
});

test("生成可能な全組み合わせで全質問を個別に解放・実行できる", () => {
  CASES.forEach((caseData) => {
    const combinations = getCaseCombinations(caseData);

    combinations.forEach((_, index) => {
      const randomValue = (index + 0.1) / combinations.length;

      caseData.questions.forEach(({ id: questionId }) => {
        const session = new GameSession(caseData, {
          random: () => randomValue,
        });
        const result = askWithPrerequisites(session, questionId);
        const question = session.caseData.questions.find(
          (item) => item.id === questionId,
        );

        assert.equal(typeof result.response, "string");
        assert.ok(result.response.length > 0);
        assert.equal(session.state.askedQuestionIds.has(questionId), true);
        result.reveals.forEach((factId) => {
          assert.equal(
            session.state.knownFacts.has(factId),
            true,
            `${caseData.id}/${session.state.variantId}/${questionId}/${factId}`,
          );
        });
      });
    });
  });
});

test("CASE 02: 利用目的・必要情報・資料条件を別々の返答で確認する", () => {
  const case02 = CASES.find((caseData) => caseData.id === "case02");

  getCaseCombinations(case02).forEach((combination, index, combinations) => {
    const randomValue = (index + 0.1) / combinations.length;
    const session = new GameSession(case02, { random: () => randomValue });
    const useResult = session.askQuestion("q02_use");
    const purpose = session.getKnownFacts().find(
      (fact) => fact.id === "course_assignment",
    );
    assert.match(
      useResult.response,
      combination.purpose.optionId === "purpose_assignment"
        ? /授業|課題/
        : combination.purpose.optionId === "purpose_hobby"
          ? /趣味|個人.*作品/
          : /大学祭|学内イベント|案内表示/,
    );
    assert.equal(typeof purpose.display, "string");
    assert.equal(session.state.knownFacts.has("traditional_colors"), false);
    assert.equal(session.state.knownFacts.has("need_swatches"), false);

    const needResult = session.askQuestion("q02_need");
    assert.equal(session.state.knownFacts.has("need_swatches"), true);
    assert.equal(needResult.reveals.includes("course_assignment"), false);
    assert.equal(needResult.reveals.includes("traditional_colors"), false);

    session.askQuestion("q02_source");
    const teacherResult = session.askQuestion("q02_teacher");
    const sourceCondition = session.getKnownFacts().find(
      (fact) => fact.id === "flexible_source",
    );
    assert.equal(session.state.knownFacts.has(sourceCondition.id), true);
    assert.doesNotMatch(teacherResult.response, /資料の条件は|と考えています/);
  });
});

test("CASE 04: 建物の種類を確認した後、別の質問で正式名称を確認する", () => {
  const case04 = CASES.find((caseData) => caseData.id === "case04");

  getCaseCombinations(case04).forEach((_, index, combinations) => {
    const randomValue = (index + 0.1) / combinations.length;
    const session = new GameSession(case04, { random: () => randomValue });
    session.askQuestion("q04_place");
    const exactName = session.caseData.facts.theater_name.display;
    assert.equal(
      session.getKnownFacts().some((fact) => fact.display.includes(exactName)),
      false,
    );

    session.askQuestion("q04_building");
    assert.equal(
      session.state.knownFacts.has("building_cinema"),
      true,
    );
    assert.equal(session.state.knownFacts.has("theater_name"), false);
    assert.equal(
      session.getKnownFacts().some((fact) => fact.display.includes(exactName)),
      false,
    );

    session.askQuestion("q04_name");
    assert.equal(session.state.knownFacts.has("theater_name"), true);
    const spokenNames = {
      target_chuo: "中央映画劇場",
      target_library: "市立.*図書館",
      target_market: "みどり市場",
    };
    const spokenName = spokenNames[session.caseData.activeCombination.target];
    assert.match(session.state.conversation.at(-1).text, new RegExp(spokenName));
  });
});

test("CASE 02・04・06は、答えられない質問や別の観点から次の手がかりへつながる", () => {
  const casesById = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));

  getCaseCombinations(casesById.case02).forEach((combination, index, combinations) => {
    const session = new GameSession(casesById.case02, {
      random: () => (index + 0.1) / combinations.length,
    });
    const authorResult = session.askQuestion("q02_author");

    assert.match(authorResult.response, /覚えてい|思い出せ/);
    assert.match(authorResult.response, /色/);
    assert.equal(session.state.knownFacts.has("course_assignment"), false);
    assert.equal(session.state.knownFacts.has("traditional_colors"), false);
    assert.equal(session.state.knownFacts.has("need_swatches"), false);
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === "q02_page").status,
      "new",
    );
  });

  getCaseCombinations(casesById.case04).forEach((combination, index, combinations) => {
    const session = new GameSession(casesById.case04, {
      random: () => (index + 0.1) / combinations.length,
    });
    session.askQuestion("q04_place");
    assert.equal(session.state.knownFacts.has("theater_name"), false);
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === "q04_reason").status,
      "new",
    );

    const reasonResult = session.askQuestion("q04_reason");
    assert.equal(session.state.knownFacts.has("theater_name"), true);
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === "q04_name").status,
      "locked",
    );
    assert.match(
      reasonResult.response,
      combination.target.optionId === "target_chuo"
        ? /中央映画劇場/
        : combination.target.optionId === "target_library"
          ? /市立.*図書館/
          : /みどり市場/,
    );
  });

  getCaseCombinations(casesById.case06).forEach((combination, index, combinations) => {
    const session = new GameSession(casesById.case06, {
      random: () => (index + 0.1) / combinations.length,
    });
    const nameResult = session.askQuestion("q06_name");

    assert.match(nameResult.response, /(?:名前はわかんない|なんていう石か(?:は)?知らない)/);
    assert.match(
      nameResult.response,
      combination.target.optionId === "target_holey"
        ? /校庭/
        : combination.target.optionId === "target_rainbow"
          ? /河原|川のそば/
          : /公園/,
    );
    assert.equal(session.state.knownFacts.has("found_place"), true);
    assert.equal(session.state.knownFacts.has("appearance"), false);
    assert.equal(
      session.getQuestionStates().find(({ question }) => question.id === "q06_look").status,
      "new",
    );
  });
});

test("CASE 02: 1問後でも回答内容が正しければ100点になる", () => {
  const case02 = CASES.find(({ id }) => id === "case02");
  const session = new GameSession(case02, { random: () => 0.999999 });
  session.askQuestion("q02_need");
  session.startDeduction();

  const informationState = session
    .getDeductionSlotStates()
    .find(({ slot }) => slot.id === "information");
  assert.deepEqual(
    informationState.availableOptions.map(({ id }) => id),
    informationState.slot.options.map(({ id }) => id),
  );

  session.caseData.deduction.slots.forEach((slot) => {
    session.setSelection(
      slot.id,
      slot.options.find((option) => option.score === 1).id,
    );
  });
  const score = session.submitDeduction();
  const informationScore = score.segments.find(
    ({ id }) => id === "information",
  );
  assert.equal(informationScore.ratio, 1);
  assert.equal(informationScore.mark, "correct");
  assert.equal(score.total, 100);
});

test("CASE 07〜10は会話表記を守り、最終回答の選択肢は日本語で表示する", () => {
  const casesById = Object.fromEntries(CASES.map((caseData) => [caseData.id, caseData]));
  const samples = [0, 0.999999];

  samples.forEach((randomValue) => {
    const english = new GameSession(casesById.case07, { random: () => randomValue }).caseData;
    [english.opening, english.patron.timeLimitLine, ...english.questions.flatMap((question) => [question.text, question.response, ...question.responseVariants])]
      .forEach((line) => assert.doesNotMatch(line, /[ぁ-んァ-ヶ一-龠]/, `CASE 07: ${line}`));

    const robot = new GameSession(casesById.case08, { random: () => randomValue }).caseData;
    [robot.opening, robot.patron.timeLimitLine, ...robot.questions.flatMap((question) => [question.text, question.response, ...question.responseVariants])]
      .forEach((line) => assert.doesNotMatch(line, /[ぁ-ん一-龠]/, `CASE 08: ${line}`));

    const cat = new GameSession(casesById.case09, { random: () => randomValue }).caseData;
    [cat.opening, cat.patron.timeLimitLine, ...cat.questions.flatMap((question) => [question.text, question.response, ...question.responseVariants])]
      .forEach((line) => {
        assert.match(line, /^ニャ/);
        assert.match(line, /（.+）$/);
      });

    const alien = new GameSession(casesById.case10, { random: () => randomValue }).caseData;
    [alien.opening, alien.patron.timeLimitLine, ...alien.questions.flatMap((question) => [question.text, question.response, ...question.responseVariants])]
      .forEach((line) => {
        assert.match(line, /^[^（]+（.+）$/);
        assert.doesNotMatch(line.slice(0, line.indexOf("（")), /[\p{L}\p{N}]/u);
      });
  });

  CASES.slice(5).forEach((caseData) => {
    caseData.deduction.slots.flatMap((slot) => slot.options).forEach((option) => {
      assert.match(option.text, /[ぁ-んァ-ヶ一-龠]/, `${caseData.id}/${option.id}`);
    });
  });
});

for (const caseData of CASES) {
  test(`${caseData.id}: 条件解放を経て6問プレイし、質問終了後の4文節採点まで完了`, () => {
    const session = new GameSession(caseData, { random: () => 0.999999 });
    const unlockedCounts = [];

    sixQuestionRoutes[caseData.id].forEach((questionId) => {
      const result = session.askQuestion(questionId);
      unlockedCounts.push(result.newlyUnlocked.length);
    });

    assert.equal(session.state.questionsUsed, 6);
    assert.equal(session.state.phase, "deduction");
    assert.equal(unlockedCounts.some((count) => count > 0), true);
    assert.equal(session.state.conversation.at(-1).text, caseData.patron.timeLimitLine);

    session.caseData.deduction.slots.forEach((slot) => {
      session.setSelection(
        slot.id,
        slot.options.find((option) => option.score === 1).id,
      );
    });
    const score = session.submitDeduction();
    assert.equal(score.accuracy, 100);
    assert.equal(score.total, 100);
    assert.equal(score.segments.every((segment) => segment.mark === "correct"), true);
  });

  test(`${caseData.id}: 1問後でも正しい回答内容なら100点になる`, () => {
    const session = new GameSession(caseData, { random: () => 0 });
    const firstAvailable = session
      .getQuestionStates()
      .find(({ status }) => status === "available").question.id;
    session.askQuestion(firstAvailable);
    assert.equal(session.startDeduction(), true);
    session.caseData.deduction.slots.forEach((slot) => {
      session.setSelection(
        slot.id,
        slot.options.find((option) => option.score === 1).id,
      );
    });
    const score = session.submitDeduction();
    assert.equal(score.accuracy, 100);
    assert.equal(score.total, 100);
    assert.equal(score.segments.every((segment) => segment.mark === "correct"), true);
  });
}

test("ケースはクリア順に解放され、保存後の再読込でも維持される", () => {
  const storage = new MemoryStorage();
  let progress = loadProgress(storage);

  assert.equal(isCaseUnlocked(CASES, "case01", progress), true);
  assert.equal(isCaseUnlocked(CASES, "case02", progress), false);
  assert.equal(isCaseUnlocked(CASES, "case06", progress), false);
  assert.equal(isCaseUnlocked(CASES, "case10", progress), false);

  CASES.forEach((caseData, index) => {
    assert.equal(isCaseUnlocked(CASES, caseData.id, progress), true);
    progress = recordResult(progress, caseData.id, 70 + index, storage);
    if (CASES[index + 1]) {
      assert.equal(isCaseUnlocked(CASES, CASES[index + 1].id, progress), true);
    }
  });

  const restored = loadProgress(storage);
  assert.deepEqual(restored.completedCases, CASES.map((caseData) => caseData.id));
  assert.equal(restored.bestScores.case05, 74);
  assert.equal(restored.bestScores.case10, 79);
});

test("CASE 06〜10はCASE 01〜05終了後、CASE 06から順番に1件ずつ解放される", () => {
  const storage = new MemoryStorage();
  let progress = loadProgress(storage);

  CASES.slice(0, 4).forEach((caseData) => {
    progress = recordResult(progress, caseData.id, 70, storage);
  });
  CASES.slice(5).forEach((caseData) => {
    assert.equal(isCaseUnlocked(CASES, caseData.id, progress), false, caseData.id);
  });

  progress = recordResult(progress, "case05", 70, storage);
  assert.equal(isCaseUnlocked(CASES, "case06", progress), true);
  CASES.slice(6).forEach((caseData) => {
    assert.equal(isCaseUnlocked(CASES, caseData.id, progress), false, caseData.id);
  });

  ["case06", "case07", "case08", "case09"].forEach((caseId, index) => {
    progress = recordResult(progress, caseId, 70, storage);
    const nextCaseId = `case${String(index + 7).padStart(2, "0")}`;
    assert.equal(isCaseUnlocked(CASES, nextCaseId, progress), true, nextCaseId);
    CASES.slice(index + 7).forEach((caseData) => {
      if (caseData.id === nextCaseId) return;
      assert.equal(isCaseUnlocked(CASES, caseData.id, progress), false, caseData.id);
    });
  });
});

test("CASE 06〜10のカードはCASE 01〜05終了後、次の1件だけ順番に表示する", () => {
  const storage = new MemoryStorage();
  let progress = loadProgress(storage);

  CASES.slice(0, 5).forEach((caseData) => {
    assert.equal(isCaseVisible(caseData, progress), true, caseData.id);
  });
  CASES.slice(5).forEach((caseData) => {
    assert.equal(isCaseVisible(caseData, progress), false, caseData.id);
  });

  CASES.slice(0, 4).forEach((caseData) => {
    progress = recordResult(progress, caseData.id, 70, storage);
  });
  CASES.slice(5).forEach((caseData) => {
    assert.equal(isCaseVisible(caseData, progress), false, caseData.id);
  });

  progress = recordResult(progress, "case05", 70, storage);
  assert.equal(isCaseVisible(CASES[5], progress), true, "case06");
  CASES.slice(6).forEach((caseData) => {
    assert.equal(isCaseVisible(caseData, progress), false, caseData.id);
  });

  ["case06", "case07", "case08", "case09"].forEach((caseId, index) => {
    progress = recordResult(progress, caseId, 70, storage);
    const nextCaseIndex = index + 6;
    CASES.slice(5).forEach((caseData, bonusIndex) => {
      assert.equal(
        isCaseVisible(caseData, progress),
        bonusIndex <= nextCaseIndex - 5,
        caseData.id,
      );
    });
  });
});

test("エクストラケースはCASE 10クリア後にだけ表示・解放される", () => {
  const storage = new MemoryStorage();
  const extraCase = CASES.find(({ id }) => id === "extra01");
  let progress = loadProgress(storage);

  CASES.slice(0, 9).forEach((caseData) => {
    progress = recordResult(progress, caseData.id, 70, storage);
  });
  assert.equal(isCaseVisible(extraCase, progress), false);
  assert.equal(isCaseUnlocked(CASES, extraCase.id, progress), false);

  progress = recordResult(progress, "case10", 70, storage);
  assert.equal(isCaseVisible(extraCase, progress), true);
  assert.equal(isCaseUnlocked(CASES, extraCase.id, progress), true);
});

test("エクストラケースでは探偵が質問し、司書さんが答える", () => {
  const extraCase = CASES.find(({ id }) => id === "extra01");
  const session = new GameSession(extraCase, { random: () => 0 });

  assert.equal(session.state.conversation[0].label, "司書さん");
  session.askQuestion("q_extra_when");
  assert.equal(session.state.conversation.at(-2).label, "探偵さん");
  assert.equal(session.state.conversation.at(-1).label, "司書さん");

  const markup = interviewScreen(session);
  assert.match(markup, /LIBRARIAN/);
  assert.match(markup, /extra-detective-icon\.webp/);
  assert.match(markup, /MYSTERY LOG/);

  session.state.score = {
    total: 95,
    rank: "S",
    accuracy: 95,
    segments: [],
  };
  const resultMarkup = resultScreen(
    session,
    { bestScores: { extra01: 95 }, volume: 1 },
    false,
  );
  assert.match(resultMarkup, /extra-detective-reaction-high-portrait\.webp/);
  assert.match(resultMarkup, /探偵さんが満足して喜んでいる表情/);
  ["high", "medium", "low"].forEach((level) => {
    assert.match(
      extraCase.presentation.resultPlayerPortraits[level],
      new RegExp(`extra-detective-reaction-${level}-portrait\\.webp$`),
    );
  });

  session.caseData.questions.forEach((question) => {
    assert.doesNotMatch(
      question.text,
      /ですか|ますか|ましたか|ませんか|できますか/,
      `${question.id}: detective speaks in friendly casual Japanese`,
    );
  });
});

test("エクストラケースの繰り返し確認は、時期の回答候補へ直接つながる", () => {
  const extraCase = CASES.find(({ id }) => id === "extra01");
  const combinations = getCaseCombinations(extraCase);

  combinations.forEach((_, index) => {
    const session = new GameSession(extraCase, {
      random: () => (index + 0.1) / combinations.length,
    });
    const question = session.caseData.questions.find(
      ({ id }) => id === "q_extra_pattern",
    );
    const correctTiming = session.caseData.deduction.slots
      .find(({ id }) => id === "timing")
      .options.find(({ score }) => score === 1);

    assert.ok(question.reveals.includes("timing"));
    question.responseOptions.forEach(({ text }) => {
      assert.match(text, new RegExp(correctTiming.text));
    });
  });

  const partialTiming = extraCase.deduction.slots
    .find(({ id }) => id === "timing")
    .options.find(({ id }) => id === "time_special");
  assert.equal(partialTiming.text, "普段と違う作業があった翌朝");
});

test("エクストラケースは3種類の時期・出来事・関係者・理由を一貫した組で生成する", () => {
  const extraCase = CASES.find(({ id }) => id === "extra01");
  const combinations = getCaseCombinations(extraCase).map((combination) =>
    Object.fromEntries(
      Object.entries(combination).map(([slotId, choice]) => [
        slotId,
        choice.optionId,
      ]),
    ),
  );

  assert.deepEqual(combinations, [
    {
      timing: "time_rain",
      occurrence: "event_cushion",
      actor: "actor_cleaner",
      reason: "reason_dry",
    },
    {
      timing: "time_story",
      occurrence: "event_owl",
      actor: "actor_student",
      reason: "reason_repair",
    },
    {
      timing: "time_closed",
      occurrence: "event_bookends",
      actor: "actor_display",
      reason: "reason_shadow",
    },
  ]);
});

test("エクストラケースは人物と理由を複数の調査経路から確かめられる", () => {
  const extraCase = CASES.find(({ id }) => id === "extra01");
  const combinations = getCaseCombinations(extraCase);

  combinations.forEach((_, index) => {
    const random = () => (index + 0.1) / combinations.length;
    const directRoute = new GameSession(extraCase, { random });
    const contextualRoute = new GameSession(extraCase, { random });

    const access = directRoute.caseData.questions.find(
      ({ id }) => id === "q_extra_access",
    );
    assert.deepEqual(access.reveals, ["access_clue"]);
    assert.equal(access.reveals.includes("actor"), false);

    ["q_extra_object", "q_extra_condition", "q_extra_access", "q_extra_trace", "q_extra_confirm", "q_extra_when"].forEach(
      (questionId) => directRoute.askQuestion(questionId),
    );
    assert.equal(directRoute.areAllDeductionSlotsUnlocked(), true);

    ["q_extra_when", "q_extra_previous", "q_extra_object", "q_extra_condition", "q_extra_trace", "q_extra_destination"].forEach(
      (questionId) => contextualRoute.askQuestion(questionId),
    );
    assert.equal(contextualRoute.areAllDeductionSlotsUnlocked(), true);

    const reasonSources = ["q_extra_destination", "q_extra_confirm"].map(
      (questionId) =>
        directRoute.caseData.questions.find(({ id }) => id === questionId),
    );
    reasonSources.forEach((question) => {
      assert.ok(question.reveals.includes("reason"), question.id);
    });
  });
});
