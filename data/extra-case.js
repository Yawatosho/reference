import { EXTRA_CASE_02 } from "./extra-case-02.js?v=20260816-fiction1";
import { EXTRA_CASE_03 } from "./extra-case-03.js?v=20260816-fiction1";

const EXTRA_UNLOCK_REQUIREMENTS = Object.freeze(["case10"]);

export function createExtraCases(maxQuestions) {
  return [
    {
      id: "extra01",
      number: "EX",
      title: "開館前の小さな謎",
      cardOpening:
        "開館前、絵本コーナーのものが別の場所へ移っていることがあるんです。",
      category: "EXTRA・日常の謎",
      difficulty: "MYSTERY 01",
      maxQuestions,
      unlockAfter: EXTRA_UNLOCK_REQUIREMENTS,
      revealAfter: EXTRA_UNLOCK_REQUIREMENTS,
      unlockHint: "CASE 10をクリア",
      opening:
        "最近、開館前に絵本コーナーのものが別の場所へ移っていることがあるんです。小さなことなんですが、理由が気になって……。探偵さん、いっしょに考えてもらえますか？",
      presentation: {
        playerLabel: "探偵さん",
        respondentLabel: "司書さん",
        respondentRole: "LIBRARIAN",
        respondentInfoLabel: "司書さんの情報",
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
        startLabel: "謎の調査",
        logTitle: "MYSTERY LOG",
        logSubtitle: "推理の記録",
        deductionLogTitle: "推理の記録",
        deductionPrompt:
          "会話の記録をもとに、日常の謎の真相を整理します。",
        limitStatus: "司書さんは、そろそろカウンターへ戻るようです。",
        limitPrompt: "最後の手がかりを確認できましたか？",
        deduceButton: "わかった！ 真相をまとめる",
        limitButton: "真相をまとめる",
        deductionEyebrow: "MYSTERY SOLUTION",
        deductionTitle: "日常の謎を、4つの文節で解き明かしましょう",
        deductionLead:
          "会話の記録を振り返り、いつ・何が起きたか・誰が・なぜしたかを整理してください。",
        answerButton: "この推理で答える",
        completionEyebrow: "MYSTERY SOLVED",
        resultHeadlineHigh: "お見事！ 小さな謎が、きれいに解けました。",
        resultHeadlineMedium: "いい線です！ 真相がかなり見えてきました。",
        resultHeadlineLow: "もうひと息！ 会話の手がかりを見直してみましょう。",
        reactionLabelEnglish: "LIBRARIAN RESPONSE",
        reactionLabelJapanese: "司書さんの反応",
        answerLabelEnglish: "MYSTERY ANSWER",
        answerLabelJapanese: "日常の謎の真相",
        adviceLabel: "DETECTIVE NOTE",
      },
      patron: {
        name: "図書館の司書さん",
        descriptor: "開館前の小さな変化が気になる、優しい司書",
        initials: "EX",
        accent: "#758ea2",
        image: "./assets/characters/extra-librarian-portrait.webp",
        messageSound: "message2",
        timeLimitLine:
          "あ、そろそろカウンターに戻る時間です。ここまでの手がかりで、真相を聞かせてもらえますか？",
        reactions: {
          high: {
            image:
              "./assets/characters/extra-librarian-reaction-high-portrait.webp",
            line: "すごいです！ 小さな謎がきれいに解けて、すっきりしました。ありがとうございます。",
          },
          medium: {
            image:
              "./assets/characters/extra-librarian-reaction-medium-portrait.webp",
            line: "なるほど、かなり真相に近そうです。いっしょに考えてくださって、ありがとうございます。",
          },
          low: {
            image:
              "./assets/characters/extra-librarian-reaction-low-portrait.webp",
            line: "考えてくださって、ありがとうございます。もう少し当日の様子を思い出してみますね。",
          },
        },
      },
      facts: {
        timing: { label: "起きた時", display: "雨の日の翌朝" },
        occurrence: {
          label: "移っていたもの",
          display: "星形クッションが窓際へ移っていた",
        },
        access_clue: {
          label: "開館前に入れた人",
          display: "開館前に作業する人が複数いた",
        },
        context: {
          label: "前日の出来事",
          display: "前日は雨で、絵本コーナーが使われていた",
        },
        actor: { label: "関わった人", display: "開館前の清掃スタッフ" },
        condition: { label: "物の様子", display: "クッションが少し湿っていた" },
        reason: { label: "移した理由", display: "日なたで乾かすため" },
        pattern: { label: "繰り返し", display: "毎日ではなく、雨の日の翌朝だけ" },
        smalltalk_followup: { label: "", display: "" },
      },
      questions: [
        {
          id: "q_extra_when",
          text: "その変化に気づいたのは、どんな朝だった？",
          requiresAll: [],
          requiresAny: [],
          response: "雨の日の翌朝です。開館準備を始めた時に気づきました。",
          responseVariants: [
            "前日に雨が降った、その次の朝でした。いつもの見回り中に見つけたんです。",
          ],
          reveals: ["timing"],
        },
        {
          id: "q_extra_object",
          text: "何が、どこへ移ってたの？",
          requiresAll: [],
          requiresAny: [],
          response:
            "絵本コーナーの星形クッションが、いつもの場所ではなく窓際に置かれていました。",
          responseVariants: [
            "星の形のクッションです。朝見たら、絵本コーナーから窓のそばへ移っていました。",
          ],
          reveals: ["occurrence"],
        },
        {
          id: "q_extra_access",
          text: "開館前に、そこへ入れた人はどのくらいいたの？",
          requiresAll: [],
          requiresAny: [],
          response:
            "司書のほかに、朝の清掃スタッフも入っていました。入れた人は一人ではありません。",
          responseVariants: [
            "その朝は、司書と清掃スタッフが開館前に作業していました。これだけでは誰か決められませんね。",
          ],
          reveals: ["access_clue"],
        },
        {
          id: "q_extra_previous",
          text: "その前の日、絵本コーナーでは何かあった？",
          requiresAll: [],
          requiresAny: ["timing", "occurrence"],
          response:
            "前日は雨で、絵本コーナーも普段どおり使われていました。閉館時にはクッションは元の場所にあったそうです。",
          responseVariants: [
            "雨の日でした。閉館前の見回りでは、まだクッションは絵本コーナーにありました。",
          ],
          reveals: ["context", "access_clue"],
        },
        {
          id: "q_extra_condition",
          text: "移ってたものに、いつもと違うところはあった？",
          requiresAll: ["occurrence"],
          requiresAny: [],
          response:
            "触ってみると少し湿っていました。窓際だけ、朝日がよく当たるんです。",
          responseVariants: [
            "少ししっとりしていました。置かれていた窓辺は、朝になると日当たりがいい場所です。",
          ],
          reveals: ["condition"],
        },
        {
          id: "q_extra_trace",
          text: "動かした人につながる、作業の跡は残ってないかな？",
          requiresAll: ["access_clue"],
          requiresAny: ["context", "condition"],
          response:
            "窓際に清掃用の布と、担当者の印が付いた作業札がありました。朝の清掃スタッフのものです。",
          responseVariants: [
            "そばに清掃カートの番号札が残っていました。担当した清掃スタッフまで確認できました。",
          ],
          reveals: ["actor"],
        },
        {
          id: "q_extra_destination",
          text: "いつもの場所じゃなく、そこへ移したことに意味はありそう？",
          requiresAll: ["occurrence", "condition"],
          requiresAny: [],
          response:
            "窓際は朝日がよく当たります。湿ったクッションを乾かすために選んだ場所だと思います。",
          responseVariants: [
            "そこだけ朝の日差しが入ります。クッションを日なたで乾かしていたと考えると自然です。",
          ],
          reveals: ["reason"],
        },
        {
          id: "q_extra_confirm",
          text: "その人の作業記録で、移した理由を確かめられそう？",
          requiresAll: ["actor", "condition"],
          requiresAny: [],
          response:
            "はい。清掃記録に『湿ったクッションを窓際で乾燥中』と書かれていました。",
          responseVariants: [
            "清掃スタッフの記録に、濡れたクッションを朝日の当たる場所で乾かしている、とありました。",
          ],
          reveals: ["reason"],
        },
        {
          id: "q_extra_pattern",
          text: "同じことは、毎朝起きてるの？",
          requiresAll: [],
          requiresAny: ["timing", "occurrence"],
          response:
            "いいえ。毎朝ではなく、雨の日の翌朝にだけ起きているようです。",
          responseVariants: [
            "毎日ではありません。これまで気づいたのは、どれも雨の日の翌朝でした。",
          ],
          reveals: ["timing", "pattern"],
        },
        {
          id: "q_extra_plausible",
          text: "その日の貸出冊数って、いつもより多かった？",
          requiresAll: [],
          requiresAny: [],
          response:
            "貸出冊数は普段どおりでした。今回の移動とは、あまり関係がなさそうですね。",
          responseVariants: [
            "特に多くはありませんでした。貸出の忙しさが原因ではなさそうです。",
          ],
          reveals: [],
          distractor: "plausible",
        },
        {
          id: "q_extra_irrelevant",
          text: "ところで、休憩時間は何をよく飲むの？",
          requiresAll: [],
          requiresAny: [],
          response:
            "ミルクティーです。少し甘くすると、午後のカウンターでも元気が出るんですよ。ふふ、探偵さんらしい寄り道ですね。",
          responseVariants: [
            "温かいほうじ茶が好きです。本の間で飲めないのが、唯一の難点ですね。楽しい質問です。",
          ],
          reveals: ["smalltalk_followup"],
          distractor: "irrelevant",
          distractorTone: "cheerful",
        },
        {
          id: "q_extra_smalltalk_followup",
          text: "いいね！ その飲み物に合わせるなら、どんなおやつが好き？",
          requiresAll: ["smalltalk_followup"],
          requiresAny: [],
          response:
            "小さなバタークッキーです。仕事のあとに一枚だけ、と決めているのに、二枚になることがあります。",
          responseVariants: [
            "あんこの入った小さなお菓子です。温かい飲み物と合わせると、ほっとします。",
          ],
          reveals: [],
          smallTalkFollowUp: true,
        },
      ],
      composition: {
        dimensions: {
          timing: [
            {
              optionId: "time_rain",
              partialOptionId: "time_special",
              compatibleWith: {
                occurrence: ["event_cushion"],
                actor: ["actor_cleaner"],
                reason: ["reason_dry"],
              },
              values: {
                mysteryTiming: "雨の日の翌朝",
                timingReply:
                  "雨の日の翌朝です。開館準備を始めた時に気づきました。",
                timingReplyAlt:
                  "前日に雨が降った、その次の朝でした。いつもの見回り中に見つけたんです。",
                patternFact: "毎日ではなく、雨の日の翌朝だけ",
                patternReply:
                  "いいえ。毎朝ではなく、雨の日の翌朝にだけ起きているようです。",
                patternReplyAlt:
                  "毎日ではありません。これまで気づいたのは、どれも雨の日の翌朝でした。",
                contextFact: "前日は雨で、閉館時にはクッションは元の場所にあった",
                contextReply:
                  "前日は雨で、絵本コーナーも普段どおり使われていました。閉館時には元の場所にあり、その後に入ったのは司書と朝の清掃スタッフです。",
                contextReplyAlt:
                  "雨の日でした。閉館前にはまだ元の場所にあり、翌朝の入館記録には司書と清掃スタッフが載っています。",
              },
            },
            {
              optionId: "time_story",
              partialOptionId: "time_special",
              compatibleWith: {
                occurrence: ["event_owl"],
                actor: ["actor_student"],
                reason: ["reason_repair"],
              },
              values: {
                mysteryTiming: "おはなし会の翌朝",
                timingReply:
                  "おはなし会の翌朝です。片づけは終わったはずなのに、不思議でした。",
                timingReplyAlt:
                  "子ども向けのおはなし会があった、その次の朝に気づきました。",
                patternFact: "毎日ではなく、おはなし会の翌朝だけ",
                patternReply:
                  "いいえ。毎朝ではなく、おはなし会の翌朝にだけ起きているようです。",
                patternReplyAlt:
                  "毎日ではありません。これまで気づいたのは、どれもおはなし会の翌朝でした。",
                contextFact: "前日はおはなし会で、片づけ後にはぬいぐるみは棚にあった",
                contextReply:
                  "前日はおはなし会でした。片づけ後は棚に戻っていて、その後の入館記録には司書と学生スタッフが載っています。",
                contextReplyAlt:
                  "おはなし会のあと、閉館時には棚にありました。翌朝に先に入ったのは、司書と学生スタッフです。",
              },
            },
            {
              optionId: "time_closed",
              partialOptionId: "time_special",
              compatibleWith: {
                occurrence: ["event_bookends"],
                actor: ["actor_display"],
                reason: ["reason_shadow"],
              },
              values: {
                mysteryTiming: "休館日の翌朝",
                timingReply:
                  "休館日の翌朝です。静かな館内を見回っていた時に気づきました。",
                timingReplyAlt:
                  "一般の利用者が入らない休館日の、その次の朝でした。",
                patternFact: "毎日ではなく、休館日の翌朝だけ",
                patternReply:
                  "毎朝ではありません。今まで起きたのは、どれも休館日の翌朝でした。",
                patternReplyAlt:
                  "繰り返すのは休館日の翌朝だけで、普段の開館日には起きていません。",
                contextFact: "前日は休館日で、児童展示の準備が行われていた",
                contextReply:
                  "前日は休館日で、児童展示の準備をしていました。夕方にはまだ棚にあり、翌朝は司書と展示担当者が先に入っています。",
                contextReplyAlt:
                  "休館中は展示替えをしていましたが、夕方にはまだ棚にありました。休館日明けの入館記録には司書と展示担当者が載っています。",
              },
            },
          ],
          occurrence: [
            {
              optionId: "event_cushion",
              partialOptionId: "event_moved",
              compatibleWith: { reason: ["reason_dry"] },
              values: {
                mysteryEvent: "絵本コーナーの星形クッションが窓際へ移っていた",
                mysteryObject: "星形クッション",
                occurrenceReply:
                  "絵本コーナーの星形クッションが、いつもの場所ではなく窓際に置かれていました。",
                occurrenceReplyAlt:
                  "星の形のクッションです。朝見たら、絵本コーナーから窓のそばへ移っていました。",
              },
            },
            {
              optionId: "event_owl",
              partialOptionId: "event_moved",
              compatibleWith: { reason: ["reason_repair"] },
              values: {
                mysteryEvent: "フクロウのぬいぐるみがカウンターへ移っていた",
                mysteryObject: "フクロウのぬいぐるみ",
                occurrenceReply:
                  "絵本コーナーのフクロウのぬいぐるみが、カウンターの端に座っていました。",
                occurrenceReplyAlt:
                  "いつもの棚にいるフクロウが、朝には貸出カウンターへ移っていたんです。",
              },
            },
            {
              optionId: "event_bookends",
              partialOptionId: "event_moved",
              compatibleWith: { reason: ["reason_shadow"] },
              values: {
                mysteryEvent: "動物のブックエンドが窓辺に一列で並んでいた",
                mysteryObject: "動物のブックエンド",
                occurrenceReply:
                  "絵本棚の動物のブックエンドが、窓辺に一列で並んでいました。",
                occurrenceReplyAlt:
                  "木の動物たちが棚を離れて、朝日の入る窓のそばに整列していたんです。",
              },
            },
          ],
          actor: [
            {
              optionId: "actor_cleaner",
              partialOptionId: "actor_staff",
              values: {
                mysteryActor: "開館前の清掃スタッフ",
                accessFact: "司書と朝の清掃スタッフが開館前に入っていた",
                accessReply:
                  "司書のほかに、朝の清掃スタッフも入っていました。入れた人は一人ではありません。",
                accessReplyAlt:
                  "その朝は、司書と清掃スタッフが開館前に作業していました。これだけでは誰か決められませんね。",
                traceReply:
                  "窓際に清掃用の布と、担当者の印が付いた作業札がありました。朝の清掃スタッフのものです。",
                traceReplyAlt:
                  "そばに清掃カートの番号札が残っていました。担当した清掃スタッフまで確認できました。",
              },
            },
            {
              optionId: "actor_student",
              partialOptionId: "actor_staff",
              values: {
                mysteryActor: "おはなし会担当の学生スタッフ",
                accessFact: "司書とおはなし会担当の学生スタッフが開館前に入っていた",
                accessReply:
                  "司書のほかに、おはなし会担当の学生スタッフも片づけのために入っていました。",
                accessReplyAlt:
                  "その朝は司書と学生スタッフが先に来ていました。入館記録だけでは、どちらか分かりません。",
                traceReply:
                  "カウンターに学生スタッフ用の作業表があり、フクロウの欄に担当者の印が付いていました。",
                traceReplyAlt:
                  "ぬいぐるみのそばに、おはなし会担当の学生スタッフが使う名札と作業札が残っていました。",
              },
            },
            {
              optionId: "actor_display",
              partialOptionId: "actor_staff",
              values: {
                mysteryActor: "児童展示担当の図書館員",
                accessFact: "休館日明けの開館前に司書と児童展示担当の図書館員が作業していた",
                accessReply:
                  "休館日明けの朝は、司書のほかに児童展示の担当者や施設の担当者も入っていました。",
                accessReplyAlt:
                  "入館記録には何人か載っています。児童展示の担当者もいましたが、まだ決め手にはなりませんね。",
                traceReply:
                  "窓辺に動物の影を描いた配置図があり、児童展示担当者の印が付いていました。",
                traceReplyAlt:
                  "床のテープ印と同じ並びが展示担当者のスケッチに描かれていました。担当者も確認できました。",
              },
            },
          ],
          reason: [
            {
              optionId: "reason_dry",
              partialOptionId: "reason_care",
              compatibleWith: { occurrence: ["event_cushion"] },
              values: {
                mysteryCondition: "クッションが少し湿っていた",
                mysteryReason: "濡れたクッションを日なたで乾かす",
                conditionReply:
                  "触ってみると少し湿っていました。窓際だけ、朝日がよく当たるんです。",
                conditionReplyAlt:
                  "少ししっとりしていました。置かれていた窓辺は、朝になると日当たりがいい場所です。",
                destinationReply:
                  "窓際は朝日がよく当たります。湿ったクッションを乾かすために選んだ場所だと思います。",
                destinationReplyAlt:
                  "そこだけ朝の日差しが入ります。クッションを日なたで乾かしていたと考えると自然です。",
                confirmReply:
                  "記録に『湿ったクッションを窓際で乾燥中』と書かれていました。",
                confirmReplyAlt:
                  "メモには、濡れたクッションを朝日の当たる場所で乾かしている、とありました。",
              },
            },
            {
              optionId: "reason_repair",
              partialOptionId: "reason_care",
              compatibleWith: { occurrence: ["event_owl"] },
              values: {
                mysteryCondition: "ぬいぐるみの蝶ネクタイがほつれていた",
                mysteryReason: "ほつれた蝶ネクタイを直す",
                conditionReply:
                  "よく見ると、フクロウの蝶ネクタイの糸がほつれていました。カウンターには裁縫箱も出ていました。",
                conditionReplyAlt:
                  "蝶ネクタイが少し外れかけていて、そばに針と糸を入れた箱がありました。",
                destinationReply:
                  "カウンターなら手元を明るくして裁縫箱を広げられます。蝶ネクタイを直すために移したようです。",
                destinationReplyAlt:
                  "ぬいぐるみの横に針と糸がそろっています。ほつれを補修する作業場所だったんですね。",
                confirmReply:
                  "作業メモに『フクロウの蝶ネクタイを補修中』と書かれていました。",
                confirmReplyAlt:
                  "記録には、ほつれた蝶ネクタイを直してから棚へ戻す、とありました。",
              },
            },
            {
              optionId: "reason_shadow",
              partialOptionId: "reason_care",
              compatibleWith: { occurrence: ["event_bookends"] },
              values: {
                mysteryCondition: "壁に動物の影が並び、床に位置を示す印があった",
                mysteryReason: "動物の影を使う展示の配置を試す",
                conditionReply:
                  "朝日を受けて、壁に動物の影が一列に映っていました。床には位置を示す小さなテープもあります。",
                conditionReplyAlt:
                  "ブックエンド自体は傷んでいません。窓からの光で影が壁に並び、足元に目印が付いていました。",
                destinationReply:
                  "窓辺なら動物の影が壁に映ります。次の展示で使う並び方を試していたようです。",
                destinationReplyAlt:
                  "朝日と床の印を見ると、動物の影を展示にするための配置確認だったと考えられます。",
                confirmReply:
                  "展示記録に『動物の影がきれいに並ぶ位置を確認』と書かれていました。",
                confirmReplyAlt:
                  "児童展示の作業表に、朝日の角度に合わせて動物の配置を試した、と記録がありました。",
              },
            },
          ],
        },
        opening:
          "最近、開館前に絵本コーナーのものが別の場所へ移っていることがあるんです。小さなことなんですが、理由が気になって……。探偵さん、いっしょに考えてもらえますか？",
        facts: {
          timing: "{mysteryTiming}",
          occurrence: "{mysteryEvent}",
          access_clue: "{accessFact}",
          context: "{contextFact}",
          actor: "{mysteryActor}",
          condition: "{mysteryCondition}",
          reason: "{mysteryReason}ため",
          pattern: "{patternFact}",
        },
        questions: {
          q_extra_when: { responses: ["{timingReply}", "{timingReplyAlt}"] },
          q_extra_object: {
            responses: ["{occurrenceReply}", "{occurrenceReplyAlt}"],
          },
          q_extra_access: { responses: ["{accessReply}", "{accessReplyAlt}"] },
          q_extra_previous: {
            responses: ["{contextReply}", "{contextReplyAlt}"],
          },
          q_extra_pattern: {
            responses: ["{patternReply}", "{patternReplyAlt}"],
          },
          q_extra_condition: {
            responses: ["{conditionReply}", "{conditionReplyAlt}"],
          },
          q_extra_trace: {
            responses: ["{traceReply}", "{traceReplyAlt}"],
          },
          q_extra_destination: {
            responses: ["{destinationReply}", "{destinationReplyAlt}"],
          },
          q_extra_confirm: {
            responses: ["{confirmReply}", "{confirmReplyAlt}"],
          },
        },
        correctSentence:
          "{mysteryTiming}、{mysteryEvent}のは、{mysteryActor}が{mysteryReason}ためだった。",
        explanation:
          "小さな移動にも理由がありました。入れた人を一人に決めつけず、前日の出来事、残された作業の跡、物の状態、移動先の特徴をつなぐことで、{mysteryActor}が{mysteryReason}ために動かしたと分かります。",
      },
      deduction: {
        template: "{slot1}、{slot2}のは、{slot3}が{slot4}ためだった。",
        slots: [
          {
            id: "timing",
            label: "いつ",
            requiresAll: ["timing"],
            options: [
              { id: "time_rain", text: "雨の日の翌朝", score: 1 },
              { id: "time_story", text: "おはなし会の翌朝", score: 0 },
              { id: "time_closed", text: "休館日の翌朝", score: 0 },
              { id: "time_special", text: "普段と違う作業があった翌朝", score: 0.5 },
            ],
          },
          {
            id: "occurrence",
            label: "起きたこと",
            requiresAll: ["occurrence"],
            options: [
              {
                id: "event_cushion",
                text: "絵本コーナーの星形クッションが窓際へ移っていた",
                score: 1,
              },
              {
                id: "event_owl",
                text: "フクロウのぬいぐるみがカウンターへ移っていた",
                score: 0,
              },
              {
                id: "event_bookends",
                text: "動物のブックエンドが窓辺に一列で並んでいた",
                score: 0,
              },
              {
                id: "event_moved",
                text: "絵本コーナーの物がいつもの場所から移っていた",
                score: 0.5,
              },
            ],
          },
          {
            id: "actor",
            label: "誰が",
            requiresAll: ["actor"],
            options: [
              { id: "actor_cleaner", text: "開館前の清掃スタッフ", score: 1 },
              {
                id: "actor_student",
                text: "おはなし会担当の学生スタッフ",
                score: 0,
              },
              {
                id: "actor_display",
                text: "児童展示担当の図書館員",
                score: 0,
              },
              { id: "actor_staff", text: "開館前後に作業するスタッフ", score: 0.5 },
            ],
          },
          {
            id: "reason",
            label: "なぜ",
            requiresAll: ["reason"],
            partialRequiresAll: ["condition"],
            options: [
              { id: "reason_dry", text: "濡れたクッションを日なたで乾かす", score: 1 },
              { id: "reason_repair", text: "ほつれた蝶ネクタイを直す", score: 0 },
              { id: "reason_shadow", text: "動物の影を使う展示の配置を試す", score: 0 },
              { id: "reason_care", text: "傷みや汚れを整える", score: 0.5 },
            ],
          },
        ],
      },
      correctSentence:
        "雨の日の翌朝、絵本コーナーの星形クッションが窓際へ移っていたのは、開館前の清掃スタッフが濡れたクッションを日なたで乾かすためだった。",
      explanation:
        "小さな移動にも理由がありました。時・場所・関係者・物の状態を順に確認すると、いたずらではなく手入れのためだったと分かります。",
      advice:
        "日常の謎も、先入観で決めつけず、変化が起きた時・場所・関係者・物の状態を一つずつ確かめると解きやすくなります。",
    },
    EXTRA_CASE_02,
    EXTRA_CASE_03,
  ];
}
