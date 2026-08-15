export const ENDING_REQUIRED_CASES = Object.freeze([
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
]);

export const ENDING_DIALOGUE = Object.freeze({
  beforeIllustration: Object.freeze([
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "司書さん、今日もいろいろ相談された？" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "はい。いろいろありましたよ" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "相談って、最初に聞かれたことに答えれば終わりじゃないんだよね？" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "そうですね。少しお話を聞いてみると、本当に知りたかったことが別に見つかることもあります" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "へー。でもそれ、本人も『これが知りたい！』って最初からわかってるわけじゃないんだ？" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "はい。お話をしているうちに整理されることもあります" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "あー、なるほど。じゃあ、そのあとで出てくるのが“本当の質問”なんだ" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "あとで出てくるというより、最初からあるのかもしれません。まだ、うまく言葉になっていないだけで" }),
  ]),
  withIllustration: Object.freeze([
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "なるほどねー。じゃあ、それを見つけるのが司書さんの仕事なんだね" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "一緒に見つける、でしょうか" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "ふふ。司書さんらしい", portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "……でもそれ、ちょっと探偵っぽくない？", illustration: 2, portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "そうですか？" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "話を聞いて、気になるところをもう一回聞いて、手がかりをつなげるんでしょ？", portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "言われてみれば、少し似ていますね", portrait: "./assets/characters/extra-librarian-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "でしょ？", portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "あ、そうだ。私も聞きたいことあったんだった", portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "何でしょう？", portrait: "./assets/characters/extra-librarian-reaction-high-portrait.webp" }),
    Object.freeze({
      speaker: "探偵さん",
      role: "detective",
      text: "えーっとね……",
      portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp",
    }),
  ]),
});

export const ENDING_DIALOGUE_LINES = Object.freeze([
  ...ENDING_DIALOGUE.beforeIllustration,
  ...ENDING_DIALOGUE.withIllustration,
]);

export function getEndingIllustration(dialogueIndex) {
  return ENDING_DIALOGUE_LINES.slice(0, dialogueIndex + 1).reduce(
    (illustration, message) => message.illustration ?? illustration,
    1,
  );
}

export function isEndingUnlocked(progress) {
  return ENDING_REQUIRED_CASES.every(
    (caseId) => progress?.bestScores?.[caseId] === 100,
  );
}
