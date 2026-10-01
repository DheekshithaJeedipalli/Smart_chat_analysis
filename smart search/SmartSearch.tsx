import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useChat } from '../src/context/ChatContext';
import { Search, Smile, MessageSquare, Calendar, User } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const SmartSearch: React.FC = () => {
  const { currentData } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSearchQuery(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !currentData.rawMessages) return [];
    
    const query = searchQuery.toLowerCase();
    return currentData.rawMessages.filter(msg => 
      msg.text.toLowerCase().includes(query)
    );
  }, [searchQuery, currentData.rawMessages]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0 mb-6">
        <Search className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-display font-extrabold text-textMain">Smart Search</h1>
      </div>

      <div className="flex-grow flex flex-col w-full relative justify-start">
        
        {/* Search Bar Container */}
        <div className="w-full relative">
          <div className="relative flex items-center bg-white/60 backdrop-blur-xl border border-primary/60 rounded-3xl shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-visible z-20">
            <Search className="w-6 h-6 text-textMuted ml-6" />
            <input 
              type="text" 
              placeholder="Search for words or emojis..." 
              className="flex-grow bg-transparent outline-none px-4 py-5 text-lg font-medium text-textMain placeholder:text-textMuted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="relative mr-4" ref={emojiPickerRef}>
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center text-textMuted hover:text-primary transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-6 h-6" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute right-0 top-14 shadow-2xl z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} />
                </div>
              )}
            </div>
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mr-6 text-xs font-bold text-textMuted hover:text-red-500 bg-black/5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full mt-10 flex-grow flex flex-col relative z-10">
          
          {!searchQuery.trim() ? (
            /* Empty State Decoration */
            <div className="flex flex-col items-center justify-center opacity-60 mt-4">
              <h2 className="text-2xl font-display font-bold text-textMain tracking-wide">Type, search and explore</h2>
              <p className="text-sm text-textMuted font-medium mt-2">Find any word or emoji in your entire chat history instantly.</p>
            </div>
          ) : (
            /* Search Results */
            <div className="flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between px-2">
                <span className="text-sm font-bold text-textMuted">
                  Found <span className="text-primary">{searchResults.length}</span> results for "{searchQuery}"
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto pr-4 pb-10 space-y-4">
                {searchResults.length > 0 ? (
                  searchResults.map((msg, idx) => (
                    <div key={idx} className="glass-panel rounded-2xl p-5 hover:border-primary/60 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-bold text-textMain">{msg.sender}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-textMuted bg-black/5 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {msg.date}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-primary/40 mt-1 shrink-0" />
                        <p className="text-[15px] leading-relaxed text-textMain font-medium">
                          {msg.text.split(new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi')).map((part, i) =>
                            part.toLowerCase() === searchQuery.toLowerCase() 
                              ? <span key={i} className="bg-primary/20 text-primary px-1 rounded-sm">{part}</span>
                              : <span key={i}>{part}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <span className="text-4xl mb-3">🔍</span>
                    <h3 className="text-lg font-bold text-textMain mb-1">No results found</h3>
                    <p className="text-sm text-textMuted font-medium">Try searching for a different word or emoji.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
