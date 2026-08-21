// EX CASE 04 「昔、ここで読んだ本」
// 前半は司書さん、6問を使い切った後半は探偵さんが聞き取りを引き継ぐ。

const WOMAN_ASSETS = Object.freeze({
  portrait: "./assets/characters/extra-ex4-portrait.webp",
  reactionHigh: "./assets/characters/extra-ex4-reaction-high-portrait.webp",
  reactionMedium: "./assets/characters/extra-ex4-reaction-middle-portrait.webp",
  reactionLow: "./assets/characters/extra-ex4-reaction-low-portrait.webp",
});

export const EXTRA_CASE_04_LIBRARIAN_PHASE = {
  id: "extra04_librarian",
  number: "EX 04",
  title: "昔、ここで読んだ本",
  cardOpening:
    "昔、この図書館でよく読んでいた本を、もう一度探したいんです。",
  category: "EXTRA・記憶の本",
  difficulty: "MYSTERY 04",
  maxQuestions: 6,

  // 接続側で使うための目印。既存エンジンが参照しなくてもよい。
  phaseMeta: {
    parentCaseId: "extra04",
    phase: 1,
    player: "librarian",
    bgmKey: "default",
    attainableMaxScore: 50,
  },

  opening:
    "すみません。昔、この図書館でよく読んでいた本を探しているんです。もう一度だけ、読んでみたくて……。タイトルも著者も、どうしても思い出せないのですが。",

  presentation: {
    playerLabel: "司書さん",
    respondentLabel: "女性",
    respondentRole: "VISITOR",
    respondentInfoLabel: "女性から聞いた情報",
    resultPlayerName: "司書さん",
    startLabel: "相談を聞く",
    logTitle: "INTERVIEW LOG",
    logSubtitle: "聞き取りの記録",
    deductionLogTitle: "聞き取りの記録",
    deductionPrompt:
      "ここまでに聞いた内容から、女性が探している本について整理します。",
    limitStatus:
      "本の特徴はかなり整理できました。それでも、まだ何かがうまくつながりません。",
    limitPrompt: "ここまでの情報で、いったん相談内容を整理してみましょう。",
    deduceButton: "回答をまとめる",
    limitButton: "回答をまとめる",
    deductionEyebrow: "REFERENCE INTERVIEW",
    deductionTitle: "相談内容を、4つの文節で整理しましょう",
    deductionLead:
      "目的・資料・読んだ場所・次に確認するものを選んでください。",
    answerButton: "この回答でまとめる",
    completionEyebrow: "INTERVIEW RESULT",
    resultHeadlineHigh:
      "本の特徴はかなり整理できました。でも、まだ説明できないことが残っています。",
    resultHeadlineMedium:
      "かなり近づいています。ただ、今の情報だけではまだ本にたどり着けません。",
    resultHeadlineLow:
      "もう少し、女性の記憶を整理する必要がありそうです。",
    reactionLabelEnglish: "VISITOR RESPONSE",
    reactionLabelJapanese: "女性の反応",
    answerLabelEnglish: "CURRENT ANSWER",
    answerLabelJapanese: "ここまでの整理",
    adviceLabel: "LIBRARIAN NOTE",
  },

  patron: {
    name: "女性",
    descriptor:
      "学生時代に図書館で読んだ一冊を、もう一度探している穏やかな女性",
    initials: "EX4",
    accent: "#8d8794",
    image: WOMAN_ASSETS.portrait,
    messageSound: "message1",

    timeLimitLine:
      "あら、もうこんなにお話ししたんですね。思い出せることはお伝えしたつもりなのですが……。何か分かりそうでしょうか？",

    reactions: {
      // 前半は仕様上100点にならない。
      // highも念のため定義しているが、通常はmedium以下を想定。
      high: {
        image: WOMAN_ASSETS.reactionMedium,
        line:
          "はい、探しているのはまさにそんな本です。学生のころ、何度も読んでいました。でも……どうして見つからないんでしょう。不思議ですね。",
      },
      medium: {
        image: WOMAN_ASSETS.reactionMedium,
        line:
          "そうです。世界の街の写真が載った、青くて大きな本でした。そこまでは間違いないと思うのですが……ここで読んでいたはずなんです。",
      },
      low: {
        image: WOMAN_ASSETS.reactionLow,
        line:
          "すみません。ずいぶん昔のことなので、私の記憶も曖昧で……。でも、もう一度あの本を読んでみたいんです。",
      },
    },
  },

  facts: {
    purpose_reread: {
      label: "利用目的",
      display: "学生時代に何度も読んだ本を、もう一度読みたい",
    },
    student_days: {
      label: "読んだ時期",
      display: "女性が学生だったころ",
    },
    content_world_cities: {
      label: "内容",
      display: "世界各地の街並みや建物を多くの写真で紹介していた",
    },
    format_large_blue: {
      label: "本の特徴",
      display: "普通の本より大きく、濃い青色の表紙だった",
    },
    favorite_white_town: {
      label: "印象的なページ",
      display: "海のそばにある白い街の写真が印象に残っている",
    },
    location_this_library: {
      label: "読んだ場所",
      display: "女性は『この図書館』で読んだと記憶している",
    },
    window_seat: {
      label: "読んだ席",
      display: "窓際の席でよく読んでいた",
    },
    in_library_only: {
      label: "利用方法",
      display: "借りずに、いつも図書館内で読んでいた",
    },
    title_author_unknown: {
      label: "書誌情報",
      display: "タイトルも著者名も思い出せない",
    },
    language_japanese: {
      label: "言語",
      display: "本文や説明は日本語だったと思う",
    },
    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    {
      id: "q_ex4a_purpose",
      text: "その本を、もう一度探したいと思われたのはどうしてですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "学生のころ、本当に何度も読んだ本なんです。ふと思い出して……もう一度、あのページを開いてみたくなりました。",
      responseVariants: [
        "昔よく読んでいた本で、最近になって急に懐かしくなったんです。もう一度読めたらと思って。",
      ],
      reveals: ["purpose_reread", "student_days"],
    },

    {
      id: "q_ex4a_content",
      text: "どのような内容の本だったか、覚えていらっしゃいますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "世界のいろいろな街を、たくさんの写真で紹介する本でした。建物や通りの写真も多かったと思います。",
      responseVariants: [
        "世界各地の街並みや建物が、写真でたくさん載っていました。文章より写真の印象が強い本です。",
      ],
      reveals: ["content_world_cities"],
    },

    {
      id: "q_ex4a_where",
      text: "その本は、どちらで読まれていましたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "ここです。この図書館で、いつも読んでいました。窓際の席が好きだったんです。",
      responseVariants: [
        "この図書館ですよ。窓の近くの席で、よくページをめくっていました。",
      ],
      reveals: ["location_this_library", "window_seat"],
    },

    {
      id: "q_ex4a_when",
      text: "いつ頃、その本を読まれていたのでしょうか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "学生だったころです。ずいぶん前のことですね。授業の合間によく図書館へ来ていました。",
      responseVariants: [
        "私が学生のころです。今となっては、ずいぶん昔のことになってしまいましたね。",
      ],
      reveals: ["student_days"],
    },

    {
      id: "q_ex4a_title_author",
      text: "タイトルや著者名について、何か覚えていることはありますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "それが、どうしても思い出せないんです。題名を見れば分かるような気はするのですが……。",
      responseVariants: [
        "著者名も題名も、きれいに抜けてしまって。表紙を見たら思い出せるかもしれません。",
      ],
      reveals: ["title_author_unknown"],
    },

    {
      id: "q_ex4a_appearance",
      text: "本の大きさや表紙の色などは覚えていますか？",
      requiresAll: [],
      requiresAny: ["content_world_cities", "title_author_unknown"],
      response:
        "普通の本より少し大きかったと思います。表紙は濃い青色で……それはよく覚えています。",
      responseVariants: [
        "大きめの本でした。抱えるほどではないですけれど、棚でも少し目立つくらい。表紙は深い青でした。",
      ],
      reveals: ["format_large_blue"],
    },

    {
      id: "q_ex4a_page",
      text: "特に印象に残っているページはありますか？",
      requiresAll: [],
      requiresAny: ["content_world_cities", "format_large_blue"],
      response:
        "海のそばに、白い建物が集まった街の写真です。あのページがとても好きでした。",
      responseVariants: [
        "白い家が並ぶ、海辺の街です。空も明るくて……その写真は今でもよく覚えています。",
      ],
      reveals: ["favorite_white_town"],
    },

    {
      id: "q_ex4a_borrow",
      text: "その本を借りて帰ったことはありますか？",
      requiresAll: [],
      requiresAny: ["location_this_library", "window_seat"],
      response:
        "いいえ。なぜか、いつもここで読んでいました。窓際で読むのが好きだったんです。",
      responseVariants: [
        "借りた記憶はありません。図書館へ来て、同じ席で読む本でした。",
      ],
      reveals: ["in_library_only", "window_seat"],
    },

    {
      id: "q_ex4a_language",
      text: "本文や写真の説明は、日本語でしたか？",
      requiresAll: [],
      requiresAny: ["content_world_cities", "format_large_blue"],
      response:
        "はい、日本語だったと思います。海外の街の名前には外国語も添えてあったかもしれません。",
      responseVariants: [
        "説明文は日本語でした。街の名前だけ、別の言葉も一緒に書いてあったような気がします。",
      ],
      reveals: ["language_japanese"],
    },

    {
      id: "q_ex4a_plausible",
      text: "写真集だった、と考えてよさそうでしょうか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "そうだと思うのですが……写真だけの本だったか、街についての説明もあったか、そのあたりは曖昧です。",
      responseVariants: [
        "写真が中心だったのは確かです。でも『写真集』という言い方で合っているかまでは、自信がありません。",
      ],
      reveals: [],
      distractor: "plausible",
    },

    {
      id: "q_ex4a_smalltalk",
      text: "写真を見るのは、昔からお好きだったんですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "ええ。知らない街の写真を眺めていると、少しだけ旅をしたような気持ちになれて。今でも好きですよ。",
      responseVariants: [
        "好きでした。行ったことのない場所を眺めるのが楽しくて、時間を忘れてしまうこともありました。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },

    {
      id: "q_ex4a_smalltalk_followup",
      text: "いいですね。実際に旅に出るのもお好きなんですか？",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "ええ、好きです。でも、本の中で旅をするのもなかなかいいものですよ。静かで、どこへでも行けますから。",
      responseVariants: [
        "好きですよ。ただ、図書館でページをめくりながら遠くへ行くのも、私は気に入っていました。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],

  // 前半ではslot3・slot4に真の正答を置かない。
  // したがって、このデータ単体では100点には到達できない。
  deduction: {
    template:
      "{slot1}。探しているのは{slot2}。{slot3}ので、{slot4}。",
    slots: [
      {
        id: "purpose",
        label: "何をしたい",
        requiresAll: [],
        options: [
          {
            id: "purpose_reread",
            text: "学生時代に何度も読んだ本を、もう一度読みたい",
            score: 1,
          },
          {
            id: "purpose_title",
            text: "昔読んだ本のタイトルだけ確認したい",
            score: 0.5,
          },
          {
            id: "purpose_trip",
            text: "旅行先を決めるために街の写真を見たい",
            score: 0,
          },
          {
            id: "purpose_new",
            text: "世界の街についての新しい本を読みたい",
            score: 0,
          },
        ],
      },

      {
        id: "material",
        label: "探している資料",
        requiresAll: [],
        options: [
          {
            id: "material_blue_city_book",
            text: "世界の街並みを写真で紹介した、濃い青色の大型本",
            score: 1,
          },
          {
            id: "material_travel_photo",
            text: "海外旅行の写真を集めた写真集",
            score: 0.5,
          },
          {
            id: "material_architecture",
            text: "世界の建築様式について解説した専門書",
            score: 0,
          },
          {
            id: "material_guide",
            text: "海辺の街を紹介する旅行ガイド",
            score: 0,
          },
        ],
      },

      {
        id: "place",
        label: "どこで読んだ",
        requiresAll: [],
        options: [
          {
            id: "place_current_window",
            text: "現在の図書館の窓際で読んでいた",
            score: 0,
          },
          {
            id: "place_current_largebook",
            text: "現在の図書館の大型本コーナーで読んでいた",
            score: 0,
          },
          {
            id: "place_other_university",
            text: "別の大学図書館で読んでいた",
            score: 0,
          },
          {
            id: "place_public",
            text: "公共図書館で読んでいた",
            score: 0,
          },
        ],
      },

      {
        id: "next_step",
        label: "次に確認するもの",
        requiresAll: [],
        options: [
          {
            id: "next_current_opac",
            text: "現在のOPACを条件を変えてもう一度検索する",
            score: 0,
          },
          {
            id: "next_shelf",
            text: "現在の書架を直接見て、青い大型本を探す",
            score: 0,
          },
          {
            id: "next_other_library",
            text: "他大学の蔵書検索で似た本を探す",
            score: 0,
          },
          {
            id: "next_web_cover",
            text: "インターネットで似た表紙の画像を探す",
            score: 0,
          },
        ],
      },
    ],
  },

  // 前半結果画面で真相を漏らさないための文面。
  // 接続側で「正解例」表示を抑制できるなら、この値は表示しない想定。
  correctSentence:
    "学生時代に読んでいた本をもう一度読みたい。探している本の特徴はかなり分かったが、読んだ場所と次に確認すべき記録がまだ特定できていない。",

  explanation:
    "女性が何をしたいのか、本がどんな資料だったのかはかなり整理できました。一方で、「この図書館で読んだ」という記憶と、現在の蔵書から見つからないことが噛み合っていません。今の情報だけで検索条件を増やしても、まだ決め手が足りません。",

  advice:
    "資料の特徴を丁寧に聞いても見つからないときは、聞き取りが不足しているとは限りません。相談者が当然だと思っている前提の中に、まだ言葉になっていない手がかりが残っていることがあります。",
};


export const EXTRA_CASE_04_DETECTIVE_PHASE = {
  id: "extra04_detective",
  number: "EX 04",
  title: "昔、ここで読んだ本",
  cardOpening:
    "昔の記憶が少し曖昧なんです。探偵さん、一緒に整理していただけますか？",
  category: "EXTRA・記憶の謎",
  difficulty: "MYSTERY 04",
  maxQuestions: 6,

  phaseMeta: {
    parentCaseId: "extra04",
    phase: 2,
    player: "detective",
    // EX1と共通の「探偵さんテーマ」に接続する想定。
    bgmKey: "detective-theme",
    finalPhase: true,
  },

  opening:
    "あなた、探偵さんなんですか？ でしたら……少し手伝っていただけませんか。昔のことが、どうもところどころ曖昧で。あの本を読んでいたころのこと、一緒に思い出してみたいんです。",

  presentation: {
    playerLabel: "探偵さん",
    respondentLabel: "女性",
    respondentRole: "VISITOR",
    respondentInfoLabel: "女性の記憶",
    playerAvatar:
      "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
    playerMessageSound: "message3",
    cutinAssetVariant: "det",
    resultPlayerName: "探偵さん",
    resultPlayerPortraits: {
      high:
        "./assets/characters/extra-detective-reaction-high-portrait.webp",
      medium:
        "./assets/characters/extra-detective-reaction-medium-portrait.webp",
      low:
        "./assets/characters/extra-detective-reaction-low-portrait.webp",
    },
    startLabel: "記憶をたどる",
    logTitle: "MYSTERY LOG",
    logSubtitle: "記憶の手がかり",
    deductionLogTitle: "記憶の手がかり",
    deductionPrompt:
      "司書さんが聞き取った本の情報と、女性の記憶の情景をつないで整理します。",
    limitStatus:
      "女性の記憶から、昔の図書館の姿が少しずつ見えてきました。",
    limitPrompt: "集まった手がかりから、探している本への道筋をまとめましょう。",
    deduceButton: "わかった！ 回答をまとめる",
    limitButton: "回答をまとめる",
    deductionEyebrow: "MYSTERY SOLUTION",
    deductionTitle: "相談の答えを、4つの文節で完成させましょう",
    deductionLead:
      "前半で分かった本の特徴と、今聞いた記憶を組み合わせてください。",
    answerButton: "この回答で答える",
    completionEyebrow: "MYSTERY SOLVED",
    resultHeadlineHigh:
      "お見事！ 二人の聞き取りがつながって、「もう一度読みたい」という願いが叶いました。",
    resultHeadlineMedium:
      "かなり近づいています。昔の図書館と現在を、もう少しつないでみましょう。",
    resultHeadlineLow:
      "本の特徴だけでなく、女性が覚えている『場所』にも注目してみましょう。",
    reactionLabelEnglish: "VISITOR RESPONSE",
    reactionLabelJapanese: "女性の反応",
    answerLabelEnglish: "REFERENCE ANSWER",
    answerLabelJapanese: "相談への回答",
    adviceLabel: "DETECTIVE NOTE",
  },

  patron: {
    name: "女性",
    descriptor:
      "昔の図書館の記憶をたどりながら、一冊の本を探している女性",
    initials: "EX4",
    accent: "#8d8794",
    image: WOMAN_ASSETS.portrait,
    messageSound: "message1",

    timeLimitLine:
      "あら、ずいぶんいろいろ思い出しましたね。自分でも、少しずつ景色が戻ってきた気がします。探偵さん、何か分かりましたか？",

    // 100点時のこの反応だけでエピローグまで完結させる。
    reactions: {
      high: {
        image: WOMAN_ASSETS.reactionHigh,
        line:
          "旧図書館時代の蔵書記録をたどってくださったんですね。……これです。この青い表紙。海のそばの白い街のページも、そのまま……。少し読ませていただきました。ずっと、もう一度読みたかったんです。ありがとうございました。これで、ようやく帰れます。",
      },
      medium: {
        image: WOMAN_ASSETS.reactionMedium,
        line:
          "ああ……旧図書館。そう言われると、今の建物とはずいぶん違っていた気がします。『ここ』だと思っていたけれど、私は大学の図書館そのものを思い浮かべていたんですね。",
      },
      low: {
        image: WOMAN_ASSETS.reactionLow,
        line:
          "すみません。私の記憶が曖昧で……。でも、今の建物とは少し違った気がするんです。窓の向こうには、大きな時計が見えていました。",
      },
    },
  },

  facts: {
    // 前半から引き継ぐ想定の情報。
    purpose_reread: {
      label: "利用目的",
      display: "学生時代に何度も読んだ本を、もう一度読みたい",
    },
    content_world_cities: {
      label: "内容",
      display: "世界各地の街並みや建物を多くの写真で紹介していた",
    },
    format_large_blue: {
      label: "本の特徴",
      display: "普通の本より大きく、濃い青色の表紙だった",
    },

    // 後半で新たに得る情報。
    clock_view: {
      label: "窓の外",
      display: "いつもの席の窓から大きな時計が見えていた",
    },
    stone_entrance: {
      label: "建物の記憶",
      display: "石段を上り、重い扉を開けて入る図書館だった",
    },
    card_catalog: {
      label: "本の探し方",
      display: "検索端末ではなく、カード目録をめくって本を探していた",
    },
    old_spine_label: {
      label: "本のラベル",
      display: "本の背には現在とは違う見た目のラベルが付いていた",
    },
    library_as_institution: {
      label: "『この図書館』の意味",
      display: "女性は建物ではなく、大学の図書館そのものを『この図書館』と呼んでいた",
    },
    old_library: {
      label: "読んだ場所",
      display: "本を読んでいたのは、現在の建物になる前の旧図書館",
    },
    old_catalog_route: {
      label: "次の調査",
      display: "旧図書館時代の蔵書記録から当時の資料を特定し、現在の所在へたどる必要がある",
    },
    graduation_memory: {
      label: "最後の記憶",
      display: "卒業が近いころにも、その本を窓際で読んでいた",
    },
    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    {
      id: "q_ex4b_window",
      text: "ねえ、その窓から何が見えてたか覚えてる？",
      requiresAll: [],
      requiresAny: [],
      response:
        "大きな時計が見えました。授業に遅れそうなとき、よく見ていて……。\n……あら？ 今、この窓からは見えないんですね。",
      responseVariants: [
        "窓の向こうに、大きな時計が見えていました。授業の時間を気にしながら、よく眺めていたんです。……でも、不思議ですね。今はどこにも見当たりません。",
      ],
      reveals: ["clock_view"],
    },

    {
      id: "q_ex4b_entrance",
      text: "その図書館に入るところ、覚えてる？ 入口はどんな感じだった？",
      requiresAll: [],
      requiresAny: [],
      response:
        "石の階段を少し上って、大きな扉を開けて入りました。\n……でも、今の入口にはそんな階段、ありませんね。",
      responseVariants: [
        "入口には石の階段があって、上った先に重たい扉がありました。毎日のことだったので、よく覚えています。……あら、今の入口とはずいぶん違いますね。",
      ],
      reveals: ["stone_entrance"],
    },

    {
      id: "q_ex4b_search_method",
      text: "その本って、どうやって見つけてたの？ 検索する端末とか使った？",
      requiresAll: [],
      requiresAny: [],
      response:
        "端末……？ いいえ。引き出しに入ったカードをめくって探していました。題名や番号が書いてあって。",
      responseVariants: [
        "カードです。小さな引き出しがたくさんあって、その中のカードを一枚ずつ見て探していました。",
      ],
      reveals: ["card_catalog"],
    },

    {
      id: "q_ex4b_label",
      text: "本の背中に付いてた番号とかラベル、何か覚えてる？",
      requiresAll: [],
      requiresAny: ["card_catalog"],
      response:
        "白っぽい小さな札が付いていました。今ここに並んでいる本のラベルとは、少し違うように見えますね。",
      responseVariants: [
        "番号の付いた札がありました。形までは思い出せませんが、今の本とは見た目が違います。",
      ],
      reveals: ["old_spine_label"],
    },

    {
      id: "q_ex4b_here",
      text: "そのころ通ってた図書館、今とは別の場所だったりしない？",
      requiresAll: ["clock_view", "stone_entrance"],
      requiresAny: [],
      response:
        "……ああ。そうかもしれません。同じ大学の図書館だから、ずっと同じ場所のように思っていましたけれど……私が通っていたころは、今とは違う建物でした。",
      responseVariants: [
        "……言われてみれば、そうかもしれません。この大学の図書館には違いないのですが、私が通っていたころは、今とは別の建物だった気がします。",
      ],
      reveals: ["library_as_institution", "old_library"],
    },

    {
      id: "q_ex4b_catalog_clue",
      text: "カードで探してたなら、そのころの記録も今とは別に残ってそうじゃない？",
      requiresAll: ["card_catalog"],
      requiresAny: ["old_spine_label", "old_library"],
      response:
        "そうかもしれません。あのカードには題名だけでなく、番号も書いてありました。今の検索とは、ずいぶん違いましたね。",
      responseVariants: [
        "ええ。昔のカードには本を探すための番号がありました。あの記録が残っていれば、手がかりになるでしょうか。",
      ],
      reveals: ["old_catalog_route"],
    },

    {
      id: "q_ex4b_last_time",
      text: "最後にその本を読んだ日のこと、何か覚えてる？",
      requiresAll: [],
      requiresAny: [],
      response:
        "卒業が近いころだったと思います。『もうここで読むのも最後かもしれない』なんて考えながら、窓際でページをめくっていました。",
      responseVariants: [
        "卒業する少し前です。いつもの窓際で、ずいぶん長いこと読んでいました。",
      ],
      reveals: ["graduation_memory"],
    },

    {
      id: "q_ex4b_plausible",
      text: "その大きな時計、何時を指してたかまで覚えてる？",
      requiresAll: [],
      requiresAny: ["clock_view"],
      response:
        "ふふ、そこまでは覚えていません。授業に遅れそうだったことだけは、よく覚えているんですけどね。",
      responseVariants: [
        "時間まではさすがに。時計そのものが見えていた、ということだけです。",
      ],
      reveals: [],
      distractor: "plausible",
    },

    {
      id: "q_ex4b_smalltalk",
      text: "図書館で過ごす時間、けっこう好きだった？",
      requiresAll: [],
      requiresAny: [],
      response:
        "ええ、とても。静かな場所でした。授業が終わっても、すぐには帰らずに少し寄っていくことが多かったんですよ。",
      responseVariants: [
        "好きでしたよ。落ち着く場所で、気がつくと長居してしまっていました。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },

    {
      id: "q_ex4b_smalltalk_followup",
      text: "分かる。お気に入りの場所があると、つい寄っちゃうよね。",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "そうなんです。何十年たっても……あら、私ったら。とにかく、それくらい好きな場所だったんですよ。",
      responseVariants: [
        "ええ。時間がたっても、好きだった場所のことは案外覚えているものですね。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],

  deduction: {
    template:
      "{slot1}。探しているのは{slot2}。{slot3}ので、{slot4}。",
    slots: [
      {
        id: "purpose",
        label: "何をしたい",
        requiresAll: [],
        options: [
          {
            id: "purpose_reread",
            text: "学生時代に何度も読んだ本を、もう一度読みたい",
            score: 1,
          },
          {
            id: "purpose_title",
            text: "昔読んだ本のタイトルだけ確認したい",
            score: 0.5,
          },
          {
            id: "purpose_trip",
            text: "旅行先を決めるために街の写真を見たい",
            score: 0,
          },
          {
            id: "purpose_new",
            text: "世界の街についての新しい本を読みたい",
            score: 0,
          },
        ],
      },

      {
        id: "material",
        label: "探している資料",
        requiresAll: [],
        options: [
          {
            id: "material_blue_city_book",
            text: "世界の街並みを写真で紹介した、濃い青色の大型本",
            score: 1,
          },
          {
            id: "material_travel_photo",
            text: "海外旅行の写真を集めた写真集",
            score: 0.5,
          },
          {
            id: "material_architecture",
            text: "世界の建築様式について解説した専門書",
            score: 0,
          },
          {
            id: "material_guide",
            text: "海辺の街を紹介する旅行ガイド",
            score: 0,
          },
        ],
      },

      {
        id: "place",
        label: "どこで読んだ",
        requiresAll: [],
        options: [
          {
            id: "place_old_library",
            text: "現在の建物になる前の、かつての旧図書館で読んでいた",
            score: 1,
          },
          {
            id: "place_old_somewhere",
            text: "現在とは違う建物だったが、どの建物かは分からない",
            score: 0.5,
          },
          {
            id: "place_current_window",
            text: "現在の図書館の窓際で読んでいた",
            score: 0,
          },
          {
            id: "place_other_library",
            text: "別の大学図書館で読んでいた",
            score: 0,
          },
        ],
      },

      {
        id: "next_step",
        label: "次に確認するもの",
        requiresAll: [],
        options: [
          {
            id: "next_old_catalog",
            text: "旧図書館時代の蔵書記録から、現在の所在をたどる",
            score: 1,
          },
          {
            id: "next_old_records",
            text: "大学に残る昔の図書館関係の記録を確認する",
            score: 0.5,
          },
          {
            id: "next_current_opac",
            text: "現在のOPACを条件を変えてもう一度検索する",
            score: 0,
          },
          {
            id: "next_web_cover",
            text: "インターネットで似た表紙の画像を探す",
            score: 0,
          },
        ],
      },
    ],
  },

  correctSentence:
    "学生時代に何度も読んだ本を、もう一度読みたい。探しているのは世界の街並みを写真で紹介した、濃い青色の大型本。読んだのは現在の建物になる前の、かつての旧図書館なので、旧図書館時代の蔵書記録から当時の資料を特定し、現在の所在を確認する。",

  explanation:
    "女性が覚えていた「この図書館」は、現在の建物そのものではありませんでした。窓から見えた大きな時計、石段と重い扉、カード目録で本を探していたことなどをつなぐと、学生時代に通っていた旧図書館の記憶だと分かります。現在の蔵書検索だけで見つからないなら、旧図書館時代の蔵書記録から当時の資料を特定し、現在どこに引き継がれているかを確認するのが次の手がかりです。",

  advice:
    "記憶から資料を探すときは、本そのものの特徴だけでなく、「どこで」「どのように探し」「何が見えていたか」といった周辺の情景も手がかりになります。違和感のある前提をいったん問い直すことで、別の調査経路が見えてくることがあります。",
};

export const EXTRA_CASE_04_PHASES = Object.freeze({
  librarian: EXTRA_CASE_04_LIBRARIAN_PHASE,
  detective: EXTRA_CASE_04_DETECTIVE_PHASE,
});

const EXTRA_CASE_04_UNLOCK_REQUIREMENTS = Object.freeze(["extra03"]);

const EXTRA_CASE_04_DETECTIVE_SESSION = Object.freeze({
  ...EXTRA_CASE_04_DETECTIVE_PHASE,
  id: "extra04",
  number: "EX4",
});

export const EXTRA_CASE_04 = Object.freeze({
  ...EXTRA_CASE_04_LIBRARIAN_PHASE,
  id: "extra04",
  number: "EX4",
  unlockAfter: EXTRA_CASE_04_UNLOCK_REQUIREMENTS,
  revealAfter: EXTRA_CASE_04_UNLOCK_REQUIREMENTS,
  unlockHint: "EX CASE 3をクリア",
  phaseTransition: Object.freeze({
    nextCaseData: EXTRA_CASE_04_DETECTIVE_SESSION,
    delayBeforeNextPhaseMs: 1600,
    beforeSwitchMessage: Object.freeze({
      speaker: "librarian",
      label: "司書さん",
      text: "本の特徴はかなり整理できました。ただ……これだけ聞いても、まだ何かがうまくつながっていない気がしますね。",
    }),
    carryFactIds: Object.freeze([
      "purpose_reread",
      "content_world_cities",
      "format_large_blue",
    ]),
    openingConversation: Object.freeze([
      Object.freeze({
        speaker: "librarian",
        label: "探偵さん",
        text: "なんか、うまく噛み合ってない感じがするね",
        playerAvatar:
          "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
        messageSound: "message3",
      }),
      Object.freeze({
        speaker: "patron",
        label: "女性",
        text: "あら……あなた、探偵さんなんですか？",
      }),
      Object.freeze({
        speaker: "librarian",
        label: "探偵さん",
        text: "一応ね",
        playerAvatar:
          "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
        messageSound: "message3",
      }),
      Object.freeze({
        speaker: "patron",
        label: "女性",
        text: "でしたら、少し手伝っていただけませんか。昔のことが、どうも曖昧で……",
      }),
      Object.freeze({
        speaker: "librarian",
        label: "探偵さん",
        text: "もちろん。じゃあ今度は、昔のことを聞かせて",
        playerAvatar:
          "./assets/characters/extra-detective-icon.webp?v=20260811-white1",
        messageSound: "message3",
      }),
    ]),
  }),
});
