import React, { useState, useEffect } from 'react';
import { useChat } from '../src/context/ChatContext';
import {
  Heart, X, Smile, Flame, Share2, BookOpen, Briefcase, Frown, Angry, MessageSquare
} from 'lucide-react';
export const ChatWrapped: React.FC = () => {
  const { currentData, setTab } = useChat();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Close wrapped mode
  const closeWrapped = () => {
    setTab('dashboard');
  };

  if (!currentData || !currentData.participantsData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white">Please upload a chat first.</p>
        <button onClick={closeWrapped} className="ml-4 text-primary">Go Back</button>
      </div>
    );
  }

  // Calculate top sender
  const pNames = Object.keys(currentData.participantsData);
  if (pNames.length < 2) return null;
  const p1 = currentData.participantsData[pNames[0]];
  const p2 = currentData.participantsData[pNames[1]];
  const topSender = p1.totalMessages > p2.totalMessages ? p1 : p2;
  

  // Calculate night owl (most active night) - using generic stat since we don't track 12-5am specifically yet
  // We'll use random or just longest session proxy for now, but to be accurate we'd need time.
  // Instead, let's focus on Moods as the 3rd slide!
  const totalHappy = p1.moodStats.happy + p2.moodStats.happy;
  const totalSad = p1.moodStats.sad + p2.moodStats.sad;
  const totalAngry = p1.moodStats.angry + p2.moodStats.angry;
  const totalStudy = p1.moodStats.study + p2.moodStats.study;
  const totalWork = p1.moodStats.work + p2.moodStats.work;
  const totalCommon = p1.moodStats.common + p2.moodStats.common;
  const allMoods = totalHappy + totalSad + totalAngry + totalStudy + totalWork + totalCommon;

  const getPercent = (val: number) => ((val / (allMoods || 1)) * 100).toFixed(1);

  // Determine top mood
  const moodArray = [
    { label: 'Happy', val: totalHappy, icon: <Smile className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500' },
    { label: 'Study', val: totalStudy, icon: <BookOpen className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500' },
    { label: 'Work', val: totalWork, icon: <Briefcase className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500' },
    { label: 'Sad', val: totalSad, icon: <Frown className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500' },
    { label: 'Angry', val: totalAngry, icon: <Angry className="w-8 h-8 text-red-400" />, color: 'bg-red-500' },
    { label: 'Common', val: totalCommon, icon: <MessageSquare className="w-8 h-8 text-slate-400" />, color: 'bg-slate-500' },
  ].sort((a, b) => b.val - a.val);
  const topMood = moodArray[0];

  const slides = [
    // Slide 1: Intro
    <div key="1" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-indigo-900 to-purple-900">
      <h1 className="text-5xl font-display font-extrabold text-white mb-6">Your Chat Wrapped</h1>
      <p className="text-2xl text-purple-200 mb-8">Let's look back at {currentData.dateRange}</p>
      <div className="w-24 h-1 bg-white/30 rounded-full mb-8"></div>
      <p className="text-xl text-white">You two sent a total of</p>
      <h2 className="text-6xl font-display font-extrabold text-amber-400 my-4">{currentData.messageCount.toLocaleString()}</h2>
      <p className="text-xl text-white">messages.</p>
    </div>,

    // Slide 2: The Talkative One
    <div key="2" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-blue-900 to-emerald-900">
      <MessageSquare className="w-16 h-16 text-emerald-400 mb-6" />
      <h1 className="text-4xl font-display font-extrabold text-white mb-8">The Talkative One</h1>
      <div className="glass-panel bg-white/10 border-white/20 p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2">{topSender.name}</h2>
        <p className="text-emerald-300 text-xl mb-6">sent {topSender.totalMessages.toLocaleString()} messages!</p>
        <div className="w-full bg-black/20 rounded-full h-4 mb-2 overflow-hidden">
          <div className="bg-emerald-400 h-full" style={{ width: `${(topSender.totalMessages / currentData.messageCount) * 100}%` }}></div>
        </div>
        <p className="text-sm text-white/70">That's {((topSender.totalMessages / currentData.messageCount) * 100).toFixed(1)}% of the conversation.</p>
      </div>
    </div>,

    // Slide 3: Mood & Topics (New Feature!)
    <div key="3" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-rose-900 to-orange-900">
      {topMood.icon}
      <h1 className="text-4xl font-display font-extrabold text-white mt-6 mb-2">The Vibe Check</h1>
      <p className="text-xl text-rose-200 mb-8">Based on your words and emojis, your top vibe is <strong>{topMood.label}</strong>.</p>
      
      <div className="w-full max-w-md space-y-4">
        {moodArray.filter(m => m.val > 0).slice(0, 4).map((m, i) => (
          <div key={i} className="bg-black/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {m.icon}
              <span className="text-white font-bold text-lg">{m.label}</span>
            </div>
            <div className="text-right">
              <span className="text-white font-bold block">{getPercent(m.val)}%</span>
              <span className="text-xs text-white/50">{m.val.toLocaleString()} hits</span>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Slide 4: Emoji Lover
    <div key="4" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-fuchsia-900 to-pink-900">
      <Heart className="w-16 h-16 text-pink-400 mb-6" />
      <h1 className="text-4xl font-display font-extrabold text-white mb-8">Top Emojis</h1>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <div className="glass-panel bg-white/10 p-6 rounded-3xl flex flex-col items-center">
          <span className="text-sm font-bold text-white/70 mb-4">{p1.name}</span>
          <div className="text-6xl mb-4">{p1.mostUsedEmojis[0]?.emoji || '👍'}</div>
          <p className="text-pink-300 font-bold">{p1.mostUsedEmojis[0]?.count?.toLocaleString() || 0} times</p>
        </div>
        <div className="glass-panel bg-white/10 p-6 rounded-3xl flex flex-col items-center">
          <span className="text-sm font-bold text-white/70 mb-4">{p2.name}</span>
          <div className="text-6xl mb-4">{p2.mostUsedEmojis[0]?.emoji || '😂'}</div>
          <p className="text-pink-300 font-bold">{p2.mostUsedEmojis[0]?.count?.toLocaleString() || 0} times</p>
        </div>
      </div>
    </div>,

    // Slide 5: The Streak
    <div key="5" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-amber-900 to-red-900">
      <Flame className="w-20 h-20 text-orange-400 mb-6" />
      <h1 className="text-4xl font-display font-extrabold text-white mb-2">Unstoppable</h1>
      <p className="text-xl text-orange-200 mb-8">Your longest texting streak</p>
      
      <h2 className="text-8xl font-display font-extrabold text-white mb-4">{currentData.streakCount}</h2>
      <p className="text-3xl text-orange-300 font-bold">Days in a row</p>
    </div>,

    // Slide 6: Outro summary
    <div key="6" className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-slate-900 to-neutral-900">
      <h1 className="text-4xl font-display font-extrabold text-white mb-8">That's a Wrap!</h1>
      
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-left shadow-2xl transform rotate-1">
        <h2 className="text-2xl font-black text-black mb-1">{p1.name} & {p2.name}</h2>
        <p className="text-gray-500 font-bold text-sm mb-6">Chat Wrapped 2026</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Messages</span>
            <span className="text-black font-bold">{currentData.messageCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Top Vibe</span>
            <span className="text-black font-bold">{topMood.label}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Longest Streak</span>
            <span className="text-black font-bold">{currentData.streakCount} days</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-600 font-medium">Media Shared</span>
            <span className="text-black font-bold">{(p1.images + p2.images + p1.videos + p2.videos).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 justify-center text-primary font-bold bg-primary/10 py-3 rounded-xl">
          <Share2 className="w-5 h-5" />
          Screenshot to Share
        </div>
      </div>
    </div>
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(curr => {
        if (curr < slides.length - 1) {
          return curr + 1;
        }
        clearInterval(timer);
        return curr;
      });
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-1 px-4 z-10">
        {slides.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: currentSlide > idx ? '100%' : currentSlide === idx ? '100%' : '0%',
                transitionDuration: currentSlide === idx ? '6000ms' : '0ms'
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button onClick={closeWrapped} className="absolute top-8 right-6 text-white/50 hover:text-white z-20">
        <X className="w-8 h-8" />
      </button>

      {/* Slide Area */}
      <div className="flex-1 relative overflow-hidden">
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: currentSlide === idx ? 1 : 0, pointerEvents: currentSlide === idx ? 'auto' : 'none' }}
          >
            {slide}
          </div>
        ))}

        {/* Invisible Tap Zones */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={prevSlide}></div>
        <div className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer" onClick={nextSlide}></div>
      </div>
    </div>
  );
};
