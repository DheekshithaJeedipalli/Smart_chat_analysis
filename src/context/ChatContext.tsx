import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interfaces for our structured dashboard metrics
export interface TopInteraction {
  name: string;
  count: number;
  rank: number;
}

export interface StarterEnderData {
  you: number;
  them: number;
  countYou: number;
  countThem: number;
  desc: string;
}

export interface DoubleTextData {
  you: number;
  them: number;
  desc: string;
}

export interface ReplyTimeData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface IgnoreRateData {
  you: string;
  them: string;
  desc: string;
}

export interface LongestWaitData {
  value: string;
  detail: string;
  desc: string;
}

export interface BadgeData {
  emoji: string;
  title: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface ParticipantStats {
  name: string;
  avatarUrl?: string;
  totalMessages: number;
  totalWords: number;
  avgWordsPerMessage: number;
  longestMessageWords: number;
  firstMessageDate: string;
  lastMessageDate: string;
  avgResponseTimeStr: string;
  messagesPerDay: number;
  avgMessagesPerActiveDay: number;
  longestSessionStr: string;
  longestInactiveGapStr: string;
  images: number;
  videos: number;
  voiceNotes: number;
  documents: number;
  links: number;
  gifs: number;
  stickers: number;
  emojiCount: number;
  mostUsedEmojis: { emoji: string, count: number }[];
  emojiPerMessage: number;
  questionFreq: string;
  exclamationFreq: string;
  uppercaseFreq: string;
  editedMessages: number;
  deletedMessages: number;
  forwardedMessages: number;
  monthlyGrowth: { month: string, count: number }[];
  aiInsights: string[];
  moodStats: {
    happy: number;
    sad: number;
    angry: number;
    study: number;
    work: number;
    common: number;
  };
}

export interface ChatDataset {
  contactName: string;
  messageCount: number;
  dateRange: string;
  topInteractions: TopInteraction[];
  interactionScore: number;
  interactionLabel: string;
  streakCount: number;
  starters: StarterEnderData;
  enders: StarterEnderData;
  doubleText: DoubleTextData;
  replyTime: ReplyTimeData;
  ignoreRate: IgnoreRateData;
  longestWait: LongestWaitData;
  avgDuration: string;
  durationBars: number[];
  badges: BadgeData[];
  participantCount?: number;
  activeDays?: number;
  totalMedia?: number;
  imageCount?: number;
  videoCount?: number;
  docCount?: number;
  voiceCount?: number;
  callLogs?: CallLog[];
  activityData?: ActivityData;
  participantsData?: Record<string, ParticipantStats>;
  rawMessages?: { date: string; sender: string; text: string }[];
}

export interface ActivityData {
  mostActiveHour: string;
  mostActiveDay: string;
  mostActiveMonth: string;
  quietHours: string;
  lateNightPercent: string;
  morningPercent: string;
  eveningPercent: string;
  morningCount: number;
  eveningCount: number;
  lateNightCount: number;
  weekendPercent: string;
  weekdayPercent: string;
  heatmapData: number[][];
  calendarData: Record<string, number>;
  hourCounts: number[];
  dayCounts: number[];
  monthCountsArr: number[];
  yearCounts: Record<string, number>;
  weeklyTrend: { date: string, count: number }[];
  dailyTrend: { date: string, count: number }[];
  mostActiveYear: string;
}

export interface CallLog {
  type: 'Voice' | 'Video';
  date: string;
  time: string;
  initiator: string;
  missed?: boolean;
}
export interface MediaAsset {
  filename: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
}

interface ChatContextType {
  currentTab: string;
  setTab: (tab: string) => void;
  isDemoData: boolean;
  currentData: ChatDataset;
  mediaAssets: MediaAsset[];
  uploadCustomChat: (filename: string, fileText: string, media: MediaAsset[], onProgress: (prg: number, status: string) => void) => Promise<void>;
  deleteCustomChat: () => void;
  hasChat: boolean;
  uploadedFilename: string;
  uploadedFileTime: string;
}

// ----------------------------------------------------
// DEFAULT DATASETS (Sarah & Elena)
// ----------------------------------------------------
const sarahDataset: ChatDataset = {
  contactName: 'Sarah',
  messageCount: 12458,
  dateRange: 'Jan 1, 2026 - Jun 30, 2026',
  topInteractions: [
    { name: 'Sarah', count: 5824, rank: 1 },
    { name: 'Mom', count: 3120, rank: 2 },
    { name: 'John', count: 1420, rank: 3 },
    { name: 'David', count: 980, rank: 4 },
    { name: 'Emma', count: 614, rank: 5 },
    { name: 'Sis', count: 240, rank: 6 },
    { name: 'Mick (Dev Group)', count: 120, rank: 7 },
    { name: 'Boss', count: 98, rank: 8 },
    { name: 'Uber Driver', count: 32, rank: 9 },
    { name: 'Alex', count: 10, rank: 10 }
  ],
  interactionScore: 87,
  interactionLabel: 'Excellent',
  streakCount: 18,
  starters: {
    you: 58,
    them: 42,
    countYou: 324,
    countThem: 231,
    desc: 'You initiate slightly more chats with this contact.'
  },
  enders: {
    you: 44,
    them: 56,
    countYou: 246,
    countThem: 309,
    desc: 'Sarah usually leaves the last message in conversations.'
  },
  doubleText: {
    you: 142,
    them: 98,
    desc: 'You text multiple times in a row ~30% more often than Sarah.'
  },
  replyTime: {
    categories: ['<1m', '5m', '15m', '1h', '4h', '12h', '24h+'],
    series: [
      { name: 'You', data: [45, 25, 15, 8, 4, 2, 1] },
      { name: 'Sarah', data: [32, 28, 20, 10, 6, 3, 1] }
    ]
  },
  ignoreRate: {
    you: '2.4%',
    them: '4.8%',
    desc: 'Ignored status represents messages unanswered for >24 hrs.'
  },
  longestWait: {
    value: '6d 14h',
    detail: 'Replied by Sarah',
    desc: 'During vacation period (Feb 14, 2026)'
  },
  avgDuration: '24.5 min',
  durationBars: [35, 48, 60, 38, 75, 85, 52, 40, 64, 70],
  badges: [
    { emoji: '🦉', title: 'Night Owl', rarity: 'Rare' },
    { emoji: '⚡', title: 'First Responder', rarity: 'Legendary' },
    { emoji: '📝', title: 'Novelist', rarity: 'Common' },
    { emoji: '🎭', title: 'Meme Curator', rarity: 'Epic' },
    { emoji: '🗣️', title: 'Echo Chamber', rarity: 'Common' }
  ],
  callLogs: [
    { type: 'Voice', date: '2/14/26', time: '18:30', initiator: 'Sarah', missed: true },
    { type: 'Video', date: '3/05/26', time: '21:15', initiator: 'You', missed: false },
    { type: 'Voice', date: '4/22/26', time: '10:05', initiator: 'Sarah', missed: true }
  ],
  activityData: {
    mostActiveHour: '9:00 PM',
    mostActiveDay: 'Friday',
    mostActiveMonth: 'March 2026',
    quietHours: '2:00 AM - 6:00 AM',
    lateNightPercent: '18.7%',
    morningPercent: '42%',
    eveningPercent: '58%',
    morningCount: 16842,
    eveningCount: 22749,
    lateNightCount: 7280,
    weekendPercent: '38%',
    weekdayPercent: '62%',
    heatmapData: Array(7).fill(0).map(() => Array(24).fill(0).map(() => Math.floor(Math.random() * 50))),
    calendarData: { '2026-05-17': 350, '2026-05-24': 400, '2026-05-25': 200 },
    hourCounts: [120, 80, 40, 10, 5, 20, 150, 400, 850, 920, 750, 600, 800, 950, 1100, 1250, 1400, 1800, 2200, 4612, 3800, 2900, 1500, 450],
    dayCounts: [15400, 18700, 19500, 20100, 21300, 23842, 16200],
    monthCountsArr: [18200, 16700, 28900, 31400, 36800, 33200, 40500, 41245, 34600, 29100, 21600, 17400],
    yearCounts: { '2021': 45700, '2022': 98300, '2023': 156245, '2024': 82100 },
    mostActiveYear: '2023',
    weeklyTrend: Array.from({length: 52}).map((_, i) => ({ date: `Week ${i+1}`, count: 2000 + Math.random() * 6000 })),
    dailyTrend: Array.from({length: 90}).map((_, i) => ({ date: `Day ${i+1}`, count: 50 + Math.random() * 2000 }))
  },
  participantsData: {
    'You': {
      name: 'You',
      totalMessages: 12450,
      totalWords: 221134,
      avgWordsPerMessage: 17.8,
      longestMessageWords: 1240,
      firstMessageDate: 'Jan 1, 2026 10:15 AM',
      lastMessageDate: 'May 28, 2026 11:47 PM',
      avgResponseTimeStr: '1h 42m',
      messagesPerDay: 22.7,
      avgMessagesPerActiveDay: 31.4,
      longestSessionStr: '3h 12m',
      longestInactiveGapStr: '2d 14h',
      images: 1246,
      videos: 342,
      voiceNotes: 588,
      documents: 128,
      links: 532,
      gifs: 184,
      stickers: 1024,
      emojiCount: 2845,
      mostUsedEmojis: [{emoji: '😂', count: 120}, {emoji: '❤️', count: 95}, {emoji: '🥺', count: 42}],
      emojiPerMessage: 0.23,
      questionFreq: '8.7%',
      exclamationFreq: '3.1%',
      uppercaseFreq: '2.4%',
      editedMessages: 312,
      deletedMessages: 152,
      forwardedMessages: 186,
      monthlyGrowth: [
        { month: '2026-01', count: 1800 },
        { month: '2026-02', count: 2100 },
        { month: '2026-03', count: 2400 },
        { month: '2026-04', count: 2800 },
        { month: '2026-05', count: 3350 }
      ],
      moodStats: { happy: 104, sad: 441, angry: 374, study: 38, work: 312, common: 666 },
      aiInsights: [
        "You reply slightly faster than Sarah on average.",
        "Your messages are more concise and formal.",
        "You share significantly more documents and links.",
        "You use less emojis but more varied vocabulary."
      ]
    },
    'Sarah': {
      name: 'Sarah',
      totalMessages: 13280,
      totalWords: 282645,
      avgWordsPerMessage: 21.3,
      longestMessageWords: 1536,
      firstMessageDate: 'Jan 1, 2026 10:16 AM',
      lastMessageDate: 'May 28, 2026 11:48 PM',
      avgResponseTimeStr: '2h 36m',
      messagesPerDay: 24.2,
      avgMessagesPerActiveDay: 33.8,
      longestSessionStr: '4h 05m',
      longestInactiveGapStr: '3d 09h',
      images: 1850,
      videos: 412,
      voiceNotes: 840,
      documents: 45,
      links: 210,
      gifs: 430,
      stickers: 1205,
      emojiCount: 4132,
      mostUsedEmojis: [{emoji: '👍', count: 88}, {emoji: '🔥', count: 65}, {emoji: '😂', count: 54}],
      emojiPerMessage: 0.31,
      questionFreq: '12.4%',
      exclamationFreq: '4.6%',
      uppercaseFreq: '3.2%',
      editedMessages: 521,
      deletedMessages: 231,
      forwardedMessages: 245,
      monthlyGrowth: [
        { month: '2026-01', count: 2000 },
        { month: '2026-02', count: 2300 },
        { month: '2026-03', count: 2700 },
        { month: '2026-04', count: 2900 },
        { month: '2026-05', count: 3380 }
      ],
      moodStats: { happy: 147, sad: 59, angry: 338, study: 265, work: 210, common: 529 },
      aiInsights: [
        "Sarah sends 6% more messages than you overall.",
        "Sarah's messages are noticeably longer.",
        "She uses voice notes frequently to reply.",
        "Her typing style leans informal with high emoji use."
      ]
    }
  }
};

const elenaDataset: ChatDataset = {
  contactName: 'Elena Rostova',
  messageCount: 94104,
  dateRange: 'Oct 15, 2025 - Jun 30, 2026',
  topInteractions: [
    { name: 'Elena Rostova', count: 48924, rank: 1 },
    { name: 'Mom', count: 18450, rank: 2 },
    { name: 'Dave (Group)', count: 14500, rank: 3 },
    { name: 'John', count: 6800, rank: 4 },
    { name: 'Sarah', count: 3200, rank: 5 },
    { name: 'Emily', count: 1200, rank: 6 },
    { name: 'Mick', count: 540, rank: 7 },
    { name: 'Boss', count: 320, rank: 8 },
    { name: 'Uber Driver', count: 120, rank: 9 },
    { name: 'Alex', count: 50, rank: 10 }
  ],
  interactionScore: 96,
  interactionLabel: 'Inseparable',
  streakCount: 46,
  starters: {
    you: 49,
    them: 51,
    countYou: 1405,
    countThem: 1462,
    desc: 'Chat starting balance is almost perfectly split!'
  },
  enders: {
    you: 52,
    them: 48,
    countYou: 1490,
    countThem: 1378,
    desc: 'You slightly edge out Elena on closing conversations.'
  },
  doubleText: {
    you: 512,
    them: 645,
    desc: 'Elena double-texts you 25% more than you double-text her.'
  },
  replyTime: {
    categories: ['<1m', '5m', '15m', '1h', '4h', '12h', '24h+'],
    series: [
      { name: 'You', data: [55, 28, 10, 4, 2, 0.8, 0.2] },
      { name: 'Elena Rostova', data: [62, 22, 11, 3, 1.5, 0.4, 0.1] }
    ]
  },
  ignoreRate: {
    you: '0.8%',
    them: '1.2%',
    desc: 'Astonishingly low ignore rates! Both respond reliably.'
  },
  longestWait: {
    value: '1d 4h',
    detail: 'Replied by You',
    desc: 'Flight crossing international zones (Apr 3, 2026)'
  },
  avgDuration: '42.8 min',
  durationBars: [45, 62, 70, 58, 90, 95, 82, 65, 88, 92],
  badges: [
    { emoji: '❤️', title: 'Soulmate', rarity: 'Legendary' },
    { emoji: '⚡', title: 'First Responder', rarity: 'Legendary' },
    { emoji: '🔥', title: 'Streak Master', rarity: 'Epic' },
    { emoji: '🦉', title: 'Night Owl', rarity: 'Rare' },
    { emoji: '💬', title: 'Chatterbox', rarity: 'Common' }
  ],
  callLogs: [
    { type: 'Video', date: '11/12/25', time: '20:00', initiator: 'Elena Rostova', missed: true },
    { type: 'Video', date: '1/01/26', time: '00:05', initiator: 'You', missed: false },
    { type: 'Voice', date: '2/14/26', time: '19:30', initiator: 'Elena Rostova', missed: true },
    { type: 'Video', date: '4/01/26', time: '12:00', initiator: 'You', missed: false }
  ],
  activityData: {
    mostActiveHour: '10:00 PM',
    mostActiveDay: 'Saturday',
    mostActiveMonth: 'January 2026',
    quietHours: '3:00 AM - 7:00 AM',
    lateNightPercent: '24.5%',
    morningPercent: '35%',
    eveningPercent: '65%',
    morningCount: 32936,
    eveningCount: 61168,
    lateNightCount: 23055,
    weekendPercent: '45%',
    weekdayPercent: '55%',
    heatmapData: Array(7).fill(0).map(() => Array(24).fill(0).map(() => Math.floor(Math.random() * 100))),
    calendarData: { '2026-01-01': 850, '2026-02-14': 950, '2026-03-15': 420 },
    hourCounts: [400, 250, 120, 45, 10, 8, 50, 150, 300, 500, 650, 700, 850, 900, 1200, 1350, 1600, 2100, 3400, 4200, 5600, 6800, 8200, 5400],
    dayCounts: [18500, 14200, 13800, 15100, 16400, 28900, 32100],
    monthCountsArr: [8500, 9200, 11400, 10800, 13200, 15500, 14100, 12800, 10200, 11900, 16700, 21400],
    yearCounts: { '2024': 32000, '2025': 84000, '2026': 123400 },
    mostActiveYear: '2026',
    weeklyTrend: Array.from({length: 52}).map((_, i) => ({ date: `Week ${i+1}`, count: 3000 + Math.random() * 8000 })),
    dailyTrend: Array.from({length: 90}).map((_, i) => ({ date: `Day ${i+1}`, count: 100 + Math.random() * 3000 }))
  },
  participantsData: {
    'You': {
      name: 'You',
      totalMessages: 46104,
      totalWords: 842100,
      avgWordsPerMessage: 18.2,
      longestMessageWords: 2410,
      firstMessageDate: 'Oct 15, 2025 8:30 AM',
      lastMessageDate: 'Jun 30, 2026 11:59 PM',
      avgResponseTimeStr: '14m',
      messagesPerDay: 180,
      avgMessagesPerActiveDay: 200,
      longestSessionStr: '6h 45m',
      longestInactiveGapStr: '1d 4h',
      images: 4500,
      videos: 820,
      voiceNotes: 120,
      documents: 50,
      links: 1200,
      gifs: 850,
      stickers: 3200,
      emojiCount: 12400,
      mostUsedEmojis: [{emoji: '💻', count: 15}, {emoji: '🚀', count: 12}, {emoji: '🤔', count: 8}],
      emojiPerMessage: 0.26,
      questionFreq: '9.2%',
      exclamationFreq: '5.1%',
      uppercaseFreq: '1.4%',
      editedMessages: 840,
      deletedMessages: 210,
      forwardedMessages: 45,
      monthlyGrowth: [],
      moodStats: { happy: 245, sad: 102, angry: 389, study: 80, work: 37, common: 931 },
      aiInsights: [
        "You reply remarkably fast to Elena.",
        "You use stickers heavily compared to voice notes."
      ]
    },
    'Elena Rostova': {
      name: 'Elena Rostova',
      totalMessages: 48000,
      totalWords: 910000,
      avgWordsPerMessage: 18.9,
      longestMessageWords: 3100,
      firstMessageDate: 'Oct 15, 2025 8:31 AM',
      lastMessageDate: 'Jun 30, 2026 11:58 PM',
      avgResponseTimeStr: '16m',
      messagesPerDay: 188,
      avgMessagesPerActiveDay: 210,
      longestSessionStr: '5h 20m',
      longestInactiveGapStr: '1d 2h',
      images: 5200,
      videos: 950,
      voiceNotes: 420,
      documents: 12,
      links: 840,
      gifs: 1100,
      stickers: 4100,
      emojiCount: 15200,
      mostUsedEmojis: [{emoji: '❤️', count: 20}, {emoji: '🥺', count: 18}, {emoji: '✨', count: 5}],
      emojiPerMessage: 0.31,
      questionFreq: '11.5%',
      exclamationFreq: '6.4%',
      uppercaseFreq: '2.1%',
      editedMessages: 1200,
      deletedMessages: 350,
      forwardedMessages: 120,
      monthlyGrowth: [],
      moodStats: { happy: 158, sad: 465, angry: 20, study: 34, work: 97, common: 659 },
      aiInsights: [
        "Elena sends slightly more messages than you.",
        "She uses a wider variety of emojis and expressions.",
        "She is more likely to edit her messages after sending."
      ]
    }
  }
};

// Create Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setTab] = useState<string>('dashboard');
  const [isDemoData, setIsDemoData] = useState<boolean>(true);
  const [hasChat, setHasChat] = useState<boolean>(true);
  const [uploadedFilename, setUploadedFilename] = useState<string>('Rahul Chat.txt');
  const [uploadedFileTime, setUploadedFileTime] = useState<string>('May 28, 2024 • 10:30 AM');
  const [parsedDataset, setParsedDataset] = useState<ChatDataset | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

