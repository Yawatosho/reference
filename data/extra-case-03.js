const EXTRA_CASE_03_SOURCE = [
// ================================================================
// EX3-A
// 「マッピングを設定したいんですが……」
// ================================================================

{
  id: "ex3_mapping",

  title: "マッピングを設定したいんですが……",

  cardOpening:
    "機関リポジトリシステムのマッピングについて、ちょっと教えてもらえますか？",

  opening:
    "すみません、機関リポジトリシステムのマッピングについて、ちょっと教えてもらえますか？ 論文を登録するなら、先にちゃんと設定しておかないといけないのかなと思って……。",

  maxQuestions: 10,

  presentation: {
    playerLabel: "司書さん",
    respondentLabel: "他大学の司書",
    respondentRole: "LIBRARIAN",
    respondentInfoLabel: "司書から聞いた情報",
  },

  patron: {
    name: "他大学の司書",
    descriptor:
      "最近、機関リポジトリを担当することになった若手司書",

    initials: "EX3",
    accent: "#6f827d",

    image:
      "./assets/characters/extra-librarian-portrait.webp",

    messageSound: "message1",

    timeLimitLine:
      "すみません、そろそろ戻らないと……。ここまでのお話で、私が本当に確認したかったことを整理してもらえますか？",

    reactions: {
      high: {
        image:
          "./assets/characters/extra-librarian-reaction-high.webp",

        line:
          "ああ、そういうことですね！ 私、マッピングは自分で設定しないといけないものだと思い込んでいました。まず標準の設定で足りるか確認すればよかったんですね。",
      },

      medium: {
        image:
          "./assets/characters/extra-librarian-reaction-medium.webp",

        line:
          "だいぶ分かってきました。マッピングの話というより、今の標準設定でやりたいことができるかを確認したかったんですね。",
      },

      low: {
        image:
          "./assets/characters/extra-librarian-reaction-low.webp",

        line:
          "うーん……マッピングの設定方法を知りたいのは確かなんですが、そもそも何を変えたいのか、自分でもまだ整理できていない気がします。",
      },
    },
  },

  facts: {
    // ------------------------------------------------------------
    // 登録したいもの
    // ------------------------------------------------------------

    journal_article: {
      label: "登録したい資料",
      display:
        "登録したいのは一般的な学術雑誌論文",
    },

    normal_metadata: {
      label: "必要な情報",
      display:
        "タイトル、著者、掲載誌、巻号、ページ、識別子など一般的な論文情報を登録したい",
    },

    // ------------------------------------------------------------
    // 現在の設定
    // ------------------------------------------------------------

    standard_item_type: {
      label: "現在のアイテムタイプ",
      display:
        "標準で用意されている論文向けのアイテムタイプを使おうとしている",
    },

    fields_sufficient: {
      label: "項目の充足",
      display:
        "登録したい情報は標準アイテムタイプの項目で足りている",
    },

    no_custom_fields: {
      label: "独自項目",
      display:
        "機関独自のメタデータ項目を追加する予定はない",
    },

    no_external_linkage: {
      label: "外部連携",
      display:
        "独自の外部システムとの特別なデータ連携も予定していない",
    },

    // ------------------------------------------------------------
    // 相談者の思い込み
    // ------------------------------------------------------------

    mapping_assumption: {
      label: "思い込み",
      display:
        "論文を登録する前に、自分でマッピング設定を作成・変更する必要があると思っている",
    },

    no_error: {
      label: "現在の状態",
      display:
        "エラーや出力上の問題が発生しているわけではなく、まだ設定変更もしていない",
    },

    // ------------------------------------------------------------
    // 本当の質問
    // ------------------------------------------------------------

    hypothesis_confirmed: {
      label: "本当の質問",
      display:
        "標準アイテムタイプで必要な情報が登録できるなら、マッピングを変更せず標準設定を利用してよいか確認したい",
    },

    // ------------------------------------------------------------
    // 寄り道
    // ------------------------------------------------------------

    few_items: {
      label: "登録件数",
      display:
        "今回は数件の論文を登録する予定",
    },

    no_harvest_error: {
      label: "連携エラー",
      display:
        "外部へのメタデータ提供でエラーが起きているわけではない",
    },

    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    // ============================================================
    // 最初から表示
    // ============================================================

    {
      id: "q_ex3a_material",
      text:
        "今回は、どのような資料を登録される予定ですか？",

      requiresAll: [],
      requiresAny: [],

      response:
        "普通の学術雑誌論文です。先生から何本か登録してほしいと依頼が来ていて。",

      responseVariants: [
        "特別な資料ではなくて、一般的な学術論文です。まずは数件登録してみようと思っています。",
      ],

      reveals: ["journal_article"],
    },

    {
      id: "q_ex3a_problem",
      text:
        "今、マッピングの設定で何かエラーや問題が起きていますか？",

      requiresAll: [],
      requiresAny: [],

      response:
        "いえ、まだ設定には触っていないんです。変に変更しておかしくなったら怖いので、先に聞いておこうと思って。",

      responseVariants: [
        "まだ何も起きていません。登録を始める前に、必要な設定を済ませておこうと思ったんです。",
      ],

      reveals: ["no_error"],
    },

    {
      id: "q_ex3a_why_mapping",
      text:
        "マッピングについて確認しておこうと思われたのは、何かきっかけがあったんですか？",

      requiresAll: [],
      requiresAny: [],

      response:
        "マニュアルを読んでいたらマッピングという項目が出てきたので、論文を登録するなら自分で設定しないといけないのかな、と……。",

      responseVariants: [
        "メタデータを外部にも出すならマッピングが必要、と読んで、自分で何か対応させる必要があるのかなと思ったんです。",
      ],

      reveals: ["mapping_assumption"],
    },

    {
      id: "q_ex3a_item_type",
      text:
        "今のところ、どのアイテムタイプを使う予定ですか？",

      requiresAll: [],
      requiresAny: ["journal_article"],

      response:
        "最初から用意されている、論文向けの標準アイテムタイプです。まだ自分では新しいものを作っていません。",

      responseVariants: [
        "標準で入っているものを使おうと思っています。独自アイテムタイプはまだ作っていません。",
      ],

      reveals: ["standard_item_type"],
    },

    // ============================================================
    // 核心へ進む
    // ============================================================

    {
      id: "q_ex3a_metadata",
      text:
        "論文について、どのような情報を登録したいとお考えですか？",

      requiresAll: ["journal_article"],
      requiresAny: [],

      response:
        "タイトル、著者、雑誌名、巻号、ページ、DOIみたいな普通の情報ですね。あとは本文ファイルも登録したいです。",

      responseVariants: [
        "一般的な論文情報が入れば十分です。特別な情報を追加したいというわけではありません。",
      ],

      reveals: ["normal_metadata"],
    },

    {
      id: "q_ex3a_missing_fields",
      text:
        "標準アイテムタイプの項目で、登録したい情報はひととおり入りそうですか？",

      requiresAll: [
        "standard_item_type",
        "normal_metadata",
      ],

      requiresAny: [],

response:
  "そうですね……改めて確認してみると、必要だと思っていた情報はひととおり登録できそうです。",

responseVariants: [
  "はい。タイトルや著者、書誌情報など、今回必要な項目はそろっていそうです。",
],

      reveals: ["fields_sufficient"],
    },

    {
      id: "q_ex3a_custom_fields",
      text:
        "大学独自の管理項目などを、新しく追加する予定はありますか？",

      requiresAll: [],
      requiresAny: [
        "standard_item_type",
        "normal_metadata",
      ],

      response:
        "今のところありません。まずは普通の論文を登録できれば十分です。",

      responseVariants: [
        "特にないです。機関独自の項目を増やしたいという話も出ていません。",
      ],

      reveals: ["no_custom_fields"],
    },

    {
      id: "q_ex3a_external_system",
      text:
        "ほかの学内システムと独自にメタデータを連携する予定はありますか？",

      requiresAll: [],
      requiresAny: ["mapping_assumption"],

      response:
        "いえ、特別な連携は予定していません。普通にリポジトリとして登録・公開できれば大丈夫です。",

      responseVariants: [
        "今のところありません。別システム向けの独自出力なども考えていないです。",
      ],

      reveals: ["no_external_linkage"],
      distractor: "plausible",
    },

    // ============================================================
    // 仮説確認
    // ============================================================

    {
      id: "q_ex3a_hypothesis",
      text:
        "ここまで伺ったところでは、標準アイテムタイプで必要な情報は登録できそうですね。今回は、マッピングを変更せず標準の設定を使ってよいかを確認したい、ということでしょうか？",

      requiresAll: [
        "mapping_assumption",
        "standard_item_type",
        "fields_sufficient",
        "no_custom_fields",
      ],

      requiresAny: [],

      response:
        "はい、まさにそれです。私、『マッピングを設定する』こと自体が必要な作業なんだと思っていました。標準の設定で足りるなら、無理に変えなくていいのかを知りたかったんです。",

      responseVariants: [
        "そうです。設定方法を覚えたいというより、そもそも今のケースで変更が必要なのかを知りたかったんですね。",
      ],

      reveals: ["hypothesis_confirmed"],
    },

    // ============================================================
    // もっともらしい寄り道
    // ============================================================

    {
      id: "q_ex3a_count",
      text:
        "今回は何件くらい登録する予定ですか？",

      requiresAll: ["journal_article"],
      requiresAny: [],

      response:
        "まずは3、4件くらいです。それで慣れたら、少しずつ増やしていこうと思っています。",

      responseVariants: [
        "今のところ数件だけです。大量登録をする予定ではありません。",
      ],

      reveals: ["few_items"],
      distractor: "plausible",
    },

    {
      id: "q_ex3a_harvest_error",
      text:
        "外部へのメタデータ提供で、何かうまくいっていないところはありますか？",

      requiresAll: [],
      requiresAny: ["mapping_assumption"],

      response:
        "今のところ、特に問題は起きていません。まだ登録を始めるところなので、何か問題が出る前に確認しておいたほうがいいかなと思って。",

      responseVariants: [
        "まだエラーなどは出ていません。これから登録を始めるところなので、今の設定のままで大丈夫なのかを先に確認しておきたかったんです。",
      ],

      reveals: ["no_harvest_error"],
      distractor: "plausible",
    },

    // ============================================================
    // 雑談
    // ============================================================

{
  id: "q_ex3a_irrelevant",
  text:
    "ところで、今日はそちらの図書館、落ち着いていますか？",

  requiresAll: [],
  requiresAny: [],

  response:
    "今日は比較的落ち着いています。午後になると、もう少し利用者が増えてきそうですけど。",

  responseVariants: [
    "今のところは静かですね。このあと少し忙しくなるかもしれません。",
  ],

  reveals: ["smalltalk_followup"],
  distractor: "irrelevant",
  distractorTone: "cheerful",
},

{
  id: "q_ex3a_smalltalk_followup",
  text:
    "忙しくなる前に、少しひと息つけそうですね。",

  requiresAll: ["smalltalk_followup"],
  requiresAny: [],

  response:
    "そうですね。戻ったらコーヒーでも飲んでから、午後の仕事を始めようかなと思います。",

  responseVariants: [
    "はい。ちょうどいいタイミングなので、戻ったら少し休憩しようと思います。",
  ],

  reveals: [],
  smallTalkFollowUp: true,
},

  deduction: {
    template:
      "{slot1}。{slot2}。しかし、{slot3}ため、{slot4}。",

    slots: [
      {
        id: "registration",
        label: "登録したいもの",

        requiresAll: ["journal_article"],
        partialRequiresAny: ["normal_metadata"],

        options: [
          {
            id: "registration_article",
            text:
              "一般的な学術雑誌論文を機関リポジトリへ登録したい",
            score: 1,
          },

          {
            id: "registration_metadata",
            text:
              "論文のメタデータを新しく設計したい",
            score: 0.5,
          },

          {
            id: "registration_dataset",
            text:
              "研究データ専用の登録形式を作りたい",
            score: 0,
          },

          {
            id: "registration_external",
            text:
              "外部システムから大量のデータを取り込みたい",
            score: 0,
          },
        ],
      },

      {
        id: "current_fit",
        label: "現在の標準設定",

        requiresAll: ["fields_sufficient"],

        partialRequiresAll: ["standard_item_type"],

        options: [
          {
            id: "fit_sufficient",
            text:
              "必要な情報は標準アイテムタイプの項目で足りている",
            score: 1,
          },

          {
            id: "fit_probably",
            text:
              "標準アイテムタイプで大部分の情報は登録できそうである",
            score: 0.5,
          },

          {
            id: "fit_missing",
            text:
              "論文登録に必要な項目が標準アイテムタイプには不足している",
            score: 0,
          },

          {
            id: "fit_custom_required",
            text:
              "論文ごとに独自アイテムタイプを作成する必要がある",
            score: 0,
          },
        ],
      },

      {
        id: "misunderstanding",
        label: "相談者が迷っている理由",

        requiresAll: ["mapping_assumption"],

        options: [
          {
            id: "misunderstanding_mapping",
            text:
              "登録前に自分でマッピングを設定・変更する必要があると思っている",
            score: 1,
          },

          {
            id: "misunderstanding_error",
            text:
              "現在のマッピング設定でエラーが発生している",
            score: 0.5,
          },

          {
            id: "misunderstanding_fields",
            text:
              "独自項目と標準項目の対応関係が決められない",
            score: 0,
          },

          {
            id: "misunderstanding_import",
            text:
              "他システムから取り込んだデータが正しく変換されない",
            score: 0,
          },
        ],
      },

      {
        id: "real_need",
        label: "本当に確認したいこと",

        requiresAll: ["hypothesis_confirmed"],

        partialRequiresAll: [
          "fields_sufficient",
          "mapping_assumption",
        ],

        options: [
          {
            id: "need_default",
            text:
              "独自設定を作らず、標準アイテムタイプと既存の設定を利用してよいか確認したい",
            score: 1,
          },

          {
            id: "need_mapping_method",
            text:
              "マッピング設定画面の操作方法を知りたい",
            score: 0.5,
          },

          {
            id: "need_custom_type",
            text:
              "自大学専用のアイテムタイプを新しく作りたい",
            score: 0,
          },

          {
            id: "need_all_mapping",
            text:
              "すべてのメタデータ項目を一からマッピングし直したい",
            score: 0,
          },
        ],
      },
    ],
  },

  correctSentence:
    "一般的な学術雑誌論文を機関リポジトリへ登録したい。必要な情報は標準アイテムタイプの項目で足りている。しかし、登録前に自分でマッピングを設定・変更する必要があると思っているため、独自設定を作らず、標準アイテムタイプと既存の設定を利用してよいか確認したい。",

  explanation:
    "相談者は「マッピングについて教えてほしい」と相談しましたが、話を聞くと、現在エラーが発生しているわけでも、独自のメタデータ項目や外部連携が必要なわけでもありませんでした。登録したいのは一般的な学術雑誌論文で、必要な情報も標準アイテムタイプで表現できそうです。相談者は「マッピングは登録前に自分で設定しなければならない」と考えていたため、設定方法そのものではなく、現在の用途で設定変更が本当に必要なのかを確認することが本当の質問でした。",

  advice:
    "専門用語を使った相談でも、その用語が本当に相談の中心とは限りません。「何を実現したいのか」「現在の設定では何が足りないのか」を確認すると、操作方法を説明する前に、そもそも操作が必要かどうかを整理できます。",
},


// ================================================================
// EX3-B
// 「1年間、非公開にしたいんですが……」
// ================================================================

{
  id: "ex3_embargo",

  title: "1年間、非公開にしたいんですが……",

  cardOpening:
    "機関リポジトリで、アイテムを1年間非公開にして、あとから公開するような設定ってできますか？",

  opening:
    "すみません、機関リポジトリシステムで、アイテムを1年間非公開にして、あとから公開するような設定ってできますか？ 論文の登録依頼が来たんですが、ちょっと公開条件があって……。",

  maxQuestions: 10,

  presentation: {
    playerLabel: "司書さん",
    respondentLabel: "他大学の司書",
    respondentRole: "LIBRARIAN",
    respondentInfoLabel: "司書から聞いた情報",
  },

  patron: {
    name: "他大学の司書",
    descriptor:
      "最近、機関リポジトリを担当することになった若手司書",

    initials: "EX3",
    accent: "#6f827d",

    image:
      "./assets/characters/extra-librarian-portrait.webp",

    messageSound: "message1",

    timeLimitLine:
      "すみません、そろそろ戻らないと……。ここまでのお話で、どういう登録にしたかったのか整理してもらえますか？",

    reactions: {
      high: {
        image:
          "./assets/characters/extra-librarian-reaction-high.webp",

        line:
          "ああ、そういうことですね！ アイテム全部を非公開にしたいわけじゃなくて、本文だけエンバーゴ期間中は読めない状態にしたかったんです。",
      },

      medium: {
        image:
          "./assets/characters/extra-librarian-reaction-medium.webp",

        line:
          "なるほど。1年後に公開したい、というところは合っています。ただ、何を今から公開して、何を待つのかをもう少し分けて考えたほうがよさそうですね。",
      },

      low: {
        image:
          "./assets/characters/extra-librarian-reaction-low.webp",

        line:
          "うーん……アイテム全部を隠したいわけではないんです。出版社の条件で公開できない部分だけ、うまく管理したいという感じで……。",
      },
    },
  },

  facts: {
    // ------------------------------------------------------------
    // 登録依頼
    // ------------------------------------------------------------

    accepted_article: {
      label: "登録依頼",
      display:
        "研究者からアクセプト済み論文のリポジトリ登録依頼を受けた",
    },

    accepted_manuscript: {
      label: "登録する本文",
      display:
        "登録対象の本文は査読後の著者最終稿",
    },

    // ------------------------------------------------------------
    // 出版社ポリシー
    // ------------------------------------------------------------

    policy_checked: {
      label: "出版社ポリシー",
      display:
        "出版社の公開条件を確認している",
    },

    embargo_12m: {
      label: "エンバーゴ",
      display:
        "著者最終稿は出版後12か月経過してから公開できる",
    },

    // ------------------------------------------------------------
    // 公開したい範囲
    // ------------------------------------------------------------

    metadata_now: {
      label: "メタデータ",
      display:
        "タイトル、著者名、掲載誌などのメタデータは今から公開したい",
    },

    file_only_embargo: {
      label: "非公開にしたいもの",
      display:
        "エンバーゴ期間中に利用できない状態にしたいのは著者最終稿の本文ファイル",
    },

    // ------------------------------------------------------------
    // 相談者の思い込み
    // ------------------------------------------------------------

    whole_item_assumption: {
      label: "最初の想定",
      display:
        "アイテム全体を1年間非公開にして、後から公開する必要があると思っている",
    },

    manual_release_concern: {
      label: "運用上の心配",
      display:
        "エンバーゴ終了時に必要な確認や設定変更を忘れないか心配している",
    },

    // ------------------------------------------------------------
    // 本当の質問
    // ------------------------------------------------------------

    hypothesis_confirmed: {
      label: "本当の質問",
      display:
        "メタデータは先に公開し、本文だけエンバーゴ期間中は利用できない状態にして、公開可能日以降に適切に公開できるよう管理したい",
    },

    // ------------------------------------------------------------
    // 寄り道
    // ------------------------------------------------------------

    publisher_version_unavailable: {
      label: "出版社版",
      display:
        "出版社版をリポジトリで公開する予定ではない",
    },

    no_need_hide_record: {
      label: "書誌情報",
      display:
        "論文が存在すること自体を隠す必要はない",
    },

    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    // ============================================================
    // 最初から表示
    // ============================================================

    {
      id: "q_ex3b_material",
      text:
        "今回は、どのようなものを登録される予定ですか？",

      requiresAll: [],
      requiresAny: [],

      response:
        "先生から、アクセプトされた論文をリポジトリに登録してほしいと依頼が来たんです。",

      responseVariants: [
        "学術雑誌論文です。出版が決まったので、リポジトリにも登録したいという依頼でした。",
      ],

      reveals: ["accepted_article"],
    },

    {
      id: "q_ex3b_reason",
      text:
        "どうして1年間非公開にする必要があるんでしょう？",

      requiresAll: [],
      requiresAny: [],

      response:
        "出版社のポリシーを確認したら、リポジトリで公開できる版にはエンバーゴ期間があるようだったんです。",

      responseVariants: [
        "登録前に出版社の公開条件を調べたら、すぐには本文を公開できないと分かって。",
      ],

      reveals: ["policy_checked"],
    },

    {
      id: "q_ex3b_what_hide",
      text:
        "非公開にする範囲としては、今のところアイテム全体を想定されていますか？",

      requiresAll: [],
      requiresAny: [],

      response:
        "はい、そのつもりでした。1年間非公開にして、期間が終わったら公開に切り替えるのかな、と。",

      responseVariants: [
        "そう思っていました。公開できない期間があるなら、アイテムそのものを非公開にするのかなと。",
      ],

      reveals: ["whole_item_assumption"],
    },

    // ============================================================
    // 出版社条件を具体化
    // ============================================================

    {
      id: "q_ex3b_version",
      text:
        "出版社の条件では、公開制限の対象になっているのはどの版でしょうか？",

      requiresAll: ["policy_checked"],
      requiresAny: [],

      response:
        "査読後の著者最終稿です。今回、先生から預かっているのもその版です。",

      responseVariants: [
        "著者最終稿ですね。出版社版ではなくて、アクセプトされたときの原稿です。",
      ],

      reveals: ["accepted_manuscript"],
    },

    {
      id: "q_ex3b_period",
      text:
        "著者最終稿は、いつから公開できる条件なんですか？",

      requiresAll: ["accepted_manuscript"],
      requiresAny: [],

      response:
        "出版後12か月経過してから、という条件でした。",

      responseVariants: [
        "出版日から12か月のエンバーゴです。それを過ぎれば公開できるようです。",
      ],

      reveals: ["embargo_12m"],
    },

    // ============================================================
    // 「何を非公開にするのか」を切り分ける
    // ============================================================

    {
      id: "q_ex3b_metadata",
      text:
        "タイトルや著者名、掲載誌などのメタデータについては、どのように公開したいとお考えですか？",

      requiresAll: ["embargo_12m"],
      requiresAny: [],

response:
  "メタデータは今から公開して大丈夫だと思っています。できれば、リポジトリに登録されていること自体は分かるようにしておきたいですね。",

responseVariants: [
  "タイトルや著者名などは、今から見える状態で構いません。公開を待つ必要があるのは本文のほうですね。",
],

      reveals: [
        "metadata_now",
        "no_need_hide_record",
      ],
    },

    {
      id: "q_ex3b_actual_target",
      text:
        "エンバーゴ期間中、本文ファイルについてはどのような状態にしておきたいですか？",

      requiresAll: [
        "embargo_12m",
        "metadata_now",
      ],

      requiresAny: [],

response:
  "著者最終稿の本文だけは、公開できる時期までは読めない状態にしておきたいです。メタデータまで非公開にする必要はなさそうですね。",

responseVariants: [
  "本文は公開可能日まで利用できないようにして、メタデータは先に公開しておければと思っています。",
],

      reveals: ["file_only_embargo"],
    },

    // ============================================================
    // エンバーゴ明けの運用
    // ============================================================

    {
      id: "q_ex3b_after_embargo",
      text:
        "エンバーゴが終わったあとについて、何か心配していることはありますか？",

      requiresAll: ["file_only_embargo"],
      requiresAny: [],

      response:
        "本文の公開日は設定できそうなんですが、それだけで全部終わりなのか自信がなくて。公開時に確認したり変更したりする項目があるなら、忘れないようにしたいです。",

      responseVariants: [
        "1年後に完全に放っておいて大丈夫なのかが少し心配です。必要な確認作業があるなら、それも含めて運用したいですね。",
      ],

      reveals: ["manual_release_concern"],
    },

    // ============================================================
    // 仮説確認
    // ============================================================

    {
      id: "q_ex3b_hypothesis",
      text:
        "ここまで伺うと、メタデータは先に公開して、本文は公開可能日までエンバーゴにしておきたい、ということですね。エンバーゴが終わったあとの確認も含めて、公開の管理方法を知りたいということでしょうか？",

      requiresAll: [
        "embargo_12m",
        "metadata_now",
        "file_only_embargo",
      ],

      requiresAny: [],

      response:
        "はい、それです。最初はアイテム全体を1年間非公開にするものだと思っていました。本文だけ分けて考えればよかったんですね。",

      responseVariants: [
        "そうです。自動公開の方法だけを知りたいわけではなくて、エンバーゴ中と終了後をどう管理すればいいのかを整理したかったんです。",
      ],

      reveals: ["hypothesis_confirmed"],
    },

    // ============================================================
    // もっともらしい寄り道
    // ============================================================

    {
      id: "q_ex3b_publisher_pdf",
      text:
        "出版社が作成した版を公開する予定ですか？",

      requiresAll: ["accepted_article"],
      requiresAny: [],

      response:
        "いえ、今回登録する予定なのは著者最終稿です。出版社版を公開しようとは考えていません。",

      responseVariants: [
        "出版社版ではないです。先生から預かった著者最終稿を登録する予定です。",
      ],

      reveals: ["publisher_version_unavailable"],
      distractor: "plausible",
    },

    {
      id: "q_ex3b_manual",
      text:
        "エンバーゴが終わったあとは、どのように公開するイメージでしたか？",

      requiresAll: ["whole_item_assumption"],
      requiresAny: [],

response:
  "最初は、1年後に担当者が手動でアイテム全体を公開するのかなと思っていました。ただ、忘れずに管理できるか少し心配で。",

responseVariants: [
  "期間が終わったところで公開設定を変更するものだと思っていました。ほかに確認が必要なところもあるなら、それも把握しておきたいです。",
],
      reveals: ["manual_release_concern"],
      distractor: "plausible",
    },

    // ============================================================
    // 雑談
    // ============================================================

{
  id: "q_ex3b_irrelevant",
  text:
    "そういえば、今日はもうお昼は済ませましたか？",

  requiresAll: [],
  requiresAny: [],

  response:
    "まだなんです。この相談が終わったら、何か食べようと思っていました。",

  responseVariants: [
    "まだです。ちょうどそろそろお昼にしようかなと思っていたところです。",
  ],

  reveals: ["smalltalk_followup"],
  distractor: "irrelevant",
  distractorTone: "cheerful",
},

{
  id: "q_ex3b_smalltalk_followup",
  text:
    "何か食べたいものは決まっていますか？",

  requiresAll: ["smalltalk_followup"],
  requiresAny: [],

  response:
    "まだ迷っています。学食に行くか、近くでパンを買うか……たぶん戻る途中で決めます。",

  responseVariants: [
    "まだ決めていないんです。今日は少し軽めのものがいいかな、くらいですね。",
  ],

  reveals: [],
  smallTalkFollowUp: true,
},

  deduction: {
    template:
      "{slot1}。{slot2}。そのため、{slot3}、{slot4}。",

    slots: [
      {
        id: "material",
        label: "登録したいもの",

        requiresAll: ["accepted_manuscript"],
        partialRequiresAll: ["accepted_article"],

        options: [
          {
            id: "material_am",
            text:
              "アクセプト済み論文の著者最終稿をリポジトリへ登録したい",
            score: 1,
          },

          {
            id: "material_article",
            text:
              "アクセプト済みの学術雑誌論文を登録したい",
            score: 0.5,
          },

          {
            id: "material_publisher",
            text:
              "出版社版PDFをリポジトリで公開したい",
            score: 0,
          },

          {
            id: "material_metadata_only",
            text:
              "論文本文は登録せず、書誌情報だけ登録したい",
            score: 0,
          },
        ],
      },

      {
        id: "condition",
        label: "公開条件",

        requiresAll: ["embargo_12m"],
        partialRequiresAll: ["policy_checked"],

        options: [
          {
            id: "condition_embargo",
            text:
              "著者最終稿には出版後12か月のエンバーゴがある",
            score: 1,
          },

          {
            id: "condition_restriction",
            text:
              "論文本文には一定期間の公開制限がある",
            score: 0.5,
          },

          {
            id: "condition_all_hidden",
            text:
              "論文に関する情報を12か月間一切公開してはいけない",
            score: 0,
          },

          {
            id: "condition_no_repository",
            text:
              "著者最終稿は機関リポジトリへ登録してはいけない",
            score: 0,
          },
        ],
      },

      {
        id: "during_embargo",
        label: "エンバーゴ中の状態",

        requiresAll: [
          "metadata_now",
          "file_only_embargo",
        ],

        partialRequiresAll: ["metadata_now"],

        options: [
          {
            id: "during_metadata_open",
            text:
              "メタデータは公開し、本文だけ利用できない状態にしたい",
            score: 1,
          },

          {
            id: "during_record_visible",
            text:
              "論文が登録されていることだけは分かるようにしたい",
            score: 0.5,
          },

          {
            id: "during_all_private",
            text:
              "アイテム全体を12か月間非公開にしたい",
            score: 0,
          },

          {
            id: "during_file_open",
            text:
              "本文を先に公開し、メタデータだけ後から公開したい",
            score: 0,
          },
        ],
      },

      {
        id: "management",
        label: "本当にしたいこと",

        requiresAll: ["hypothesis_confirmed"],

        partialRequiresAll: [
          "embargo_12m",
          "file_only_embargo",
        ],

        options: [
          {
            id: "management_embargo",
            text:
              "本文のエンバーゴ期間と公開可能日を設定し、終了時の確認も含めて適切に公開を管理したい",
            score: 1,
          },

          {
            id: "management_release",
            text:
              "本文PDFを12か月後に公開できるようにしたい",
            score: 0.5,
          },

          {
            id: "management_all_auto",
            text:
              "アイテム全体を12か月非公開にし、その後すべて自動で公開したい",
            score: 0,
          },

          {
            id: "management_manual",
            text:
              "アイテムを非公開にして、12か月後に担当者が手動で全体を公開したい",
            score: 0,
          },
        ],
      },
    ],
  },

  correctSentence:
    "アクセプト済み論文の著者最終稿をリポジトリへ登録したい。著者最終稿には出版後12か月のエンバーゴがある。そのため、メタデータは公開し、本文だけ利用できない状態にしたいので、本文のエンバーゴ期間と公開可能日を設定し、終了時の確認も含めて適切に公開を管理したい。",

  explanation:
    "相談者は最初、「アイテムを1年間非公開にしたい」と考えていました。しかし、出版社の公開条件を確認すると、公開制限があるのは登録予定の著者最終稿であり、タイトルや著者名などのメタデータまで非公開にする必要があるわけではありませんでした。さらに話を聞くと、相談者が実現したいのは、エンバーゴ期間中も論文情報は公開しつつ、本文だけ公開可能日まで利用できない状態にすることでした。エンバーゴ終了時に必要となる確認や設定も考慮しながら、適切に公開を管理することが本当の相談内容です。",

  advice:
    "「非公開にしたい」という相談では、何を非公開にするのかを具体的に確認することが重要です。アイテム全体、メタデータ、本文ファイルでは必要な対応が異なることがあります。また、将来の公開を設定する場合も、「設定したらそれで終わり」と決めつけず、公開時に必要な確認を含めて運用を整理すると安全です。",
}
];

function withOlibArtwork(scenario) {
  const reactions = scenario.patron.reactions;
  return {
    ...scenario,
    explanation: `${scenario.explanation}本ケースは大学図書館で想定される相談をもとに構成したフィクションであり、実際の対応条件は個別の状況によって異なります。`,
    patron: {
      ...scenario.patron,
      image: "./assets/characters/extra-olib-portrait.webp",
      reactions: {
        high: {
          ...reactions.high,
          image: "./assets/characters/extra-olib-reaction-high-portrait.webp",
        },
        medium: {
          ...reactions.medium,
          image: "./assets/characters/extra-olib-reaction-medium-portrait.webp",
        },
        low: {
          ...reactions.low,
          image: "./assets/characters/extra-olib-reaction-low-portrait.webp",
        },
      },
    },
  };
}

const [mappingSource, embargoSource] = EXTRA_CASE_03_SOURCE;
const mappingScenario = withOlibArtwork(mappingSource);
const { id: _embargoScenarioId, ...embargoFields } = withOlibArtwork(embargoSource);
const embargoScenario = {
  ...embargoFields,
  deduction: {
    ...embargoFields.deduction,
    template: "{slot1}。{slot2}。そのため、{slot3}ので、{slot4}。",
  },
};

export const EXTRA_CASE_03 = {
  ...mappingScenario,
  id: "extra03",
  number: "EX3",
  cardTitle: "機関リポジトリの設定を確認したい",
  cardOpening:
    "機関リポジトリへの登録や公開設定について、ちょっと教えてもらえますか？",
  category: "EXTRA・機関リポジトリ",
  difficulty: "INTERVIEW 03",
  unlockAfter: ["extra02"],
  revealAfter: ["extra02"],
  unlockHint: "EX CASE 2をクリア",
  replayVariation: { recentHistorySize: 1 },
  variants: [
    {
      id: "embargo-management",
      scenarioData: embargoScenario,
    },
  ],
};
