// ============================================================
//  月亮图书馆管理员 · 网站内容配置
// ============================================================

export const siteConfig = {
  title: '月亮图书馆管理员',
  titleSub: 'The Lunar Library',
  heroSubtitle: '世界上所有被遗忘的东西，最终都会落进月亮。',
  scrollHint: '翻页',
  footerQuote: '人并不一定要知道自己的全部故事，才能继续向前。',
  copyright: '2026 @Dreamways',
  heroImage: './images/moon-library-hero.png',
  // 手机竖屏时背景图保留哪一部分（CSS background-position），对准画面里的人物
  heroImageFocus: '80% center',
  // 视频暂留作未来动态背景，不作为当前背景层。
  introVideo: './videos/intro.mp4',
};

// ────────────────────────────────────────────────────────────
//  管理员介绍
//
//  他整理所有被遗忘之物，却不能修改任何一本书，也不能拥有名字。
//  音频和肖像暂时留空，等正式素材完成后再接入。
// ────────────────────────────────────────────────────────────
export const protagonist = {
  show: true,
  sectionTitle: '关于管理员',
  image: './images/lunar-librarian.png',
  imageLabel: '没有名字的人',
  intro: '世界上所有被遗忘的东西，最终都会落进月亮。月亮里面有一座图书馆，管理员整理所有被遗忘的故事、约定、名字和梦。他不能离开月亮，不能修改任何书，也不能拥有名字。可是，他已经在那里待了很久。',
  audio: '',
};

// ────────────────────────────────────────────────────────────
//  四章叙事
//
//  每个章节同时决定故事面板和下方的意象卡片。
//  第一轮暂时复用旧视频，并关闭旧音频；正式素材在阶段三替换。
// ────────────────────────────────────────────────────────────
export const chapters = [
  {
    id: 'blank-book',
    // 桌面端文字面板的位置，避开画面里的人物：'left' | 'right' | 'center'
    panelAlign: 'right',
    video: './videos/spring-sky.mp4',
    image: './images/chapter-01-blank-book.png',
    imageFocus: '48% center',
    title: '第一章 · 掉进月亮里的书',
    story: '管理员照常整理被遗忘的故事、约定、名字和梦。某天，一本没有标题的空白书落进图书馆。第一页慢慢浮现一句话：从前有一个月亮图书馆管理员。他第一次意识到，书里写的是自己。',
    audio: '',
    color: '#DDE7F2',
    glassBg: 'rgba(221, 231, 242, 0.12)',
    character: {
      name: '空白的书',
      role: '正在寻找结局的故事',
      emoji: '📖',
      image: './images/card-blank-book.png',
      visualGradient: 'linear-gradient(160deg, #edf3f8 0%, #c7d6e5 45%, #9aaec4 100%)',
      desc: '一本没有标题的书，第一页写着管理员自己。',
      detail: '它不是被遗忘的故事，而是正在寻找结局的故事。书页没有墨水，却会在月光下慢慢浮现文字。',
      intro: '我没有标题，也没有结尾。可我知道，你翻开的第一页，写的就是你自己。',
      audio: '',
    },
  },
  {
    id: 'borrowed-names',
    panelAlign: 'right',
    video: './videos/summer-sky.mp4',
    image: './images/chapter-02-traveler.png',
    imageFocus: '42% center',
    title: '第二章 · 借走名字的旅人',
    story: '管理员第一次违反规则，离开月亮来到地面。他遇见一个拥有上百个名字、却记不得昨天叫什么的旅人。旅人告诉他：名字不是用来记住自己的，名字是为了让别人找到你。',
    audio: '',
    color: '#8F7CEC',
    glassBg: 'rgba(143, 124, 236, 0.14)',
    character: {
      name: '旅人',
      role: '借走许多名字的人',
      emoji: '🧳',
      image: './images/card-traveler.png',
      visualGradient: 'linear-gradient(160deg, #e6e1ff 0%, #afa3ed 45%, #f5c86a 100%)',
      desc: '他有上百个名字，却不记得昨天的自己。',
      detail: '旅人认为名字不是锁住身份，而是让别人找到你。他借走许多名字走过世界，也把每一次相遇留在别人心里。',
      intro: '我有过很多名字，但名字从来不是为了把你锁在原地。它是为了让想找你的人，知道该向哪里走。',
      audio: '',
    },
  },
  {
    id: 'clocktower',
    panelAlign: 'left',
    video: './videos/autumn-sky.mp4',
    image: './images/chapter-03-clocktower.png',
    imageFocus: '12% center',
    title: '第三章 · 世界尽头的钟楼',
    story: '管理员根据钥匙的线索来到世界尽头。那里有一座巨大的钟楼，每响一次，世界上就有一样东西被遗忘。他发现月亮图书馆里的所有故事都来自这里，也在钟楼深处找到自己的过去。',
    audio: '',
    color: '#D6A84F',
    glassBg: 'rgba(214, 168, 79, 0.13)',
    character: {
      name: '钟楼',
      role: '遗忘发生的地方',
      emoji: '🕰️',
      image: './images/card-clocktower.png',
      visualGradient: 'linear-gradient(160deg, #f5e6bd 0%, #c79d58 45%, #6e4b2a 100%)',
      desc: '每响一次，世界就遗忘一样东西。',
      detail: '管理员在这里看见自己的过去，也发现记忆曾被刻意删去。钟声从不停止，只是有些人已经听不见了。',
      intro: '每一次钟响，世界都会轻一点。你在这里找到的，不只是过去，还有谁曾经决定让你忘记。',
      audio: '',
    },
  },
  {
    id: 'last-book',
    panelAlign: 'right',
    video: './videos/winter-sky.mp4',
    image: './images/chapter-04-last-book.png',
    imageFocus: '15% center',
    title: '第四章 · 最后一本书',
    story: '管理员回到月亮，空白的书已经写满，只剩最后一页。书给出两个选择：取回名字回到人间，或继续留在月亮守护别人的故事。他没有打开最后一页，而是把书放回书架。月亮升起，图书馆重新开门，一本新的书落下。',
    audio: '',
    color: '#F0EEE7',
    glassBg: 'rgba(240, 238, 231, 0.12)',
    character: {
      name: '最后一本书',
      role: '等待选择的结局',
      emoji: '📚',
      image: './images/card-last-book.png',
      visualGradient: 'linear-gradient(160deg, #f8f6ef 0%, #c8ccd5 45%, #202532 100%)',
      desc: '写满一生，只缺最后一页。',
      detail: '它等待管理员选择是否取回名字，但管理员没有打开最后一页。他把书放回书架，继续守护那些仍在寻找结局的故事。',
      intro: '我只缺最后一页。你可以把名字写回自己，也可以把我放回书架，让另一个故事找到这里。',
      audio: '',
    },
  },
];

export type Chapter = typeof chapters[number];
