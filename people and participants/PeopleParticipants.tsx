import React, { useState } from 'react';
import { useChat } from '../src/context/ChatContext';
import { Users, Calendar, Download, Image as ImageIcon, Video, Mic, FileText, Link as LinkIcon, Smile, BarChart2, Edit3, Zap, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import Plot from 'react-plotly.js';

export const PeopleParticipants: React.FC = () => {
  const { currentData } = useChat();
  const pData = currentData.participantsData;

  // Handle dynamic participant selection
  const participants = pData ? Object.values(pData) : [];
  
  // Default to first two participants, or keep user selection
  const [selectedP1, setSelectedP1] = useState<string | null>(null);
  const [selectedP2, setSelectedP2] = useState<string | null>(null);

  const p1Name = selectedP1 || (participants.length > 0 ? participants[0].name : null);
  const p2Name = selectedP2 || (participants.length > 1 ? participants[1].name : null);

  const p1 = pData && p1Name ? pData[p1Name] : null;
  const p2 = pData && p2Name ? pData[p2Name] : null;

  

  

  if (!p1 || !p2) {
    return <div className="p-10 text-textMuted font-medium">Not enough participant data to compare.</div>;
  }

  const renderBasicStatRow = (label: string, v1: any, v2: any) => (
    <div className="grid grid-cols-3 py-3 border-b border-black/5 last:border-0 items-center">
      <span className="text-xs font-semibold text-textMuted col-span-1">{label}</span>
      <span className="text-sm font-bold text-textMain text-center col-span-1">{v1}</span>
      <span className="text-sm font-bold text-textMain text-center col-span-1">{v2}</span>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-display font-extrabold text-textMain">People & Participants</h1>
          </div>
          <p className="text-sm text-textMuted mt-2 font-medium">Detailed insights about each participant in this conversation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white/60 border border-primary/60 rounded-2xl px-5 py-2.5 shadow-sm text-xs font-bold text-textMain">
            {currentData.dateRange} <Calendar className="w-4 h-4 text-textMuted" />
          </div>
          <button className="flex items-center gap-2 bg-white/60 border border-primary/60 rounded-2xl px-5 py-2.5 shadow-sm text-xs font-bold text-textMain hover:bg-white/80 transition-colors">
            <Download className="w-4 h-4 text-textMuted" /> Export Report
          </button>
        </div>
      </div>

      {/* Top Selector & High-level KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel rounded-3xl p-6 lg:col-span-1 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-textMain mb-4">Select Participant to View</h3>
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3 w-full bg-white/50 border border-black/10 rounded-xl p-2">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                 <span className="text-lg">🦊</span>
               </div>
               <select 
                 className="bg-transparent text-sm font-bold text-textMain flex-1 outline-none cursor-pointer appearance-none"
                 value={p1.name}
                 onChange={(e) => setSelectedP1(e.target.value)}
               >
                 {participants.map(p => (
                   <option key={p.name} value={p.name}>{p.name}</option>
                 ))}
               </select>
             </div>
             
             <div className="flex items-center gap-3 w-full bg-white/50 border border-black/10 rounded-xl p-2">
               <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                 <span className="text-lg">🐰</span>
               </div>
               <select 
                 className="bg-transparent text-sm font-bold text-textMain flex-1 outline-none cursor-pointer appearance-none"
                 value={p2.name}
                 onChange={(e) => setSelectedP2(e.target.value)}
               >
                 {participants.map(p => (
                   <option key={p.name} value={p.name}>{p.name}</option>
                 ))}
               </select>
             </div>
          </div>
          <div className="mt-4 bg-slate-50 border border-black/5 rounded-xl p-3 flex gap-2 items-start">
             <div className="min-w-[16px] mt-0.5"><div className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center text-[8px]">i</div></div>
             <span className="text-[10px] text-textMuted font-medium leading-tight">Compare participants to see who is more active, responsive & expressive.</span>
          </div>
        </div>

        {/* Comparison Container */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* p1 KPI */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                 <span className="text-3xl">🦊</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">{p1.name}</h2>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-display font-extrabold text-textMain leading-none">{p1.totalMessages.toLocaleString()}</span>
                </div>
                <span className="text-[11px] text-textMuted font-medium">Messages ({(p1.totalMessages / (p1.totalMessages + p2.totalMessages) * 100).toFixed(1)}% of total)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-6 border-t border-black/5 pt-4">
               <div>
                 <span className="text-xl font-bold text-textMain block mb-0.5">{p1.avgWordsPerMessage}</span>
                 <span className="text-[10px] text-textMuted font-semibold uppercase tracking-wide">Avg Words / Msg</span>
               </div>
               <div>
                 <span className="text-xl font-bold text-textMain block mb-0.5">{p1.totalWords.toLocaleString()}</span>
                 <span className="text-[10px] text-textMuted font-semibold uppercase tracking-wide">Total Words</span>
               </div>
            </div>
          </div>

          {/* VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10 w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 font-bold text-xs text-textMuted">
            VS
          </div>

          {/* p2 KPI */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                 <span className="text-3xl">🐰</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-600 mb-1">{p2.name}</h2>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-display font-extrabold text-textMain leading-none">{p2.totalMessages.toLocaleString()}</span>
                </div>
                <span className="text-[11px] text-textMuted font-medium">Messages ({(p2.totalMessages / (p1.totalMessages + p2.totalMessages) * 100).toFixed(1)}% of total)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-6 border-t border-black/5 pt-4">
               <div>
                 <span className="text-xl font-bold text-textMain block mb-0.5">{p2.avgWordsPerMessage}</span>
                 <span className="text-[10px] text-textMuted font-semibold uppercase tracking-wide">Avg Words / Msg</span>
               </div>
               <div>
                 <span className="text-xl font-bold text-textMain block mb-0.5">{p2.totalWords.toLocaleString()}</span>
                 <span className="text-[10px] text-textMuted font-semibold uppercase tracking-wide">Total Words</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Basic Stats & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Statistics */}
        <div className="glass-panel rounded-3xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <BarChart2 className="w-5 h-5 text-indigo-500" />
             <h3 className="font-bold text-textMain">Basic Statistics</h3>
           </div>
           
           <div className="grid grid-cols-3 mb-2 pb-2 border-b-2 border-black/5">
             <span className="col-span-1"></span>
             <span className="text-xs font-bold text-primary text-center col-span-1">{p1.name}</span>
             <span className="text-xs font-bold text-emerald-600 text-center col-span-1">{p2.name}</span>
           </div>

           <div className="flex flex-col">
             {renderBasicStatRow('Total Messages', p1.totalMessages.toLocaleString(), p2.totalMessages.toLocaleString())}
             {renderBasicStatRow('Total Words', p1.totalWords.toLocaleString(), p2.totalWords.toLocaleString())}
             {renderBasicStatRow('Average Message Length', `${p1.avgWordsPerMessage} words`, `${p2.avgWordsPerMessage} words`)}
             {renderBasicStatRow('Longest Message', `${p1.longestMessageWords.toLocaleString()} words`, `${p2.longestMessageWords.toLocaleString()} words`)}
             
             <div className="grid grid-cols-3 py-3 border-b border-black/5 items-center">
                <span className="text-xs font-semibold text-textMuted col-span-1">First Message</span>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p1.firstMessageDate.split(' ')[0]} {p1.firstMessageDate.split(' ')[1]} {p1.firstMessageDate.split(' ')[2]}</span><span className="text-[10px] text-textMuted">{p1.firstMessageDate.split(' ').slice(3).join(' ')}</span></div>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p2.firstMessageDate.split(' ')[0]} {p2.firstMessageDate.split(' ')[1]} {p2.firstMessageDate.split(' ')[2]}</span><span className="text-[10px] text-textMuted">{p2.firstMessageDate.split(' ').slice(3).join(' ')}</span></div>
             </div>
             
             <div className="grid grid-cols-3 py-3 items-center">
                <span className="text-xs font-semibold text-textMuted col-span-1">Last Message</span>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p1.lastMessageDate.split(' ')[0]} {p1.lastMessageDate.split(' ')[1]} {p1.lastMessageDate.split(' ')[2]}</span><span className="text-[10px] text-textMuted">{p1.lastMessageDate.split(' ').slice(3).join(' ')}</span></div>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p2.lastMessageDate.split(' ')[0]} {p2.lastMessageDate.split(' ')[1]} {p2.lastMessageDate.split(' ')[2]}</span><span className="text-[10px] text-textMuted">{p2.lastMessageDate.split(' ').slice(3).join(' ')}</span></div>
             </div>
           </div>
        </div>

        {/* Communication */}
        <div className="glass-panel rounded-3xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <Clock className="w-5 h-5 text-blue-500" />
             <h3 className="font-bold text-textMain">Communication</h3>
           </div>

           <div className="grid grid-cols-3 mb-2 pb-2 border-b-2 border-black/5">
             <span className="col-span-1"></span>
             <span className="text-xs font-bold text-primary text-center col-span-1">{p1.name}</span>
             <span className="text-xs font-bold text-emerald-600 text-center col-span-1">{p2.name}</span>
           </div>

           <div className="flex flex-col">
             {renderBasicStatRow('Average Response Time', p1.avgResponseTimeStr, p2.avgResponseTimeStr)}
             {renderBasicStatRow('Messages Per Day', p1.messagesPerDay, p2.messagesPerDay)}
             {renderBasicStatRow('Avg Messages / Active Day', p1.avgMessagesPerActiveDay, p2.avgMessagesPerActiveDay)}
             
             <div className="grid grid-cols-3 py-3 border-b border-black/5 items-center">
                <span className="text-xs font-semibold text-textMuted col-span-1">Longest Conversation Session</span>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p1.longestSessionStr}</span><span className="text-[10px] text-textMuted">May 4, 2026</span></div>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p2.longestSessionStr}</span><span className="text-[10px] text-textMuted">May 4, 2026</span></div>
             </div>

             <div className="grid grid-cols-3 py-3 items-center">
                <span className="text-xs font-semibold text-textMuted col-span-1">Longest Inactive Gap</span>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p1.longestInactiveGapStr}</span><span className="text-[10px] text-textMuted">Feb 11 - Feb 14, 2026</span></div>
                <div className="col-span-1 text-center"><span className="text-sm font-bold text-textMain block leading-tight">{p2.longestInactiveGapStr}</span><span className="text-[10px] text-textMuted">Mar 3 - Mar 6, 2026</span></div>
             </div>
           </div>
        </div>
      </div>

      {/* Grid Row 2: Conv Share & Shared Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Conversation Share */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-4 flex flex-col items-center">
           <div className="flex items-center gap-2 mb-1 w-full justify-start">
             <Users className="w-5 h-5 text-primary" />
             <h3 className="font-bold text-textMain">Conversation Share</h3>
           </div>
           <p className="text-xs text-textMuted font-medium w-full text-left mb-6">Who talks more in this conversation?</p>
           
           <div className="flex items-center gap-6 mb-8 mt-4 w-full justify-center relative">
             <div className="text-center">
                <span className="text-xl font-display font-extrabold text-textMain block">{(p1.totalMessages / (p1.totalMessages + p2.totalMessages) * 100).toFixed(1)}%</span>
                <span className="text-xs font-bold text-primary block">{p1.name}</span>
                <span className="text-[10px] text-textMuted block mt-1">{p1.totalMessages.toLocaleString()}<br/>Messages</span>
             </div>
             
             <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                  <path className="text-emerald-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path className="text-primary" strokeDasharray={`${(p1.totalMessages / (p1.totalMessages + p2.totalMessages) * 100).toFixed(1)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center z-10 text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
             </div>

             <div className="text-center">
                <span className="text-xl font-display font-extrabold text-textMain block">{(p2.totalMessages / (p1.totalMessages + p2.totalMessages) * 100).toFixed(1)}%</span>
                <span className="text-xs font-bold text-emerald-600 block">{p2.name}</span>
                <span className="text-[10px] text-textMuted block mt-1">{p2.totalMessages.toLocaleString()}<br/>Messages</span>
             </div>
           </div>

           <div className="w-full bg-primary/5 text-primary text-xs font-bold text-center py-3 rounded-xl border border-primary/10 mt-auto">
             {p1.totalMessages > p2.totalMessages ? p1.name : p2.name} is more active in this conversation by {Math.abs((p1.totalMessages / (p1.totalMessages + p2.totalMessages) * 100) - (p2.totalMessages / (p1.totalMessages + p2.totalMessages) * 100)).toFixed(1)}%
           </div>
        </div>

        {/* Shared Content */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-8 flex flex-col">
           <div className="flex items-center gap-2 mb-1">
             <FileText className="w-5 h-5 text-indigo-500" />
             <h3 className="font-bold text-textMain">Shared Content</h3>
           </div>
           <p className="text-xs text-textMuted font-medium mb-6">Total shared between both of you</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              {[
                { icon: <ImageIcon className="w-6 h-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Images', val: p1.images + p2.images, p1Val: p1.images, p2Val: p2.images },
                { icon: <Video className="w-6 h-6" />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Videos', val: p1.videos + p2.videos, p1Val: p1.videos, p2Val: p2.videos },
                { icon: <Mic className="w-6 h-6" />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Voice Notes', val: p1.voiceNotes + p2.voiceNotes, p1Val: p1.voiceNotes, p2Val: p2.voiceNotes },
                { icon: <FileText className="w-6 h-6" />, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Documents', val: p1.documents + p2.documents, p1Val: p1.documents, p2Val: p2.documents },
                { icon: <LinkIcon className="w-6 h-6" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Links', val: p1.links + p2.links, p1Val: p1.links, p2Val: p2.links },
                { icon: <div className="font-bold text-sm">GIF</div>, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', label: 'GIFs', val: p1.gifs + p2.gifs, p1Val: p1.gifs, p2Val: p2.gifs },
                { icon: <BarChart2 className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20', label: 'Total Shared', val: (p1.images + p2.images + p1.videos + p2.videos + p1.voiceNotes + p2.voiceNotes + p1.documents + p2.documents + p1.links + p2.links + p1.gifs + p2.gifs), p1Val: (p1.images + p1.videos + p1.voiceNotes + p1.documents + p1.links + p1.gifs), p2Val: (p2.images + p2.videos + p2.voiceNotes + p2.documents + p2.links + p2.gifs) }
              ].map((item, i) => (
                <div key={i} className={`rounded-2xl border ${item.border} p-4 flex flex-col items-center justify-center text-center bg-white/40 hover:bg-white/70 transition-colors`}>
                   <span className={`text-[11px] font-bold ${item.color} mb-3 block`}>{item.label}</span>
                   <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-2`}>
                     {item.icon}
                   </div>
                   <span className="text-lg font-display font-extrabold text-textMain mb-2">{item.val.toLocaleString()}</span>
                   <div className="flex items-center gap-2 text-[10px] font-bold w-full justify-between mt-auto pt-2 border-t border-black/5">
                     <span className="text-primary truncate" title={p1.name}>{item.p1Val.toLocaleString()}</span>
                     <span className="text-textMuted mx-1">vs</span>
                     <span className="text-emerald-600 truncate" title={p2.name}>{item.p2Val.toLocaleString()}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Grid Row 3: Expressions & Typing Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-panel rounded-3xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <Smile className="w-5 h-5 text-amber-500" />
             <h3 className="font-bold text-textMain">Expressions</h3>
           </div>
           
           <div className="grid grid-cols-3 mb-2 pb-2 border-b-2 border-black/5">
             <span className="col-span-1"></span>
             <span className="text-xs font-bold text-primary text-center col-span-1">{p1.name}</span>
             <span className="text-xs font-bold text-emerald-600 text-center col-span-1">{p2.name}</span>
           </div>

           <div className="flex flex-col">
             {renderBasicStatRow('Emoji Usage', p1.emojiCount.toLocaleString(), p2.emojiCount.toLocaleString())}
             
             <div className="grid grid-cols-3 py-4 border-b border-black/5 items-center">
                <span className="text-xs font-semibold text-textMuted col-span-1">Most Used Emoji</span>
                <div className="col-span-1 flex justify-center gap-2 text-lg">
                  {p1.mostUsedEmojis.map(e => <div key={e.emoji} className="flex items-center gap-1"><span title={e.count.toLocaleString()}>{e.emoji}</span><span className="text-[10px] text-textMuted font-medium">{e.count.toLocaleString()}</span></div>)}
                </div>
                <div className="col-span-1 flex justify-center gap-2 text-lg">
                  {p2.mostUsedEmojis.map(e => <div key={e.emoji} className="flex items-center gap-1"><span title={e.count.toLocaleString()}>{e.emoji}</span><span className="text-[10px] text-textMuted font-medium">{e.count.toLocaleString()}</span></div>)}
                </div>
             </div>


             {renderBasicStatRow('Emoji per Message', p1.emojiPerMessage, p2.emojiPerMessage)}
           </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <FileText className="w-5 h-5 text-indigo-500" />
             <h3 className="font-bold text-textMain">Typing Style</h3>
           </div>
           
           <div className="grid grid-cols-3 mb-2 pb-2 border-b-2 border-black/5">
             <span className="col-span-1"></span>
             <span className="text-xs font-bold text-primary text-center col-span-1">{p1.name}</span>
             <span className="text-xs font-bold text-emerald-600 text-center col-span-1">{p2.name}</span>
           </div>

           <div className="flex flex-col">
             {renderBasicStatRow('Average Words per Message', p1.avgWordsPerMessage, p2.avgWordsPerMessage)}
             {renderBasicStatRow('Question Frequency', p1.questionFreq, p2.questionFreq)}
             {renderBasicStatRow('Exclamation Usage', p1.exclamationFreq, p2.exclamationFreq)}
             {renderBasicStatRow('Uppercase Usage', p1.uppercaseFreq, p2.uppercaseFreq)}
             {renderBasicStatRow('Emoji Frequency', p1.emojiPerMessage, p2.emojiPerMessage)}
           </div>
        </div>
      </div>

      {/* Grid Row 4: Message Growth & Editing Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="glass-panel rounded-3xl p-6 lg:col-span-7">
           <div className="flex items-center gap-2 mb-1">
             <BarChart2 className="w-5 h-5 text-purple-500" />
             <h3 className="font-bold text-textMain">Message Growth</h3>
           </div>
           <p className="text-xs text-textMuted font-medium mb-4">Messages over time</p>
           
           <div className="h-48 w-full -ml-2">
             <Plot 
               data={[
                 { x: p1.monthlyGrowth.map(m => m.month), y: p1.monthlyGrowth.map(m => m.count), type: 'bar', name: p1.name, marker: { color: '#8b5cf6', borderRadius: 4 } },
                 { x: p2.monthlyGrowth.map(m => m.month), y: p2.monthlyGrowth.map(m => m.count), type: 'bar', name: p2.name, marker: { color: '#22c55e', borderRadius: 4 } }
               ]}
               layout={{ 
                 barmode: 'group',
                 paper_bgcolor: 'transparent',
                 plot_bgcolor: 'transparent',
                 font: { family: 'Inter, sans-serif', color: '#64748b', size: 10 },
                 margin: { t: 10, r: 10, b: 30, l: 30 },
                 xaxis: { gridcolor: 'rgba(0,0,0,0.03)', tickfont: { size: 9 } },
                 yaxis: { gridcolor: 'rgba(0,0,0,0.05)', tickfont: { size: 9 } },
                 legend: { orientation: 'h', y: 1.2, x: 0.8, font: { size: 10 } }
               }} 
               config={{ displayModeBar: false, responsive: true }} 
               style={{ width: '100%', height: '100%' }}
             />
           </div>

           <div className="mt-6 pt-4 border-t border-black/5">
             <h4 className="text-xs font-bold text-textMain mb-3">Top Active Months <span className="text-textMuted font-medium">(by total messages)</span></h4>
             <div className="flex gap-4 overflow-x-auto pb-2">
               {p1.monthlyGrowth.slice(0, 5).map((m, i) => (
                 <div key={i} className="flex-shrink-0 border border-black/5 rounded-xl px-4 py-2 flex flex-col items-center">
                   <span className="text-[10px] font-bold text-primary">{m.month}</span>
                   <span className="text-xs text-textMuted font-medium mt-1">{m.count.toLocaleString()} msgs</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:col-span-5 flex flex-col">
           <div className="flex items-center gap-2 mb-6">
             <Edit3 className="w-5 h-5 text-fuchsia-500" />
             <h3 className="font-bold text-textMain">Editing Activity</h3>
           </div>
           
           <div className="grid grid-cols-3 mb-2 pb-2 border-b-2 border-black/5">
             <span className="col-span-1"></span>
             <span className="text-xs font-bold text-primary text-center col-span-1">{p1.name}</span>
             <span className="text-xs font-bold text-emerald-600 text-center col-span-1">{p2.name}</span>
           </div>

           <div className="flex flex-col mb-8">
             {renderBasicStatRow('Edited Messages', p1.editedMessages, p2.editedMessages)}
             {renderBasicStatRow('Deleted Messages', p1.deletedMessages, p2.deletedMessages)}
             {renderBasicStatRow('Forwarded Messages', p1.forwardedMessages, p2.forwardedMessages)}
           </div>

           <h4 className="text-[11px] font-bold text-textMain mb-4">Deleted Messages Breakdown</h4>
           <div className="flex items-center gap-6 justify-center mt-auto">
             <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute inset-0">
                  <path className="text-emerald-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path className="text-primary" strokeDasharray={`${(p1.deletedMessages / (p1.deletedMessages + p2.deletedMessages) * 100).toFixed(1)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center z-10 mt-1">
                  <span className="text-sm font-bold text-textMain">{p1.deletedMessages + p2.deletedMessages}</span>
                  <span className="text-[8px] text-textMuted uppercase font-bold tracking-wider">Total Deleted</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-primary" /> <span className="text-xs font-semibold text-textMuted">{p1.name} Deleted</span></div>
                  <span className="text-xs font-bold text-textMain">{p1.deletedMessages} <span className="text-textMuted font-medium">({(p1.deletedMessages / (p1.deletedMessages + p2.deletedMessages) * 100).toFixed(1)}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> <span className="text-xs font-semibold text-textMuted">{p2.name} Deleted</span></div>
                  <span className="text-xs font-bold text-textMain">{p2.deletedMessages} <span className="text-textMuted font-medium">({(p2.deletedMessages / (p1.deletedMessages + p2.deletedMessages) * 100).toFixed(1)}%)</span></span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Grid Row 5: AI Insights */}
      <div className="glass-panel border-primary/20 bg-gradient-to-br from-white/90 to-primary/5 rounded-3xl p-6 mb-6">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
             <Zap className="w-5 h-5" />
           </div>
           <div>
             <h3 className="font-bold text-textMain text-lg">AI Comparative Insights</h3>
             <p className="text-xs text-textMuted font-medium">Automatically generated observations based on behavioral patterns.</p>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {p1.aiInsights.map((insight, i) => (
             <div key={i} className="flex items-start gap-3 bg-white/60 border border-primary/60 p-4 rounded-2xl shadow-sm">
               <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <p className="text-sm text-textMain font-medium">{insight}</p>
             </div>
           ))}
           {p2.aiInsights.map((insight, i) => (
             <div key={i} className="flex items-start gap-3 bg-white/60 border border-primary/60 p-4 rounded-2xl shadow-sm">
               <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
               <p className="text-sm text-textMain font-medium">{insight}</p>
             </div>
           ))}
         </div>
      </div>


    </div>
  );
};
