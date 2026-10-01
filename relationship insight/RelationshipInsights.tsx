import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useChat } from '../src/context/ChatContext';
import { 
  Flame, CalendarDays, Zap, Hourglass, ArrowUpRight, 
  ArrowDownLeft, Copy, MessageSquareOff, Clock, Sparkles
} from 'lucide-react';

export const RelationshipInsights: React.FC = () => {
  const { currentData } = useChat();

  const { p1, p1Name, p2Name } = useMemo(() => {
    const participants = Object.values(currentData.participantsData || {}).sort((a, b) => b.totalMessages - a.totalMessages);
    const p1 = participants[0];
    const p2 = participants[1] || participants[0];
    return { p1, p1Name: p1?.name || 'You', p2Name: p2?.name || 'Them' };
  }, [currentData]);

  // Calculations from raw messages
  const { 
    longestActiveStreak, currentActiveStreak, 
    longestMutualStreak, currentMutualStreak,
    fastestReplyStr, slowestReplyStr
  } = useMemo(() => {
    if (!currentData.rawMessages || currentData.rawMessages.length === 0) {
      return {
        longestActiveStreak: 0, currentActiveStreak: 0,
        longestMutualStreak: 0, currentMutualStreak: 0,
        fastestReplyStr: 'N/A', slowestReplyStr: 'N/A'
      };
    }

    const dateMap = new Map<string, Set<string>>();
    let minReplyMs = Infinity;
    let maxReplyMs = 0;
    
    let prevMsg = currentData.rawMessages[0];
    let prevTime = new Date(prevMsg.date).getTime();

    currentData.rawMessages.forEach((msg) => {
      // Date tracking for streaks
      const dateStr = msg.date.split(',')[0].trim();
      if (!dateMap.has(dateStr)) dateMap.set(dateStr, new Set());
      dateMap.get(dateStr)!.add(msg.sender);

      // Reply times
      const currTime = new Date(msg.date).getTime();
      if (msg.sender !== prevMsg.sender) {
        const diff = currTime - prevTime;
        if (diff > 0) {
          if (diff < minReplyMs) minReplyMs = diff;
          if (diff > maxReplyMs) maxReplyMs = diff;
        }
      }
      prevMsg = msg;
      prevTime = currTime;
    });

    const formatMs = (ms: number) => {
      if (ms === Infinity || ms === 0) return 'N/A';
      const sec = Math.floor(ms / 1000);
      if (sec < 60) return `${sec} Seconds`;
      const min = Math.floor(sec / 60);
      if (min < 60) return `${min} Minutes`;
      const hrs = Math.floor(min / 60);
      if (hrs < 24) return `${hrs} Hours`;
      return `${Math.floor(hrs / 24)} Days`;
    };

    // Streaks
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let lActive = 0, lMutual = 0;
    let currA = 0, currM = 0;
    let lastDateA: Date | null = null, lastDateM: Date | null = null;

    sortedDates.forEach(dateStr => {
      const d = new Date(dateStr);
      const senders = dateMap.get(dateStr)!;
      const isMutual = senders.size >= 2;

      // Active Streak
      if (!lastDateA || (d.getTime() - lastDateA.getTime()) <= 86400000 * 1.5) {
        currA++;
      } else {
        currA = 1;
      }
      if (currA > lActive) lActive = currA;
      lastDateA = d;

      // Mutual Streak
      if (isMutual) {
        if (!lastDateM || (d.getTime() - lastDateM.getTime()) <= 86400000 * 1.5) {
          currM++;
        } else {
          currM = 1;
        }
        if (currM > lMutual) lMutual = currM;
        lastDateM = d;
      } else {
        currM = 0;
      }
    });

    return {
      longestActiveStreak: lActive,
      currentActiveStreak: currA,
      longestMutualStreak: lMutual,
      currentMutualStreak: currM,
      fastestReplyStr: formatMs(minReplyMs),
      slowestReplyStr: formatMs(maxReplyMs)
    };
  }, [currentData.rawMessages]);

  const durationStr = useMemo(() => {
    if (!p1?.firstMessageDate || !p1?.lastMessageDate) return 'Unknown';
    const d1 = new Date(p1.firstMessageDate);
    const d2 = new Date(p1.lastMessageDate);
    const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} Months`;
    if (m === 0) return `${y} Years`;
    return `${y} Years ${m} Months`;
  }, [p1]);

  const DonutChart = ({ val1, val2, color1, color2 }: { val1: number, val2: number, color1: string, color2: string }) => {
    const total = val1 + val2 || 1;
    const p1Pct = Math.round((val1 / total) * 100);
    const strokeDasharray = `${p1Pct} ${100 - p1Pct}`;
    return (
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke={color2} strokeWidth="5" />
          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke={color1} strokeWidth="5" strokeDasharray={strokeDasharray} strokeDashoffset="0" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col text-left max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-textMain tracking-[-0.8px] mb-1.5">
          Relationship Insights
        </h2>
        <p className="text-sm font-semibold text-textMuted">
          Understand the communication dynamics, consistency, and interaction patterns between you and your conversation partner.
        </p>
      </div>

      {/* Hero Section */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-white/40 border border-primary/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50" />
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-4xl">🦊</span>
            </div>
            <span className="font-bold text-textMain">{p1Name}</span>
          </div>

          <div className="flex flex-col items-center px-4">
            <div className="relative flex items-center justify-center w-32 h-32 mb-2">
              <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(124, 92, 255, 0.1)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#7C5CFF" strokeWidth="3" strokeDasharray={`${currentData.interactionScore} ${100 - currentData.interactionScore}`} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Interaction Score</span>
                <span className="text-4xl font-display font-extrabold text-primary">{currentData.interactionScore}%</span>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              {currentData.interactionLabel} Relationship
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-4xl">🐰</span>
            </div>
            <span className="font-bold text-textMain">{p2Name}</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 bg-white/50 border border-primary/60 p-5 rounded-2xl shadow-sm max-w-md">
          <Sparkles className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-semibold text-textMain leading-relaxed italic">
            "Your conversations are highly balanced with consistent communication and quick responses. You maintain a strong, engaging relationship."
          </p>
        </div>
      </div>

      {/* Grid Row 1 (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Conversation Duration */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-textMain">Conversation Duration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-textMuted font-medium block">First Chat</span>
              <span className="text-sm font-bold text-textMain">{p1?.firstMessageDate?.split(',')[0] || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-textMuted font-medium block">Latest Chat</span>
              <span className="text-sm font-bold text-textMain">{p1?.lastMessageDate?.split(',')[0] || 'N/A'}</span>
            </div>
            <div className="pt-2 border-t border-black/5">
              <span className="text-[10px] text-textMuted font-medium block">Relationship Duration</span>
              <span className="text-base font-bold text-primary">{durationStr}</span>
            </div>
          </div>
        </div>

        {/* Conversation Streaks */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange" />
            <h3 className="text-xs font-bold text-textMain">Conversation Streaks</h3>
          </div>
          <div className="space-y-4 flex-grow flex flex-col justify-center">
            <div>
              <span className="text-[10px] text-textMuted font-medium block">Longest Streak</span>
              <span className="text-xl font-bold text-orange">{longestMutualStreak} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-textMuted font-medium block">Current Streak</span>
              <span className="text-xl font-bold text-orange">{currentMutualStreak} Days</span>
            </div>
          </div>
        </div>

        {/* Consecutive Active Days */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-textMain">Consecutive Active Days</h3>
          </div>
          <div className="space-y-4 flex-grow flex flex-col justify-center">
            <div>
              <span className="text-[10px] text-textMuted font-medium block">Longest Active Days</span>
              <span className="text-xl font-bold text-emerald-600">{longestActiveStreak} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-textMuted font-medium block">Current Active Days</span>
              <span className="text-xl font-bold text-emerald-600">{currentActiveStreak} Days</span>
            </div>
          </div>
        </div>

        {/* Fastest Reply */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-textMain">Fastest Reply</h3>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center text-center relative">
            <Zap className="w-16 h-16 text-blue-500/5 absolute opacity-50 pointer-events-none scale-150" />
            <span className="text-2xl font-bold text-blue-600 relative z-10">{fastestReplyStr}</span>
            <span className="text-[10px] text-textMuted font-medium mt-1 relative z-10">Your fastest reply time</span>
          </div>
        </div>

        {/* Slowest Reply */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60">
          <div className="flex items-center gap-2 mb-4">
            <Hourglass className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-textMain">Slowest Reply</h3>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center text-center relative">
            <Hourglass className="w-16 h-16 text-rose-500/5 absolute opacity-50 pointer-events-none scale-150" />
            <span className="text-2xl font-bold text-rose-600 relative z-10">{slowestReplyStr}</span>
            <span className="text-[10px] text-textMuted font-medium mt-1 relative z-10">Your slowest reply time</span>
          </div>
        </div>
      </div>

      {/* Grid Row 2 (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Who Starts */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60 text-center items-center">
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <ArrowUpRight className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-textMain">Who Starts Conversations</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold text-primary">{currentData.starters.you}%</span>
              <span className="text-[9px] font-bold text-textMuted">You</span>
            </div>
            <DonutChart val1={currentData.starters.you} val2={currentData.starters.them} color1="#7C5CFF" color2="#10B981" />
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold text-emerald-500">{currentData.starters.them}%</span>
              <span className="text-[9px] font-bold text-textMuted">{p2Name}</span>
            </div>
          </div>
          <span className="text-[10px] text-textMuted font-medium mt-4">{currentData.starters.desc}</span>
        </div>

        {/* Who Ends */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60 text-center items-center">
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <ArrowDownLeft className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-textMain">Who Ends Conversations</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold text-primary">{currentData.enders.you}%</span>
              <span className="text-[9px] font-bold text-textMuted">You</span>
            </div>
            <DonutChart val1={currentData.enders.you} val2={currentData.enders.them} color1="#7C5CFF" color2="#10B981" />
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold text-emerald-500">{currentData.enders.them}%</span>
              <span className="text-[9px] font-bold text-textMuted">{p2Name}</span>
            </div>
          </div>
          <span className="text-[10px] text-textMuted font-medium mt-4">{currentData.enders.desc}</span>
        </div>

        {/* Double Text Analysis */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60 text-center items-center">
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <Copy className="w-4 h-4 text-sky-500" />
            <h3 className="text-xs font-bold text-textMain">Double Text Analysis</h3>
          </div>
          <div className="flex items-center gap-8 my-auto">
            <div className="flex flex-col">
              <span className="text-3xl font-display font-bold text-sky-500">{currentData.doubleText.you}</span>
              <span className="text-[10px] font-bold text-textMuted">You</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-display font-bold text-emerald-500">{currentData.doubleText.them}</span>
              <span className="text-[10px] font-bold text-textMuted">{p2Name}</span>
            </div>
          </div>
          <span className="text-[10px] text-textMuted font-medium mt-4">You send multiple messages before getting a reply.</span>
        </div>

        {/* Ignored Messages */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60 text-center items-center">
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <MessageSquareOff className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-textMain">Ignored Messages</h3>
          </div>
          <div className="flex items-center gap-8 my-auto">
            <div className="flex flex-col">
              <span className="text-3xl font-display font-bold text-primary">{currentData.ignoreRate.you}</span>
              <span className="text-[10px] font-bold text-textMuted">You</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-display font-bold text-emerald-500">{currentData.ignoreRate.them}</span>
              <span className="text-[10px] font-bold text-textMuted">{p2Name}</span>
            </div>
          </div>
          <span className="text-[10px] text-textMuted font-medium mt-4">Messages without reply.</span>
        </div>

        {/* Longest Wait */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col bg-white/40 border border-primary/60 text-center items-center">
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <Clock className="w-4 h-4 text-orange" />
            <h3 className="text-xs font-bold text-textMain">Longest Wait</h3>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow">
            <span className="text-3xl font-display font-bold text-rose-500">{currentData.longestWait.value}</span>
            <span className="text-[10px] text-textMuted font-medium mt-3">Longest time waiting for a reply</span>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Timeline & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="glass-panel rounded-3xl p-6 bg-white/40 border border-primary/60 lg:col-span-1">
          <h3 className="text-sm font-bold text-textMain mb-6">Relationship Timeline</h3>
          <div className="relative border-l-2 border-primary/20 ml-3 space-y-6">
            
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-primary block">First Chat</span>
              <span className="text-xs text-textMain font-semibold mt-1 block">Started chatting</span>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-blue-500 block">Peak Interaction</span>
              <span className="text-xs text-textMain font-semibold mt-1 block">Most active year</span>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-emerald-500 block">Recent Milestone</span>
              <span className="text-xs text-textMain font-semibold mt-1 block">Consistent daily conversations</span>
            </div>

          </div>
        </div>

        {/* Relationship Growth */}
        <div className="glass-panel rounded-3xl p-6 bg-white/40 border border-primary/60 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-textMain">Relationship Growth</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">Monthly</span>
              <span className="px-3 py-1 bg-white/50 text-textMuted text-[10px] font-bold rounded-full border border-black/5">Yearly</span>
            </div>
          </div>
          
          <div className="flex-grow w-full min-h-[250px] relative">
            <Plot
              data={[
                {
                  x: p1?.monthlyGrowth?.map(d => d.month) || [],
                  y: p1?.monthlyGrowth?.map(d => d.count) || [],
                  name: 'Messages',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { shape: 'spline', width: 3, color: '#7C5CFF' },
                  marker: { size: 6, color: '#7C5CFF' },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(124, 92, 255, 0.1)'
                }
              ]}
              layout={{
                autosize: true,
                margin: { t: 10, r: 10, b: 30, l: 30 },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                showlegend: false,
                xaxis: { showgrid: false, tickfont: { size: 9, color: '#94A3B8' } },
                yaxis: { showgrid: true, gridcolor: 'rgba(0,0,0,0.05)', tickfont: { size: 9, color: '#94A3B8' } }
              }}
              config={{ displayModeBar: false }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%", position: 'absolute' }}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary" />
            <span className="text-xs text-textMuted font-medium">Communication has grown consistently over the years.</span>
          </div>
        </div>
      </div>

      {/* Grid Row 4: Badges & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges */}
        <div className="glass-panel rounded-3xl p-6 bg-white/40 border border-primary/60 lg:col-span-2">
          <h3 className="text-sm font-bold text-textMain mb-4">Friendship Badges</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {currentData.badges?.slice(0, 5).map((badge, i) => (
              <div key={i} className="flex-shrink-0 bg-white/50 border border-primary/60 rounded-2xl p-4 flex flex-col items-center text-center w-28 shadow-sm">
                <span className="text-3xl mb-2">{badge.emoji}</span>
                <span className="text-[10px] font-bold text-textMain leading-tight mb-1">{badge.title}</span>
                <span className="text-[9px] font-bold text-primary">{badge.rarity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="glass-panel rounded-3xl p-6 bg-white/40 border border-primary/60 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-textMain">AI Relationship Summary</h3>
          </div>
          <ul className="space-y-3">
            {p1?.aiInsights?.slice(0, 4).map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-primary mt-1 shrink-0" />
                <span className="text-xs text-textMain font-medium leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};
