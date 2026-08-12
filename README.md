# THE REFERENCE INTERVIEW GAME — ほんとの質問

**聞くことから、レファレンスは始まる。**

図書館のレファレンスカウンターを舞台にした、短編ダイアローグ型ゲームです。利用者の曖昧な依頼に基本6回の質問を重ね、「本当に知りたいこと」を4つの文節から再構成します。

通常10ケースと、CASE 10クリア後に解放されるエクストラケースを収録しています。ゲームエンジンとケースデータは分離されており、シナリオは `data/` 内のケースデータを追加・修正するだけで増やせます。

エクストラケースには3種類の日常の謎があり、作業の痕跡を追う経路と、物の状態・移動先から理由を考える経路を選べます。探偵の質問は、司書への親しみを感じさせる自然なタメ口で統一しています。

## 遊び方

1. CASE 01から順番にケースを選びます。CASE 01〜05をすべて終えるとボーナスCASE 06が表示され、以後は直前のケースをクリアするたびに次のカードが1件ずつ表示・解放されます。CASE 10を終えると、探偵として司書さんの日常の謎を解くエクストラケースが初めて表示されます。
2. 表示された候補から質問を選びます。各ケースには、もっともらしく見えても手がかりにならない質問と、明らかに無関係な質問も1問ずつ含まれます。利用者は無関係な質問にも笑顔で雑談へ乗り、雑談をさらに深掘りする質問が `NEW` 表示つきで解放されます。深掘りまでできると会話が弾み、そのケースで質問できる回数が2回分回復します。通常の回答で事実が判明した場合も、新しい質問が同様に解放されます。
3. 質問できるのは基本6回です。1問以上質問すれば、いつでも途中で「回答をまとめる」を選べます。上限に達した返答後には、利用者から時間を知らせるひと言が表示されます。6回目に雑談を始めた場合は深掘り前に終了するため、回復は発生しません。
4. 回答画面では、確認状況にかかわらず4文節すべてに同じ複数候補が表示されます。どこまで確認できているかは画面に示されないため、インタビューログを根拠に利用者の本当の問いを一文にします。
5. 4文節の回答内容だけで100点満点の採点を行います。質問回数は得点に影響しません。

クリア状況、ケースごとのベストスコア、音声ON/OFFは、ブラウザの `localStorage` に保存されます。個人情報や会話内容は保存しません。

## ローカルで実行する

ビルドや依存パッケージのインストールは不要です。リポジトリのルートで静的サーバーを起動してください。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。OSによっては `python` コマンドを使用してください。

ロジックテストはNode.js 20以降で実行できます。外部パッケージは使用しません。

```bash
npm test
```

## GitHub Pagesで公開する

すべての参照は相対パスで、ビルド済み成果物は不要です。

1. このディレクトリの内容をGitHubリポジトリの `main` ブランチへ置きます。
2. リポジトリの **Settings → Pages** を開きます。
3. **Build and deployment** のSourceを **Deploy from a branch** にします。
4. Branchを **main**、フォルダーを **/(root)** にして保存します。

リポジトリ名配下のURLでも、そのまま動作します。

## 構成

```text
.
├── index.html          # GitHub Pagesの入口
├── css/                # 見た目とレスポンシブ対応
├── js/
│   ├── app.js          # 画面遷移とイベント接続
│   ├── game.js         # 質問解放・セッション状態
│   ├── ui.js           # ケース非依存の画面描画
│   ├── scoring.js      # 4文節の回答内容を採点
│   └── storage.js      # 進行状況の保存
├── data/
│   ├── cases.js        # 基本ケースとゲーム設定
│   ├── additional-cases.js # ボーナスケースのシナリオデータ
│   └── extra-case.js   # 探偵役で遊ぶエクストラケース
└── tests/              # Node.js標準テスト
```

`js/game.js`、`js/ui.js`、`js/scoring.js` にはケースIDによる分岐を置かず、すべての表示と判定をケースデータから生成します。

## ケースを追加する

`data/cases.js`、`data/additional-cases.js`、または `data/extra-case.js` へ、新しいケースオブジェクトを1件追加します。ゲーム本体の変更は不要です。

最低限、次の項目を定義します。

- `id`、`number`、`title`、`opening`（回答4文節の正解を先に示さない、曖昧な相談の入口）
- `unlockAfter`：複数ケースの完了を解放条件にするときのケースID配列（省略時は直前ケースの完了で解放）
- `patron`：表示名、説明、識別記号、アクセント色、質問上限到達時の `timeLimitLine`
- `presentation`（任意）：質問者・応答者の表示名、質問者アイコン、ログ・回答・結果画面の役割別コピー。省略時は司書と利用者の通常表示
- `facts`：質問によって判明する事実
- `questions`：質問文、返答ごとの `text` と `reveals`、`requiresAll`、`requiresAny`、任意の寄り道種別 `distractor` と反応傾向 `distractorTone`
- `composition`：4文節の候補、固定シナリオ、会話テンプレート、判明事項テンプレート
- `replayVariation`：直前に遊んだ固定シナリオを避ける履歴数。CASE 02〜10は `recentHistorySize: 1`
- `deduction.template`：`{slot1}`〜`{slot4}` を含む完成文テンプレート
- `deduction.slots`：4文節それぞれの選択肢と、回答内容の `score`（`1`、`0.5`、`0`）
- `correctSentence`、`explanation`、`advice`

