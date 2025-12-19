import { World, Word, StoryChapter, StoryLine, Achievement, Player } from './types';

export const AVATARS = [
  "noob", "bacon", "guest", "girl_pink", "girl_purple",
  "cool_boy", "boy_blue", "ninja", "knight", "pirate",
  "wizard", "rich_boy", "zombie_survivor", "alien",
  "robot_2", "cat_hoodie"
];

export const TOTAL_LEVELS = 50;

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps',
        title: 'Siswa Baru',
        description: 'Dapatkan 5 bintang pertama.',
        icon: '⭐',
        condition: (p) => Object.values(p.stars).reduce((a, b) => a + b, 0) >= 5
    },
    {
        id: 'vocab_warrior',
        title: 'Jaguh Kosa Kata',
        description: 'Kumpul 1000 mata skor.',
        icon: '⚔️',
        condition: (p) => p.totalScore >= 1000
    },
    {
        id: 'spelling_bee',
        title: 'Pakar Ejaan',
        description: 'Selesaikan Level Ejaan (Level 4).',
        icon: '🐝',
        condition: (p) => Object.keys(p.stars).some(k => k.endsWith('-4'))
    },
    {
        id: 'sentence_master',
        title: 'Guru Tatabahasa',
        description: 'Kumpul 20 bintang.',
        icon: '🎓',
        condition: (p) => Object.values(p.stars).reduce((a, b) => a + b, 0) >= 20
    }
];

