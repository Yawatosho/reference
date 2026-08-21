import { calculateScore } from "./scoring.js";

export function isQuestionUnlocked(question, knownFacts) {
  return areFactRequirementsMet(question, knownFacts);
}

function areFactRequirementsMet(item, knownFacts, prefix = "") {
  const facts = knownFacts instanceof Set ? knownFacts : new Set(knownFacts);
  const allRequirements =
    item[prefix ? `${prefix}RequiresAll` : "requiresAll"] ?? [];
  const anyRequirements =
    item[prefix ? `${prefix}RequiresAny` : "requiresAny"] ?? [];
  const allOk = allRequirements.every((id) => facts.has(id));
  const anyOk =
    anyRequirements.length === 0 || anyRequirements.some((id) => facts.has(id));
  return allOk && anyOk;
}

export function isDeductionSlotUnlocked(slot, knownFacts) {
  return areFactRequirementsMet(slot, knownFacts);
}

export function isDeductionSlotPartiallyUnlocked(slot, knownFacts) {
  const hasPartialRequirements =
    (slot.partialRequiresAll?.length ?? 0) > 0 ||
    (slot.partialRequiresAny?.length ?? 0) > 0;
  return (
    hasPartialRequirements &&
    areFactRequirementsMet(slot, knownFacts, "partial")
  );
}

export function formatDeduction(template, slots, selections) {
  return slots.reduce((sentence, slot, index) => {
    const selected = slot.options.find(
      (option) => option.id === selections[slot.id],
    );
    return sentence.replace(
      `{slot${index + 1}}`,
      selected?.text ?? `［${slot.label}を選択］`,
    );
  }, template);
}

function normalizeRandomValue(value) {
  const randomValue = Number(value);
  const normalizedValue = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999999)
    : 0;
  return normalizedValue;
}

function pickRandomItem(items, random) {
  const normalizedValue = normalizeRandomValue(random());
  return items[Math.floor(normalizedValue * items.length)];
}

