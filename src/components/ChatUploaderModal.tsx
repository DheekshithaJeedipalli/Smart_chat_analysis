import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, UploadCloud } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface ChatUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatUploaderModal: React.FC<ChatUploaderModalProps> = ({ isOpen, onClose }) => {
  const { uploadCustomChat } = useChat();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert("Please upload a standard text export file (.txt) exported from WhatsApp.");
      return;
    }

    setIsParsing(true);
    setProgress(0);
    setStatusText('Opening file stream...');

    try {
      const text = await file.text();
      await uploadCustomChat(file.name, text, [], (prg: number, status: string) => {
        setProgress(prg);
        setStatusText(status);
      });
      setTimeout(() => {
        setIsParsing(false);
        onClose();
        alert(`Successfully processed WhatsApp history for "${file.name}". Analyzing results for: Elena Rostova.`);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsParsing(false);
      alert("Failed parsing chat record locally. Ensure it is a valid WhatsApp text export file.");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isParsing ? onClose : undefined}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative bg-white/85 backdrop-blur-[30px] border border-primary/60 rounded-[28px] w-[500px] max-w-[90%] p-9 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.15)] z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-textMain">
                Upload WhatsApp Conversation
              </h3>
              {!isParsing && (
                <button
                  onClick={onClose}
                  className="bg-white/50 border border-black/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-[18px] h-[18px] text-textMuted" />
                </button>
              )}
            </div>

            {/* Content Switcher */}
            {!isParsing ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-primary/60 bg-white/40 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <UploadCloud className="w-12 h-12 text-primary mb-4 animate-float" />
                <span className="text-sm font-semibold text-textMain mb-1.5">
                  Drag & drop WhatsApp chat export file
                </span>
                <span className="text-xs text-textMuted max-w-[280px] leading-relaxed">
                  Support .txt files exported from WhatsApp chat (with or without media references). Files are parsed locally in browser memory.
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center mt-5">
                <FileText className="w-12 h-12 text-primary mb-4 animate-bounce" />
                
                {/* Loader bar */}
                <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    transition={{ ease: "easeInOut" }}
                  />
                </div>
                
                <span className="text-xs font-semibold text-textMuted">
                  {statusText} ({progress}%)
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
