import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper function to generate mock AI insights when API key is missing
function generateMockInsights() {
  return {
    confidence: 94,
    messagesAnalyzed: 12486,
    conversationPeriod: 'Jan 12, 2026 - Jul 28, 2026',
    primaryTopic: 'Coding',
    dominantMood: 'Positive',
    dominantLanguage: 'English + Telugu',
    summary: 'This conversation mainly revolves around coding, college projects and career preparation. The overall tone appears positive and collaborative. English is the dominant language with frequent Telugu code-mixing.',
    
    topics: [
      { name: 'Coding', percent: 34, conf: 96 },
      { name: 'College', percent: 21, conf: 95 },
      { name: 'Movies', percent: 12, conf: 93 },
      { name: 'Gaming', percent: 7, conf: 91 },
      { name: 'Finance', percent: 5, conf: 88 },
      { name: 'Others', percent: 9, conf: 70 },
    ],
    knowledgeVsEntertainment: {
      Study: { percent: 31, conf: 94 },
      Work: { percent: 18, conf: 91 },
      Career: { percent: 14, conf: 92 },
      Coding: { percent: 22, conf: 96 },
      Entertainment: { percent: 9, conf: 88 },
      Personal: { percent: 5, conf: 85 },
      Others: { percent: 1, conf: 60 }
    },
    mood: {
      distribution: {
        Positive: { percent: 58, conf: 91 },
        Neutral: { percent: 22, conf: 89 },
        Negative: { percent: 8, conf: 72 }
      },
      emotions: [
        { name: 'Happy', percent: 32, conf: 89, emoji: '🤩' },
        { name: 'Excited', percent: 18, conf: 85, emoji: '🚀' },
        { name: 'Motivational', percent: 10, conf: 84, emoji: '💪' },
        { name: 'Angry', percent: 6, conf: 65, emoji: '😠' }
      ]
    },
    language: {
      English: { percent: 48, conf: 99 },
      Telugu: { percent: 34, conf: 97 },
      Hindi: { percent: 8, conf: 94 },
      Mixed: { percent: 7, conf: 93 },
      CodeMixing: { percent: 3, conf: 91 }
    },
    communicationStyle: {
      Humor: { percent: 76, conf: 82, desc: 'Frequent jokes and playful conversations.' },
      Optimism: { percent: 81, conf: 88, desc: 'Positive and hopeful language observed.' },
      Curiosity: { percent: 74, conf: 83, desc: 'Asks questions and seeks more information.' },
      Friendliness: { percent: 91, conf: 89, desc: 'Warm, supportive and appreciative communication.' },
      EmotionalStability: { percent: 70, conf: 76, desc: 'Balanced responses in positive and challenging times.' },
      Confidence: { percent: 67, conf: 74, desc: 'Expresses opinions clearly and with assurance.' },
      EmojiRichness: { percent: 82, conf: 90, desc: 'Uses a good variety of emojis.' },
      FormalVsInformal: { percent: 28, conf: 70, desc: 'Mostly informal and casual communication.' },
      QuestionAsking: { percent: 71, conf: 84, desc: 'Asks many questions and seeks clarity.' },
      ConversationBalance: { percent: 85, conf: 92, desc: 'Both participants contribute almost equally.' },
      MessageDetail: { percent: 73, conf: 83, desc: 'Messages are detailed and context rich.' }
    }
  };
}

