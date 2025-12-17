
import { World, Word, StoryChapter, StoryLine } from './types';

export const AVATARS = [
  "noob", "bacon", "guest", "girl_pink", "girl_purple",
  "cool_boy", "boy_blue", "ninja", "knight", "pirate",
  "wizard", "rich_boy", "zombie_survivor", "alien",
  "robot_2", "cat_hoodie"
];

export const TOTAL_LEVELS = 50;

// --- STORY DATA CONTENT ---

export const STORIES: StoryChapter[] = [
  {
    id: 1,
    title: "Kisah 1: Keluarga Sara",
    content: [
      // Vocab
      { id: 101, malay: "Sara", chinese: "莎拉 (人名)", audioText: "Sara", type: 'vocab', isName: true },
      { id: 102, malay: "ibu", chinese: "妈妈", audioText: "ibu", type: 'vocab' },
      { id: 103, malay: "bapa", chinese: "爸爸", audioText: "bapa", type: 'vocab' },
      { id: 113, malay: "Helo", chinese: "你好", audioText: "Helo", type: 'vocab' },
      { id: 114, malay: "Saya", chinese: "我", audioText: "Saya", type: 'vocab' },
      { id: 115, malay: "suka", chinese: "喜欢", audioText: "suka", type: 'vocab' },

      // Sentences
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
  }
];

// Helper to get distractors that are NOT names
export const getDistractors = (currentId: number, count: number = 3, type: 'vocab' | 'sentence' = 'vocab'): string[] => {
  const story = STORIES[0]; // Currently only 1 story
  
  // Filter candidates: same type, not current, NOT a name (unless current is a name, but user said no names in options)
  const candidates = story.content.filter(item => 
    item.id !== currentId && 
    item.type === type && 
    !item.isName 
  );
  
  // Shuffle and slice
  return candidates.sort(() => 0.5 - Math.random()).slice(0, count).map(c => c.chinese);
};


// --- LEGACY WORLD DATA (Kept for compatibility if needed, but UI will focus on Stories) ---

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
  // Placeholders for future stories
  { id: 2, name: "Kisah 2", enemy: "Panther", hp: 80, img: "panther", theme: "bg-emerald-800", bgPattern: "bg-emerald-700", desc: "Coming Soon", textColor: "text-emerald-100" },
  { id: 3, name: "Kisah 3", enemy: "Mech", hp: 120, img: "mech", theme: "bg-blue-700", bgPattern: "bg-blue-600", desc: "Coming Soon", textColor: "text-blue-100" },
];

// Legacy word generation for Versus mode compatibility
const generateWordList = (): Word[] => {
   const list: Word[] = [];
   // Flatten story content into legacy Word format
   STORIES.forEach((story, sIdx) => {
       story.content.forEach((line, lIdx) => {
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
   
   // Add some fillers if needed for versus mode random generation
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

// Legacy generator
export const generateOptions = (targetWord: Word) => {
    const otherWords = FULL_WORD_LIST.filter(w => w.id !== targetWord.id);
    const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...distractors, targetWord].sort(() => 0.5 - Math.random());
};
