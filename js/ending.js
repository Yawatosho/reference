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
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "じゃあさ、“本当の質問”って最初からそこにあるの？" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "たぶん、あるんだと思います。まだ、うまく言葉になっていないこともありますけど" }),
  ]),
  withIllustration: Object.freeze([
    Object.freeze({ speaker: "探偵さん", role: "detective", text: "なるほどねー、じゃあ、それを見つけるのが司書さんの仕事なんだね" }),
    Object.freeze({ speaker: "司書さん", role: "librarian", text: "一緒に見つける、でしょうか" }),
    Object.freeze({
      speaker: "探偵さん",
      role: "detective",
      text: "ふふ。司書さんらしい",
      portrait: "./assets/characters/extra-detective-reaction-high-portrait.webp",
    }),
  ]),
});

export const ENDING_DIALOGUE_LINES = Object.freeze([
  ...ENDING_DIALOGUE.beforeIllustration,
  ...ENDING_DIALOGUE.withIllustration,
]);

export function isEndingUnlocked(progress) {
  return ENDING_REQUIRED_CASES.every(
    (caseId) => progress?.bestScores?.[caseId] === 100,
  );
}
