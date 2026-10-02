import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import {
  Sparkles, Bot, AlertCircle, Info
} from 'lucide-react';

import { useChat } from '../src/context/ChatContext';

interface AiInsightsData {
  confidence: number;
  messagesAnalyzed: number;
  conversationPeriod: string;
  primaryTopic: string;
  dominantMood: string;
  dominantLanguage: string;
  summary: string;
  topics: { name: string, percent: number, conf: number }[];
  knowledgeVsEntertainment: Record<string, { percent: number, conf: number }>;
  mood: {
    distribution: Record<string, { percent: number, conf: number }>;
    emotions: { name: string, percent: number, conf: number, emoji: string }[];
  };
  language: Record<string, { percent: number, conf: number }>;
  communicationStyle: Record<string, { percent: number, conf: number, desc: string }>;
}

export const AiInsights: React.FC = () => {
  const { currentData } = useChat();
  const [data, setData] = useState<AiInsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const payload = { messages: currentData?.rawMessages || [] };
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze-chat`, payload);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-textMuted font-medium animate-pulse">AI is analyzing conversation patterns...</p>
      </div>
    );
  }

  // Base tile style with the requested highlighted borders!
  const tileClass = "bg-white rounded-2xl p-6 shadow-sm border border-primary/60 shadow-[0_0_15px_rgba(124,92,255,0.15)] flex flex-col relative overflow-hidden";

  // Chart config
  const chartLayout = {
    showlegend: false,
    margin: { t: 10, b: 10, l: 10, r: 10 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">AI Insights</h1>
          <p className="text-sm text-textMuted">AI analyzes your conversation to discover topics, patterns, mood, language and communication style.</p>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-r from-white to-primary/5 rounded-2xl p-6 border border-primary/40 shadow-[0_4px_25px_rgba(124,92,255,0.2)]">
        <div className="flex flex-col items-center justify-center border-r border-black/5 pr-4 relative">
          <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {data.confidence}%
          </div>
          <span className="text-sm font-semibold text-textMain mt-1">AI Confidence</span>
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <Bot className="w-full h-full text-primary" />
          </div>
        </div>
        
        <div className="flex flex-col justify-center px-4 gap-3">
           <div>
             <span className="text-xs text-textMuted font-semibold">Messages Analyzed</span>
             <p className="text-lg font-bold text-textMain">{data.messagesAnalyzed.toLocaleString()}</p>
           </div>
           <div>
             <span className="text-xs text-textMuted font-semibold">Conversation Period</span>
             <p className="text-sm font-bold text-textMain">{data.conversationPeriod}</p>
           </div>
        </div>

        <div className="flex flex-col justify-center px-4 gap-3 border-l border-black/5">
           <div>
             <span className="text-xs text-textMuted font-semibold">Primary Topic</span>
             <p className="text-lg font-bold text-textMain">{data.primaryTopic}</p>
           </div>
           <div>
             <span className="text-xs text-textMuted font-semibold">Dominant Mood</span>
             <p className="text-sm font-bold text-textMain">{data.dominantMood}</p>
           </div>
        </div>

        <div className="flex flex-col justify-center px-4 border-l border-black/5">
           <span className="text-xs text-textMuted font-semibold mb-1">Dominant Language</span>
           <p className="text-lg font-bold text-primary">{data.dominantLanguage}</p>
           <p className="text-xs text-textMuted mt-2 italic leading-tight">
             "{data.summary.substring(0, 80)}..."
           </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tile 1: Conversation Topics */}
        <div className={tileClass}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">1</span>
              <h2 className="text-lg font-bold text-textMain">Conversation Topics</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">AI Classified</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/2 flex flex-col gap-3">
              {data.topics.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{['💻','🎓','🎬','🎮','💰','📦'][i%6]}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-textMain">{t.name}</span>
                      <span className="text-[10px] text-textMuted">{Math.floor(data.messagesAnalyzed * (t.percent/100))} msgs</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-textMain">{t.percent}%</span>
                    <span className="text-[10px] text-mint font-semibold">Conf. {t.conf}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/2 flex justify-center">
              <Plot
                data={[{
                  values: data.topics.map(t => t.percent),
                  labels: data.topics.map(t => t.name),
                  type: 'pie',
                  hole: 0.6,
                  marker: { colors: ['#7C5CFF', '#00C9A7', '#FF9F43', '#FF4C60', '#3498DB', '#95A5A6'] },
                  textinfo: 'none'
                }]}
                layout={{ ...chartLayout, width: 200, height: 200 }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>
          <p className="text-[10px] text-textMuted mt-4 italic">* Percentages may not add up to 100% due to rounding.</p>
        </div>

        {/* Tile 2: Knowledge vs Entertainment */}
        <div className={tileClass}>
           <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">2</span>
              <h2 className="text-lg font-bold text-textMain">Knowledge vs Entertainment</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">AI Estimated</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-grow justify-center">
            {Object.entries(data.knowledgeVsEntertainment).map(([key, val], i) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-32 text-sm font-semibold text-textMain flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-lg flex-shrink-0">{['📚','💼','🚀','💻','🎮','❤️','📦'][i%7]}</span> 
                  <span className="truncate">{key}</span>
                </div>
                <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${val.percent}%` }}></div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-textMain">{val.percent}%</div>
                <div className="w-16 text-right text-[10px] text-mint font-semibold">Conf. {val.conf}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tile 3: Estimated Mood Analysis */}
        <div className={tileClass}>
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">3</span>
              <h2 className="text-lg font-bold text-textMain">Estimated Mood Analysis</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">AI Estimated</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-4">
            <div className="w-1/3">
              <Plot
                data={[{
                  values: [data.mood.distribution.Positive.percent, data.mood.distribution.Neutral.percent, data.mood.distribution.Negative.percent],
                  labels: ['Positive', 'Neutral', 'Negative'],
                  type: 'pie',
                  hole: 0.7,
                  marker: { colors: ['#00C9A7', '#FF9F43', '#FF4C60'] },
                  textinfo: 'none'
                }]}
                layout={{ ...chartLayout, width: 140, height: 140 }}
                config={{ displayModeBar: false }}
              />
            </div>
            <div className="w-1/3 flex flex-col gap-2">
               {['Positive', 'Neutral', 'Negative'].map(m => (
                 <div key={m} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                   <div className="flex items-center gap-1.5 text-xs font-semibold">
                     <span className={`w-2 h-2 rounded-full ${m==='Positive'?'bg-mint':m==='Neutral'?'bg-warning':'bg-danger'}`}></span>
                     {m}
                   </div>
                   <div className="flex flex-col items-end text-xs font-bold">
                     {data.mood.distribution[m].percent}%
                     <span className="text-[9px] text-mint font-normal">C. {data.mood.distribution[m].conf}%</span>
                   </div>
                 </div>
               ))}
            </div>
            <div className="w-1/3 flex flex-col gap-1.5 pl-2 border-l border-black/5">
              {data.mood.emotions.map(e => (
                 <div key={e.name} className="flex justify-between items-center">
                   <span className="text-xs font-semibold flex items-center gap-1"><span className="text-base">{e.emoji}</span> {e.name}</span>
                   <span className="text-xs font-bold">{e.percent}%</span>
                 </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-textMuted mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-textMuted italic">Mood is estimated from conversation text and may not perfectly represent actual emotions.</p>
          </div>
        </div>

        {/* Tile 4: Language Analysis */}
        <div className={tileClass}>
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">4</span>
              <h2 className="text-lg font-bold text-textMain">Language Intelligence</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">AI Estimated</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="w-[60%] flex flex-col gap-3 pl-2">
               {Object.entries(data.language).map(([lang, val]) => (
                 <div key={lang} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-semibold">{lang}</span>
                    <div className="flex-grow h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{width: `${val.percent}%`}}></div>
                    </div>
                    <span className="text-sm font-bold w-10 text-right">{val.percent}%</span>
                    <span className="text-[10px] text-mint w-14 text-right">Conf. {val.conf}%</span>
                 </div>
               ))}
            </div>
            <div className="w-[40%] flex justify-center">
              <Plot
                data={[{
                  values: Object.values(data.language).map(v => v.percent),
                  labels: Object.keys(data.language),
                  type: 'pie',
                  hole: 0.6,
                  marker: { colors: ['#7C5CFF', '#6C5CE7', '#A29BFE', '#81ECEC', '#55EFC4'] },
                  textinfo: 'none'
                }]}
                layout={{ ...chartLayout, width: 160, height: 160 }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tile 5: Communication Style */}
      <div className={tileClass}>
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">5</span>
              <h2 className="text-lg font-bold text-textMain">Estimated Communication Style</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">AI Estimated</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
             {Object.entries(data.communicationStyle).map(([style, val], idx) => (
                <div key={style} className="bg-gray-50 rounded-xl p-3 flex flex-col items-center text-center border border-black/5 hover:border-primary/60 transition-colors">
                   <div className="text-2xl mb-1">{['😂','🌟','🧐','🤝','🧠','⭐','😀','👔','❓','⚖️','📝'][idx%11]}</div>
                   <h3 className="text-xs font-bold text-textMain mb-2 leading-tight">{style.replace(/([A-Z])/g, ' $1').trim()}</h3>
                   <div className="text-lg font-extrabold text-primary">{val.percent}%</div>
                   <div className="w-full h-1 bg-gray-200 rounded-full my-2">
                     <div className="h-full bg-primary rounded-full" style={{width: `${val.percent}%`}}></div>
                   </div>
                   <span className="text-[10px] text-mint font-semibold mb-2">Conf. {val.conf}%</span>
                   <p className="text-[9px] text-textMuted leading-tight">{val.desc}</p>
                </div>
             ))}
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-2 border border-warning/20">
            <Info className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-textMuted">These are AI-generated communication style estimates and should not be interpreted as psychological assessments.</p>
          </div>
      </div>

      {/* Bottom Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* AI Summary */}
         <div className={`${tileClass} md:col-span-1 bg-gradient-to-br from-primary/5 to-white`}>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-textMain">AI Summary</h2>
            </div>
            <p className="text-sm text-textMain leading-relaxed italic border-l-4 border-primary pl-3 bg-white/50 p-3 rounded-r-lg">
              "{data.summary}"
            </p>
         </div>

         {/* How AI Generated */}
         <div className={tileClass}>
            <h2 className="text-sm font-bold text-textMain mb-3">How AI Generated These Insights</h2>
            <ul className="text-xs text-textMuted flex flex-col gap-1.5">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Natural Language Processing (NLP)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Large Language Models (LLMs)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Topic Classification</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Sentiment & Emotion Analysis</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Language Detection</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Conversation Pattern Recognition</li>
            </ul>
         </div>

         {/* Confidence Guide */}
         <div className={tileClass}>
            <h2 className="text-sm font-bold text-textMain mb-3">AI Confidence Guide</h2>
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-8 text-center px-1 py-0.5 rounded bg-mint/20 text-mint font-bold text-[10px]">90+</span>
                 <span className="font-semibold">Very High Confidence</span>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-8 text-center px-1 py-0.5 rounded bg-blue-500/20 text-blue-600 font-bold text-[10px]">75-89</span>
                 <span className="font-semibold">High Confidence</span>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-8 text-center px-1 py-0.5 rounded bg-warning/20 text-warning font-bold text-[10px]">60-74</span>
                 <span className="font-semibold">Moderate Confidence</span>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-8 text-center px-1 py-0.5 rounded bg-danger/20 text-danger font-bold text-[10px]">&lt;60</span>
                 <span className="font-semibold">Low Confidence</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
