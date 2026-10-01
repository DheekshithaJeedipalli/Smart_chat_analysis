import React, { useState, useRef, useMemo } from 'react';
import JSZip from 'jszip';
import { useChat } from '../src/context/ChatContext';
import { 
  UploadCloud, 
  Trash2, 
  MessageSquare, 
  Users, 
  Calendar, 
  Activity, 
  ChevronRight, 
  Info, 
  Search, 
  ShieldCheck, 
  X, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Play, 
  FileText,
  ArrowUp,
  Mic,
  Download
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    isDemoData, 
    currentData, 
    uploadCustomChat, 
    deleteCustomChat, 
    hasChat, 
    uploadedFilename, 
    uploadedFileTime,
    mediaAssets,
    setTab
  } = useChat();

  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pastedText, setPastedText] = useState('');

  // Media Modal States
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Mock search query interactions
  const handleQueryClick = (query: string) => {
    alert(`Searching local indexed text for query: "${query}"...\nFound matches across conversation timelines.`);
  };

  // Media Shared in WhatsApp Chat
  const actualImages = mediaAssets.filter(m => m.type === 'image');
  const actualVideos = mediaAssets.filter(m => m.type === 'video');
  const actualAudio = mediaAssets.filter(m => m.type === 'audio');
  const actualDocs = mediaAssets.filter(m => m.type === 'document');

  const displayImages = isDemoData 
    ? [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", desc: "Beach Sunset.jpg" },
        { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop", desc: "Coastal Breeze.png" },
        { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop", desc: "Mountain Cabin.jpg" },
        { url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop", desc: "Forest Pathway.png" },
        { url: "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=600&auto=format&fit=crop", desc: "Green Meadows.jpg" },
        { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop", desc: "Rocky Peak.png" }
      ]
    : actualImages.map(m => ({ url: m.url, desc: m.filename }));

  const displayVideos = isDemoData
    ? [
        { url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4", thumb: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&fit=crop", title: "Forest Stream.mp4", duration: "0:12" },
        { url: "https://assets.mixkit.co/videos/preview/mixkit-sea-waves-holding-floating-balls-28564-large.mp4", thumb: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&fit=crop", title: "Abstract Floating.mp4", duration: "0:24" }
      ]
    : actualVideos.map(m => ({ url: m.url, thumb: '', title: m.filename, duration: '' }));

  const displayAudio = isDemoData
    ? [
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "Voice Note 1.mp3" },
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "Voice Note 2.mp3" }
      ]
    : actualAudio.map(m => ({ url: m.url, title: m.filename }));

  const displayDocs = isDemoData
    ? [
        { url: "#", title: "Project Proposal.pdf" },
        { url: "#", title: "Quarterly Report.docx" }
      ]
    : actualDocs.map(m => ({ url: m.url, title: m.filename }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsParsing(true);
      setProgress(0);
      setStatusText('Reading file locally...');

      try {
        let textContent = '';
        let fileName = file.name;
        let extractedMedia: any[] = [];

        if (file.name.toLowerCase().endsWith('.zip')) {
          setStatusText('Extracting ZIP archive...');
          const zip = new JSZip();
          const zipData = await zip.loadAsync(file);
          
          let foundTxt = false;
          const mediaPromises: Promise<void>[] = [];
          
          for (const [name, zipEntry] of Object.entries(zipData.files)) {
            if (zipEntry.dir) continue;
            
            const lowerName = name.toLowerCase();
            if (lowerName.endsWith('.txt')) {
              if (!foundTxt) {
                textContent = await zipEntry.async("string");
                fileName = name;
                foundTxt = true;
              }
            } else if (lowerName.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
              mediaPromises.push(zipEntry.async("blob").then(blob => {
                extractedMedia.push({ filename: name, url: URL.createObjectURL(blob), type: 'image' });
              }));
            } else if (lowerName.match(/\.(mp4|mov|avi)$/i)) {
              mediaPromises.push(zipEntry.async("blob").then(blob => {
                extractedMedia.push({ filename: name, url: URL.createObjectURL(blob), type: 'video' });
              }));
            } else if (lowerName.match(/\.(opus|m4a|mp3|wav|ogg|aac)$/i)) {
              mediaPromises.push(zipEntry.async("blob").then(blob => {
                extractedMedia.push({ filename: name, url: URL.createObjectURL(blob), type: 'audio' });
              }));
            } else if (lowerName.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i)) {
              mediaPromises.push(zipEntry.async("blob").then(blob => {
                extractedMedia.push({ filename: name, url: URL.createObjectURL(blob), type: 'document' });
              }));
            }
          }

          await Promise.all(mediaPromises);

          if (!foundTxt) {
            throw new Error("No .txt file found inside the ZIP archive.");
          }
        } else {
          textContent = await file.text();
        }

        await uploadCustomChat(fileName, textContent, extractedMedia, (prg, status) => {
          setProgress(prg);
          setStatusText(status);
        });
        
        setTimeout(() => {
          setIsParsing(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setIsParsing(false);
        alert(err instanceof Error ? err.message : "Failed to load chat file.");
      }
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;
    setIsParsing(true);
    setProgress(0);
    setStatusText('Reading pasted chat...');

    try {
      await uploadCustomChat('Pasted_Chat.txt', pastedText, [], (prg, status) => {
        setProgress(prg);
        setStatusText(status);
      });
      setTimeout(() => {
        setIsParsing(false);
        setPastedText('');
      }, 500);
    } catch (err) {
      console.error(err);
      setIsParsing(false);
      alert("Failed to load pasted chat.");
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Date span calculations
  // Sarah dates: Jan 15, 2023 - May 28, 2024 -> 1 Year, 4 Months, 13 Days
  // Elena dates: Oct 15, 2025 - Jun 30, 2026 -> 8 Months, 15 Days
  const dateRangeDisplay = useMemo(() => {
    if (!hasChat) {
      return { start: '-', end: '-', duration: 'No active session' };
    }
    const parts = currentData.dateRange.split(' - ');
    const start = parts[0] || '-';
    const end = parts[1] || '-';
    
    return {
      start,
      end,
      duration: isDemoData ? (currentData.contactName === 'Sarah' ? '1 Year, 4 Months, 13 Days' : '8 Months, 15 Days') : 'Custom duration'
    };
  }, [hasChat, isDemoData, currentData.dateRange, currentData.contactName]);

  return (
    <div className="flex flex-col text-left select-none">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-3xl font-extrabold text-textMain tracking-[-0.8px] mb-1">
          Dashboard
        </h2>
        <p className="text-sm font-semibold text-textMuted">
          Overview of your uploaded WhatsApp conversation.
        </p>
      </div>

      {/* Top Row: Upload & Delete */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upload Chat */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 flex flex-col justify-center gap-4">
          {isParsing ? (
            <div className="flex flex-col items-center justify-center w-full py-4">
              <FileText className="w-10 h-10 text-primary mb-3 animate-bounce" />
              <div className="w-full max-w-md h-1.5 rounded-full bg-black/5 overflow-hidden mb-2.5">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-textMuted">
                {statusText} ({progress}%)
              </span>
            </div>
          ) : !hasChat ? (
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-textMain">Upload Chat</span>
                    <span className="text-[10px] text-textMuted mt-0.5">Upload .txt/.zip file or paste text</span>
                  </div>
                </div>
                <button 
                  onClick={triggerUpload}
                  className="bg-primary/10 border border-primary/25 rounded-xl px-6 py-2.5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(124,92,255,0.1)] cursor-pointer w-full sm:flex-1 text-center"
                >
                  Choose File
                </button>
              </div>
              
              <div className="flex items-center bg-white border border-black/10 shadow-sm rounded-xl px-3 py-2 w-full transition-all focus-within:border-primary/40 focus-within:shadow-md">
                <textarea 
                  rows={2}
                  placeholder="Paste your WhatsApp chat export here..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-textMain placeholder-textLight resize-none overflow-y-auto"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
                <button 
                  onClick={handlePasteSubmit}
                  disabled={!pastedText.trim()}
                  className="text-primary hover:text-primary-light disabled:opacity-50 ml-2 cursor-pointer transition-colors flex items-center justify-center bg-primary/5 hover:bg-primary/10 p-1.5 rounded-lg h-full"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.zip"
                className="hidden"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left hidden sm:flex">
                    <span className="text-xs font-bold text-textMain">Upload Chat</span>
                  </div>
                </div>

                {/* Text Asset Card */}
                <div className="bg-slate-100/50 border border-black/5 rounded-2xl p-2 flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-7 h-8 bg-indigo-500 rounded-lg flex flex-col items-center justify-center text-[8px] font-extrabold text-white tracking-wider relative shadow-sm">
                    <span className="mt-0.5">TXT</span>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600 rounded-b-lg" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-textMain truncate max-w-[140px]">{uploadedFilename}</span>
                    <span className="text-[8px] text-textLight mt-0.5 truncate">Uploaded on {uploadedFileTime}</span>
                  </div>
                </div>

                <button 
                  onClick={triggerUpload}
                  className="bg-white/70 border border-black/5 hover:border-primary/60 hover:bg-primary/5 rounded-xl px-6 py-2.5 text-xs font-bold text-textMuted hover:text-primary transition-all duration-200 cursor-pointer w-full sm:flex-1 text-center"
                >
                  Choose File
                </button>
              </div>

              <div className="flex items-center bg-white border border-black/10 shadow-sm rounded-xl px-3 py-2 w-full transition-all focus-within:border-primary/40 focus-within:shadow-md">
                <textarea 
                  rows={2}
                  placeholder="Paste chat text to replace current session..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-textMain placeholder-textLight resize-none overflow-y-auto"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
                <button 
                  onClick={handlePasteSubmit}
                  disabled={!pastedText.trim()}
                  className="text-primary hover:text-primary-light disabled:opacity-50 ml-2 cursor-pointer transition-colors flex items-center justify-center bg-primary/5 hover:bg-primary/10 p-1.5 rounded-lg h-full"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.zip"
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Delete Chat */}
        <div className="glass-panel rounded-3xl p-5 flex items-center justify-between gap-4 h-full">
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-textMain">Delete Chat</span>
              <span className="text-[11px] text-textMuted mt-0.5">Permanently delete current chat & all data</span>
            </div>
          </div>
          <button 
            onClick={deleteCustomChat}
            disabled={!hasChat}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer ${
              hasChat 
                ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_8px_20px_-6px_rgba(239,68,68,0.4)]'
                : 'bg-slate-100 text-textLight border border-black/5 cursor-not-allowed'
            }`}
          >
            Delete Session
          </button>
        </div>
      </div>

      {/* Middle Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Total Messages */}
        <div className="glass-panel rounded-3xl p-6 h-48 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-bold text-textMain">Total Messages</span>
          </div>
          <div className="flex flex-col text-left mt-2">
            <span className="font-display text-[32px] font-extrabold text-textMain leading-none">
              {hasChat ? currentData.messageCount.toLocaleString() : "-"}
            </span>
            <span className="text-[10px] text-textLight font-semibold mt-1.5">Messages in this conversation</span>
          </div>
          {/* Sparkline overlay */}
          <div className="absolute bottom-0 inset-x-0 h-10 w-full overflow-hidden select-none pointer-events-none">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="purple-spark-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124, 92, 255, 0.25)" />
                  <stop offset="100%" stopColor="rgba(124, 92, 255, 0)" />
                </linearGradient>
              </defs>
              <path 
                d="M0,35 Q30,15 60,25 T120,10 T180,30 T200,15 L200,40 L0,40 Z" 
                fill="url(#purple-spark-grad)" 
              />
              <path 
                d="M0,35 Q30,15 60,25 T120,10 T180,30 T200,15" 
                fill="none" 
                stroke="#7C5CFF" 
                strokeWidth="1.5" 
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Participants */}
        <div className="glass-panel rounded-3xl p-6 h-48 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-xl bg-mint/10 flex items-center justify-center text-mint">
              <Users className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-bold text-textMain">Participants</span>
          </div>
          <div className="flex flex-col text-left mt-2">
            <span className="font-display text-[32px] font-extrabold text-textMain leading-none">
              {hasChat ? (currentData.participantCount ?? 2) : "-"}
            </span>
            <span className="text-[10px] text-textLight font-semibold mt-1.5">
              {hasChat ? `Including ${currentData.contactName}` : "No active session"}
            </span>
          </div>
          {hasChat && (
            <span className="text-[9px] font-bold text-mint bg-mint/10 border border-mint/15 rounded-md px-2 py-0.5 mt-2.5 self-start">
              Personal Chat
            </span>
          )}
          {/* Silhouettes in background */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
            <Users className="w-20 h-20 text-textMain" />
          </div>
        </div>

        {/* Card 3: Date Range */}
        <div className="glass-panel rounded-3xl p-6 h-48 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Calendar className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-bold text-textMain">Date Range</span>
          </div>
          <div className="flex flex-col text-left mt-2 gap-1 select-text">
            <span className="text-xs font-bold text-textMain leading-none">
              {dateRangeDisplay.start}
            </span>
            <span className="text-[10px] font-bold text-textMuted tracking-wider leading-none text-center w-6">-</span>
            <span className="text-xs font-bold text-textMain leading-none">
              {dateRangeDisplay.end}
            </span>
          </div>
          {hasChat && (
            <div className="text-[9px] font-bold text-secondary bg-secondary/10 border border-secondary/15 rounded-md px-2 py-1 mt-2 self-start truncate">
              {dateRangeDisplay.duration}
            </div>
          )}
        </div>

        {/* Card 4: Active Days */}
        <div className="glass-panel rounded-3xl p-6 h-48 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-xl bg-orange/10 flex items-center justify-center text-orange">
              <Activity className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px] font-bold text-textMain">Active Days</span>
          </div>
          <div className="flex flex-col text-left mt-2">
            <span className="font-display text-[32px] font-extrabold text-textMain leading-none">
              {hasChat ? (currentData.activeDays ?? (isDemoData ? "147" : "210")) : "-"}
            </span>
            <span className="text-[10px] text-textLight font-semibold mt-1.5">
              {hasChat ? "Days with conversations" : "No active session"}
            </span>
          </div>
          {hasChat && (
            <span className="text-[9.5px] font-bold text-orange mt-1">
              {isDemoData ? "~ 40% of total days" : "~ 81% of total days"}
            </span>
          )}
          {/* Columns Sparkline */}
          <div className="absolute right-4 bottom-4 left-1/2 w-1/2 h-12 flex items-end gap-1 select-none pointer-events-none opacity-20">
            {[45, 60, 30, 80, 50, 75, 90, 40, 65, 85, 35, 70].map((val, i) => (
              <div 
                key={i} 
                className="flex-grow bg-orange rounded-t-sm" 
                style={{ height: hasChat ? `${val}%` : '4%' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lower Row: Recently Searched & Conversation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Vibe Check */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500">
                <span className="text-[18px]">✨</span>
              </div>
              <span className="text-[14px] font-bold text-textMain">AI Vibe Check</span>
            </div>
            <a 
              href="#view-wrapped"
              onClick={(e) => { e.preventDefault(); setTab('wrapped'); }} 
              className="text-xs font-bold text-fuchsia-500 hover:text-fuchsia-600 transition-colors"
            >
              Play Wrapped
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {hasChat && currentData.participantsData ? (
              (() => {
                const pNames = Object.keys(currentData.participantsData);
                const p1 = currentData.participantsData[pNames[0]];
                const p2 = currentData.participantsData[pNames[1]];
                const totalHappy = p1.moodStats.happy + p2.moodStats.happy;
                const totalSad = p1.moodStats.sad + p2.moodStats.sad;
                const totalStudy = p1.moodStats.study + p2.moodStats.study;
                
                const topMood = [
                  { label: 'Happy & Excited', val: totalHappy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Study & Work', val: totalStudy, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Serious & Sad', val: totalSad, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
                ].sort((a, b) => b.val - a.val)[0];

                return (
                  <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl border border-white/40">
                    <div className={`w-16 h-16 rounded-2xl ${topMood.bg} flex items-center justify-center mb-3`}>
                      <span className="text-3xl">✨</span>
                    </div>
                    <h3 className="text-lg font-display font-extrabold text-textMain mb-1">Your Chat Vibe is <span className={topMood.color}>{topMood.label}</span></h3>
                    <p className="text-xs text-textMuted text-center max-w-[80%] mb-4">
                      Based on AI analysis of your keywords and emojis, this is the most dominant emotion in your conversation!
                    </p>
                    <button 
                      onClick={() => setTab('wrapped')}
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      Play Chat Wrapped
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-white/30 rounded-2xl border border-dashed border-primary/20">
                <span className="text-3xl mb-2">🔮</span>
                <p className="text-xs font-bold text-textMain">Upload a chat to see your Vibe Check!</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Overview */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5 flex-shrink-0">
            <div className="w-[38px] h-[38px] rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Info className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[14px] font-bold text-textMain">Conversation Overview</span>
          </div>

          <div className="flex flex-col gap-1">
            {[
              { label: 'Total Media Messages', value: hasChat ? (currentData.totalMedia ?? (isDemoData ? 12840 : 48900)).toLocaleString() : '0', action: null },
              { label: 'Images', value: hasChat ? (currentData.imageCount ?? (isDemoData ? 8567 : 32450)).toLocaleString() : '0', action: () => setShowImageModal(true), highlight: true },
              { label: 'Videos', value: hasChat ? (currentData.videoCount ?? (isDemoData ? 1234 : 5410)).toLocaleString() : '0', action: () => setShowVideoModal(true), highlight: true },
              { label: 'Documents', value: hasChat ? (currentData.docCount ?? (isDemoData ? 892 : 2120)).toLocaleString() : '0', action: () => setShowDocModal(true), highlight: true },
              { label: 'Voice Messages', value: hasChat ? (currentData.voiceCount ?? (isDemoData ? 2147 : 8920)).toLocaleString() : '0', action: () => setShowAudioModal(true), highlight: true },
            ].map((item) => {
              const isClickable = item.action !== null && hasChat;
              return (
                <button 
                  key={item.label}
                  disabled={!isClickable}
                  onClick={isClickable ? item.action : undefined}
                  className={`w-full flex items-center justify-between px-4 py-3.5 border border-transparent rounded-xl transition-all duration-200 text-left ${
                    isClickable 
                      ? 'bg-white/35 border-primary/60 hover:bg-white/70 hover:border-primary/20 cursor-pointer'
                      : 'bg-transparent cursor-default'
                  }`}
                >
                  <span className={`text-xs font-semibold ${item.highlight && hasChat ? 'text-primary font-bold' : 'text-textMain'}`}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-textMuted">{item.value}</span>
                    {isClickable && <ChevronRight className="w-3.5 h-3.5 text-textLight" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-left leading-normal">
          <span className="text-[11px] font-bold text-textMain block">Your data is completely private and secure.</span>
          <span className="text-[10px] text-textMuted">All analysis is done locally on your device. Nothing is uploaded or shared.</span>
        </div>
      </div>

      {/* ----------------------------------------------------
          IMAGES GALLERY MODAL
          ---------------------------------------------------- */}
      {showImageModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div 
            onClick={() => setShowImageModal(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
          />
          <div className="relative bg-white/90 backdrop-blur-xl border border-primary/60 rounded-[28px] w-[750px] max-w-[95%] max-h-[85vh] p-8 shadow-2xl z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-primary w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-textMain">Images Shared in Chat</h3>
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="bg-white/50 border border-black/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-textMuted" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayImages.map((img, index) => (
                  <div key={index} className="flex flex-col bg-white/40 border border-primary/60 rounded-xl p-2 group hover:shadow-md transition-all duration-200">
                    <div className="aspect-square rounded-lg overflow-hidden relative bg-slate-100 flex items-center justify-center">
                      <img 
                        src={img.url} 
                        alt={img.desc} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-textMuted mt-2 truncate max-w-full px-1">{img.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          VIDEOS GALLERY MODAL
          ---------------------------------------------------- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div 
            onClick={() => {
              setShowVideoModal(false);
              setActiveVideo(null);
            }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
          />
          <div className="relative bg-white/90 backdrop-blur-xl border border-primary/60 rounded-[28px] w-[680px] max-w-[95%] max-h-[85vh] p-8 shadow-2xl z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <VideoIcon className="text-primary w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-textMain">Videos Shared in Chat</h3>
              </div>
              <button 
                onClick={() => {
                  setShowVideoModal(false);
                  setActiveVideo(null);
                }}
                className="bg-white/50 border border-black/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-textMuted" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-1">
              {activeVideo ? (
                <div className="flex flex-col gap-4">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 relative">
                    <video 
                      src={activeVideo} 
                      controls 
                      autoPlay 
                      className="w-full h-full"
                    />
                  </div>
                  <button 
                    onClick={() => setActiveVideo(null)}
                    className="text-xs font-bold text-primary hover:text-primary-light self-start"
                  >
                    &larr; Back to Video List
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {displayVideos.map((vid, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveVideo(vid.url)}
                      className="flex flex-col bg-white/40 border border-primary/60 rounded-2xl p-3 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden relative bg-slate-100 mb-2.5 flex items-center justify-center">
                        {vid.thumb ? (
                          <img 
                            src={vid.thumb} 
                            alt={vid.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <VideoIcon className="w-10 h-10 text-primary/40" />
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-md group-hover:scale-110 transition-transform duration-200">
                            <Play className="w-4 h-4 fill-primary text-primary ml-0.5" />
                          </div>
                        </div>
                        {vid.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-textMain truncate px-1">{vid.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ----------------------------------------------------
          AUDIO GALLERY MODAL
          ---------------------------------------------------- */}
      {showAudioModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div onClick={() => setShowAudioModal(false)} className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-primary/60 rounded-[28px] w-[600px] max-w-[95%] max-h-[85vh] p-8 shadow-2xl z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Mic className="text-primary w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-textMain">Voice Messages</h3>
              </div>
              <button onClick={() => setShowAudioModal(false)} className="bg-white/50 border border-black/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white cursor-pointer"><X className="w-4 h-4 text-textMuted" /></button>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
              <div className="flex flex-col gap-3">
                {displayAudio.map((aud, index) => (
                  <div key={index} className="flex flex-col bg-white/40 border border-primary/60 rounded-xl p-3 hover:shadow-sm transition-all">
                    <span className="text-xs font-bold text-textMain mb-2 truncate px-1">{aud.title}</span>
                    <audio controls src={aud.url} className="w-full h-10 outline-none" />
                  </div>
                ))}
                {displayAudio.length === 0 && <span className="text-xs text-textMuted text-center">No voice messages found in this chat.</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          DOCUMENTS GALLERY MODAL
          ---------------------------------------------------- */}
      {showDocModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div onClick={() => setShowDocModal(false)} className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-primary/60 rounded-[28px] w-[600px] max-w-[95%] max-h-[85vh] p-8 shadow-2xl z-10 flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="text-primary w-5 h-5" />
                <h3 className="font-display text-lg font-bold text-textMain">Documents Shared</h3>
              </div>
              <button onClick={() => setShowDocModal(false)} className="bg-white/50 border border-black/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white cursor-pointer"><X className="w-4 h-4 text-textMuted" /></button>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
              <div className="flex flex-col gap-3">
                {displayDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/40 border border-primary/60 rounded-xl p-3 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-textMain truncate">{doc.title}</span>
                    </div>
                    {doc.url !== '#' && (
                      <a href={doc.url} download={doc.title} className="bg-white hover:bg-primary/5 border border-black/5 text-primary rounded-lg p-2 flex-shrink-0 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
                {displayDocs.length === 0 && <span className="text-xs text-textMuted text-center">No documents found in this chat.</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