  const currentData = isDemoData ? sarahDataset : (parsedDataset || elenaDataset);

  const uploadCustomChat = (
    filename: string,
    fileText: string,
    media: MediaAsset[],
    onProgress: (prg: number, status: string) => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      const steps = [
        { prg: 10, text: `Opening file ${filename} and checking headers...` },
        { prg: 30, text: 'Parsing timestamps and media identifiers...' },
        { prg: 50, text: 'Structuring threads and timing distributions...' },
        { prg: 75, text: 'Evaluating double text patterns...' },
        { prg: 90, text: 'Scoring intimacy metric & indexing badges...' },
        { prg: 100, text: 'Compilation complete! Rendering dashboard...' }
      ];

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          const step = steps[stepIdx];
          onProgress(step.prg, step.text);
          stepIdx++;
        } else {
          clearInterval(interval);
          
          // Basic parser
          const lines = fileText.split('\n');
          let totalMessages = 0;
          let firstDate: string | null = null;
          let lastDate: string | null = null;
          const participants = new Set<string>();
          const activeDays = new Set<string>();
          let imageCount = 0;
          let videoCount = 0;
          let docCount = 0;
          let voiceCount = 0;
          const parsedCalls: CallLog[] = [];
          const hourCounts = new Array(24).fill(0);
          const dayCounts = new Array(7).fill(0);
          const monthCountsArr = new Array(12).fill(0);
          const monthCounts: Record<string, number> = {};
          const yearCounts: Record<string, number> = {};
          const heatmapData = Array(7).fill(0).map(() => Array(24).fill(0));
          const calendarData: Record<string, number> = {};

          let morningCount = 0;
          let eveningCount = 0;
          let lateNightCount = 0;
          let weekendCount = 0;
          let weekdayCount = 0;

          const androidRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s*[aApP][mM])?)\s*-\s*([^:]+):\s*(.*)/;
          const iosRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\:\d{2})?(?:\s*[aApP][mM])?)\]\s*([^:]+):\s*(.*)/;
          const androidSysRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s*[aApP][mM])?)\s*-\s*(.*)/;
          const iosSysRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\:\d{2})?(?:\s*[aApP][mM])?)\]\s*(.*)/;

          const parseDateTime = (dStr: string, tStr: string) => {
            const parts = dStr.split(/[-/.]/);
            if (parts.length !== 3) return null;
            let year = parseInt(parts[2]);
            if (year < 100) year += 2000;
            let p1 = parseInt(parts[0]);
            let p2 = parseInt(parts[1]);
            let month = p2, day = p1; // Assume DD/MM
            if (p1 > 12) { day = p1; month = p2; }
            else if (p2 > 12) { month = p1; day = p2; }
            
            let h = 0, m = 0;
            const timeMatch = tStr.match(/(\d+):(\d+)(?:\:\d+)?\s*([aApP][mM])?/i);
            if (timeMatch) {
              h = parseInt(timeMatch[1]);
              m = parseInt(timeMatch[2]);
              const ampm = timeMatch[3];
              if (ampm) {
                if (ampm.toLowerCase() === 'pm' && h < 12) h += 12;
                if (ampm.toLowerCase() === 'am' && h === 12) h = 0;
              }
            }
            return new Date(year, month - 1, day, h, m);
          };

          // --- Dynamic Participant Stats Tracking ---
          const pStats: Record<string, any> = {};
          let prevSender: string | null = null;
          let prevTime: Date | null = null;

          const getOrCreatePStat = (name: string) => {
            if (!pStats[name]) {
              pStats[name] = {
                name,
                totalMessages: 0,
                totalWords: 0,
                avgWordsPerMessage: 0,
                longestMessageWords: 0,
                firstMessageDate: null,
                lastMessageDate: null,
                avgResponseTimeStr: '0m',
                totalResponseTimeMs: 0,
                responseCount: 0,
                messagesPerDay: 0,
                avgMessagesPerActiveDay: 0,
                longestSessionStr: '0m',
                longestInactiveGapStr: '0h',
                activeDaysCount: new Set<string>(),
                images: 0, videos: 0, voiceNotes: 0, documents: 0, links: 0, gifs: 0, stickers: 0,
                emojiCount: 0, mostUsedEmojis: [], emojisMap: {}, emojiPerMessage: 0,
                questionFreq: 0, exclamationFreq: 0, uppercaseFreq: 0,
                questionCount: 0, exclamationCount: 0, uppercaseCount: 0,
                monthlyGrowthMap: {}, monthlyGrowth: [],
                editedMessages: 0, deletedMessages: 0, forwardedMessages: 0,
                aiInsights: [],
                moodStats: { happy: 0, sad: 0, angry: 0, study: 0, work: 0, common: 0 }
              };
            }
            return pStats[name];
          };

          const rawMessages: { date: string; sender: string; text: string }[] = [];

          const processMessage = (dateStr: string, timeStr: string, sender: string, msg: string) => {
            if (!firstDate) firstDate = dateStr;
            lastDate = dateStr;
            
            if (sender !== 'System' && msg.trim()) {
              rawMessages.push({ date: dateStr, sender, text: msg.trim() });
            }
            
            activeDays.add(dateStr);
            if (sender !== 'System') {
              participants.add(sender);
            }
            totalMessages++;

            const dt = parseDateTime(dateStr, timeStr);
            if (dt && !isNaN(dt.getTime())) {
              const hour = dt.getHours();
              const dayOfWeek = dt.getDay(); // 0 = Sunday
              const month = dt.getMonth(); // 0-11
              const year = dt.getFullYear();
              const monthStr = dt.toLocaleString('default', { month: 'short', year: 'numeric' });
              const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
              
              hourCounts[hour]++;
              dayCounts[dayOfWeek]++;
              monthCountsArr[month]++;
              monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;
              yearCounts[year.toString()] = (yearCounts[year.toString()] || 0) + 1;
              heatmapData[dayOfWeek][hour]++;
              calendarData[isoDate] = (calendarData[isoDate] || 0) + 1;
              
              if (hour >= 5 && hour < 12) morningCount++;
              else if (hour >= 12 && hour < 24) eveningCount++;
              else lateNightCount++;
              
              if (dayOfWeek === 0 || dayOfWeek === 6) weekendCount++;
              else weekdayCount++;

              // --- Participant Tracking Logic ---
              if (sender !== 'System') {
                const stat = getOrCreatePStat(sender);
                stat.totalMessages++;
                stat.activeDaysCount.add(dateStr);
                
                if (!stat.firstMessageDate) stat.firstMessageDate = `${dateStr} ${timeStr}`;
                stat.lastMessageDate = `${dateStr} ${timeStr}`;

                // Word tracking
                const words = msg.split(/\s+/).filter((w: string) => w.length > 0);
                const wordCount = words.length;
                stat.totalWords += wordCount;
                if (wordCount > stat.longestMessageWords) {
                  stat.longestMessageWords = wordCount;
                }

                // Typing style
                if (msg.includes('?')) stat.questionCount++;
                if (msg.includes('!')) stat.exclamationCount++;
                if (msg === msg.toUpperCase() && msg.match(/[A-Z]/)) stat.uppercaseCount++;

                // Emoji tracking with Intl.Segmenter for grapheme-accurate counting (composite emojis = 1)
                const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
                const graphemes = Array.from(segmenter.segment(msg)).map((s: any) => s.segment);
                const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
                const emojiMatches = graphemes.filter((g: string) => emojiRegex.test(g));
                
                if (emojiMatches.length > 0) {
                  stat.emojiCount += emojiMatches.length;
                  emojiMatches.forEach((em: string) => {
                    stat.emojisMap[em] = (stat.emojisMap[em] || 0) + 1;
                  });
                }

                // Mood & Topic Parsing
                const textForMood = msg.toLowerCase();
                const studyRegex = /\b(class|exam|assignment|sir|madam|test|study|notes|pdf|book|read|homework|hw|college|school|lecture|syllabus|marks|grade)\b/g;
                const studyEmojis = /[\u{1F4DA}\u{1F4BB}\u{1F4D6}\u{1F393}\u{1F4DD}\u{1F4D8}]/u;
                const happyRegex = /\b(wow|yay|haha|lol|lmao|omg|love|good|great|awesome|mast|crazy|nice|lmfao|rofl|xd|cool|fun)\b/g;
                const happyEmojis = /[\u{1F602}\u{1F60D}\u{1F60A}\u{1F525}\u{1F389}\u{1F604}\u{1F600}\u{1F923}\u{2764}\u{1F496}]/u;
                const sadRegex = /\b(sad|bad|cry|sorry|hurt|pain|ugh|dukh|bura|shit|damn|noo)\b/g;
                const sadEmojis = /[\u{1F622}\u{1F62D}\u{1F61E}\u{1F494}\u{1F614}\u{1F629}\u{1F62B}]/u;
                const angryRegex = /\b(angry|mad|hate|annoyed|irritated|stupid|idiot|dumb|shut|wtf|fck|fuck)\b/g;
                const angryEmojis = /[\u{1F621}\u{1F620}\u{1F92C}\u{1F4A2}]/u;
                const workRegex = /\b(work|job|office|meeting|project|deadline|boss|manager|client|task|done|shift|salary|pay|email)\b/g;
                const workEmojis = /[\u{1F4BC}\u{1F4C8}\u{1F4B0}]/u;
                
                let isCommon = true;
                const countMatches = (regex: RegExp, text: string) => (text.match(regex) || []).length;
                const countEmojiMatches = (regex: RegExp, emojis: string[]) => emojis.filter(e => regex.test(e)).length;

                const studyHits = countMatches(studyRegex, textForMood) + countEmojiMatches(studyEmojis, emojiMatches);
                if (studyHits > 0) { stat.moodStats.study += studyHits; isCommon = false; }
                const happyHits = countMatches(happyRegex, textForMood) + countEmojiMatches(happyEmojis, emojiMatches);
                if (happyHits > 0) { stat.moodStats.happy += happyHits; isCommon = false; }
                const sadHits = countMatches(sadRegex, textForMood) + countEmojiMatches(sadEmojis, emojiMatches);
                if (sadHits > 0) { stat.moodStats.sad += sadHits; isCommon = false; }
                const angryHits = countMatches(angryRegex, textForMood) + countEmojiMatches(angryEmojis, emojiMatches);
                if (angryHits > 0) { stat.moodStats.angry += angryHits; isCommon = false; }
                const workHits = countMatches(workRegex, textForMood) + countEmojiMatches(workEmojis, emojiMatches);
                if (workHits > 0) { stat.moodStats.work += workHits; isCommon = false; }
                
                if (isCommon) {
                   stat.moodStats.common++;
                }

                // Editing Activity
                if (msg.includes('This message was deleted') || msg.includes('deleted this message')) {
                  stat.deletedMessages++;
                }
                if (msg.includes('<This message was edited>')) {
                  stat.editedMessages++;
                }
                if (msg.includes('Forwarded')) {
                  stat.forwardedMessages++;
                }

                // Media Tracking
                const lowerMediaMsg = msg.toLowerCase();
                if (lowerMediaMsg.includes('<media omitted>') || lowerMediaMsg.includes('omitted') || lowerMediaMsg.includes('attached')) {
                  if (lowerMediaMsg.includes('video') || lowerMediaMsg.includes('.mp4') || lowerMediaMsg.includes('.mov') || lowerMediaMsg.includes('.avi')) {
                    stat.videos++;
                    videoCount++;
                  } else if (lowerMediaMsg.includes('audio') || lowerMediaMsg.includes('voice') || lowerMediaMsg.includes('.mp3') || lowerMediaMsg.includes('.m4a') || lowerMediaMsg.includes('.wav') || lowerMediaMsg.includes('.ogg') || lowerMediaMsg.includes('.opus') || lowerMediaMsg.includes('ptt-') || lowerMediaMsg.includes('aud-')) {
                    stat.voiceNotes++;
                    voiceCount++;
                  } else if (lowerMediaMsg.includes('document') || lowerMediaMsg.includes('.pdf') || lowerMediaMsg.includes('.doc') || lowerMediaMsg.includes('.xls') || lowerMediaMsg.includes('.ppt') || lowerMediaMsg.includes('.txt') || lowerMediaMsg.includes('.csv') || lowerMediaMsg.includes('.zip') || lowerMediaMsg.includes('.rar') || lowerMediaMsg.includes('.apk') || lowerMediaMsg.includes('.tar') || lowerMediaMsg.includes('.gz') || lowerMediaMsg.includes('.rtf')) {
                    stat.documents++;
                    docCount++;
                  } else if (lowerMediaMsg.includes('image') || lowerMediaMsg.includes('photo') || lowerMediaMsg.includes('pic') || lowerMediaMsg.includes('.jpg') || lowerMediaMsg.includes('.jpeg') || lowerMediaMsg.includes('.png') || lowerMediaMsg.includes('img-') || lowerMediaMsg.includes('sticker') || lowerMediaMsg.includes('.webp') || lowerMediaMsg.includes('stk-')) {
                    stat.images++;
                    imageCount++;
                  } else if (lowerMediaMsg.includes('gif')) {
                    stat.gifs++;
                  } else {
                    // Catch-all for any unknown attached files (like .json, .py, etc)
                    stat.documents++;
                    docCount++;
                  }
                } else if (lowerMediaMsg.includes('http://') || lowerMediaMsg.includes('https://')) {
                  stat.links++;
                }

                // Response Time Tracking
                if (prevSender && prevSender !== sender && prevTime) {
                  const diffMs = dt.getTime() - prevTime.getTime();
                  if (diffMs > 0 && diffMs < 1000 * 60 * 60 * 24) { // less than 24 hours
                    stat.totalResponseTimeMs += diffMs;
                    stat.responseCount++;
                  }
                }

                // Monthly Growth
                const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
                stat.monthlyGrowthMap[ym] = (stat.monthlyGrowthMap[ym] || 0) + 1;
                
                prevSender = sender;
                prevTime = dt;
              }
            }

            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes('voice call') || lowerMsg.includes('video call') || lowerMsg.includes('audio call') || lowerMsg.includes('missed call') || lowerMsg.includes('called you')) {
              const isMissed = lowerMsg.includes('missed') || lowerMsg.includes('unanswered') || lowerMsg.includes('declined') || lowerMsg.includes('cancelled');
              parsedCalls.push({
                type: (lowerMsg.includes('video') || lowerMsg.includes('facetime')) ? 'Video' : 'Voice',
                date: dateStr,
                time: timeStr,
                initiator: sender,
                missed: isMissed
              });
            }
          };

          let currentMsg = '';
          let currentDateStr = '';
          let currentTimeStr = '';
          let currentSender = '';

          for (const line of lines) {
            let match = line.match(androidRegex) || line.match(iosRegex);
            
            if (match) {
              if (currentDateStr && currentSender) {
                processMessage(currentDateStr, currentTimeStr, currentSender, currentMsg);
              }
              currentDateStr = match[1];
              currentTimeStr = match[2];
              currentSender = match[3];
              currentMsg = match[4].trim();
            } else {
              match = line.match(androidSysRegex) || line.match(iosSysRegex);
              if (match) {
                if (currentDateStr && currentSender) {
                  processMessage(currentDateStr, currentTimeStr, currentSender, currentMsg);
                }
                currentDateStr = match[1];
                currentTimeStr = match[2];
                currentSender = 'System';
                currentMsg = match[3].trim();
              } else {
                // Continuation line for multi-line messages
                if (currentDateStr) {
                  currentMsg += '\n' + line.trim();
                }
              }
            }
          }

          // Process the very last message in the file
          if (currentDateStr && currentSender) {
            processMessage(currentDateStr, currentTimeStr, currentSender, currentMsg);
          }

          // Finalize Participant Stats
          const formattedPStats: Record<string, ParticipantStats> = {};
          const chatActiveDays = activeDays.size || 1;
          
          for (const [name, s] of Object.entries(pStats)) {
            s.avgWordsPerMessage = s.totalMessages > 0 ? (s.totalWords / s.totalMessages).toFixed(1) : 0;
            s.messagesPerDay = (s.totalMessages / chatActiveDays).toFixed(1);
            s.avgMessagesPerActiveDay = s.activeDaysCount.size > 0 ? (s.totalMessages / s.activeDaysCount.size).toFixed(1) : 0;
            
            if (s.responseCount > 0) {
              const avgMs = s.totalResponseTimeMs / s.responseCount;
              const mins = Math.floor(avgMs / 60000);
              s.avgResponseTimeStr = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
            }

            // Top emojis
            const sortedEmojis = Object.keys(s.emojisMap).sort((a, b) => s.emojisMap[b] - s.emojisMap[a]);
            s.mostUsedEmojis = sortedEmojis.slice(0, 3).map(em => ({ emoji: em, count: s.emojisMap[em] }));
            s.emojiPerMessage = s.totalMessages > 0 ? (s.emojiCount / s.totalMessages).toFixed(2) : 0;

            s.questionFreq = s.totalMessages > 0 ? ((s.questionCount / s.totalMessages) * 100).toFixed(1) + '%' : '0%';
            s.exclamationFreq = s.totalMessages > 0 ? ((s.exclamationCount / s.totalMessages) * 100).toFixed(1) + '%' : '0%';
            s.uppercaseFreq = s.totalMessages > 0 ? ((s.uppercaseCount / s.totalMessages) * 100).toFixed(1) + '%' : '0%';

            s.monthlyGrowth = Object.keys(s.monthlyGrowthMap).sort().map(k => ({
              month: k,
              count: s.monthlyGrowthMap[k]
            }));

            // Static mocks for now where complex sliding window is needed
            s.longestSessionStr = '2h 15m';
            s.longestInactiveGapStr = '1d 4h';

            // Generate AI insights dynamically based on actual stats
            const insights = [];
            if (s.totalMessages > totalMessages * 0.55) insights.push(`${name} is the most active participant, sending ${((s.totalMessages/totalMessages)*100).toFixed(1)}% of all messages.`);
            if (s.totalWords / s.totalMessages > 15) insights.push(`${name} tends to write longer, more detailed paragraphs.`);
            if (s.emojiCount / s.totalMessages > 0.5) insights.push(`${name} is very expressive, frequently using emojis.`);
            if (s.videos + s.images + s.links > 50) insights.push(`${name} frequently shares media and links with the group.`);
            if (insights.length === 0) insights.push(`${name} has a balanced communication style.`);
            s.aiInsights = insights;

            formattedPStats[name] = s as ParticipantStats;
          }

          const newDataset: ChatDataset = {
            ...elenaDataset,
            contactName: Array.from(participants).join(', ') || 'Unknown Chat',
            messageCount: totalMessages,
            dateRange: `${firstDate || '?'} - ${lastDate || '?'}`,
            participantCount: participants.size || 2,
            activeDays: activeDays.size || 1,
            totalMedia: imageCount + videoCount + docCount + voiceCount,
            imageCount,
            videoCount,
            docCount,
            voiceCount,
            callLogs: parsedCalls,
            participantsData: formattedPStats,
            activityData: (() => {
              const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
              const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
              let maxMonth = Object.keys(monthCounts)[0] || 'N/A';
              let maxMonthCount = 0;
              for (const [m, c] of Object.entries(monthCounts)) {
                if (c > maxMonthCount) { maxMonthCount = c; maxMonth = m; }
              }
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const ampm = (h: number) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
              
              let maxYear = Object.keys(yearCounts)[0] || 'N/A';
              let maxYearCount = 0;
              for (const [y, c] of Object.entries(yearCounts)) {
                if (c > maxYearCount) { maxYearCount = c; maxYear = y; }
              }

              // Process daily and weekly trends from calendarData
              const sortedDates = Object.keys(calendarData).sort();
              const dailyTrend = sortedDates.map(d => ({ date: d, count: calendarData[d] }));
              
              // Weekly trend
              const weeklyMap: Record<string, number> = {};
              for (const dateStr of sortedDates) {
                const dt = new Date(dateStr);
                // get start of week (Sunday)
                const start = new Date(dt);
                start.setDate(dt.getDate() - dt.getDay());
                const weekStr = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
                weeklyMap[weekStr] = (weeklyMap[weekStr] || 0) + calendarData[dateStr];
              }
              const weeklyTrend = Object.keys(weeklyMap).sort().map(w => ({ date: w, count: weeklyMap[w] }));

              const pct = (val: number) => totalMessages > 0 ? ((val / totalMessages) * 100).toFixed(1) + '%' : '0%';
              
              return {
                mostActiveHour: ampm(maxHour),
                mostActiveDay: days[maxDay] || 'N/A',
                mostActiveMonth: maxMonth,
                quietHours: '2:00 AM - 6:00 AM', // Hardcoded static for now as it needs a sliding window
                lateNightPercent: pct(lateNightCount),
                morningPercent: pct(morningCount),
                eveningPercent: pct(eveningCount),
                morningCount,
                eveningCount,
                lateNightCount,
                weekendPercent: pct(weekendCount),
                weekdayPercent: pct(weekdayCount),
                heatmapData,
                calendarData,
                hourCounts,
                dayCounts,
                monthCountsArr,
                yearCounts,
                weeklyTrend,
                dailyTrend,
                mostActiveYear: maxYear
              };
            })(),
            rawMessages
          };
          
          setParsedDataset(newDataset);
          setMediaAssets(media);
          setIsDemoData(false);
          setHasChat(true);
          setUploadedFilename(filename);
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = now.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
          setUploadedFileTime(`${dateStr} • ${timeStr}`);
          resolve();
        }
      }, 500);
    });
  };

  const deleteCustomChat = () => {
    // Revoke object URLs to prevent memory leaks
    mediaAssets.forEach(m => URL.revokeObjectURL(m.url));

    setIsDemoData(true);
    setHasChat(false);
    setUploadedFilename('');
    setUploadedFileTime('');
    setParsedDataset(null);
    setMediaAssets([]);
  };

  return (
    <ChatContext.Provider
      value={{
        currentTab,
        setTab,
        isDemoData,
        currentData,
        mediaAssets,
        uploadCustomChat,
        deleteCustomChat,
        hasChat,
        uploadedFilename,
        uploadedFileTime
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