export const STORIES: StoryChapter[] = [
  {
    id: 1,
    title: "Kisah 1: Keluarga Sara",
    content: [
      { id: 101, malay: "Sara", chinese: "莎拉 (人名)", audioText: "Sara", type: 'vocab', isName: true },
      { id: 102, malay: "ibu", chinese: "妈妈", audioText: "ibu", type: 'vocab' },
      { id: 103, malay: "bapa", chinese: "爸爸", audioText: "bapa", type: 'vocab' },
      { id: 113, malay: "Helo", chinese: "你好", audioText: "Helo", type: 'vocab' },
      { id: 114, malay: "Saya", chinese: "我", audioText: "Saya", type: 'vocab' },
      { id: 115, malay: "suka", chinese: "喜欢", audioText: "suka", type: 'vocab' },
      { id: 104, malay: "Helo! Saya Sara.", chinese: "你好！我是莎拉。", audioText: "Helo! Saya Sara.", type: 'sentence' },
      { id: 105, malay: "Helo! Saya ibu Sara.", chinese: "你好！我是莎拉的妈妈。", audioText: "Helo! Saya ibu Sara.", type: 'sentence' },
      { id: 106, malay: "Helo! Saya bapa Sara.", chinese: "你好！我是莎拉的爸爸。", audioText: "Helo! Saya bapa Sara.", type: 'sentence' },
      { id: 107, malay: "Helo, ibu!", chinese: "你好，妈妈！", audioText: "Helo, ibu!", type: 'sentence' },
      { id: 108, malay: "Helo, bapa!", chinese: "你好，爸爸！", audioText: "Helo, bapa!", type: 'sentence' },
      { id: 109, malay: "Sara suka ibu.", chinese: "莎拉喜欢妈妈。", audioText: "Sara suka ibu.", type: 'sentence' },
      { id: 110, malay: "Sara suka bapa.", chinese: "莎拉喜欢爸爸。", audioText: "Sara suka bapa.", type: 'sentence' },
      { id: 111, malay: "Ibu suka Sara.", chinese: "妈妈喜欢莎拉。", audioText: "Ibu suka Sara.", type: 'sentence' },
      { id: 112, malay: "Bapa suka Sara.", chinese: "爸爸喜欢莎拉。", audioText: "Bapa suka Sara.", type: 'sentence' }
    ]
  },
  {
    id: 2,
    title: "Kisah 2: Tubuh Sara",
    content: [
      { id: 201, malay: "kepala", chinese: "头", audioText: "kepala", type: 'vocab' },
      { id: 202, malay: "rambut", chinese: "头发", audioText: "rambut", type: 'vocab' },
      { id: 203, malay: "muka", chinese: "脸", audioText: "muka", type: 'vocab' },
      { id: 204, malay: "mata", chinese: "眼睛", audioText: "mata", type: 'vocab' },
      { id: 205, malay: "hidung", chinese: "鼻子", audioText: "hidung", type: 'vocab' },
      { id: 206, malay: "mulut", chinese: "嘴巴", audioText: "mulut", type: 'vocab' },
      { id: 207, malay: "telinga", chinese: "耳朵", audioText: "telinga", type: 'vocab' },
      { id: 208, malay: "bahu", chinese: "肩膀", audioText: "bahu", type: 'vocab' },
      { id: 209, malay: "tangan", chinese: "手", audioText: "tangan", type: 'vocab' },
      { id: 210, malay: "perut", chinese: "肚子", audioText: "perut", type: 'vocab' },
      { id: 211, malay: "kaki", chinese: "脚", audioText: "kaki", type: 'vocab' },
      { id: 212, malay: "Ibu, ibu! Ini apa?", chinese: "妈妈，妈妈！这是什么？", audioText: "Ibu, ibu! Ini apa?", type: 'sentence' },
      { id: 213, malay: "Ini kepala. Ini kepala Sara.", chinese: "这是头。这是莎拉的头。", audioText: "Ini kepala. Ini kepala Sara.", type: 'sentence' },
      { id: 214, malay: "Ini rambut. Ini rambut Sara.", chinese: "这是头发。这是莎拉的头发。", audioText: "Ini rambut. Ini rambut Sara.", type: 'sentence' },
      { id: 215, malay: "Ini muka. Ini muka Sara.", chinese: "这是脸。这是莎拉的脸。", audioText: "Ini muka. Ini muka Sara.", type: 'sentence' },
      { id: 216, malay: "Ini mata. Ini mata Sara.", chinese: "这是眼睛。这是莎拉的眼睛。", audioText: "Ini mata. Ini mata Sara.", type: 'sentence' },
      { id: 217, malay: "Ini hidung. Ini hidung Sara.", chinese: "这是鼻子。这是莎拉的鼻子。", audioText: "Ini hidung. Ini hidung Sara.", type: 'sentence' },
      { id: 218, malay: "Ini mulut. Ini mulut Sara.", chinese: "这是嘴巴。这是莎拉的嘴巴。", audioText: "Ini mulut. Ini mulut Sara.", type: 'sentence' },
      { id: 219, malay: "Ini telinga. Ini telinga Sara.", chinese: "这是耳朵。这是莎拉的耳朵。", audioText: "Ini telinga. Ini telinga Sara.", type: 'sentence' },
      { id: 220, malay: "Ini bahu. Ini bahu Sara.", chinese: "这是肩膀。这是莎拉的肩膀。", audioText: "Ini bahu. Ini bahu Sara.", type: 'sentence' },
      { id: 221, malay: "Ini tangan. Ini tangan Sara.", chinese: "这是手。这是莎拉的手。", audioText: "Ini tangan. Ini tangan Sara.", type: 'sentence' },
      { id: 222, malay: "Ini perut. Ini perut Sara.", chinese: "这是肚子。这是莎拉的肚子。", audioText: "Ini perut. Ini perut Sara.", type: 'sentence' },
      { id: 223, malay: "Ini kaki. Ini kaki Sara.", chinese: "这是脚。这是莎拉的脚。", audioText: "Ini kaki. Ini kaki Sara.", type: 'sentence' }
    ]
  },
  {
    id: 3,
    title: "Kisah 3: Hari Jadi Sara",
    content: [
      { id: 301, malay: "hari", chinese: "天 / 日子", audioText: "hari", type: 'vocab' },
      { id: 302, malay: "buku", chinese: "书", audioText: "buku", type: 'vocab' },
      { id: 303, malay: "bola", chinese: "球", audioText: "bola", type: 'vocab' },
      { id: 304, malay: "topi", chinese: "帽子", audioText: "topi", type: 'vocab' },
      { id: 305, malay: "guli", chinese: "弹珠", audioText: "guli", type: 'vocab' },
      { id: 306, malay: "Ibu, ibu! Hari ini hari apa?", chinese: "妈妈，妈妈！今天是什么日子？", audioText: "Ibu, ibu! Hari ini hari apa?", type: 'sentence' },
      { id: 307, malay: "Hari jadi Sara.", chinese: "莎拉的生日。", audioText: "Hari jadi Sara.", type: 'sentence' },
      { id: 308, malay: "Bapa, bapa! Hari ini hari apa?", chinese: "爸爸，爸爸！今天是什么日子？", audioText: "Bapa, bapa! Hari ini hari apa?", type: 'sentence' },
      { id: 309, malay: "Hari jadi Sara.", chinese: "莎拉的生日。", audioText: "Hari jadi Sara.", type: 'sentence' },
      { id: 310, malay: "Hari ini hari jadi Sara.", chinese: "今天也是莎拉的生日。", audioText: "Hari ini hari jadi Sara.", type: 'sentence' },
      { id: 311, malay: "Itu Zaki. Itu Mira.", chinese: "那是扎基。那是米拉。", audioText: "Itu Zaki. Itu Mira.", type: 'sentence' },
      { id: 312, malay: "Zaki bawa apa?", chinese: "扎基带了什么？", audioText: "Zaki bawa apa?", type: 'sentence' },
      { id: 313, malay: "Zaki bawa buku.", chinese: "扎基带了书。", audioText: "Zaki bawa buku.", type: 'sentence' },
      { id: 314, malay: "Zaki bawa bola.", chinese: "扎基带了球。", audioText: "Zaki bawa bola.", type: 'sentence' },
      { id: 315, malay: "Mira bawa apa?", chinese: "米拉带了什么？", audioText: "Mira bawa apa?", type: 'sentence' },
      { id: 316, malay: "Mira bawa topi.", chinese: "米拉带了帽子。", audioText: "Mira bawa topi.", type: 'sentence' },
      { id: 317, malay: "Mira bawa guli.", chinese: "米拉带了弹珠。", audioText: "Mira bawa guli.", type: 'sentence' }
    ]
  },
  {
    id: 4,
    title: "Kisah 4: Jeli dan Roti",
    content: [
      { id: 401, malay: "jeli", chinese: "果冻", audioText: "jeli", type: 'vocab' },
      { id: 402, malay: "roti", chinese: "面包", audioText: "roti", type: 'vocab' },
      { id: 403, malay: "kaya", chinese: "咖央酱", audioText: "kaya", type: 'vocab' },
      { id: 404, malay: "mahu", chinese: "要", audioText: "mahu", type: 'vocab' },
      { id: 405, malay: "beri", chinese: "给", audioText: "beri", type: 'vocab' },
      { id: 406, malay: "Sara ada jeli.", chinese: "莎拉有果冻。", audioText: "Sara ada jeli.", type: 'sentence' },
      { id: 407, malay: "Zaki mahu jeli?", chinese: "扎基要果冻吗？", audioText: "Zaki mahu jeli?", type: 'sentence' },
      { id: 408, malay: "Sara beri Zaki jeli.", chinese: "莎拉给扎基果冻。", audioText: "Sara beri Zaki jeli.", type: 'sentence' },
      { id: 409, malay: "Kami ada jeli.", chinese: "我们有果冻。", audioText: "Kami ada jeli.", type: 'sentence' },
      { id: 410, malay: "Sara suka jeli.", chinese: "莎拉喜欢果冻。", audioText: "Sara suka jeli.", type: 'sentence' },
      { id: 411, malay: "Zaki suka jeli.", chinese: "扎基喜欢果冻。", audioText: "Zaki suka jeli.", type: 'sentence' },
      { id: 412, malay: "Zaki ada roti.", chinese: "扎基有面包。", audioText: "Zaki ada roti.", type: 'sentence' },
      { id: 413, malay: "Sara mahu roti?", chinese: "莎拉要面包吗？", audioText: "Sara mahu roti?", type: 'sentence' },
      { id: 414, malay: "Zaki beri Sara roti.", chinese: "扎基给莎拉面包。", audioText: "Zaki beri Sara roti.", type: 'sentence' },
      { id: 415, malay: "Kami ada roti.", chinese: "我们有面包。", audioText: "Kami ada roti.", type: 'sentence' },
      { id: 416, malay: "Roti Zaki ada kaya.", chinese: "扎基的面包有咖央酱。", audioText: "Roti Zaki ada kaya.", type: 'sentence' },
      { id: 417, malay: "Roti Sara ada kaya.", chinese: "莎拉的面包有咖央酱。", audioText: "Roti Sara ada kaya.", type: 'sentence' },
      { id: 418, malay: "Roti kami ada kaya.", chinese: "我们的面包有咖央酱。", audioText: "Roti kami ada kaya.", type: 'sentence' },
      { id: 419, malay: "Zaki suka roti.", chinese: "扎基喜欢面包。", audioText: "Zaki suka roti.", type: 'sentence' },
      { id: 420, malay: "Sara suka roti.", chinese: "莎拉喜欢面包。", audioText: "Sara suka roti.", type: 'sentence' }
    ]
  },
  {
    id: 5,
    title: "Kisah 5: Didi si Kucing",
    content: [
      { id: 501, malay: "bulu", chinese: "毛", audioText: "bulu", type: 'vocab' },
      { id: 502, malay: "gebu", chinese: "蓬松", audioText: "gebu", type: 'vocab' },
      { id: 503, malay: "mata", chinese: "眼睛", audioText: "mata", type: 'vocab' },
      { id: 504, malay: "biru", chinese: "蓝色", audioText: "biru", type: 'vocab' },
      { id: 505, malay: "jaga", chinese: "照顾", audioText: "jaga", type: 'vocab' },
      { id: 506, malay: "susu", chinese: "牛奶", audioText: "susu", type: 'vocab' },
      { id: 507, malay: "juga", chinese: "也 / 同样", audioText: "juga", type: 'vocab' },
      { id: 508, malay: "baharu", chinese: "新", audioText: "baharu", type: 'vocab' },
      { id: 509, malay: "Ini Didi.", chinese: "这是迪迪。", audioText: "Ini Didi.", type: 'sentence' },
      { id: 510, malay: "Bulu Didi gebu.", chinese: "迪迪的毛很蓬松。", audioText: "Bulu Didi gebu.", type: 'sentence' },
      { id: 511, malay: "Mata Didi biru.", chinese: "迪迪的眼睛是蓝色的。", audioText: "Mata Didi biru.", type: 'sentence' },
      { id: 512, malay: "Sara jaga Didi.", chinese: "莎拉照顾迪迪。", audioText: "Sara jaga Didi.", type: 'sentence' },
      { id: 513, malay: "Ibu jaga Didi.", chinese: "妈妈照顾迪迪。", audioText: "Ibu jaga Didi.", type: 'sentence' },
      { id: 514, malay: "Bapa juga jaga Didi.", chinese: "爸爸也照顾迪迪。", audioText: "Bapa juga jaga Didi.", type: 'sentence' },
      { id: 515, malay: "Didi ada bola.", chinese: "迪迪有球。", audioText: "Didi ada bola.", type: 'sentence' },
      { id: 516, malay: "Didi juga ada bola baharu.", chinese: "迪迪也有新球。", audioText: "Didi juga ada bola baharu.", type: 'sentence' },
      { id: 517, malay: "Didi suka bola baharu.", chinese: "迪迪喜欢新球。", audioText: "Didi suka bola baharu.", type: 'sentence' },
      { id: 518, malay: "Didi suka bola biru.", chinese: "迪迪喜欢蓝色的球。", audioText: "Didi suka bola biru.", type: 'sentence' },
      { id: 519, malay: "Didi mahu susu.", chinese: "迪迪要喝牛奶。", audioText: "Didi mahu susu.", type: 'sentence' },
      { id: 520, malay: "Ibu, ibu! Didi mahu susu.", chinese: "妈妈，妈妈！迪迪要喝牛奶。", audioText: "Ibu, ibu! Didi mahu susu.", type: 'sentence' },
      { id: 521, malay: "Ibu beri Didi susu.", chinese: "妈妈给迪迪牛奶。", audioText: "Ibu beri Didi susu.", type: 'sentence' },
      { id: 522, malay: "Didi suka susu.", chinese: "迪迪喜欢牛奶。", audioText: "Didi suka susu.", type: 'sentence' }
    ]
  },
  {
    id: 6,
    title: "Kisah 6: Mari Berlari",
    content: [
      { id: 601, malay: "mari", chinese: "来", audioText: "mari", type: 'vocab' },
      { id: 602, malay: "lari", chinese: "跑", audioText: "lari", type: 'vocab' },
      { id: 603, malay: "laju", chinese: "快", audioText: "laju", type: 'vocab' },
      { id: 604, malay: "bawa", chinese: "带", audioText: "bawa", type: 'vocab' },
      { id: 605, malay: "bersama-sama", chinese: "一起", audioText: "bersama-sama", type: 'vocab' },
      { id: 606, malay: "daripada", chinese: "比起 / 较", audioText: "daripada", type: 'vocab' },
      { id: 607, malay: "Mari kita lari.", chinese: "我们一起来跑。", audioText: "Mari kita lari.", type: 'sentence' },
      { id: 608, malay: "Sara lari laju.", chinese: "莎拉跑得快。", audioText: "Sara lari laju.", type: 'sentence' },
      { id: 609, malay: "Zaki lari laju.", chinese: "扎基跑得快。", audioText: "Zaki lari laju.", type: 'sentence' },
      { id: 610, malay: "Mira juga lari laju.", chinese: "米拉也跑得快。", audioText: "Mira juga lari laju.", type: 'sentence' },
      { id: 611, malay: "Sara lari laju daripada Zaki.", chinese: "莎拉跑得比扎基快。", audioText: "Sara lari laju daripada Zaki.", type: 'sentence' },
      { id: 612, malay: "Zaki lari laju daripada Mira.", chinese: "扎基跑得比米拉快。", audioText: "Zaki lari laju daripada Mira.", type: 'sentence' },
      { id: 613, malay: "Kami lari laju bersama-sama.", chinese: "我们一起跑得很快。", audioText: "Kami lari laju bersama-sama.", type: 'sentence' },
      { id: 614, malay: "Mari kita lari bawa bola.", chinese: "我们一起来带着球跑。", audioText: "Mari kita lari bawa bola.", type: 'sentence' },
      { id: 615, malay: "Zaki lari bawa bola.", chinese: "扎基带着球跑。", audioText: "Zaki lari bawa bola.", type: 'sentence' },
      { id: 616, malay: "Sara lari bawa bola.", chinese: "莎拉带着球跑。", audioText: "Sara lari bawa bola.", type: 'sentence' },
      { id: 617, malay: "Mira juga lari bawa bola.", chinese: "米拉也带着球跑。", audioText: "Mira juga lari bawa bola.", type: 'sentence' },
      { id: 618, malay: "Kami lari bawa bola bersama-sama.", chinese: "我们一起带着球跑。", audioText: "Kami lari bawa bola bersama-sama.", type: 'sentence' },
      { id: 619, malay: "Itu Didi. Didi lari laju.", chinese: "那是迪迪。迪迪跑得快。", audioText: "Itu Didi. Didi lari laju.", type: 'sentence' },
      { id: 620, malay: "Didi lari bawa bola.", chinese: "迪迪带着球跑。", audioText: "Didi lari bawa bola.", type: 'sentence' }
    ]
  },
  {
    id: 7,
    title: "Kisah 7: Tadika Cahaya",
    content: [
      { id: 701, malay: "tadika", chinese: "幼儿园", audioText: "tadika", type: 'vocab' },
      { id: 702, malay: "Cahaya", chinese: "光芒", audioText: "Cahaya", type: 'vocab' },
      { id: 703, malay: "guru", chinese: "老师", audioText: "guru", type: 'vocab' },
      { id: 704, malay: "cerita", chinese: "故事", audioText: "cerita", type: 'vocab' },
      { id: 705, malay: "suku kata", chinese: "音节", audioText: "suku kata", type: 'vocab' },
      { id: 706, malay: "baca", chinese: "读", audioText: "baca", type: 'vocab' },
      { id: 707, malay: "Ini tadika Sara.", chinese: "这是莎拉的幼儿园。", audioText: "Ini tadika Sara.", type: 'sentence' },
      { id: 708, malay: "Ini tadika Zaki.", chinese: "这是扎基的幼儿园。", audioText: "Ini tadika Zaki.", type: 'sentence' },
      { id: 709, malay: "Ini juga tadika Mira.", chinese: "这也是米拉的幼儿园。", audioText: "Ini juga tadika Mira.", type: 'sentence' },
      { id: 710, malay: "Nama tadika ini Tadika Cahaya.", chinese: "这间幼儿园的名字叫光芒幼儿园。", audioText: "Nama tadika ini Tadika Cahaya.", type: 'sentence' },
      { id: 711, malay: "Helo, Zaki!", chinese: "你好扎基！", audioText: "Helo, Zaki!", type: 'sentence' },
      { id: 712, malay: "Helo, Mira!", chinese: "你好米拉！", audioText: "Helo, Mira!", type: 'sentence' },
      { id: 713, malay: "Helo, Sara!", chinese: "你好莎拉！", audioText: "Helo, Sara!", type: 'sentence' },
      { id: 714, malay: "Itu guru kami.", chinese: "那是我们的老师。", audioText: "Itu guru kami.", type: 'sentence' },
      { id: 715, malay: "Guru bawa buku.", chinese: "老师带了书。", audioText: "Guru bawa buku.", type: 'sentence' },
      { id: 716, malay: "Guru bawa buku cerita.", chinese: "老师带了故事书。", audioText: "Guru bawa buku cerita.", type: 'sentence' },
      { id: 717, malay: "Guru bawa buku suku kata.", chinese: "老师带了音节书。", audioText: "Guru bawa buku suku kata.", type: 'sentence' },
      { id: 718, malay: "Kami mahu baca buku.", chinese: "我们要读书。", audioText: "Kami mahu baca buku.", type: 'sentence' },
      { id: 719, malay: "Kami baca buku cerita.", chinese: "我们读故事书。", audioText: "Kami baca buku cerita.", type: 'sentence' },
      { id: 720, malay: "Kami baca buku suku kata.", chinese: "我们读音节书。", audioText: "Kami baca buku suku kata.", type: 'sentence' },
      { id: 721, malay: "Kami suka Tadika Cahaya.", chinese: "我们喜欢光芒幼儿园。", audioText: "Kami suka Tadika Cahaya.", type: 'sentence' }
    ]
  },
  {
    id: 8,
    title: "Kisah 8: Cuti di Melaka",
    content: [
      { id: 801, malay: "cuti", chinese: "假期", audioText: "cuti", type: 'vocab' },
      { id: 802, malay: "Melaka", chinese: "马六甲", audioText: "Melaka", type: 'vocab' },
      { id: 803, malay: "kamera", chinese: "照相机", audioText: "kamera", type: 'vocab' },
      { id: 804, malay: "kereta", chinese: "汽车", audioText: "kereta", type: 'vocab' },
      { id: 805, malay: "kota", chinese: "城堡", audioText: "kota", type: 'vocab' },
      { id: 806, malay: "perigi", chinese: "井", audioText: "perigi", type: 'vocab' },
      { id: 807, malay: "kebaya", chinese: "卡巴雅", audioText: "kebaya", type: 'vocab' },
      { id: 808, malay: "peta", chinese: "地图", audioText: "peta", type: 'vocab' },
      { id: 809, malay: "dadu", chinese: "骰子", audioText: "dadu", type: 'vocab' },
      { id: 810, malay: "kayu", chinese: "木头", audioText: "kayu", type: 'vocab' },
      { id: 811, malay: "Hari ini hari cuti.", chinese: "今天是一个假期。", audioText: "Hari ini hari cuti.", type: 'sentence' },
      { id: 812, malay: "Hari ini kami ke Melaka.", chinese: "今天我们去马六甲。", audioText: "Hari ini kami ke Melaka.", type: 'sentence' },
      { id: 813, malay: "Ibu bawa roti. Ibu bawa kaya.", chinese: "妈妈带了面包和咖央酱。", audioText: "Ibu bawa roti. Ibu bawa kaya.", type: 'sentence' },
      { id: 814, malay: "Sara bawa susu.", chinese: "莎拉带了牛奶。", audioText: "Sara bawa susu.", type: 'sentence' },
      { id: 815, malay: "Bapa bawa kamera baharu.", chinese: "爸爸带了新照相机。", audioText: "Bapa bawa kamera baharu.", type: 'sentence' },
      { id: 816, malay: "Bapa bawa kereta baharu.", chinese: "爸爸带了新车。", audioText: "Bapa bawa kereta baharu.", type: 'sentence' },
      { id: 817, malay: "Di Melaka ada kota lama.", chinese: "马六甲有旧城堡。", audioText: "Di Melaka ada kota lama.", type: 'sentence' },
      { id: 818, malay: "Itu Kota A Famosa.", chinese: "那是爱法摩沙城堡。", audioText: "Itu Kota A Famosa.", type: 'sentence' },
      { id: 819, malay: "Di Melaka ada perigi lama.", chinese: "马六甲有古井。", audioText: "Di Melaka ada perigi lama.", type: 'sentence' },
      { id: 820, malay: "Itu Perigi Puteri Cina.", chinese: "那是汉丽宝井。", audioText: "Itu Perigi Puteri Cina.", type: 'sentence' },
      { id: 821, malay: "Ibu beli kebaya.", chinese: "妈妈买了卡巴雅。", audioText: "Ibu beli kebaya.", type: 'sentence' },
      { id: 822, malay: "Bapa beli peta lama.", chinese: "爸爸买了旧地图。", audioText: "Bapa beli peta lama.", type: 'sentence' },
      { id: 823, malay: "Sara beli dadu kayu.", chinese: "莎拉买了木骰子。", audioText: "Sara beli dadu kayu.", type: 'sentence' },
      { id: 824, malay: "Kami suka Melaka.", chinese: "我们喜欢马六甲。", audioText: "Kami suka Melaka.", type: 'sentence' }
    ]
  }
];

