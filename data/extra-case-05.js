// EX CASE 05 「まだ書かれていない本」
// 前半は探偵さん、後半は司書さん。
// 前半の採点結果にかかわらず、物語上必要な「青年が未来から来た」事実は
// フェーズ間イベントで確定し、後半へ進む想定。

const MAN_ASSETS = Object.freeze({
  portrait: "./assets/characters/extra-ex5-portrait.webp",
  reactionHigh: "./assets/characters/extra-ex5-reaction-high-portrait.webp",
  reactionMedium: "./assets/characters/extra-ex5-reaction-middle-portrait.webp",
  reactionLow: "./assets/characters/extra-ex5-reaction-low-portrait.webp",
});

const PLAY_YEAR = new Date().getFullYear();
const YEARS_SINCE_2024 = PLAY_YEAR - 2024;

export const EXTRA_CASE_05_DETECTIVE_PHASE = {
  id: "extra05_detective",
  number: "EX 05",
  title: "まだ書かれていない本",
  cardOpening:
    "さっきまで検索できていたはずの本が、どこを探しても出てこないんです。",
  category: "EXTRA・消えた本",
  difficulty: "MYSTERY 05",
  maxQuestions: 6,

  phaseMeta: {
    parentCaseId: "extra05",
    phase: 1,
    player: "detective",
    bgmKey: "detective-theme",
    transitionRegardlessOfScore: true,
  },

  opening:
    "探偵さんですよね。消えた本を探してほしいんです。書名も著者も分かっています。それなのに、どこを検索しても一件も出てこない。まるで、最初から存在していなかったみたいに。",

  presentation: {
    playerLabel: "探偵さん",
    respondentLabel: "青年",
    respondentRole: "VISITOR",
    respondentInfoLabel: "青年から聞いた情報",
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

    startLabel: "消えた本を調べる",
    logTitle: "MYSTERY LOG",
    logSubtitle: "消えた本の手がかり",
    deductionLogTitle: "消えた本の手がかり",
    deductionPrompt:
      "青年の話に含まれる時代のずれを整理して、本が見つからない理由を考えます。",
    limitStatus:
      "本の情報はそろっています。それでも見つからない理由は、本そのものではないのかもしれません。",
    limitPrompt:
      "集まった手がかりから、「消えた本」の正体をまとめてみましょう。",
    deduceButton: "わかった！ 回答をまとめる",
    limitButton: "回答をまとめる",
    deductionEyebrow: "MYSTERY SOLUTION",
    deductionTitle: "何が起きているのか、4つの文節で整理しましょう",
    deductionLead:
      "本が見つからない理由と、青年が置かれている状況を選んでください。",
    answerButton: "この回答で答える",
    completionEyebrow: "MYSTERY RESULT",
    resultHeadlineHigh:
      "お見事！ 「消えた本」の謎は解けました。",
    resultHeadlineMedium:
      "かなり近づいています。青年の時間感覚と現在のずれに注目してみましょう。",
    resultHeadlineLow:
      "まだ謎は残っています。ただ、青年の話には時代の合わない点がいくつかあります。",
    reactionLabelEnglish: "VISITOR RESPONSE",
    reactionLabelJapanese: "青年の反応",
    answerLabelEnglish: "MYSTERY ANSWER",
    answerLabelJapanese: "ここまでの推理",
    adviceLabel: "DETECTIVE NOTE",
  },

  patron: {
    name: "青年",
    descriptor:
      "存在していたはずの本が記録から消えたと思い、探偵さんを頼った青年",
    initials: "EX5",
    accent: "#7892aa",
    image: MAN_ASSETS.portrait,
    messageSound: "message1",

    timeLimitLine:
      "変なんです。本のことはかなり正確に覚えているはずなのに……何か、僕の方がおかしいんでしょうか。",

    reactions: {
      high: {
        image: MAN_ASSETS.reactionHigh,
        line:
          "……そういうことだったんですね。だから、本の記録がどこにもない……。",
      },
      medium: {
        image: MAN_ASSETS.reactionMedium,
        line:
          "確かに、僕が覚えている年代と今の状況が合っていませんね。……まさか、時間そのものがずれているんでしょうか。",
      },
      low: {
        image: MAN_ASSETS.reactionLow,
        line:
          "本の情報は間違っていないはずなんです。でも、2087年という年を皆さんが未来のことみたいに受け取るのが……どうにも変ですね。",
      },
    },
  },

  facts: {
    bibliographic_details: {
      label: "書誌情報",
      display: "青年は探している本の書名と著者名を正確に覚えている",
    },
    publication_2087: {
      label: "刊行年",
      display: "探している本は2087年刊行だと青年は記憶している",
    },
    old_book_to_him: {
      label: "青年の認識",
      display: "青年にとって2087年刊行の本は『かなり古い本』である",
    },
    future_library_use: {
      label: "利用経験",
      display: "青年は大学の図書館で紙の復刻版を読んだことがある",
    },
    read_student_days: {
      label: "最後に読んだ時期",
      display: "青年は学生時代、十年ほど前にもその本を読んでいた",
    },
    arrival_terminal: {
      label: "直前の出来事",
      display: "図書館の閲覧端末を操作中、画面が白くなり気づくと現在の図書館にいた",
    },
    thinks_year_2134: {
      label: "現在年の認識",
      display: "青年は現在を2134年だと思っている",
    },
    time_mismatch: {
      label: "時間のずれ",
      display: `青年の時間認識と${PLAY_YEAR}年の現在が一致していない`,
    },
    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    {
      id: "q_ex5a_book",
      text: "その本のタイトルや著者は、ちゃんと覚えてる？",
      requiresAll: [],
      requiresAny: [],
      response:
        "はい。『残された記録』という本です。著者名も覚えています。だから検索条件を間違えているとは思えないんです。",
      responseVariants: [
        "書名も著者名も分かっています。何度も読んだ本なので、そこは間違いありません。",
      ],
      reveals: ["bibliographic_details"],
    },

    {
      id: "q_ex5a_year",
      text: "その本って、いつ出た本なの？",
      requiresAll: [],
      requiresAny: [],
      response:
        "2087年です。かなり古い本なので、記録から抜けてしまったのかとも思ったんですが……。",
      responseVariants: [
        "2087年刊です。古い本ではありますけど、僕がいたところでは、さっきまで普通に検索できていたんです。",
      ],
      reveals: ["publication_2087", "old_book_to_him"],
    },

    {
      id: "q_ex5a_where_read",
      text: "その本、どこで読んだことがあるの？",
      requiresAll: [],
      requiresAny: [],
      response:
        "大学の図書館です。紙の復刻版があって。紙の本を直接読む機会はあまりないので、よく覚えています。",
      responseVariants: [
        "大学の図書館で読みました。普段は画面で読むことが多いので、紙の復刻版はちょっと特別でした。",
      ],
      reveals: ["future_library_use"],
    },

    {
      id: "q_ex5a_last_read",
      text: "最後にその本を読んだのって、いつごろ？",
      requiresAll: [],
      requiresAny: ["publication_2087", "future_library_use"],
      response:
        "学生だったころですから、十年くらい前ですね。そのころには、もう古い本として扱われていました。",
      responseVariants: [
        "十年ほど前です。学生時代によく読んでいました。出版されたのは、それよりずっと前ですね。",
      ],
      reveals: ["read_student_days"],
    },

    {
      id: "q_ex5a_before_arrival",
      text: "ここに来る直前は、何をしてた？",
      requiresAll: [],
      requiresAny: [],
      response:
        "図書館で、古い資料を読むための閲覧端末を使っていました。その本の記録を開いたところで画面が急に真っ白になって……気づいたら、ここにいたんです。",
      responseVariants: [
        "閲覧端末でその本を探していました。画面が白く光ったと思ったら、次に見えたのがこの図書館でした。",
      ],
      reveals: ["arrival_terminal"],
    },

    {
      id: "q_ex5a_current_year",
      text: "念のため聞くけど、今って何年だと思ってる？",
      requiresAll: ["publication_2087", "arrival_terminal"],
      requiresAny: [],
      response:
        "2134年ですよね？ ……あれ、その顔。違うんですか？",
      responseVariants: [
        "2134年……のはずです。まさか、違う年だと言うんですか？",
      ],
      reveals: ["thinks_year_2134", "time_mismatch"],
    },

    {
      id: "q_ex5a_plausible",
      text: "検索システムの障害って可能性はないの？",
      requiresAll: [],
      requiresAny: [],
      response:
        "最初はそう思いました。でも、検索画面だけじゃなく、館内の設備まで昨日とはずいぶん違って見えるんです。",
      responseVariants: [
        "それも考えました。ただ、端末だけの問題にしては、周りの景色まで変わりすぎています。",
      ],
      reveals: [],
      distractor: "plausible",
    },

    {
      id: "q_ex5a_smalltalk",
      text: "本が一冊だけ、記録ごと消えたって……なんか事件っぽいね。",
      requiresAll: [],
      requiresAny: [],
      response:
        "僕としては、普通に読めればそれでよかったんですけど……。でも、確かに変ですよね。書名も著者も分かっているのに、何も出てこないなんて。",
      responseVariants: [
        "事件と言われると少し大げさな気もしますけど……。ここまで何も記録が出てこないと、僕も何が起きているのか気になります。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },

    {
      id: "q_ex5a_smalltalk_followup",
      text: "こういう“説明のつかないこと”、ちょっと気になっちゃうんだよね。",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "探偵さんって、本当にそういうのが好きなんですね。……頼もしい、ということにしておきます。",
      responseVariants: [
        "なるほど、そういうところが探偵さんなんですね。僕には困りごとですけど、少し心強くなってきました。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],

  deduction: {
    template:
      "{slot1}。青年は{slot2}。探している本は{slot3}ため、{slot4}。",
    slots: [
      {
        id: "disappearance",
        label: "本に起きたこと",
        requiresAll: [],
        options: [
          {
            id: "book_not_deleted",
            text: "本が記録から消されたわけではない",
            score: 1,
          },
          {
            id: "book_system_issue",
            text: "検索システムの不具合で一時的に表示されていない",
            score: 0.5,
          },
          {
            id: "book_withdrawn",
            text: "図書館から除籍されて記録も削除された",
            score: 0,
          },
          {
            id: "book_misremembered",
            text: "青年が別の本と勘違いしている",
            score: 0,
          },
        ],
      },

      {
        id: "person_time",
        label: "青年の状況",
        requiresAll: [],
        options: [
          {
            id: "person_from_2134",
            text: "2134年から現在へ迷い込んでいる",
            score: 1,
          },
          {
            id: "person_time_mismatch",
            text: "現在の年代を取り違えている",
            score: 0.5,
          },
          {
            id: "person_confused",
            text: "図書館を別の施設と勘違いしている",
            score: 0,
          },
          {
            id: "person_roleplay",
            text: "未来の設定で話しているだけ",
            score: 0,
          },
        ],
      },

      {
        id: "book_time",
        label: "本の時代",
        requiresAll: [],
        options: [
          {
            id: "book_published_2087",
            text: "2087年に刊行される本である",
            score: 1,
          },
          {
            id: "book_old_unknown",
            text: "かなり古い時代の本である",
            score: 0.5,
          },
          {
            id: "book_current",
            text: `${PLAY_YEAR}年ごろに刊行された本である`,
            score: 0,
          },
          {
            id: "book_unpublished_manuscript",
            text: "刊行されなかった未刊行原稿である",
            score: 0,
          },
        ],
      },

      {
        id: "reason_absent",
        label: "見つからない理由",
        requiresAll: [],
        options: [
          {
            id: "not_yet_exists",
            text: "現在には、まだ存在していない",
            score: 1,
          },
          {
            id: "not_digitized",
            text: "まだ電子化されていない",
            score: 0.5,
          },
          {
            id: "lost_record",
            text: "書誌記録だけが失われている",
            score: 0,
          },
          {
            id: "different_library",
            text: "別の図書館にしか所蔵されていない",
            score: 0,
          },
        ],
      },
    ],
  },

  correctSentence:
    `本が記録から消されたわけではない。青年は2134年から${PLAY_YEAR}年へ迷い込んでいる。探している本は2087年に刊行される本であるため、${PLAY_YEAR}年の現在にはまだ存在していない。`,

  explanation:
    `青年が覚えている書誌情報が正しいのに本が見つからないのは、本が消えたからではありません。2087年を『かなり古い本』と表現し、現在を2134年だと認識していること、閲覧端末の異常のあとに周囲の様子まで変わったことをつなぐと、青年自身が本の出版前である${PLAY_YEAR}年へ移動していると考えられます。`,

  advice:
    "一見すると対象そのものに問題があるようでも、周辺の時期・場所・前提を整理すると、別の原因が見えてくることがあります。違和感のある情報同士をつなぐのは、探偵さんの得意分野です。",
};


export const EXTRA_CASE_05_LIBRARIAN_PHASE = {
  id: "extra05_librarian",
  number: "EX 05",
  title: "まだ書かれていない本",
  cardOpening:
    "その本そのものではなく、そこで確かめたかったことについて聞かせてください。",
  category: "EXTRA・ほんとの質問",
  difficulty: "REFERENCE 05",
  maxQuestions: 6,

  phaseMeta: {
    parentCaseId: "extra05",
    phase: 2,
    player: "librarian",
    bgmKey: "default",
    finalPhase: true,
  },

  opening:
    "その本がまだ存在しないことは分かりました。でも、本がないからといって、知りたかったことまで分からないとは限りません。その本で、何を確かめたかったのか教えていただけますか？",

  presentation: {
    playerLabel: "司書さん",
    respondentLabel: "青年",
    respondentRole: "VISITOR",
    respondentInfoLabel: "青年から聞いた情報",
    resultPlayerName: "司書さん",

    startLabel: "続きを聞く",
    logTitle: "INTERVIEW LOG",
    logSubtitle: "ほんとの質問",
    deductionLogTitle: "聞き取りの記録",
    deductionPrompt:
      "未来の本そのものではなく、青年が知りたかったことと、この時代に残っている記録を整理します。",
    limitStatus:
      "青年が知りたかったことと、それを確かめるための今の資料が見えてきました。",
    limitPrompt:
      "ここまでの情報から、青年の相談への答えをまとめましょう。",
    deduceButton: "回答をまとめる",
    limitButton: "回答をまとめる",
    deductionEyebrow: "REFERENCE INTERVIEW",
    deductionTitle: "相談への答えを、4つの文節で整理しましょう",
    deductionLead:
      "目的・知りたい情報・今の時代にある記録・調べ方を選んでください。",
    answerButton: "この回答でまとめる",
    completionEyebrow: "INTERVIEW RESULT",
    resultHeadlineHigh:
      "お見事！ 二人の聞き取りがつながって、本ではなく「知りたかったこと」にたどり着きました。",
    resultHeadlineMedium:
      "かなり近づいています。2087年の本ではなく、その本がもとにした今の記録に注目してみましょう。",
    resultHeadlineLow:
      "青年がその本で何を確かめたかったのか、もう一度整理してみましょう。",
    reactionLabelEnglish: "VISITOR RESPONSE",
    reactionLabelJapanese: "青年の反応",
    answerLabelEnglish: "REFERENCE ANSWER",
    answerLabelJapanese: "相談への回答",
    adviceLabel: "LIBRARIAN NOTE",
  },

  patron: {
    name: "青年",
    descriptor:
      "2087年の本で、先祖が大学に寄贈した研究資料の内容を確かめようとしていた青年",
    initials: "EX5",
    accent: "#7892aa",
    image: MAN_ASSETS.portrait,
    messageSound: "message1",

    timeLimitLine:
      "こうして話していると、僕が知りたかったことが少し整理できてきた気がします。",

    reactions: {
      high: {
        image: MAN_ASSETS.reactionHigh,
        line:
          "……これなら確認できますね。先祖が寄贈した資料の一覧を、2087年の本ではなく、今ここにある記録から直接たどれるなんて。ありがとうございました。",
      },
      medium: {
        image: MAN_ASSETS.reactionMedium,
        line:
          "そうか。2087年の本はまだなくても、その本がもとにした寄贈時の記録は、今なら残っているかもしれないんですね。",
      },
      low: {
        image: MAN_ASSETS.reactionLow,
        line:
          "僕が知りたいのは、2087年の本そのものではないんです。先祖が大学に寄贈した研究資料の中に、何が含まれていたのかを確かめたいんです。",
      },
    },
  },

  facts: {
    purpose_contents: {
      label: "本当に知りたいこと",
      display: "2087年の本を読むこと自体ではなく、先祖が大学に寄贈した研究資料の内容を知りたい",
    },
    ancestor_period: {
      label: "寄贈された時代",
      display: `先祖が研究資料を寄贈したのは2024年で、${PLAY_YEAR}年の今からわずか${YEARS_SINCE_2024}年前である`,
    },
    wanted_contents: {
      label: "知りたい情報",
      display: "寄贈された研究資料の中に、どのような資料が含まれていたのかを知りたい",
    },
    future_book_summary: {
      label: "2087年の本",
      display: "2087年の本には、先祖が寄贈した資料群の構成や内容がまとめられていた",
    },
    cited_sources: {
      label: "未来の本の出典",
      display: "2087年の本は、寄贈を受け入れた当時の受入記録や資料目録をもとに書かれていた",
    },
    source_loss_future: {
      label: "2134年の状況",
      display: "2134年には寄贈当時の受入記録や目録が残っておらず、2087年の本を頼る必要があった",
    },
    records_exist_now: {
      label: "今の時代の手がかり",
      display: `${PLAY_YEAR}年は寄贈からわずか${YEARS_SINCE_2024}年後で、2087年の本のもとになった受入記録や目録が今まさに残っている可能性がある`,
    },
    book_not_goal: {
      label: "資料条件",
      display: "同じ内容を確認できるなら、2087年の本そのものを読む必要はない",
    },
    smalltalk_followup: {
      label: "",
      display: "",
    },
  },

  questions: [
    {
      id: "q_ex5b_why",
      text: "その本で、何を知りたかったのでしょうか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "先祖がこの大学に寄贈した研究資料の中に、何が含まれていたのかを知りたかったんです。2087年に、その寄贈資料について詳しくまとめた本が出ていて、僕はそれを調べようとしていました。",
      responseVariants: [
        "先祖がこの大学に寄贈した研究資料の内容です。2087年に、その寄贈資料を後からまとめた本が出ていて、それを見れば何が残されたのか分かると思っていました。",
      ],
      reveals: ["purpose_contents", "wanted_contents", "future_book_summary"],
    },

    {
      id: "q_ex5b_when",
      text: "その資料が寄贈されたのは、いつごろか分かりますか？",
      requiresAll: [],
      requiresAny: ["purpose_contents"],
      response:
        `2024年です。僕の時代から見ると百年以上前ですが……そうか。今から、まだ${YEARS_SINCE_2024}年しかたっていないんですね。`,
      responseVariants: [
        `2024年だったはずです。僕にはずっと昔の出来事でしたけど、ここではほんの${YEARS_SINCE_2024}年前なんですね。`,
      ],
      reveals: ["ancestor_period"],
    },

    {
      id: "q_ex5b_sources",
      text: "2087年の本には、その情報を何から調べたか載っていましたか？",
      requiresAll: [],
      requiresAny: ["purpose_contents", "future_book_summary"],
      response:
        "はい。寄贈を受け入れたときの記録と、資料の目録が挙げられていました。2087年の本は、それをもとに寄贈資料の内容をまとめていたんです。",
      responseVariants: [
        "出典として、当時の受入記録と資料目録が載っていました。そこから、どんな資料が寄贈されたのかをまとめた本だったはずです。",
      ],
      reveals: ["cited_sources"],
    },

    {
      id: "q_ex5b_future_loss",
      text: "あなたの時代では、その受入記録や目録は確認できなかったんですか？",
      requiresAll: [],
      requiresAny: ["cited_sources"],
      response:
        "残っていなかったんです。だから僕は、それらをもとに2087年に書かれた本を読んで、寄贈された資料の内容を確かめようとしていました。",
      responseVariants: [
        "2134年には元の受入記録や目録はもう失われていました。なので、後からまとめられた2087年の本を頼るしかなかったんです。",
      ],
      reveals: ["source_loss_future"],
    },

    {
      id: "q_ex5b_now",
      text: "その受入記録や目録が作られたのも、2024年ごろということですね？",
      requiresAll: ["ancestor_period", "cited_sources"],
      requiresAny: [],
      response:
        "……あ。そうか。2087年の本はまだなくても、その本がもとにした受入記録や目録なら、今ここに残っているかもしれないんですね。",
      responseVariants: [
        `そうか。僕の時代では失われていた記録が、ここではほんの${YEARS_SINCE_2024}年前の記録なんですね。なら、元の記録から直接確かめられるかもしれません。`,
      ],
      reveals: ["records_exist_now"],
    },

    {
      id: "q_ex5b_other_source",
      text: "2087年の本でなくても、同じことが分かればよいのでしょうか？",
      requiresAll: ["purpose_contents", "cited_sources"],
      requiresAny: [],
      response:
        "もちろんです。僕が知りたいのは本そのものではなくて、先祖がどんな研究資料を大学に残したのかです。",
      responseVariants: [
        "はい。寄贈された資料の内容が確認できるなら、2087年の本である必要はありません。",
      ],
      reveals: ["book_not_goal"],
    },

    {
      id: "q_ex5b_plausible",
      text: "2087年の本と同じ内容を、今のウェブ検索だけで探すことはできそうですか？",
      requiresAll: [],
      requiresAny: ["purpose_contents"],
      response:
        "どうでしょう。僕が知りたいのは寄贈された資料の具体的な内容なので、一般のウェブ情報より、図書館側の受入記録や目録の方が確かそうです。",
      responseVariants: [
        "ウェブに出ている情報だけでは難しいと思います。寄贈時に図書館が作った記録の方が、知りたいことに直接つながりそうです。",
      ],
      reveals: [],
      distractor: "plausible",
    },

    {
      id: "q_ex5b_smalltalk",
      text: "あの……これは相談とは関係ないんですが、未来の図書館って、どんな感じなんですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "今よりずっと静かですよ。紙の本は少なくなりましたけど、なくなってはいません。古い資料を読むときは、今でも図書館へ行きます。",
      responseVariants: [
        "ずいぶん変わっています。でも、分からないことがあって図書館へ行くところは、たぶん今とあまり変わりません。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },

    {
      id: "q_ex5b_smalltalk_followup",
      text: "未来でも図書館に行くんですね。……よかった。あ、すみません、なんだかちょっと嬉しくて。",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "ええ。技術が変わっても、知りたいことがなくなるわけではありませんから。",
      responseVariants: [
        "そうみたいです。未来でも、分からないことがあると誰かに聞いたり、資料を探したりしていますよ。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],

  deduction: {
  template:
    "知りたいのは{slot1}。2087年の本は{slot2}で、{slot3}をもとに書かれていた。だから今は、{slot4}。",
  slots: [
    {
      id: "goal",
      label: "何を確かめたい",
      requiresAll: [],
      options: [
        {
          id: "goal_contents",
          text: "先祖が寄贈した研究資料に何が含まれていたのか",
          score: 1,
        },
        {
          id: "goal_research",
          text: "先祖がどのような研究をしていたのか",
          score: 0.5,
        },
        {
          id: "goal_book",
          text: "2087年の本に何が書かれていたのか",
          score: 0,
        },
        {
          id: "goal_time_travel",
          text: "自分がなぜ現在に来たのか",
          score: 0,
        },
      ],
    },

    {
      id: "future_book",
      label: "2087年の本は何だった",
      requiresAll: [],
      options: [
        {
          id: "book_summary",
          text: "先祖が寄贈した資料群について後世にまとめた本",
          score: 1,
        },
        {
          id: "book_library_history",
          text: "大学図書館全体の歴史をまとめた本",
          score: 0.5,
        },
        {
          id: "book_catalog",
          text: `${PLAY_YEAR}年当時の図書館の蔵書目録`,
          score: 0,
        },
        {
          id: "book_personal_record",
          text: "先祖自身が書き残した研究日誌",
          score: 0,
        },
      ],
    },

    {
      id: "source",
      label: "何をもとに書かれていた",
      requiresAll: [],
      options: [
        {
          id: "source_donation_records",
          text: "寄贈時に作られた受入記録や資料目録",
          score: 1,
        },
        {
          id: "source_later_research",
          text: "後世の研究者による解説や推測",
          score: 0.5,
        },
        {
          id: "source_web",
          text: "当時の一般的なウェブ検索結果",
          score: 0,
        },
        {
          id: "source_memory",
          text: "寄贈した本人の記憶だけ",
          score: 0,
        },
      ],
    },

    {
      id: "method",
      label: "今どうすれば分かる",
      requiresAll: [],
      options: [
        {
          id: "method_check_original_records",
          text: "現在の受入記録や資料目録を確認する",
          score: 1,
        },
        {
          id: "method_search_current_web",
          text: "現在のウェブ検索だけで同じ情報を探す",
          score: 0.5,
        },
        {
          id: "method_wait_future_book",
          text: "2087年に本が出版されるまで待つ",
          score: 0,
        },
        {
          id: "method_recreate_future_book",
          text: "2087年の本の内容を推測して再現する",
          score: 0,
        },
      ],
    },
  ],
},

  correctSentence:
    "2087年の本を読むこと自体ではなく、先祖が大学に寄贈した研究資料の内容を知りたい。知りたいのは、寄贈された研究資料の中にどのような資料が含まれていたのか。その手がかりは、寄贈された2024年に作られた今の図書館の受入記録や資料目録に残っている可能性があるので、2087年の本を待たず、2024年の寄贈時に作られ、今まさに残っている受入記録や目録を確認する。",

  explanation:
    `青年が最初に求めていたのは2087年刊行の本でしたが、その本を読むこと自体が目的ではありませんでした。知りたかったのは、先祖が2024年にこの大学へ寄贈した研究資料の中に、何が含まれていたのかということです。2134年には寄贈時の受入記録や目録が失われていたため、青年はそれらをもとに2087年に書かれた本を頼ろうとしていました。しかし現在は${PLAY_YEAR}年で、寄贈からまだ${YEARS_SINCE_2024}年しかたっていません。未来の本はまだなくても、その本のもとになった受入記録や資料目録を今の図書館で直接確認できる可能性があります。`,

  advice:
    "利用者が特定の資料名を挙げていても、その資料を入手すること自体が目的とは限りません。資料が利用できないときこそ、『その資料で何を知りたいのか』を確認すると、同じ情報を持つ別の資料や、より元に近い記録から答えに近づけることがあります。",
};

export const EXTRA_CASE_05_PHASES = Object.freeze({
  detective: EXTRA_CASE_05_DETECTIVE_PHASE,
  librarian: EXTRA_CASE_05_LIBRARIAN_PHASE,
});

const EXTRA_CASE_05_UNLOCK_REQUIREMENTS = Object.freeze(["extra04"]);

const EXTRA_CASE_05_LIBRARIAN_SESSION = Object.freeze({
  ...EXTRA_CASE_05_LIBRARIAN_PHASE,
  id: "extra05",
  number: "EX5",
});

export const EXTRA_CASE_05 = Object.freeze({
  ...EXTRA_CASE_05_DETECTIVE_PHASE,
  id: "extra05",
  number: "EX5",
  unlockAfter: EXTRA_CASE_05_UNLOCK_REQUIREMENTS,
  revealAfter: EXTRA_CASE_05_UNLOCK_REQUIREMENTS,
  unlockHint: "EX CASE 4をクリア",

  // Codex側で実装する想定の遷移メタデータ。
  // 前半の得点にかかわらず、結果画面から必ず後半へ進める。
  phaseTransition: Object.freeze({
    trigger: "after-result",
    continueButtonLabel: "まだ依頼は終わっていない",
    nextCaseData: EXTRA_CASE_05_LIBRARIAN_SESSION,
    carryFactIds: Object.freeze([]),

    // 前半の採点結果に応じて、探偵さんの推理到達度だけを変える。
    // その後 commonMessages で「プレイ時の年である」ことを物語上確定させる。
    resultMessagesByBand: Object.freeze({
      high: Object.freeze([
        Object.freeze({
          speaker: "detective",
          label: "探偵さん",
          text: "分かった。本が消えたんじゃない。君の方が、その本がまだ書かれていない時代に来ちゃったんだ。",
        }),
      ]),
      medium: Object.freeze([
        Object.freeze({
          speaker: "detective",
          label: "探偵さん",
          text: "全部はまだつながってないけど、君が覚えてる時間と、今の時間が合ってないのは確かだと思う。",
        }),
      ]),
      low: Object.freeze([
        Object.freeze({
          speaker: "detective",
          label: "探偵さん",
          text: "うーん……本が見つからない理由はまだ分からない。でも、2087年を『古い本』って言うのは、やっぱり変だよね。",
        }),
      ]),
    }),

    commonMessages: Object.freeze([
      Object.freeze({
        speaker: "patron",
        label: "青年",
        text: `……確認してもいいですか。今は、本当に${PLAY_YEAR}年なんですね。`,
      }),
      Object.freeze({
        speaker: "patron",
        label: "青年",
        text: "そうか……。では、あの本はまだない。あのことを確かめる方法も、ないんですね……。",
      }),
      Object.freeze({
        speaker: "detective",
        label: "探偵さん",
        text: "あのこと？",
      }),
      Object.freeze({
        speaker: "librarian",
        label: "司書さん",
        text: "少し待ってください。その本で、何を確かめたかったのでしょうか？",
      }),
      Object.freeze({
        speaker: "patron",
        label: "青年",
        text: "……それも、聞いていただけますか。",
      }),
    ]),

    nextPhaseOpeningSuppressed: true,
  }),
});
