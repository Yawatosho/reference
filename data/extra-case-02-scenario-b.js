export const EXTRA_CASE_02_SCENARIO_B = {
  opening:
    "ちょっと相談していいですか？ 論文がアクセプトされたんですが、オープンアクセスにするならAPCを払ったほうがいいんでしょうか？ こういう制度、少し自信がなくて……。",
  patron: {
    descriptor:
      "アクセプトされた論文のオープンアクセスについて相談に来た物理学の教授",
    timeLimitLine:
      "そろそろ研究室に戻らないといけなくて……。ここまでのお話で、私が何を確認したかったのか整理していただけますか？",
    reactions: {
      high: {
        image: "./assets/characters/extra-prof-reaction-high-previous.webp",
        line:
          "そう、それです。義務の対象かどうかだけじゃなくて、せっかくなら読める人は増やしたいんです。そのために、どんな方法が選べるのかを知りたかったんですね。",
      },
      medium: {
        image: "./assets/characters/extra-prof-reaction-medium-portrait.webp",
        line:
          "だいぶ整理できました。今回の即時OA義務の対象ではない、というところまではそのとおりです。ただ、それで話が終わりという感じでもないんですよね。",
      },
      low: {
        image: "./assets/characters/extra-prof-reaction-low-portrait.webp",
        line:
          "うーん……私も最初は制度のことばかり気にしていたんですけど、それだけが相談したかったことではない気がします。",
      },
    },
  },
  facts: {
    accepted_stage: {
      label: "論文の状況",
      display: "査読を終えてアクセプトされ、現在は出版手続き中",
    },
    publisher_apc_offer: {
      label: "出版社の案内",
      display: "出版社からAPCを伴うOAオプションを提示されている",
    },
    manuscript_available: {
      label: "著者最終稿",
      display: "アクセプト時の著者最終稿が手元に残っている",
    },
    oa_notice: {
      label: "相談のきっかけ",
      display: "大学から即時OAに関する案内を見たことがきっかけ",
    },
    grant_2023: {
      label: "科研費",
      display: "論文は2023年度に採択され、現在も継続中の科研費による成果",
    },
    not_mandatory_scope: {
      label: "制度上の位置づけ",
      display:
        "今回の科研費は、2025年度から新たに公募された課題ではないため、この即時OA義務の対象ではない",
    },
    still_wants_open: {
      label: "教授の希望",
      display: "義務の対象外でも、できれば論文を広く読める状態にはしたい",
    },
    access_goal: {
      label: "OAにしたい理由",
      display: "制度対応そのものではなく、研究成果へアクセスできる人を増やしたい",
    },
    apc_not_main_issue: {
      label: "APCについて",
      display: "APCの金額だけでOAにするかどうかを決めたいわけではない",
    },
    repository_awareness: {
      label: "別の公開経路",
      display:
        "機関リポジトリという方法があることは知っているが、今回利用できる条件までは分からない",
    },
    options_unclear: {
      label: "迷っていること",
      display: "出版社のOAとそれ以外の公開方法について、条件や違いを整理できていない",
    },
    hypothesis_confirmed: {
      label: "本当の質問",
      display:
        "義務の有無とは切り分けて、利用できるOAの経路と条件を比較して方法を選びたい",
    },
    deadline: {
      label: "出版社への回答期限",
      display: "OAオプションの回答期限は約1週間後",
    },
    coauthor_view: {
      label: "共著者",
      display: "共著者からOAについて特に強い希望は出ていない",
    },
    journal_reason: {
      label: "投稿先を選んだ理由",
      display: "研究分野との相性を重視して投稿しており、OAかどうかで選んだわけではない",
    },
    smalltalk_followup: { label: "", display: "" },
  },
  questions: [
    {
      id: "q_ex2b_stage",
      text: "論文は、今どの段階まで進んでいますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "先週アクセプトされました。今は出版社から届いた出版手続きを進めているところです。",
      responseVariants: [
        "査読はもう終わっています。アクセプト後の手続きに入ったところですね。",
      ],
      reveals: ["accepted_stage"],
    },
    {
      id: "q_ex2b_trigger",
      text: "今回、オープンアクセスのことを気にされたきっかけは何でしたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "大学から即時OAについて案内が来ていたのを思い出したんです。私も科研費を使っているので、今回の論文も何かしないといけないのかなと思って。",
      responseVariants: [
        "大学の案内ですね。科研費の論文は即時OAに、という話を見て、自分の論文も対象なのかなと気になりました。",
      ],
      reveals: ["oa_notice"],
    },
    {
      id: "q_ex2b_publisher",
      text: "出版社からは、OAについてどんな選択肢を案内されていますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "APCを払えば、この論文をオープンアクセスにできるという案内です。それを見て、これを選ぶべきなのかなと思いました。",
      responseVariants: [
        "出版手続きの中にOAを選択する項目があって、選ぶとAPCがかかるようです。",
      ],
      reveals: ["publisher_apc_offer"],
    },
    {
      id: "q_ex2b_grant",
      text: "今回の論文に関係する科研費は、いつ採択された課題ですか？",
      requiresAll: [],
      requiresAny: ["oa_notice", "publisher_apc_offer"],
      response:
        "2023年度に採択された課題です。まだ研究期間中なので、今もその科研費で研究を続けています。",
      responseVariants: [
        "2023年度からの科研費です。新しく取ったものではなくて、今も継続している課題ですね。",
      ],
      reveals: ["grant_2023"],
    },
    {
      id: "q_ex2b_scope",
      text: "その科研費が、今回の即時OA義務の対象になる課題か確認してみましょうか？",
      requiresAll: ["grant_2023"],
      requiresAny: [],
      response:
        "お願いします。……あ、2025年度から新たに公募された科研費が対象なんですね。私のは2023年度採択だから、今回の義務の対象ではない、と。",
      responseVariants: [
        "なるほど。今も継続中だから対象だと思っていましたが、採択された年度が違うんですね。今回は義務の対象外なんですね。",
      ],
      reveals: ["not_mandatory_scope"],
    },
    {
      id: "q_ex2b_no_obligation",
      text: "義務の対象ではないことが分かりましたが、今回の論文をOAにすることについては、どのようにお考えですか？",
      requiresAll: ["not_mandatory_scope"],
      requiresAny: [],
      response:
        "できればOAにはしたいと思っています。義務だから、ということではなくて、せっかくの研究なので、読める人は多いほうがいいなと思っていて。",
      responseVariants: [
        "義務ではないとしても、公開できるのであれば、できるだけ広く読んでもらえる状態にはしておきたいですね。。",
      ],
      reveals: ["still_wants_open"],
    },
    {
      id: "q_ex2b_why_open",
      text: "今回の論文をOAにするとしたら、どんなことを期待されていますか？",
      requiresAll: ["still_wants_open"],
      requiresAny: [],
      response:
        "できれば、大学に所属していない方も含めて、読める人が増えるとうれしいですね。義務だからというより、せっかくの研究なので、できるだけ広く届けばと思っています。",
      responseVariants: [
        "読める人をあまり限定せずに済むといいなと思っています。制度への対応というより、研究成果にアクセスできる人が増えることを期待しています。",
      ],
      reveals: ["access_goal"],
    },
    {
      id: "q_ex2b_apc_priority",
      text: "APCがもう少し安ければ、迷わず出版社のOAを選びますか？",
      requiresAll: ["publisher_apc_offer"],
      requiresAny: [],
      response:
        "うーん、金額だけでは決めないと思います。安ければ払う、というより、ほかにどういう方法があるのかを知ってから考えたいです。",
      responseVariants: [
        "値段だけの問題ではないですね。出版社でOAにする方法しかないなら別ですが、そうとも限らないんですよね？",
      ],
      reveals: ["apc_not_main_issue"],
    },
    {
      id: "q_ex2b_other_options",
      text: "出版社でOAにする以外の公開方法については、何かご存じですか？",
      requiresAll: ["still_wants_open"],
      requiresAny: ["publisher_apc_offer", "apc_not_main_issue"],
      response:
        "大学の機関リポジトリは知っています。ただ、今回の論文で使えるのかとか、出版社のOAとどう違うのかまでは分かっていません。",
      responseVariants: [
        "リポジトリという言葉は知っています。でも、出版社でOAにする場合との違いはあまり理解していなくて。",
      ],
      reveals: ["repository_awareness", "options_unclear"],
    },
    {
      id: "q_ex2b_manuscript",
      text: "アクセプトされたときの著者最終稿は手元にありますか？",
      requiresAll: ["accepted_stage"],
      requiresAny: ["repository_awareness", "still_wants_open"],
      response:
        "はい、あります。査読コメントを反映した最終版の原稿は保存してあります。",
      responseVariants: [
        "あります。出版社が組版する前の原稿なら手元に残っています。",
      ],
      reveals: ["manuscript_available"],
    },
    {
      id: "q_ex2b_hypothesis",
      text:
        "ここまでのお話だと、義務への対応というより、論文を広く読めるようにするために、どんな公開方法が使えるかを整理したい、ということでしょうか？",
      requiresAll: ["not_mandatory_scope", "access_goal", "options_unclear"],
      requiresAny: [],
      response:
        "はい、そうです。義務だからということではなくて、できれば広く読めるようにはしたいんです。出版社のOAも含めて、どんな方法が使えるのかを知ってから決めたいと思っています。",
      responseVariants: [
        "そうですね。義務の対象ではないことは分かりましたが、公開したい気持ちはあります。まずは利用できる方法を整理して、そのうえで選べればと思っています。",
      ],
      reveals: ["hypothesis_confirmed"],
    },
    {
      id: "q_ex2b_deadline",
      text: "出版社のOAオプションは、いつまでに回答する必要がありますか？",
      requiresAll: ["publisher_apc_offer"],
      requiresAny: [],
      response: "一週間くらいです。それまでにどうするか決めれば大丈夫そうです。",
      responseVariants: ["来週までですね。今日すぐ決める必要はありません。"],
      reveals: ["deadline"],
      distractor: "plausible",
    },
    {
      id: "q_ex2b_coauthors",
      text: "共著者の方から、OAについて希望は出ていますか？",
      requiresAll: ["accepted_stage"],
      requiresAny: [],
      response:
        "特には出ていません。私が出版手続きを担当しているので、まず整理してから相談しようと思っています。",
      responseVariants: [
        "今のところ特にありません。方法が分かってから共有するつもりです。",
      ],
      reveals: ["coauthor_view"],
      distractor: "plausible",
    },
    {
      id: "q_ex2b_journal",
      text: "この雑誌を選んだとき、OAにできることは重視していましたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "いえ。研究内容に合っていて、この分野の人がよく読む雑誌だったので選びました。OAのことはアクセプトされてから考え始めましたね。",
      responseVariants: [
        "OAかどうかでは選んでいません。投稿先として一番合っていたからです。",
      ],
      reveals: ["journal_reason"],
      distractor: "plausible",
    },
    {
      id: "q_ex2b_irrelevant",
      text: "アクセプトの連絡は、すぐ気づきましたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "実は会議中で、終わってから気づきました。件名だけ見て『これはどっちだ……』って、しばらくメールを開けませんでした。",
      responseVariants: [
        "夜に届いていたんですが、朝まで気づかなかったんです。起きて最初に見て、一気に目が覚めました。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },
    {
      id: "q_ex2b_smalltalk_followup",
      text: "アクセプトだと分かった瞬間、どうでした？",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "ほっとしました。査読が長かったので。……でもその直後に出版手続きがいっぱい出てきて、『まだ終わりじゃないのか』って思いましたけど。",
      responseVariants: [
        "うれしかったですよ。その日は査読コメントを見なくていい、というだけでもかなり開放感がありました。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],
  deduction: {
    template: "{slot1}。しかし、{slot2}。{slot3}ため、{slot4}。",
    slots: [
      {
        id: "policy_status",
        label: "制度上の位置づけ",
        requiresAll: ["not_mandatory_scope"],
        partialRequiresAll: ["grant_2023"],
        options: [
          { id: "status_old_grant", text: "2023年度採択の継続課題で、今回の即時OA義務の対象ではない", score: 1 },
          { id: "status_check_needed", text: "継続中の科研費なので、対象になるか確認が必要な状態である", score: 0.5 },
          { id: "status_all_kaken", text: "科研費による論文なので、採択年度にかかわらず即時OAが必要である", score: 0 },
          { id: "status_after_finish", text: "科研費の研究期間が終了するまではOAにできない", score: 0 },
        ],
      },
      {
        id: "remaining_goal",
        label: "それでもしたいこと",
        requiresAll: ["access_goal"],
        partialRequiresAll: ["still_wants_open"],
        options: [
          { id: "goal_access", text: "義務とは別に、論文をできるだけ広く読める状態にしたい", score: 1 },
          { id: "goal_open_if_easy", text: "大きな負担がなければ公開してもよいと思っている", score: 0.5 },
          { id: "goal_report_only", text: "科研費の実績報告書に論文情報だけ登録しておきたい", score: 0 },
          { id: "goal_closed", text: "義務がないことを確認できたので、論文は非公開のままにしたい", score: 0 },
        ],
      },
      {
        id: "uncertainty",
        label: "まだ判断できない理由",
        requiresAll: ["options_unclear"],
        partialRequiresAny: ["publisher_apc_offer", "repository_awareness"],
        options: [
          { id: "unclear_routes", text: "出版社のOA以外にも方法がありそうだが、それぞれの条件や違いを整理できていない", score: 1 },
          { id: "unclear_repository", text: "機関リポジトリが今回使えるか分からない", score: 0.5 },
          { id: "unclear_coauthor", text: "共著者全員からOAの同意をまだ取れていない", score: 0 },
          { id: "unclear_deadline", text: "出版社からOAを選ぶ期限を知らされていない", score: 0 },
        ],
      },
      {
        id: "decision",
        label: "最終的に確認したいこと",
        requiresAll: ["hypothesis_confirmed"],
        partialRequiresAll: ["access_goal", "options_unclear"],
        options: [
          { id: "decision_compare", text: "利用できるOAの経路と条件を比較して、自分に合う公開方法を選びたい", score: 1 },
          { id: "decision_repository_rule", text: "著者最終稿を大学へ提出するときの手続きだけ知りたい", score: 0.5 },
          { id: "decision_publisher", text: "出版社のOAオプションを選択する手続きを進めたい", score: 0 },
          { id: "decision_exemption", text: "即時OAを実施しなくても問題ないことだけ確認して相談を終えたい", score: 0 },
        ],
      },
    ],
  },
  correctSentence:
    "2023年度採択の継続課題で、今回の即時OA義務の対象ではない。しかし、義務とは別に、論文をできるだけ広く読める状態にしたい。出版社のOA以外にも方法がありそうだが、それぞれの条件や違いを整理できていないため、利用できるOAの経路と条件を比較して、自分に合う公開方法を選びたい。",
  explanation:
    "教授は最初、「APCを払ったほうがいいか」と相談しました。大学から即時OAについての案内を見て、自分の科研費による論文も対象だと思っていたためです。しかし、話を聞くと、この論文に関係する科研費は2023年度採択の継続課題であり、今回の即時OA義務の対象ではないことが分かりました。ここで「義務ではないのでOAにしなくてよい」と結論づけると、教授の相談を途中で終わらせてしまいます。さらに話を聞くと、教授には制度上の義務とは別に、研究成果をできるだけ広く読めるようにしたいという希望がありました。一方、出版社から提示されたAPC付きOA以外にどのような公開方法が利用でき、それぞれどのような条件があるのかは整理できていませんでした。そこで、即時OA義務への対応という当初の前提から離れ、利用可能なOAの経路と条件を比較して公開方法を選びたい、という本当の質問が見えてきます。本ケースは大学図書館で想定される相談をもとに構成したフィクションであり、実際の対応条件は個別の状況によって異なります。",
  advice:
    "利用者が最初に示した前提が違っていたとしても、その前提を訂正しただけで相談が解決したとは限りません。「では、その条件がなくても、やりたいことは残っていますか？」ともう一歩確認すると、制度や手段の奥にある目的が見えてくることがあります。",
};
