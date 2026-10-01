import React, { useState } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from '../dashboard/Dashboard';
import { RelationshipInsights } from '../relationship insight/RelationshipInsights';
import { ActivityAnalytics } from '../activity analysis/ActivityAnalytics';
import { PeopleParticipants } from '../people and participants/PeopleParticipants';
import { AiInsights } from '../Ai insights/AiInsights';
import { SmartSearch } from '../smart search/SmartSearch';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ChatUploaderModal } from './components/ChatUploaderModal';
import { ChatWrapped } from '../chat wrapped/ChatWrapped';

const DashboardContent: React.FC = () => {
  const { currentTab } = useChat();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div id="app-container" className="flex w-full min-h-screen bg-neutralBg">
      {/* Sidebar - Fixed Left Navigation */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="ml-[290px] w-[calc(100%-290px)] flex flex-col min-h-screen">
        
        {/* Topbar Actions */}
        <Topbar onOpenUpload={() => setIsUploadOpen(true)} />

        {/* Content Pane */}
        <main className="p-10 flex-grow">
          {currentTab === 'dashboard' ? (
            <Dashboard />
          ) : currentTab === 'activity' ? (
            <ActivityAnalytics />
          ) : currentTab === 'relationship' ? (
            <RelationshipInsights />
          ) : currentTab === 'people' ? (
            <PeopleParticipants />
          ) : currentTab === 'ai-insights' ? (
            <AiInsights />
          ) : currentTab === 'search' ? (
            <SmartSearch />
          ) : (
            <PlaceholderPage tabId={currentTab} />
          )}
        </main>
      </div>

      {/* Chat Upload Modal Overlay */}
      <ChatUploaderModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />

      {/* Chat Wrapped Fullscreen Mode */}
      {currentTab === 'wrapped' && <ChatWrapped />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ChatProvider>
      <DashboardContent />
    </ChatProvider>
  );
};

export default App;