function createSeededRandom(seedText) {
  let seed = 2166136261;
  for (const character of String(seedText)) {
    seed ^= character.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledOptions(options, seedText) {
  const shuffled = options.map((option) => ({ ...option }));
  const seededRandom = createSeededRandom(seedText);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(seededRandom() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function renderCaseTemplate(template, values) {
  if (typeof template !== "string") return template;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key)
      ? String(values[key])
      : match,
  );
}

function normalizeResponseOption(response, defaultReveals, values = {}) {
  const option =
    typeof response === "string" ? { text: response } : (response ?? {});
  return {
    text: renderCaseTemplate(option.text, values),
    reveals: [...(option.reveals ?? defaultReveals ?? [])],
  };
}

function resolveQuestionResponses(question, override, values = {}) {
  const configuredResponses = (override?.responses ?? question.responses)?.filter(
    Boolean,
  );
  const sourceResponses = configuredResponses?.length
    ? configuredResponses
    : [question.response, ...(question.responseVariants ?? [])].filter(Boolean);
  return sourceResponses.map((response) =>
    normalizeResponseOption(response, question.reveals, values),
  );
}

function isCompatibleCombination(combination) {
  return Object.entries(combination).every(([, choice]) =>
    Object.entries(choice.compatibleWith ?? {}).every(
      ([otherSlotId, allowedOptionIds]) =>
        allowedOptionIds.includes(combination[otherSlotId]?.optionId),
    ),
  );
}

export function getCaseCombinations(caseData) {
  const dimensionEntries = Object.entries(caseData.composition?.dimensions ?? {});
  if (dimensionEntries.length === 0) return [];

  const fixedScenarios = caseData.composition?.scenarios;
  if (Array.isArray(fixedScenarios) && fixedScenarios.length > 0) {
    const scenarioIds = new Set();
    return fixedScenarios.map((scenario) => {
      if (typeof scenario.id !== "string" || !scenario.id) {
        throw new Error(`${caseData.id} の固定シナリオに id がありません。`);
      }
      if (scenarioIds.has(scenario.id)) {
        throw new Error(`${caseData.id} の固定シナリオID ${scenario.id} が重複しています。`);
      }
      scenarioIds.add(scenario.id);

      const selections = scenario.selections ?? {};
      const combination = Object.fromEntries(
        dimensionEntries.map(([slotId, choices]) => {
          const optionId = selections[slotId];
          const choice = choices.find((item) => item.optionId === optionId);
          if (!choice) {
            throw new Error(
              `${caseData.id}/${scenario.id} の ${slotId}: ${optionId ?? "未指定"} は有効な選択肢ではありません。`,
            );
          }
          return [slotId, choice];
        }),
      );

      const unknownSlotIds = Object.keys(selections).filter(
        (slotId) => !Object.hasOwn(caseData.composition.dimensions, slotId),
      );
      if (unknownSlotIds.length > 0 || !isCompatibleCombination(combination)) {
        throw new Error(`${caseData.id}/${scenario.id} の組み合わせは成立しません。`);
      }
      return combination;
    });
  }

  const combinations = dimensionEntries.reduce(
    (results, [slotId, choices]) =>
      results.flatMap((result) =>
        choices.map((choice) => ({ ...result, [slotId]: choice })),
      ),
    [{}],
  );

  return combinations.filter(isCompatibleCombination);
}

function getCombinationSignature(combination) {
  return Object.entries(combination)
    .map(([slotId, choice]) => `${slotId}:${choice.optionId}`)
    .join("|");
}

function findFixedScenario(composition, combination) {
  return composition.scenarios?.find((scenario) =>
    Object.entries(combination).every(
      ([slotId, choice]) => scenario.selections?.[slotId] === choice.optionId,
    ),
  );
}

function getChangedDimensionCount(combination, signature) {
  const previousOptions = new Map(
    String(signature)
      .split("|")
      .map((part) => part.split(":"))
      .filter(([slotId, optionId]) => slotId && optionId),
  );
  return Object.entries(combination).filter(
    ([slotId, choice]) => previousOptions.get(slotId) !== choice.optionId,
  ).length;
}

function resolveCaseComposition(
  caseData,
  {
    random = Math.random,
    excludeVariantId = null,
    excludeVariantIds = [],
    preferDifferentDimensions = false,
  } = {},
) {
  const combinations = getCaseCombinations(caseData);
  if (combinations.length === 0) {
    throw new Error(`${caseData.id} に有効な文節の組み合わせがありません。`);
  }

  const recentVariantIds = [
    ...new Set(
      [...excludeVariantIds, excludeVariantId].filter(
        (variantId) => typeof variantId === "string" && variantId,
      ),
    ),
  ];
  const excludedVariants = new Set(recentVariantIds);
  const combinationsOutsideHistory = combinations.filter(
    (combination) => !excludedVariants.has(getCombinationSignature(combination)),
  );
  let availableCombinations =
    combinationsOutsideHistory.length > 0
      ? combinationsOutsideHistory
      : combinations;

  if (
    preferDifferentDimensions &&
    recentVariantIds.length > 0 &&
    availableCombinations.length > 1
  ) {
    const previousVariantId = recentVariantIds.at(-1);
    const greatestDifference = Math.max(
      ...availableCombinations.map((combination) =>
        getChangedDimensionCount(combination, previousVariantId),
      ),
    );
    availableCombinations = availableCombinations.filter(
      (combination) =>
        getChangedDimensionCount(combination, previousVariantId) ===
        greatestDifference,
    );
  }
  const compositionRandomValue = normalizeRandomValue(random());
  const combination =
    availableCombinations[
      Math.floor(compositionRandomValue * availableCombinations.length)
    ];
  const composition = caseData.composition;
  const activeScenario = findFixedScenario(composition, combination);
  const optionOrderSeed = `${caseData.id}|${getCombinationSignature(combination)}|${compositionRandomValue.toString(36)}`;
  const values = {
    ...Object.values(combination).reduce(
      (result, choice) => ({ ...result, ...(choice.values ?? {}) }),
      {},
    ),
    ...(activeScenario?.values ?? {}),
  };

  const facts = Object.fromEntries(
    Object.entries(caseData.facts).map(([factId, fact]) => [
      factId,
      {
        ...fact,
        display: renderCaseTemplate(
          composition.facts?.[factId] ?? fact.display,
          values,
        ),
      },
    ]),
  );

  const questions = caseData.questions.map((question) => {
    const override = {
      ...(composition.questions?.[question.id] ?? {}),
      ...(activeScenario?.questions?.[question.id] ?? {}),
    };
    const responseOptions = resolveQuestionResponses(question, override, values);
    return {
      ...question,
      text: renderCaseTemplate(override?.text ?? question.text, values),
      responseOptions,
      response: responseOptions[0]?.text ?? question.response,
      responseVariants: responseOptions.slice(1).map(({ text }) => text),
    };
  });

  const patron = {
    ...caseData.patron,
    reactions: Object.fromEntries(
      Object.entries(caseData.patron.reactions ?? {}).map(
        ([level, reaction]) => [
          level,
          {
            ...reaction,
            line: renderCaseTemplate(reaction.line, values),
          },
        ],
      ),
    ),
  };

  const deduction = {
    ...caseData.deduction,
    slots: caseData.deduction.slots.map((slot) => {
      const choice = combination[slot.id];
      const partialOptionIds = new Set(
        [choice?.partialOptionIds ?? choice?.partialOptionId]
          .flat()
          .filter(Boolean),
      );
      return {
        ...slot,
        options: shuffledOptions(
          slot.options.map((option) => ({
            ...option,
            score:
              option.id === choice?.optionId
                ? 1
                : partialOptionIds.has(option.id)
                  ? 0.5
                  : 0,
          })),
          `${optionOrderSeed}|${slot.id}`,
        ),
      };
    }),
  };
  const correctSelections = Object.fromEntries(
    Object.entries(combination).map(([slotId, choice]) => [
      slotId,
      choice.optionId,
    ]),
  );

  return {
    ...caseData,
    patron,
    opening: renderCaseTemplate(composition.opening ?? caseData.opening, values),
    facts,
    questions,
    deduction,
    correctSentence: (activeScenario?.correctSentence ?? composition.correctSentence)
      ? renderCaseTemplate(
          activeScenario?.correctSentence ?? composition.correctSentence,
          values,
        )
      : formatDeduction(
          caseData.deduction.template,
          caseData.deduction.slots,
          correctSelections,
        ),
    explanation: renderCaseTemplate(
      activeScenario?.explanation ?? composition.explanation ?? caseData.explanation,
      values,
    ),
    activeVariantId: getCombinationSignature(combination),
    activeScenarioId: activeScenario?.id ?? null,
    activeCombination: correctSelections,
  };
}

function resolveLegacyCaseVariant(
  caseData,
  {
    random = Math.random,
    excludeVariantId = null,
    excludeVariantIds = [],
  } = {},
) {
  const variants = [{ id: "default" }, ...(caseData.variants ?? [])];
  const excludedVariants = new Set(
    [...excludeVariantIds, excludeVariantId].filter(Boolean),
  );
  const availableVariants = variants.filter(
    (variant) =>
      variants.length === 1 || !excludedVariants.has(variant.id),
  );
  const selectableVariants =
    availableVariants.length > 0 ? availableVariants : variants;
  const variantRandomValue = normalizeRandomValue(random());
  const variant =
    selectableVariants[
      Math.floor(variantRandomValue * selectableVariants.length)
    ];
  const optionOrderSeed = `${caseData.id}|${variant.id}|${variantRandomValue.toString(36)}`;

  if (variant.scenarioData) {
    const scenarioCase = {
      ...caseData,
      ...variant.scenarioData,
      patron: {
        ...caseData.patron,
        ...(variant.scenarioData.patron ?? {}),
      },
    };
    const questions = scenarioCase.questions.map((question) => {
      const responseOptions = resolveQuestionResponses(question);
      return {
        ...question,
        responseOptions,
        response: responseOptions[0]?.text ?? question.response,
        responseVariants: responseOptions.slice(1).map(({ text }) => text),
      };
    });
    const deduction = {
      ...scenarioCase.deduction,
      slots: scenarioCase.deduction.slots.map((slot) => ({
        ...slot,
        options: shuffledOptions(
          slot.options,
          `${optionOrderSeed}|${slot.id}`,
        ),
      })),
    };

    return {
      ...scenarioCase,
      questions,
      deduction,
      activeVariantId: variant.id,
    };
  }

  const factOverrides = variant.facts ?? {};
  const questionOverrides = variant.questions ?? {};

  const facts = Object.fromEntries(
    Object.entries(caseData.facts).map(([factId, fact]) => [
      factId,
      {
        ...fact,
        display: factOverrides[factId] ?? fact.display,
      },
    ]),
  );

  const questions = caseData.questions.map((question) => {
    const override = questionOverrides[question.id];
    const responseOptions = resolveQuestionResponses(question, override);
    return {
      ...question,
      text: override?.text ?? question.text,
      responseOptions,
      response: responseOptions[0]?.text ?? question.response,
      responseVariants: responseOptions.slice(1).map(({ text }) => text),
    };
  });

  const deduction = {
    ...caseData.deduction,
    slots: caseData.deduction.slots.map((slot) => {
      const correctOptionId = variant.answers?.[slot.id];
      const partialOptionIds = new Set(
        [variant.partialAnswers?.[slot.id]].flat().filter(Boolean),
      );
      return {
        ...slot,
        options: shuffledOptions(
          slot.options.map((option) => ({
            ...option,
            score: correctOptionId
              ? option.id === correctOptionId
                ? 1
                : partialOptionIds.has(option.id)
                  ? 0.5
                  : 0
              : option.score,
          })),
          `${optionOrderSeed}|${slot.id}`,
        ),
      };
    }),
  };

  return {
    ...caseData,
    opening: variant.opening ?? caseData.opening,
    facts,
    questions,
    deduction,
    correctSentence: variant.correctSentence ?? caseData.correctSentence,
    explanation: variant.explanation ?? caseData.explanation,
    activeVariantId: variant.id,
  };
}

export function resolveCaseVariant(caseData, options = {}) {
  return caseData.composition
    ? resolveCaseComposition(caseData, options)
    : resolveLegacyCaseVariant(caseData, options);
}

export class GameSession {
  constructor(
    caseData,
    {
      random = Math.random,
      excludeVariantId = null,
      excludeVariantIds = [],
      preferDifferentDimensions = false,
    } = {},
  ) {
    this.caseData = resolveCaseVariant(caseData, {
      random,
      excludeVariantId,
      excludeVariantIds,
      preferDifferentDimensions,
    });
    this.random = random;
    const presentation = this.caseData.presentation ?? {};
    const playerLabel = presentation.playerLabel ?? "あなた";
    const respondentLabel = presentation.respondentLabel ?? "利用者";
    this.state = {
      caseId: this.caseData.id,
      variantId: this.caseData.activeVariantId,
      questionsUsed: 0,
      askedQuestionIds: new Set(),
      knownFacts: new Set(),
      newlyUnlockedQuestionIds: new Set(),
      conversationMood: "default",
      questionBonus: 0,
      patronExpression: "default",
      phase: "interview",
      deductionSelections: {},
      score: null,
      conversation: [
        {
          speaker: "patron",
          text: this.caseData.opening,
          label: respondentLabel,
        },
      ],
    };
  }

  getQuestionLimit() {
    return this.caseData.maxQuestions + this.state.questionBonus;
  }

  canContinueToNextPhase() {
    const transition = this.caseData.phaseTransition;
    if (!transition?.nextCaseData || transition.trigger === "after-result") {
      return false;
    }
    const requiredQuestionIds = transition.choiceRequiresQuestionIds ?? [];
    return requiredQuestionIds.every((questionId) =>
      this.state.askedQuestionIds.has(questionId),
    );
  }

  getQuestionStates() {
    return this.caseData.questions.map((question) => {
      if (this.state.askedQuestionIds.has(question.id)) {
        return { question, status: "asked" };
      }
      if (!isQuestionUnlocked(question, this.state.knownFacts)) {
        return { question, status: "locked" };
      }
      if (this.state.newlyUnlockedQuestionIds.has(question.id)) {
        return { question, status: "new" };
      }
      return { question, status: "available" };
    });
  }

  getKnownFacts() {
    return [...this.state.knownFacts]
      .map((id) => ({ id, ...this.caseData.facts[id] }))
      .filter((fact) => fact.label && fact.display);
  }

  pickResponse(question) {
    const responses = question.responseOptions?.length
      ? question.responseOptions
      : [question.response, ...(question.responseVariants ?? [])]
          .filter(Boolean)
          .map((text) => ({ text, reveals: [...(question.reveals ?? [])] }));

    if (responses.length === 0) {
      throw new Error("返答が設定されていません。");
    }

    const randomValue = Number(this.random());
    const normalizedValue = Number.isFinite(randomValue)
      ? Math.min(Math.max(randomValue, 0), 0.999999999)
      : 0;
    return responses[Math.floor(normalizedValue * responses.length)];
  }

  askQuestion(questionId) {
    if (this.state.phase !== "interview") {
      throw new Error("質問フェイズではありません。");
    }
    const question = this.caseData.questions.find((item) => item.id === questionId);
    if (!question) throw new Error("質問が見つかりません。");
    if (this.state.questionsUsed >= this.getQuestionLimit()) {
      throw new Error("質問回数の上限です。");
    }

    if (this.state.askedQuestionIds.has(questionId)) {
      throw new Error("その質問は質問済みです。");
    }
    if (!isQuestionUnlocked(question, this.state.knownFacts)) {
      throw new Error("その質問はまだ解放されていません。");
    }

    const unlockedBefore = new Set(
      this.getQuestionStates()
        .filter(({ status }) => status === "available" || status === "new")
        .map(({ question: item }) => item.id),
    );

    const response = this.pickResponse(question);
    const startsWarmMood = question.distractorTone === "cheerful";
    const responseText = response.text;

    this.state.askedQuestionIds.add(questionId);
    this.state.questionsUsed += 1;
    const recoveredQuestions =
      question.smallTalkFollowUp && this.caseData.allowQuestionRecovery !== false
      ? Math.floor(normalizeRandomValue(this.random()) * 3) + 1
      : 0;
    this.state.questionBonus += recoveredQuestions;
    if (startsWarmMood) this.state.conversationMood = "warm";
    this.state.patronExpression =
      this.state.conversationMood === "warm" ? "high" : "default";
    response.reveals.forEach((factId) => this.state.knownFacts.add(factId));
    this.state.conversation.push(
      {
        speaker: "librarian",
        text: question.text,
        label: this.caseData.presentation?.playerLabel ?? "あなた",
      },
      {
        speaker: "patron",
        text: responseText,
        label: this.caseData.presentation?.respondentLabel ?? "利用者",
      },
    );

    const newlyUnlocked = this.caseData.questions
      .filter(
        (item) =>
          item.id !== questionId &&
          !this.state.askedQuestionIds.has(item.id) &&
          !unlockedBefore.has(item.id) &&
          isQuestionUnlocked(item, this.state.knownFacts),
      )
      .map((item) => item.id);
    this.state.newlyUnlockedQuestionIds = new Set(newlyUnlocked);

    if (this.state.questionsUsed >= this.getQuestionLimit()) {
      this.state.conversation.push({
        speaker: "patron",
        text:
          this.caseData.patron.timeLimitLine ??
          "すみません、そろそろ時間です。ここまでのお話で、必要な資料をまとめていただけますか？",
        label: this.caseData.presentation?.respondentLabel ?? "利用者",
      });
      this.state.phase = "deduction";
    }

    return {
      response: responseText,
      reveals: [...response.reveals],
      newlyUnlocked,
      recoveredQuestions,
      reachedLimit: this.state.phase === "deduction",
    };
  }

  startDeduction() {
    if (this.state.questionsUsed < 1) return false;
    if (this.state.phase === "result") return false;
    this.state.phase = "deduction";
    return true;
  }

  getDeductionSlotStates() {
    return this.caseData.deduction.slots.map((slot) => {
      const fullyUnlocked = isDeductionSlotUnlocked(
        slot,
        this.state.knownFacts,
      );
      const partiallyUnlocked =
        !fullyUnlocked &&
        isDeductionSlotPartiallyUnlocked(slot, this.state.knownFacts);

      return {
        slot,
        fullyUnlocked,
        partiallyUnlocked,
        unlocked: fullyUnlocked || partiallyUnlocked,
        availableOptions: slot.options,
      };
    });
  }

  areAllDeductionSlotsUnlocked() {
    return this.getDeductionSlotStates().every(
      ({ fullyUnlocked }) => fullyUnlocked,
    );
  }

  setSelection(slotId, optionId) {
    const slotState = this.getDeductionSlotStates().find(
      ({ slot }) => slot.id === slotId,
    );
    if (!slotState?.availableOptions.some((option) => option.id === optionId)) {
      return false;
    }
    this.state.deductionSelections[slotId] = optionId;
    return true;
  }

  isDeductionComplete() {
    return this.getDeductionSlotStates().every(
      ({ slot }) => this.state.deductionSelections[slot.id],
    );
  }

  getDeductionSentence() {
    return formatDeduction(
      this.caseData.deduction.template,
      this.caseData.deduction.slots,
      this.state.deductionSelections,
    );
  }

  submitDeduction() {
    if (this.state.phase !== "deduction" || !this.isDeductionComplete()) {
      throw new Error("4つの文節をすべて選択してください。");
    }
    this.state.score = calculateScore(
      this.caseData,
      this.state.deductionSelections,
    );
    this.state.phase = "result";
    return this.state.score;
  }
}

export function createNextPhaseSession(currentSession) {
  const transition = currentSession?.caseData?.phaseTransition;
  if (!transition?.nextCaseData) return null;

  const previousPresentation = currentSession.caseData.presentation ?? {};
  const previousPlayerAvatar = previousPresentation.playerAvatar ?? "";
  const previousPlayerSound =
    previousPresentation.playerMessageSound ?? "message2";
  const previousConversation = currentSession.state.conversation.map((entry) =>
    entry.speaker === "librarian"
      ? {
          ...entry,
          playerAvatar: entry.playerAvatar ?? previousPlayerAvatar,
          messageSound: entry.messageSound ?? previousPlayerSound,
        }
      : { ...entry },
  );

  const nextSession = new GameSession(transition.nextCaseData, {
    random: currentSession.random,
  });
  const openingConversation = transition.openingConversation?.length
    ? transition.openingConversation
    : transition.nextPhaseOpeningSuppressed
      ? []
      : [
          ...(transition.messages ?? []),
          ...nextSession.state.conversation,
        ];
  nextSession.state.conversation = [
    ...previousConversation,
    ...openingConversation.map((entry) => ({ ...entry })),
  ];

  const carryFactIds = new Set(transition.carryFactIds ?? []);
  nextSession.state.knownFacts = new Set(
    [...currentSession.state.knownFacts].filter(
      (factId) =>
        carryFactIds.has(factId) && Boolean(nextSession.caseData.facts[factId]),
    ),
  );

  return nextSession;
}
