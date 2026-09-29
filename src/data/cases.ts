import type { Case } from "./types";

/**
 * 先行7事例｜試行審査結果（評価基準 v1.3・目盛り R04-5）。
 *
 * 7件49欄の点数は v1.2 で保存した試行値をそのまま引き継いでいる。
 * 新たな外部リサーチ・独立再採点を行った結果ではない。
 *
 * 記述の原則:
 *  - 点数は企画の特徴を読むための編集判断で、作者や作品の総合価値ではない。
 *  - 合計・平均・総合順位は作らない。低い項目を含むこと自体は、掲載価値の否定ではない。
 *  - 人物や作品全体ではなく、各件に明記した版と受け手の経験を読む。
 */
export const cases: Case[] = [
  {
    id: "01",
    code: "RIK",
    slug: "taian-nijiriguchi",
    title: "待庵の躙口",
    author: "伝・千利休",
    year: 1590,
    yearLabel: "16世紀末",
    headline: "小さな入口が、身体の振る舞いを変える。",
    body:
      "二畳の茶室へ入るために、客は小さな躙口で身をかがめる。入口の寸法が、身体の動きと空間への注意を切り替える。言葉で姿勢を説くのではなく、入るという行為に組み込む。「身分を平等にした」とは断定しない。",
    target:
      "16世紀末の待庵の躙口から二畳の小間へ入る構成。当時の茶席の招待客を主対象とする。",
    place: "日本・京都府大山崎町、妙喜庵",
    review: {
      PS: {
        score: 3,
        reason:
          "低い入口と二畳の小間によって、通路に身体尺度という見方が加わる。身分秩序の変化や当時の心理変化まで推定しない。",
        caveat:
          "入室所作の変更は確認できるが、所作だけで認識変化を実証したことにはならない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      PL: {
        score: 1,
        reason:
          "入室の身体調整と所作が中心で、試す・見立てることを遊びとして面白がる仕掛けは、この単位では特定できない。",
        caveat: "茶の湯全体の遊びや、個人が面白く感じる可能性まで否定しない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      AG: {
        score: 3,
        reason:
          "本人が身をかがめて通ることが経験の成立条件になる。一方、その行為で部屋や他者の条件を選び変える役割ではない。",
        caveat:
          "身体による所定条件の実行を3。身体動作があるだけで4・5へ上げない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      CO: {
        score: 4,
        reason:
          "中へ入りたいという動機に沿った動作を、入口そのものが変える。ただし身体を低くすることから、身体と空間の関係を意識するまでには幅が残る。",
        caveat:
          "主要な形と行為が接続を担う4。平等という追加の物語を使って5にしない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      EP: {
        score: 3,
        reason:
          "茶席へ入って主客で会する目的が、身をかがめる負担を引き受ける理由になる。入口単独の集客力ではなく、茶席の文脈込みで読む。",
        caveat:
          "招待・作法への依存が大きく、この構成固有の引力を4ほど強くは説明できない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      EM: {
        score: 1,
        reason:
          "入室者の違いが、入口や次の客の利用条件を更新する仕組みではない。体格や感じ方の違いだけでは創発としない。",
        caveat: "自然光や茶会全体の会話を後から追加し、評価単位を広げない。",
        sourceIds: ["RIK-01", "RIK-02"],
      },
      OR: {
        score: 3,
        reason:
          "四畳半の茶室の系譜と比較し、低い入口と二畳の近接を結ぶ組み替えを3とする。利休による単独の起源を認定する採点ではない。",
        caveat: "同時期の個別茶室を広く比較した4・5の根拠は不足。3の差分に限る。",
        sourceIds: ["RIK-01", "RIK-02", "RIK-04"],
      },
    },
    sources: [
      {
        id: "RIK-01",
        title: "国宝茶室 待庵",
        by: "妙喜庵",
        url: "https://www.eonet.ne.jp/~myoukian-no2/newpage3%20taian.htm",
        support:
          "二畳・躙口・窓・天井の構成、建立伝承、刀掛け等が推測表現であること",
        caveat:
          "歴史的意図・身分平等の実証ではない。世界初という主張を無検証で採用しない。",
      },
      {
        id: "RIK-02",
        title: "nijiriguchi 躙口",
        by: "JAANUS（Japanese Architecture and Art Net Users System）",
        url: "https://www.aisf.or.jp/~jaanus/deta/n/nijiriguchi.htm",
        support: "細川三斎茶書を引く入室所作、一般寸法、起源の諸伝承",
        caveat: "原史料は未読。65×60cmは待庵固有の実測値ではない。",
      },
      {
        id: "RIK-04",
        title: "yojouhan 四畳半",
        by: "JAANUS",
        url: "https://www.aisf.or.jp/~jaanus/deta/y/yojouhan.htm",
        support: "珠光・紹鴎・利休の四畳半の系譜",
        caveat: "説明の一般形を利休以外の現物記として扱えない。",
      },
    ],
  },

  {
    id: "02",
    code: "DCH",
    slug: "fountain-duchamp",
    title: "《泉》",
    author: "Marcel Duchamp",
    year: 1917,
    yearLabel: "1917",
    headline: "無審査を掲げる展覧会へ、小便器を出す。",
    body:
      "小便器を作品として出品したが、展示されなかった。写真とその経緯が誌面に置かれると、見る人も「何を作品と呼ぶか」を判断する側になる。物の姿だけでなく、それを選び、名づけ、受け入れる条件が見えてくる。",
    target:
      "1917年の出品・展示見送りを必要文脈に、同年の写真・誌面へ接する美術関心層の読書経験。",
    place: "米国・ニューヨーク",
    review: {
      PS: {
        score: 5,
        reason:
          "便器の写真・作品名と、出品資格・非展示の経緯が同時に提示される。通常の用途だけでは受け取りきれない判断の衝突が、提示の核にある。",
        caveat:
          "制度を語れる高度さではなく、同じ物を異なる扱いで見る局面を評価する。",
        sourceIds: ["DCH-01", "DCH-02"],
      },
      PL: {
        score: 4,
        reason:
          "便器を《泉》や彫刻候補として読み替える見立てが、誌面を読む主要部分を支える。作者の出品戦略を読者の遊びへ転記しない。",
        caveat:
          "見立ては重要だが、論争を含む経験全体が遊びだけで自立する5とはしない。",
        sourceIds: ["DCH-01", "DCH-03"],
      },
      AG: {
        score: 2,
        reason:
          "写真と出品・拒否の対比は、読者自身を「作品としてどう扱うか」の判断へ招く。ただしその判断で提示や結果は変わらない。",
        caveat:
          "判断する役割が前景化された2。何らかの感想が生じるだけで全鑑賞を2としない。",
        sourceIds: ["DCH-01", "DCH-02", "DCH-03"],
      },
      CO: {
        score: 5,
        reason:
          "「なぜ拒否されたか」を確かめる読書が、そのまま物の分類と受入判断に触れる。問いの入口と提示内容が同じ仕掛けにある。",
        caveat:
          "誌面は経験の一部。説明があることだけでは減点せず、擁護への方向づけは留保する。",
        sourceIds: ["DCH-01", "DCH-02"],
      },
      EP: {
        score: 4,
        reason:
          "なぜ出品し、なぜ展示されなかったかという事件固有の疑問が、写真と短い記事を読む入口になる。",
        caveat:
          "当時の美術関心層が対象。必要な文脈と、悪ふざけとして退ける余地を残す。",
        sourceIds: ["DCH-01", "DCH-02", "DCH-03"],
      },
      EM: {
        score: 1,
        reason:
          "主対象は固定された写真・記事の読者。感想や反論が生じても、その入力が次の誌面や参加条件へ返る規則はない。",
        caveat: "出品者・開催者の判断や、後世の模倣を読者の入力へ足さない。",
        sourceIds: ["DCH-01", "DCH-02", "DCH-03"],
      },
      OR: {
        score: 4,
        reason:
          "先行する日用品の選択・命名に、公募展の可否判断とその経緯の提示を結びつけた中心的な差を読む。",
        caveat:
          "《自転車の車輪》《折れた腕の前に》との比較。レディメイドの世界初とはしない。",
        sourceIds: ["DCH-06", "DCH-07", "DCH-01", "DCH-02"],
      },
    },
    sources: [
      {
        id: "DCH-01",
        title: "Blindman No. 2 (New York, May 1917), Page 4",
        by: "The Blind Man／デジタル公開：University of Iowa Libraries, International Dada Archive",
        url: "https://sdrc.lib.uiowa.edu/dada/blindman/2/04.htm",
        support:
          "Stieglitz写真、R. Mutt署名、作品名、独立展に拒否された品というキャプション",
        caveat: "写真は実際の独立展展示風景ではない。",
      },
      {
        id: "DCH-02",
        title: "The Richard Mutt Case, The Blind Man No.2, p5",
        by: "The Blind Man（無署名）／University of Iowa Libraries",
        url: "https://sdrc.lib.uiowa.edu/dada/blindman/2/05.htm",
        support: "6ドルの資格・展示見送り・批判内容・選択と命名による擁護",
        caveat: "擁護側の議論。デュシャン単独の声明・中立的受容調査ではない。",
      },
      {
        id: "DCH-03",
        title: "Louise Norton, Buddha of the Bathroom, The Blind Man No.2, pp5–6",
        by: "The Blind Man／University of Iowa Libraries",
        url: "https://sdrc.lib.uiowa.edu/dada/blindman/2/06.htm",
        support: "仏像等への見立て、冗談か真剣かという論点",
        caveat: "p5から続く。筆者は擁護側。読者全体の反応ではない。",
      },
      {
        id: "DCH-06",
        title:
          "Marcel Duchamp. Bicycle Wheel. New York, 1951 (third version, after lost original of 1913)",
        by: "MoMA",
        url: "https://www.moma.org/collection/works/81631",
        support: "原作1913年、車輪とスツールの組み替え、回転の鑑賞という先行例",
        caveat: "所蔵品1951年と原作を区別。世界初の認証には用いない。",
      },
      {
        id: "DCH-07",
        title:
          "Marcel Duchamp. In Advance of the Broken Arm. August 1964 (fourth version, after lost original of November 1915)",
        by: "MoMA",
        url: "https://www.moma.org/collection/works/105050",
        support: "原作1915年、雪かき道具の選択・署名・吊下げ・命名",
        caveat: "所蔵品1964年と原作を区別。",
      },
    ],
  },

  {
    id: "03",
    code: "BID",
    slug: "before-i-die",
    title: "Before I Die",
    author: "Candy Chang",
    year: 2011,
    yearLabel: "2011",
    headline: "知らない人の「死ぬまでにしたいこと」が並ぶ。",
    body:
      "街の壁に、同じ書き出しと空欄を置く。自分の願いを書くだけでなく、知らない人の願いも読める。冗談も切実な望みも同じ面に並び、次に来る人の言葉を誘う。作者が答えを用意せず、他者の人生が現れる場所をつくる。",
    target:
      "2011年開始の共有壁の基本形式。通行人が他人の願いを読み、任意で書く経験。",
    place: "米国／ニューオーリンズ（基本形式）",
    review: {
      PS: {
        score: 4,
        reason:
          "私的な願いが公共の壁に並び、通り過ぎる背景が、知らない人の人生を読む面へ変わる。",
        caveat:
          "自分の願いを書くだけで終わる関与もある。全員の人生観を変えるとは扱わない。",
        sourceIds: ["BID-01", "BID-02"],
      },
      PL: {
        score: 3,
        reason:
          "空欄を補い、先の回答へ言葉を返す遊びが成立する。回答を矢印で指して応答する例も記録される。",
        caveat:
          "内省や通常の会話すべてを遊びとしない。基本形式全体を戯れとみなす4・5ではない。",
        sourceIds: ["BID-02"],
      },
      AG: {
        score: 4,
        reason:
          "任意の記入によって、その人固有の回答が公開面へ加わる。読むだけの人も受け手だが、形式として内容をつくる役割が開かれている。",
        caveat:
          "追加内容が公に見えるだけで5にしない。他者の利用権や競合状態を動かす裁量は中心ではない。",
        sourceIds: ["BID-01", "BID-02"],
      },
      CO: {
        score: 5,
        reason:
          "他人の望みを知りたい、自分も答えたいという理由で読む・書く内容自体が、限りある人生の望みである。",
        caveat: "特定の人生観への同意や、強い心理効果は5の要件にしない。",
        sourceIds: ["BID-01", "BID-02"],
      },
      EP: {
        score: 4,
        reason:
          "他の人の答えを読みたい、自分も一言を残したいという理由が、立ち止まる小さな入口に結びつく。",
        caveat:
          "死の想起や自己開示へのためらいは残る。読むだけの人には記入の負担を足さない。",
        sourceIds: ["BID-01", "BID-02"],
      },
      EM: {
        score: 4,
        reason:
          "残った回答が、後から来た人の読むものや返す言葉を変える。単なる記録の蓄積にとどまらず、次の応答へ返る。",
        caveat:
          "清掃やチョークの寄付だけで、役割が関与を再編する5には上げない。",
        sourceIds: ["BID-01", "BID-02"],
      },
      OR: {
        score: 3,
        reason:
          "屋外の共同黒板と願いを集める先行形式を、有限な生の問いと街での読み合いへ組み替えた差を読む。",
        caveat:
          "Community ChalkboardsとWish Treeを比較。願いの記入そのものの発明とはしない。",
        sourceIds: ["BID-03", "BID-04", "BID-09"],
      },
    },
    sources: [
      {
        id: "BID-01",
        title: "Before I Die",
        by: "Candy Chang",
        url: "https://www.candychang.com/beforeidie/",
        support:
          "2011年原壁の配置、道具、許可、終了、作者の動機、読取りと維持協力の報告。",
        caveat:
          "効果・参加反応は主に作者の回顧。掲載回数は独立確認していない。後年の運用指針を2011年へ遡及しない。",
      },
      {
        id: "BID-02",
        title: "TED 2011: What Do You Want to Do Before You Die?",
        by: "WIRED／Olivia Solon（2011-03-09）",
        url: "https://www.wired.com/2011/03/ted-2011-what-do-you-want-to-do-before-you-die/",
        support:
          "2011年街頭形式、チョークの用意、既存回答を矢印で参照する応答、街路化前のギャラリーとの関係。",
        caveat:
          "反応例は作者が記者へ説明したもの。記事中の後日の開催予定を実施済みとは扱わない。",
      },
      {
        id: "BID-03",
        title: "Community Chalkboards",
        by: "Candy Chang",
        url: "https://www.candychang.com/community-chalkboards/",
        support: "地域情報を住民が共有する屋外黒板という作者内の先行機構。",
        caveat:
          "年は別の公式作品一覧BID-09を参照。作者の経歴一般を独創性の点にしない。",
      },
      {
        id: "BID-04",
        title: "Wish Tree for Washington DC",
        by: "Hirshhorn Museum and Sculpture Garden／Smithsonian",
        url: "https://hirshhorn.si.edu/explore/wish-tree-washington/",
        support: "2007年設置。願いを紙に書いて木へ加える参加形式との比較。",
        caveat:
          "現在の運用を1996年等の起源へ遡らせない。Before I Dieと同じ体験と断定しない。",
      },
      {
        id: "BID-09",
        title: "Installations",
        by: "Candy Chang",
        url: "https://www.candychang.com/installations/",
        support: "Community Chalkboardsを2007–2008年と記す。",
        caveat: "現行の作品リスト。過去の全版・変遷の完全な年表ではない。",
      },
    ],
  },

  {
    id: "04",
    code: "KEY",
    slug: "key4all",
    title: "Key4All",
    author: "MSCHF",
    year: 2022,
    yearLabel: "2022",
    headline: "同じ一台の車の鍵を、大勢が持つ。",
    body:
      "車を見つければ使える。ただし、ほかの鍵の持ち主も同じ車を使える。車に乗りたいという欲望から探索に入ると、使えることと独り占めできることの違いに触れる。車の所有権は参加者に移らず、MSCHFに残る。",
    target:
      "2022年原企画の鍵購入・位置探索・車の使用。免許・保険等を満たす鍵購入者の関与。",
    place: "アメリカ合衆国",
    review: {
      PS: {
        score: 5,
        reason:
          "鍵が自分の使用を開く一方で、他人の使用を排除しない。アクセスと独占のずれが、探索・使用の条件自体として現れる。",
        caveat:
          "所有権はMSCHFに残る。参加者全員の所有観が変わったという効果測定ではない。",
        sourceIds: ["KEY-01", "KEY-02"],
      },
      PL: {
        score: 4,
        reason:
          "他人の利用で動く車を追い、到達機会を考えることに探索と駆け引きがある。",
        caveat:
          "実際の運転・維持を含むため、全経験が遊びとして自立する5とはしない。実利だけを理由に減点しない。",
        sourceIds: ["KEY-01", "KEY-09", "KEY-10"],
      },
      AG: {
        score: 5,
        reason:
          "自分が使って移動・駐車することで、他の鍵保有者も利用する一台の位置と状態に直接作用する。",
        caveat:
          "到達保証を意味しない。取得できる権限を評価し、後から生じる役割の豊かさは創発性へ分ける。",
        sourceIds: ["KEY-01", "KEY-02"],
      },
      CO: {
        score: 5,
        reason:
          "車を使いたくて探し、使うことが、そのまま同じ鍵を持つ他者の利用条件と向き合うことになる。",
        caveat:
          "共有や資本主義への結論を後付けせず、使えることと独占のずれへの直接接続を評価する。",
        sourceIds: ["KEY-01", "KEY-02"],
      },
      EP: {
        score: 4,
        reason:
          "実車を見つけて使える期待が探索へ人を入れる。位置案内もあるが、移動・時間・費用・不確実性は残る。",
        caveat:
          "売切れや価格の低さだけで評価せず、到達できた成功者だけへ対象を絞らない。",
        sourceIds: ["KEY-01", "KEY-02", "KEY-09"],
      },
      EM: {
        score: 4,
        reason:
          "先の利用者が車を動かし駐車すると、次の人の探索地点や利用可能性が変わる。",
        caveat:
          "履歴作成や共同移送の提案を、実際に役割が関与を再編した5の証拠にはしない。",
        sourceIds: ["KEY-01", "KEY-02", "KEY-08", "KEY-09", "KEY-10"],
      },
      OR: {
        score: 4,
        reason:
          "予約型の共有車、固定物の交換、最後の一人が車を得る競争と異なり、動く一台への同権アクセスを残す獲得競争をつくる。",
        caveat:
          "比較先はZipcar、Dead Drops、Hands on a Hardbody。広範な実世界ゲームの起源まで確定しない。",
        sourceIds: ["KEY-12", "KEY-13", "KEY-14", "KEY-15"],
      },
    },
    sources: [
      {
        id: "KEY-01",
        title: "Key4All",
        by: "MSCHF",
        url: "https://key4all.com/",
        support:
          "Drop #84、同一車の鍵、全保有者が使える条件、位置案内、主催者の先行参照",
        caveat:
          "現行ページ。2022年の保存版ではない。価格と実売数を確定できない。マニフェストは反応実証ではない。",
      },
      {
        id: "KEY-02",
        title: "TERMS OF SERVICE BLANKET (Key 4 All) / TERMS OF SERVICE",
        by: "MSCHF",
        url: "https://key4all.com/terms-and-conditions.pdf",
        support:
          "車両所有権はMSCHF、参加資格、運転・譲渡の制限、費用と責任の提示",
        caveat:
          "規約の存在・文言を確認。法的執行可能性・実際の遵守を判定する資料ではない。",
      },
      {
        id: "KEY-09",
        title: "So Long, East Coast",
        by: "Reddit / u/LongWlkoffaShortDock and commenters",
        url: "https://www.reddit.com/r/key4all/comments/xxbqpx/so_long_east_coast/",
        support:
          "配送前に車が遠ざかったとの不満、電話の位置を表へ記録したとの申告",
        caveat:
          "ルールに伴う負担と自主的記録役割の具体資料。投稿中の位置・目的地・追跡装置等の事実は独立検証していない。",
      },
      {
        id: "KEY-10",
        title: "Anyone know what direction the car is moving in?",
        by: "Reddit / deleted author",
        url: "https://www.reddit.com/r/key4all/comments/xvgqrn/anyone_know_what_direction_the_car_is_moving_in/",
        support:
          "近づけば追いかけたいという期待と、皆で全国を移動させたいという二次目標の提案",
        caveat: "提案であり達成記録ではない。異なる背景の人の入口を比較する資料ではない。",
      },
      {
        id: "KEY-08",
        title:
          "Added all the details I could find for the MSCHF Key4All car to the VINWiki app. Any help would be cool, would be a good way to keep its history",
        by: "Reddit / u/Motobitcrush- and commenters",
        url: "https://www.reddit.com/r/mschf/comments/y702gn/added_all_the_details_i_could_find_for_the_mschf/",
        support: "VINWikiで共同履歴を作るという役割・目標の具体的投稿",
        caveat:
          "投稿行為は閲覧確認済。車両体験の身元・内容とVINWiki本体を独立検証していない。同作者の転載は別の裏付けに数えない。",
      },
      {
        id: "KEY-12",
        title: "About / Dead Drops",
        by: "Dead Drops / Aram Bartholl",
        url: "https://deaddrops.com/",
        support:
          "2010年NYC開始、公共USBでファイル交換、誰でも新たな地点を作れる仕組み",
        caveat: "Key4Allへの直接の影響関係を示す資料ではない。比較のため使用。",
      },
      {
        id: "KEY-13",
        title: "The Story of Zipcar / What is Zipcar - About Us",
        by: "Zipcar",
        url: "https://www.zipcar.com/about",
        support: "2000年からのカーシェア事業、共有方式の先行性",
        caveat: "企業自身の沿革。現行記載を全て2022年当時の仕様とみなさない。",
      },
      {
        id: "KEY-14",
        title: "How Does Car Sharing Work?",
        by: "Zipcar",
        url: "https://www.zipcar.com/how-it-works",
        support: "免許審査、予約、時間・拠点に沿う返却の一般構造",
        caveat:
          "2022年保存版ではなく現行ページ。現行UI・料金等をKey4All発表時の条件へ遡及しない。",
      },
      {
        id: "KEY-15",
        title: "Hands On a Hardbody: The Documentary",
        by: "Apple TV / rights credit HOHB LLC",
        url: "https://tv.apple.com/us/movie/hands-on-a-hardbody-the-documentary/umc.cmc.4cnlwve3shu5y8vc7esnraut8",
        support: "車に手を置き続け最後まで残る人が獲得する競争という先行構造",
        caveat:
          "作品概要を閲覧。映画全編未鑑賞。公開面のメタデータ差を本審査では争点にせず。",
      },
    ],
  },

  {
    id: "05",
    code: "PLC",
    slug: "r-place",
    title: "r/place",
    author: "Reddit",
    year: 2017,
    yearLabel: "2017",
    headline: "一人では少ししか描けない画面を、全員に開く。",
    body:
      "一画素を置くと、次に置くまで待つ。しかも、同じ場所を他の人も上書きできる。描きたい絵を残すには、修復や仲間集め、隣との交渉が必要になる。単純な描画ルールから、作者が割り当てていない役割や関係が生まれた。",
    target:
      "2017年初回の共有画面への実参加。利用条件を満たすReddit利用者の描画と開催中の調整。",
    place: "オンライン（Reddit）",
    review: {
      PS: {
        score: 4,
        reason:
          "描いたものを残すには他者の上書きや修復に向き合う必要があり、描画が維持・交渉としても立ち上がる。",
        caveat:
          "全員が公共性を学ぶという主張はしない。陣取りの遊びとして受け取る関与もある。",
        sourceIds: ["PLC-01", "PLC-04"],
      },
      PL: {
        score: 5,
        reason:
          "描く・直す・侵入する・譲る・協力する次の一手を考えること自体が、活動の目的になる。",
        caveat: "参加数や滞在時間ではなく、過程の遊びとしての自立を5とする。",
        sourceIds: ["PLC-03", "PLC-04"],
      },
      AG: {
        score: 5,
        reason:
          "自分の一手が共通画面の画素を実際に変える。他者の描画を変更でき、自分の結果も変更される直接の相互作用に入る。",
        caveat:
          "役割や同盟がその後に生まれることとは分け、参加者に与えられた作用の位置を5とする。",
        sourceIds: ["PLC-01", "PLC-04"],
      },
      CO: {
        score: 5,
        reason:
          "絵を残したいから置き、保とうとする行為自体が、他者と同じ画面を使う条件に触れる。",
        caveat: "再知覚の深さを転記しない。描く・保つという主行為に接続がある。",
        sourceIds: ["PLC-01", "PLC-04"],
      },
      EP: {
        score: 4,
        reason:
          "一画素から自分の印を残せる。小さな入口と、図柄を作りたい・残したいという動機が噛み合う。",
        caveat:
          "再訪や修復には目標や仲間との接続が必要。定着した参加者だけを基準に5へ上げない。",
        sourceIds: ["PLC-02", "PLC-04", "PLC-07"],
      },
      EM: {
        score: 5,
        reason:
          "画面の変化から図案・境界合意・協力関係が生まれ、それがさらに後続の描画を方向づける記録がある。",
        caveat:
          "虹を額縁へ組み込む調整などを根拠にする。単なる維持作業や終了後の派生物とは分ける。",
        sourceIds: ["PLC-04"],
      },
      OR: {
        score: 3,
        reason:
          "共同画面、上書き、修復には先行例がある。一画素・待機・期限・掲示板共同体を組み替え、個人の描画量を条件化した差を読む。",
        caveat:
          "Poietic GeneratorとDrawballを比較。共同制作や領土争い自体の初発とはしない。",
        sourceIds: ["PLC-05", "PLC-06", "PLC-08"],
      },
    },
    sources: [
      {
        id: "PLC-01",
        title: "How We Built r/Place",
        by: "Reddit / Brian Simpson, Matt Lee, Daniel Ellis (2017-04-13)",
        url: "https://redditinc.com/news/how-we-built-rplace",
        support: "1000×1000、基本5分、待機時間の技術的な変更、同期、ボット・不具合。",
        caveat: "設計者側の説明。心理効果を独立検証しない。",
      },
      {
        id: "PLC-04",
        title:
          "Instruction vs. emergence on r/place: Understanding the growth and control of evolving artifacts in mass collaboration",
        by: "Kristina T. Litherland, Anders I. Mørch / Computers in Human Behavior 122 (2021) 106845",
        url: "https://www.researchgate.net/publication/351163760_Instruction_vs_emergence_on_rplace_Understanding_the_growth_and_control_of_evolving_artifacts_in_mass_collaboration",
        support:
          "2017年のMona Lisa Clan・Rainbow Road・r/treesの交渉、図案、上書き、異なる共同体の接続と排除。",
        caveat:
          "著者一人が参加観察。具体分析はMona Lisa周辺に重点。全画面の代表性を証明しない。DOI:10.1016/j.chb.2021.106845。",
      },
      {
        id: "PLC-03",
        title: "Latent Structure in Collaboration: the Case of Reddit r/place",
        by: "Jérémie Rappaz, Michele Catasta, Robert West, Karl Aberer / ICWSM 2018・arXiv",
        url: "https://arxiv.org/html/1804.05962v1",
        support:
          "2017年版、待機時間5〜20分、72時間、役割や共通目標を指定しない環境での協調。",
        caveat: "行動ログからの推論。全参加者の内的認識を測っていない。",
      },
      {
        id: "PLC-02",
        title: "Looking Back at r/Place",
        by: "Reddit / Josh Wardle, Justin Bassett (2017-04-18)",
        url: "https://redditinc.com/news/place-part-two",
        support:
          "72時間、100万人超・1650万回描画という主催者報告、集団・記録者・技術参加者の活動。",
        caveat:
          "成功・善意についての主催者評価は、そのまま客観的結論にしない。終了後の制作物は初回体験から分離。",
      },
      {
        id: "PLC-07",
        title: "Place",
        by: "Reddit / u/powerlanguage（2017年告知）",
        url: "https://www.reddit.com/r/announcements/comments/62mesr/place/",
        support: "一画素を置いて待つ簡素な参加案内、ウェブ・Android・iOS接触。",
        caveat:
          "現在の相対年月日表示ではなく、他の当時記録と日付照合。コメントは全員を代表しない。",
      },
      {
        id: "PLC-05",
        title: "RedditPlace versus PoieticGenerator",
        by: "Olivier Auber / Medium (2022-04-06)",
        url: "https://olivierauber.medium.com/redditplace-versus-poieticgenerator-5752fe13f12d",
        support:
          "Poietic Generatorの1986年構想・1987年作動、個人区画を組み合わせる集団画像の先行性。",
        caveat:
          "r/placeについての2022年の論評は2017年へ流用しない。先行作品の作者説明部分を使用。",
      },
      {
        id: "PLC-06",
        title: "Drawball: from Chaos to Community / Drawball",
        by: "The Wilx Collection (2007-01-08 / 2007-01-04)",
        url: "https://wilxcollection.wordpress.com/category/drawball/",
        support:
          "2007年以前の有限インク、上書き、共同描画、国旗と領土争い、修復の記録。",
        caveat:
          "個人の参加記録で、運営の完全仕様書ではない。2005年開始は今回の根拠に採用せず。",
      },
      {
        id: "PLC-08",
        title:
          "Role of Simplicity in Creative Behaviour: The Case of the Poietic Generator",
        by: "Antoine Saillenfest, Jean-Louis Dessalles, Olivier Auber / ICCC 2016",
        url: "https://www.computationalcreativity.net/iccc2016/wp-content/uploads/2016/06/paper_39-1.pdf",
        support: "r/place以前の集団ピクセル画制作。共通画面と個人の小区画の関係。",
        caveat:
          "Poietic Generatorを研究装置にした論文。r/placeとの直接の影響関係を示さない。",
      },
    ],
  },

  {
    id: "06",
    code: "BNK",
    slug: "love-is-in-the-bin",
    title: "Love is in the Bin",
    author: "Banksy",
    year: 2018,
    yearLabel: "2018",
    headline: "落札直後、額の中で絵が切れ始める。",
    body:
      "値段が決まった直後、額の仕掛けで絵の一部が裁断された。その後、新しい題名の作品として認証され、買い手は購入を続けた。保存される物としての絵に、一度きりの出来事としての姿が重なる。価値を決める場への介入。",
    target:
      "2018年の落札直後の部分裁断と同年の公開記録。前後関係を知って見る一般視聴者。",
    place: "英国／ロンドン、Sotheby'sと同年の公開記録",
    review: {
      PS: {
        score: 5,
        reason:
          "落札された同じ絵が変形し、新しい題名で認証され購入も継続された経緯から、保存する物と出来事としての作品が重なる。",
        caveat:
          "価格の高さや後年の値上がりではなく、2018年の出来事と提示を評価する。",
        sourceIds: ["BNK-02", "BNK-03", "BNK-04"],
      },
      PL: {
        score: 4,
        reason:
          "保存・展示のための額が、絵を裁断する装置になる。正式な取引手順へ割り込むいたずらを、見る側が面白がれる。",
        caveat:
          "驚きの強さを遊びの強さへ直結しない。装置を操作する役を観客に与えたとはしない。",
        sourceIds: ["BNK-02"],
      },
      AG: {
        score: 1,
        reason:
          "記録を見る人は出来事を見届ける側であり、裁断する、購入を続行する、認証する役割は与えられていない。",
        caveat:
          "解釈や批判が可能なだけでは2としない。買い手本人を対象にした別の採点ではない。",
        sourceIds: ["BNK-02", "BNK-03", "BNK-09"],
      },
      CO: {
        score: 4,
        reason:
          "落札と裁断は同じ仕掛けで強く結びつく。一方、見届けるだけなら破損の驚きでも成立し、価値づけの変化には認証・購入続行の経緯をつなぐ判断が残る。",
        caveat:
          "v1.1の5から4へ。直近の合意案を採用し、4／5の解釈の幅を記録。2021年価格で補強しない。",
        sourceIds: ["BNK-02", "BNK-03", "BNK-04"],
      },
      EP: {
        score: 4,
        reason:
          "買われた直後の絵に何が起き、どう扱われるのかを見届けたいという好奇心が、記録へ入る理由になる。",
        caveat:
          "買い手の購入動機ではない。競売の前後関係を知る手間と知名度による補助を残す。",
        sourceIds: ["BNK-02", "BNK-09"],
      },
      EM: {
        score: 1,
        reason:
          "主な受け手は、確定した裁断の映像・記事を読む視聴者。その入力で元の提示や次の参加条件を更新する規則はない。",
        caveat:
          "売手・買手・認証側の判断や、外部のミームをこの視聴経験へ合算しない。",
        sourceIds: ["BNK-02", "BNK-03", "BNK-09"],
      },
      OR: {
        score: 4,
        reason:
          "自壊・消去の表現に先行例はあるが、落札成立の直後に、保護する額が対象を変える条件の結合に固有差がある。",
        caveat:
          "Tinguely、Rauschenbergとの比較。販売主体の「史上初」をそのまま採用しない。",
        sourceIds: ["BNK-07", "BNK-08", "BNK-13"],
      },
    },
    sources: [
      {
        id: "BNK-02",
        title: "Sotheby's Gets Banksy'ed at Contemporary Art Auction in London",
        by: "Sotheby's（2018-10-05表記）",
        url: "https://www.sothebys.com/en/articles/sothebys-gets-banksyed-at-contemporary-art-auction-in-london",
        support:
          "落札直後の部分裁断、額内装置、£1,042,000の販売結果、作者SNS記録の紹介。",
        caveat:
          "販売当事者の自己記録。史上初、事前不知等の宣伝・自己説明を独立認定にしない。日付表記後に追記された部分がある。",
      },
      {
        id: "BNK-03",
        title: "Latest Banksy Artwork 'Love is in the Bin' Created Live at Auction",
        by: "Sotheby's（2018-10-11）",
        url: "https://www.sothebys.com/en/articles/latest-banksy-artwork-love-is-in-the-bin-created-live-at-auction",
        support:
          "Pest Controlによる新作認証、改題、購入続行、2018年10月13–14日の一般公開。",
        caveat:
          "買手の声明は競売会社経由。視聴者一般の反応や作者の意図を示すものではない。",
      },
      {
        id: "BNK-04",
        title:
          "Banksy renames shredded painting Love Is In The Bin as work sells to winning bidder after a week of negotiation",
        by: "The Art Newspaper／Anny Shaw（2018-10-11）",
        url: "https://www.theartnewspaper.com/2018/10/11/banksy-renames-shredded-painting-love-is-in-the-bin-as-work-sells-to-winning-bidder-after-a-week-of-negotiation",
        support:
          "一週間の協議後の購入続行、手数料前£860,000／手数料込み約£1.04mの区別。",
        caveat:
          "競売会社の発表由来の箇所を別の独立証拠と数えない。事前共謀の有無を確定しない。",
      },
      {
        id: "BNK-09",
        title: "Banksy publishes video detailing auction stunt plan – video",
        by: "The Guardian（2018-10-07、映像出典Banksy）",
        url: "https://www.theguardian.com/artanddesign/video/2018/oct/07/banksy-publishes-video-detailing-auction-prank-plan-video",
        support: "作者制作の記録が当時公開・紹介された接触経路。",
        caveat:
          "動画全編の直接視聴・検証はしていない。制作過程の編集映像を機構や当日条件の完全な証拠とはしない。",
      },
      {
        id: "BNK-07",
        title:
          "Robert Breer. Homage to Jean Tinguely's Homage to New York. 1960",
        by: "The Museum of Modern Art",
        url: "https://www.moma.org/audio/playlist/40/649",
        support: "1960年Tinguelyの自壊する機械による作品との比較。",
        caveat:
          "本調査ではページ上の文字解説を確認。完全破壊が実現したか等の細部は本件で主張しない。",
      },
      {
        id: "BNK-08",
        title: "Robert Rauschenberg, Erased de Kooning Drawing, 1953",
        by: "San Francisco Museum of Modern Art",
        url: "https://www.sfmoma.org/artwork/98.298/",
        support: "先行する絵の消去によって別作品を成立させた比較例。",
        caveat:
          "破壊・消去という一点だけでBanksyと同一の仕掛けとはしない。競売との結合は別に検討。",
      },
      {
        id: "BNK-13",
        title:
          "Homage to New York: A Self-Constructing and Self-Destroying Work of Art Conceived and Built by Jean Tinguely",
        by: "The Museum of Modern Art",
        url: "https://www.moma.org/calendar/exhibitions/3369",
        support: "1960年3月17日の先行イベントの特定。",
        caveat: "BNK-07と同一機関の補完資料であり独立した二先行例ではない。",
      },
    ],
  },

  {
    id: "07",
    code: "PGO",
    slug: "pokemon-go",
    title: "Pokémon GO",
    author: "Niantic／株式会社ポケモン等",
    year: 2016,
    yearLabel: "2016",
    headline: "街をつくり替えずに、街で遊ぶ理由を変える。",
    body:
      "ポケモンを探して捕まえる遊びを、現実の移動につなぐ。いつもの道に、立ち止まる理由や寄り道の目的が重なる。捕まえたいという動機が、画面の外の行動を変える。ただし、歩くことがそのまま街への理解を深めるとは限らない。",
    target:
      "2016年配信初期の現実移動・探索・捕獲と補給地点。初期プレイヤーの近隣探索。",
    place:
      "米国・豪州・ニュージーランドで配信開始、日本ほか／現実空間とスマートフォン",
    review: {
      PS: {
        score: 4,
        reason:
          "捕獲や補充のための移動が、いつも通る道や目印への注意を変える。初期調査には記念物等への気づきの報告がある。",
        caveat:
          "現地を資源地点として使う関与も可能。歩いた人数を認識変化の人数としない。",
        sourceIds: ["PGO-01", "PGO-03"],
      },
      PL: {
        score: 5,
        reason:
          "探して、見つけて、捕まえ、集める試行が、活動への付加要素ではなく活動の中心になる。",
        caveat: "後年のレイド・交換を加えず、初期の探索と捕獲で5を説明する。",
        sourceIds: ["PGO-01", "PGO-03"],
      },
      AG: {
        score: 4,
        reason:
          "自分の移動・選択・捕獲が、自分の遭遇結果と手持ちを変える。観察や所定動作の実行だけにとどまらない。",
        caveat:
          "今回除外したジム等の共有競争を加えず4。身体運動の量ではなく、本人に委ねた結果への作用を見る。",
        sourceIds: ["PGO-01", "PGO-03"],
      },
      CO: {
        score: 4,
        reason:
          "捕まえたいという動機と現実移動は直接つながる。ただし移動先をゲーム資源として処理する関与もあり、場所そのものを見直す注意への接続には幅がある。",
        caveat:
          "v1.1の5から4へ。直近の合意案を採用。移動の必須性だけで見え直しへの必然性を5としない。",
        sourceIds: ["PGO-01", "PGO-02", "PGO-03"],
      },
      EP: {
        score: 4,
        reason:
          "なじみのあるポケモンとの遭遇や収集欲が、現実に出かける理由になる。",
        caveat:
          "対応端末・通信・時間・地域配置との摩擦は残る。熱心なファンだけへ受け手を絞らない。",
        sourceIds: ["PGO-01", "PGO-02", "PGO-03"],
      },
      EM: {
        score: 4,
        reason:
          "捕獲結果が手持ちに残り、未収集の対象や次の探索先を変える。同じ人の入力が、その人の次の行動条件へ返る。",
        caveat:
          "蓄積だけでなく次の選択へ返る点を4。基本範囲外の集団的な役割生成を足さない。",
        sourceIds: ["PGO-01", "PGO-03"],
      },
      OR: {
        score: 3,
        reason:
          "現地探索と位置ゲーム、地図上のポケモン発見の先行例を踏まえ、現実の寄り道と捕獲・個人収集の接続を組み替えとして読む。",
        caveat:
          "Geocaching、Ingress、2014年Google Maps Pokémon Challengeとの比較。売上や普及を発明の証拠にしない。",
        sourceIds: ["PGO-01", "PGO-05", "PGO-06"],
      },
    },
    sources: [
      {
        id: "PGO-01",
        title: "Break out the sneakers and Poké Balls!",
        by: "Niantic / John Hanke and the Niantic team (2016-07-06)",
        url: "https://pokemongo.com/news/launch",
        support:
          "米国・豪州・ニュージーランド配信、近隣探索と捕獲、初期の収集機能、先行Ingressの存在。",
        caveat:
          "主催者の効果主張を事実としない。GO Plusの将来形と現行フッターは配信当初の利用可能機能ではない。",
      },
      {
        id: "PGO-03",
        title:
          "“It wasn't really about the Pokémon”: Parents' Perspectives on a Location-Based Mobile Game",
        by: "Kiley Sobel, Arpita Bhattacharya, Alexis Hiniker, Jin Ha Lee, Julie A. Kientz, Jason C. Yip / CHI 2017",
        url: "https://faculty.washington.edu/alexisr/PokemonGO.pdf",
        support:
          "2016年7〜8月の保護者87人、親子共同利用、操作・知識・安全の支え、異なる動機と技能の接続、AR任意。",
        caveat:
          "保護者側の回答。ほぼ米国で高学歴・高所得に偏る。長期効果・子ども本人の経験を代表しない。DOI:10.1145/3025453.3025761。",
      },
      {
        id: "PGO-02",
        title: "Pokémon GO、いよいよ日本で配信開始！",
        by: "Niantic・株式会社ポケモン / Pokémon GO 開発チーム (2016-07-22)",
        url: "https://pokemongo.com/news/launch-jp",
        support:
          "日本開始日、実際に歩く参加形式、親子での参加案内、冒険・場所・人のつながりという作者意図。",
        caveat: "開発側の志向を受け手の実際の効果と区別。",
      },
      {
        id: "PGO-05",
        title: "The History of Geocaching",
        by: "Geocaching.com / Groundspeak",
        url: "https://www.geocaching.com/about/history.aspx",
        support: "2000年のGPS Stash Hunt、現実の容器を座標から探索する仕組み。",
        caveat:
          "現行の歴史解説であり2000年投稿そのものではない。位置ゲームの無前例性を否定する比較として使用。",
      },
      {
        id: "PGO-06",
        title: "Become a Pokémon Master with Google Maps",
        by: "Google / Tatsuo Nomura (2014-03-31)",
        url: "https://blog.google/products-and-platforms/products/maps/become-pokemon-master-with-google-maps/",
        support:
          "Google Mapsを探索し、ポケモンを発見して図鑑に加える2014年の先行形式。",
        caveat: "冗談の採用文脈を現実の雇用募集としない。地図上の探索と実際の現地移動を区別。",
      },
    ],
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}

/** 出典IDから、その件の出典を引く。審査理由の脚注に使う。 */
export function sourceOf(c: Case, id: string) {
  return c.sources.find((s) => s.id === id);
}