app.post('/api/analyze-chat', async (req, res) => {
  try {
    const { messages } = req.body; 

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('No messages provided, returning default mock.');
      return res.json(generateMockInsights());
    }

    console.log(`Analyzing ${messages.length} real messages...`);

    let coding = 0, college = 0, movies = 0, gaming = 0, finance = 0, others = 0;
    let study = 0, work = 0, career = 0, entertainment = 0, personal = 0;
    let positive = 0, neutral = 0, negative = 0;
    let happy = 0, excited = 0, motivational = 0, angry = 0;
    let engCount = 0, teluguCount = 0, hindiCount = 0;
    let emojis = 0, questions = 0, hahaCount = 0, formalCount = 0, totalWords = 0;

    messages.forEach(msgObj => {
      const text = msgObj.text || '';
      const lower = text.toLowerCase();
      totalWords += text.split(/\s+/).length;

      // Topics
      let matchedTopic = false;
      if (lower.match(/code|programming|react|node|bug|error|git|api|javascript|python/)) { coding++; matchedTopic = true; }
      if (lower.match(/college|class|assignment|exam|prof|semester|campus/)) { college++; matchedTopic = true; }
      if (lower.match(/movie|film|cinema|actor|director|watch/)) { movies++; matchedTopic = true; }
      if (lower.match(/game|play|xbox|ps5|pc|steam/)) { gaming++; matchedTopic = true; }
      if (lower.match(/money|finance|stock|invest|pay|rupee/)) { finance++; matchedTopic = true; }
      if (!matchedTopic) others++;

      // Knowledge vs Entertainment
      if (lower.match(/study|book|read|learn|notes|class|classes|assignment|exam|lecture|professor|college|school|university/)) study++;
      if (lower.match(/work|office|boss|meeting|company|salary|shift|manager|colleague|project/)) work++;
      if (lower.match(/career|job|interview|resume|hiring|promotion|linkedin/)) career++;
      if (lower.match(/fun|party|chill|music|movie|game|play|show|concert|funny|joke/)) entertainment++;
      if (lower.match(/family|life|feel|love|friend|relationship|home|health/)) personal++;

      // Mood & Emotion with Emojis
      let moodMatched = false;
      const hasHappyEmoji = text.match(/[😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩]/);
      const hasSadAngryEmoji = text.match(/[😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬]/);
      const hasAngryEmoji = text.match(/[😤😠😡🤬]/);
      const hasExcitedEmoji = text.match(/[🤯🎉🎊🤩🥳]/);
      const hasMotivationalEmoji = text.match(/[💪🔥💯]/);

      if (lower.match(/good|great|happy|love|awesome|amazing|thanks/) || hasHappyEmoji) {
        positive++; happy++; moodMatched = true;
      } 
      if (lower.match(/bad|sad|angry|hate|terrible|worst|mad|annoy/) || hasSadAngryEmoji) {
        negative++; moodMatched = true;
        if (lower.match(/angry|mad|hate/) || hasAngryEmoji) angry++;
      } 
      
      if (!moodMatched) {
        neutral++;
      }

      if (lower.match(/excited|cant wait|omg|wow/) || hasExcitedEmoji) excited++;
      if (lower.match(/do it|keep going|hustle|grind/) || hasMotivationalEmoji) motivational++;

      // Language detection
      if (text.match(/[a-zA-Z]/)) engCount++;
      if (text.match(/[\u0C00-\u0C7F]/)) teluguCount++;
      if (text.match(/[\u0900-\u097F]/)) hindiCount++;

      // Communication Style
      if (text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u)) emojis++;
      if (text.includes('?')) questions++;
      if (lower.match(/haha|lol|lmao|hehe/) || text.match(/[😂🤣😅😆]/)) hahaCount++;
      if (lower.match(/therefore|sincerely|regards|furthermore|appreciate/)) formalCount++;
    });

    const totalT = coding + college + movies + gaming + finance + others || 1;
    const totalK = study + work + career + entertainment + personal || 1;
    const totalM = positive + neutral + negative || 1;
    const totalL = engCount + teluguCount + hindiCount || 1;
    const msgLen = messages.length;

    // Helper to calculate percent safely
    const pct = (val, total) => Math.round((val / total) * 100);
    // Confidence is estimated based on sample size (cap at 98)
    const baseConf = Math.min(98, 50 + Math.floor(msgLen / 100));

    const insights = {
      confidence: baseConf,
      messagesAnalyzed: msgLen,
      conversationPeriod: 'Estimated from chat', // Could pass from frontend
      primaryTopic: [
        {n: 'Coding', v: coding}, {n: 'College', v: college}, {n: 'Movies', v: movies}, 
        {n: 'Gaming', v: gaming}, {n: 'Finance', v: finance}
      ].sort((a,b) => b.v - a.v)[0].n,
      dominantMood: positive >= negative ? 'Positive' : 'Negative',
      dominantLanguage: teluguCount > engCount ? 'Telugu' : hindiCount > engCount ? 'Hindi' : 'English',
      summary: `Analyzed ${msgLen} messages. The chat seems ${positive >= negative ? 'positive' : 'tense'}.`,
      
      topics: [
        { name: 'Coding', percent: pct(coding, totalT), conf: baseConf },
        { name: 'College', percent: pct(college, totalT), conf: baseConf },
        { name: 'Movies', percent: pct(movies, totalT), conf: baseConf },
        { name: 'Gaming', percent: pct(gaming, totalT), conf: baseConf },
        { name: 'Finance', percent: pct(finance, totalT), conf: baseConf },
        { name: 'Others', percent: pct(others, totalT), conf: baseConf },
      ],
      knowledgeVsEntertainment: {
        Study: { percent: pct(study, totalK), conf: baseConf },
        Work: { percent: pct(work, totalK), conf: baseConf },
        Career: { percent: pct(career, totalK), conf: baseConf },
        Entertainment: { percent: pct(entertainment, totalK), conf: baseConf },
        Personal: { percent: pct(personal, totalK), conf: baseConf },
      },
      mood: {
        distribution: {
          Positive: { percent: pct(positive, totalM), conf: baseConf },
          Neutral: { percent: pct(neutral, totalM), conf: baseConf },
          Negative: { percent: pct(negative, totalM), conf: baseConf }
        },
        emotions: [
          { name: 'Happy', percent: pct(happy, msgLen), conf: baseConf, emoji: '🤩' },
          { name: 'Excited', percent: pct(excited, msgLen), conf: baseConf, emoji: '🚀' },
          { name: 'Motivational', percent: pct(motivational, msgLen), conf: baseConf, emoji: '💪' },
          { name: 'Angry', percent: pct(angry, msgLen), conf: baseConf, emoji: '😠' }
        ]
      },
      language: {
        English: { percent: pct(engCount, totalL), conf: baseConf },
        Telugu: { percent: pct(teluguCount, totalL), conf: baseConf },
        Hindi: { percent: pct(hindiCount, totalL), conf: baseConf },
        Mixed: { percent: 0, conf: baseConf }, // Simplified
        CodeMixing: { percent: 0, conf: baseConf }
      },
      communicationStyle: {
        Humor: { percent: Math.min(100, Math.round((hahaCount / msgLen) * 500)), conf: baseConf, desc: 'Jokes and laughter frequency.' },
        EmojiRichness: { percent: Math.min(100, Math.round((emojis / msgLen) * 200)), conf: baseConf, desc: 'Usage of emojis in text.' },
        QuestionAsking: { percent: Math.min(100, Math.round((questions / msgLen) * 300)), conf: baseConf, desc: 'Frequency of asking questions.' },
        MessageDetail: { percent: Math.min(100, Math.round((totalWords / msgLen) * 5)), conf: baseConf, desc: 'Average words per message.' },
        FormalVsInformal: { percent: Math.min(100, Math.round((formalCount / msgLen) * 1000)), conf: baseConf, desc: 'Formality of language.' }
      }
    };

    res.json(insights);
    
  } catch (error) {
    console.error('Error analyzing chat:', error);
    res.status(500).json({ error: 'Failed to analyze chat data.' });
  }
});



app.listen(port, () => {
  console.log(`AI Backend server running on http://localhost:${port}`);
});