質問の解放条件は次の2種類を組み合わせます。

```js
{
  id: "q_example",
  text: "次に尋ねる質問",
  requiresAll: ["fact_a", "fact_b"],
  requiresAny: ["fact_c", "fact_d"],
  responses: [
    { text: "利用者の返答", reveals: ["fact_e"] },
    { text: "別の返答", reveals: ["fact_e", "fact_f"] }
  ],
  reveals: ["fact_e"] // 文字列返答・reveals省略時の既定値
}
```

- `responses` から、質問するたびに返答を1つランダム選択
- 各返答は `text` と、その返答で実際に判明する `reveals` を持つ
- 従来の `response`、`responseVariants`、質問直下の `reveals` も互換用として使用可能
- 返答バリエーションは質問ごとに独立して選ばれるため、プレイごとに会話の組み合わせが変化
- 返答で述べていない事実は `reveals` に含めず、述べた事実を未解放のまま残さない
- `requiresAll`：列挙した事実がすべて判明したとき解放
- `requiresAny`：列挙した事実のどれか1つが判明したとき解放
- 両方を空配列にすると初期質問
- `distractor: "plausible"` は一見関係がありそうな寄り道質問で、`reveals: []` とし質問枠だけを消費する
- `distractor: "irrelevant"` と `distractorTone: "cheerful"` を設定した雑談質問は、非表示の `smalltalk_followup` だけを判明させる。これは深掘り雑談の解放と笑顔表示にだけ使用し、回答文節や採点には使用しない

回答は各文節25点で、`score: 1` は25点、`score: 0.5` は12.5点、`score: 0` は0点です。同じ回答内容なら、質問回数や質問経路にかかわらず同じ得点になります。回答候補の並びはプレイ開始時に文節ごとにシャッフルされ、回答画面の再描画中は同じ順番を維持します。

CASE 01は `composition.dimensions` の候補を組み合わせて正解を生成します。CASE 02〜10は、相談の中心そのものが異なる、整合性を確認した3件の `composition.scenarios` から1件を選びます。各回答文節は「3シナリオそれぞれの具体候補＋全シナリオ共通の部分点候補」の4択です。直前のシナリオIDは `localStorage` に保存され、次のプレイでは選ばれません。各質問の返答は、固定シナリオの中でも毎回ランダムに選ばれます。

```js
composition: {
  scenarios: [
    {
      id: "scenario-a",
      selections: {
        period: "period_40"
      },
      // 必要なら、このシナリオだけの言い回しを上書きできる
      values: {
        periodReply: "昭和40年代だったと思います。"
      }
    },
    {
      id: "scenario-b",
      selections: {
        period: "period_50"
      }
    }
  ],
  dimensions: {
    period: [
      {
        optionId: "period_40",
        partialOptionId: "period_showa",
        values: {
          periodFact: "昭和40年代",
          periodReply: "昭和40年代です。"
        }
      },
      {
        optionId: "period_50",
        partialOptionId: "period_showa",
        values: {
          periodFact: "昭和50年代",
          periodReply: "昭和50年代です。"
        }
      }
    ]
  },
  facts: {
    period_fact: "{periodFact}"
  },
  questions: {
    q_period: {
      responses: ["{periodReply}", "時期は{periodFact}です。"]
    }
  }
}
```

- CASE 01は4文節の候補を組み合わせ、成立しない組は `compatibleWith` で除外
- CASE 02〜10は、相談の中心・用途・対象・必要情報・資料条件が異なる独立した3シナリオを定義
- `scenarios[].selections` に、各シナリオで実際に出題する4文節の組だけを列挙
- 各文節の最終回答は、3シナリオの具体候補3件と共通の部分点候補1件で構成
- `scenarios[].values` と `scenarios[].questions` で、特定シナリオだけの会話や質問を上書き可能
- CASE 02〜10の再プレイでは、保存された直前のシナリオを除外
- 同じシナリオでも `responses` の言い回しは質問ごとにランダム選択
- 正解文と文節ごとの採点は、選ばれた `optionId` から自動生成
- ケース固有の処理は `composition` 内で完結し、ゲーム本体にケースID別の分岐は不要

追加後は `npm test` を実行し、全固定シナリオについて、未置換変数、質問解放、部分点、6問ルート、正解文、直前シナリオ除外、返答のランダム選択を確認してください。

## 仕様

詳細は [reference_interview_game_spec.md](./reference_interview_game_spec.md) を参照してください。
