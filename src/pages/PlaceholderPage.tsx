import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Cpu, 
  BookOpen, 
  Search, 
  MessageSquareCode, 
  Sparkles, 
  FileText, 
  Settings,
  LucideIcon
} from 'lucide-react';

interface PlaceholderPageProps {
  tabId: string;
}

const TAB_INFO: Record<string, { title: string; desc: string; summary: string; icon: LucideIcon }> = {
  dashboard: {
    title: 'Executive Dashboard',
    desc: 'Aggregated workspace health metrics, contact heatmaps, and platform status indicators.',
    summary: 'A macro view of your conversations across multiple workspaces, detailing active chat volumes, server ping latency, and model availability.',
    icon: LayoutDashboard
  },
  activity: {
    title: 'Activity Analytics',
    desc: 'Temporal and word-volume analysis across days of the week, hourly distributions, and periods.',
    summary: 'Identify conversation hotspots, weekday peaks, hourly message concentrations, and average length indicators.',
    icon: LineChart
  },
  people: {
    title: 'People & Contacts',
    desc: 'Database mapping of analyzed contacts, contact groups, metadata, and custom categorization.',
    summary: 'Audit individual profiles, export contacts as sheets, assign custom tags, or link phone numbers to CRM endpoints.',
    icon: Users
  },
  'ai-insights': {
    title: 'AI Insights & Sentiment Reports',
    desc: 'Semantic clustering, sentiment analysis trends, and key summaries parsed from WhatsApp data.',
    summary: 'Let AI scan conversation sentiments, highlights of positive/negative triggers, key topics, and recurring discussion themes.',
    icon: Cpu
  },
  language: {
    title: 'Language & Writing Style',
    desc: 'Emoji analysis, word clouds, vocabulary richness, punctuation ratios, and text length analytics.',
    summary: 'Examine lexical diversity, emoji usage counts, custom word frequency trees, and typing metrics.',
    icon: BookOpen
  },
  search: {
    title: 'Smart Search Engine',
    desc: 'Locate conversations by sentiment, time filters, intent classification, and key conversational hooks.',
    summary: 'Run advanced filters on local chat histories by dates, keywords, intents, or semantic similarity searches.',
    icon: Search
  },
  assistant: {
    title: 'AI Chat Assistant',
    desc: 'Query your local conversation base using natural language. Fast, anonymous, and offline.',
    summary: 'Query a local, fine-tuned parser model about dates, occurrences, files shared, and conversational facts.',
    icon: MessageSquareCode
  },
  wrapped: {
    title: 'Fun & Wrapped',
    desc: 'Personalized year-end review, communication cards, compatibility scores, and shareable infographics.',
    summary: 'Generate beautiful, styled shareable summaries detailing your chat metrics with friends.',
    icon: Sparkles
  },
  reports: {
    title: 'Reports & Export Center',
    desc: 'Export structured PDF profiles, JSON relational graphs, or anonymized CSV text sheets.',
    summary: 'Export data packets locally with multiple format settings (PDF reports, JSON networks, or CSV sheets).',
    icon: FileText
  },
  settings: {
    title: 'Platform Settings',
    desc: 'Manage thresholds, local encryption keys, UI themes, and parser models.',
    summary: 'Configure local storage parameters, parse speed offsets, security keys, and styling configurations.',
    icon: Settings
  }
};

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ tabId }) => {
  const data = TAB_INFO[tabId] || {
    title: 'Settings Panel',
    desc: 'Generic setup tools.',
    summary: 'Adjust preferences.',
    icon: Settings
  };

  const Icon = data.icon;

  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="bg-white/55 backdrop-blur-xl border border-primary/60 rounded-[24px] p-12 text-center shadow-glass flex flex-col items-center max-w-[640px] w-full hover:shadow-glass-hover transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white mb-6 shadow-[0_8px_20px_-6px_rgba(124,92,255,0.4)]">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl font-bold text-textMain mb-3">
          {data.title}
        </h3>
        <p className="text-sm font-semibold text-textMuted mb-4">
          {data.desc}
        </p>
        <p className="text-xs text-textLight leading-relaxed bg-white/40 border border-primary/60 p-4 rounded-xl">
          {data.summary}
        </p>
      </div>
    </div>
  );
};