export const getDistractors = (currentId: number, count: number = 3, type: 'vocab' | 'sentence' = 'vocab'): string[] => {
  const allContent = STORIES.flatMap(s => s.content);
  const candidates = allContent.filter(item => 
    item.id !== currentId && 
    item.type === type && 
    !item.isName 
  );
  
  const uniqueMeanings = Array.from(new Set(candidates.map(c => c.chinese)));
  return uniqueMeanings.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const WORLDS: World[] = [
  { 
    id: 1, 
    name: "Kisah 1: Sara", 
    enemy: "Si Bulat", 
    hp: 40, 
    img: "slime", 
    theme: "bg-green-600", 
    bgPattern: "bg-green-500", 
    desc: "Kenali Sara dan keluarganya.",
    textColor: "text-green-100"
  },
  { 
    id: 2, 
    name: "Kisah 2: Tubuh Sara", 
    enemy: "Harimau Kumbang", 
    hp: 60, 
    img: "panther", 
    theme: "bg-blue-600", 
    bgPattern: "bg-blue-500", 
    desc: "Bahagian tubuh badan Sara.",
    textColor: "text-blue-100"
  },
  { 
    id: 3, 
    name: "Dunia Hari Jadi & Makanan", 
    enemy: "Raksasa Api", 
    hp: 80, 
    img: "magma", 
    theme: "bg-orange-600", 
    bgPattern: "bg-orange-500", 
    desc: "Kisah 3 & 4: Hari jadi dan snek!",
    textColor: "text-orange-100"
  },
  { 
    id: 4, 
    name: "Dunia Haiwan & Aktiviti", 
    enemy: "Mech Robot", 
    hp: 100, 
    img: "robot_2", 
    theme: "bg-purple-600", 
    bgPattern: "bg-purple-500", 
    desc: "Kisah 5 & 6: Didi dan berlari.",
    textColor: "text-purple-100"
  },
  { 
    id: 5, 
    name: "Dunia Sekolah & Cuti", 
    enemy: "Raja Langit", 
    hp: 120, 
    img: "king", 
    theme: "bg-red-600", 
    bgPattern: "bg-red-500", 
    desc: "Kisah 7 & 8: Belajar dan bercuti.",
    textColor: "text-red-100"
  }
];

const generateWordList = (): Word[] => {
   const list: Word[] = [];
   STORIES.forEach((story, sIdx) => {
       story.content.forEach((line) => {
           if(line.type === 'vocab') {
               list.push({
                   id: line.id,
                   word: line.malay,
                   meaning: line.chinese,
                   level: sIdx + 1
               });
           }
       });
   });
   const fillers = [
       { id: 901, word: "saya", meaning: "我", level: 1 },
       { id: 902, word: "kamu", meaning: "你", level: 1 },
       { id: 903, word: "dia", meaning: "他", level: 1 },
       { id: 904, word: "makan", meaning: "吃", level: 1 },
       { id: 905, word: "minum", meaning: "喝", level: 1 }
   ];
   return [...list, ...fillers];
};

export const FULL_WORD_LIST = generateWordList();
export const getWordsForLevel = (level: number) => FULL_WORD_LIST.filter(w => w.level === level);
export const getRandomWords = (count: number, rangeStart = 1, rangeEnd = 50) => {
    return FULL_WORD_LIST.sort(() => 0.5 - Math.random()).slice(0, count);
};
export const generateOptions = (targetWord: Word) => {
    const otherWords = FULL_WORD_LIST.filter(w => w.id !== targetWord.id);
    const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...distractors, targetWord].sort(() => 0.5 - Math.random());
};
