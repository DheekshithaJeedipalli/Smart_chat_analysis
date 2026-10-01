import React from 'react';
import { useChat } from '../context/ChatContext';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Heart, 
  Cpu, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  Check,
  Play
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentTab, setTab } = useChat();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity', name: 'Activity Analytics', icon: LineChart },
    { id: 'people', name: 'People & Participants', icon: Users },
    { id: 'relationship', name: 'Relationship Insights', icon: Heart },
    { id: 'ai-insights', name: 'AI Insights', icon: Cpu },
    { id: 'search', name: 'Smart Search', icon: Search },
  ];

  return (
    <aside className="w-[290px] h-screen fixed top-0 left-0 bg-white/45 backdrop-blur-[25px] flex flex-col p-7 z-50 shadow-[4px_0_30px_rgba(0,0,0,0.01)] select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pl-2">
        <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-xl font-display shadow-[0_8px_16px_-4px_rgba(124,92,255,0.4)]">
          CS
        </div>
        <div className="flex flex-col">
          <h1 className="font-display text-[19px] font-bold text-textMain tracking-[-0.5px] leading-tight">
            Smart chat analysis
          </h1>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-grow overflow-y-auto pr-1 -mr-1 mb-6">
        <ul className="list-none flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border border-transparent text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-[10px] border-primary/20 text-primary shadow-[0_10px_25px_-10px_rgba(124,92,255,0.2)] relative after:content-[""] after:absolute after:left-0 after:top-[25%] after:h-[50%] after:w-[3px] after:bg-gradient-to-b after:from-primary after:to-secondary after:rounded-r-md'
                      : 'text-textMuted hover:bg-white/70 hover:text-textMain hover:border-primary/10 hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-[17px] h-[17px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-textMuted'}`} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Chat Wrapped Call to Action */}
        <div className="mt-6 mb-2 px-1">
          <button 
            onClick={() => setTab('wrapped')}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 p-[1px] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-3 rounded-xl text-white">
              <Play className="w-[17px] h-[17px] fill-white" />
              <span className="text-xs font-bold tracking-wide">Play Chat Wrapped</span>
            </div>
          </button>
        </div>

      </nav>

      {/* Privacy Status Footer Card */}
      <div className="mt-auto">
        <div className="bg-white/50 border border-primary/60 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col gap-3 text-left">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-lg bg-mint/10 flex items-center justify-center text-mint">
              <ShieldCheck className="w-[18px] h-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-textMain leading-tight">Privacy Status</span>
              <span className="text-[9px] font-bold text-mint mt-0.5">100% Private & Secure</span>
            </div>
          </div>
          
          <ul className="flex flex-col gap-2 border-t border-black/5 pt-3">
            {[
              "Data stays on your device",
              "No data uploaded",
              "No data shared",
              "Auto delete after session"
            ].map((text) => (
              <li key={text} className="flex items-center gap-2 text-[10px] font-semibold text-textMuted">
                <div className="w-3.5 h-3.5 rounded-full bg-mint/10 flex items-center justify-center text-mint">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          
          <a 
            href="#privacy-policy" 
            onClick={(e) => { e.preventDefault(); alert("Local privacy information details open."); }}
            className="text-[9.5px] font-bold text-primary hover:text-primary-light transition-colors mt-1 block"
          >
            Learn more about privacy &rarr;
          </a>
        </div>
      </div>
    </aside>
  );
};
