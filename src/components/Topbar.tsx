import React from 'react';


interface TopbarProps {
  onOpenUpload: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenUpload }) => {
  return (
    <header className="h-20 flex items-center justify-end px-10 bg-neutralBg/40 backdrop-blur-md sticky top-0 z-40">
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenUpload}
          className="bg-primary/10 border border-primary/20 px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer hover:bg-primary/20 transition-colors"
        >
          <span className="text-lg">✨</span>
          <span className="text-sm font-bold text-primary tracking-wide">Upload and Explore</span>
        </button>
      </div>
    </header>
  );
};
