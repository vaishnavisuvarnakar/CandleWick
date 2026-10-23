import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Check,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  BookOpen,
  PenLine,
} from 'lucide-react';
import type { JournalEntry, ReflectionAnalysis } from '../types.ts';
import { reflectOnEntry, mapAiErrorToMessage } from '../lib/ai.ts';

interface NotebookTabProps {
  entry: JournalEntry;
  onSaveEntry: (entry: JournalEntry) => Promise<void>;
  apiKey: string | null;
  onOpenSettings: () => void;
}

export const NotebookTab: React.FC<NotebookTabProps> = ({
  entry,
  onSaveEntry,
  apiKey,
  onOpenSettings,
}) => {
  const [text, setText] = useState(entry.text || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectError, setReflectError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ReflectionAnalysis | undefined>(entry.analysis);
  const [flippedPage, setFlippedPage] = useState(false);
  const [mobilePage, setMobilePage] = useState<'write' | 'reflection'>('write');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Sync state if a different entry is opened
  useEffect(() => {
    setText(entry.text || '');
    setAnalysis(entry.analysis);
    setReflectError(null);
    setSaveStatus('saved');
    if (entry.analysis) {
      setMobilePage('reflection');
    } else {
      setMobilePage('write');
    }
  }, [entry.id]);

  // Debounced autosave (~800ms) to IndexedDB via storage.ts
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const updated: JournalEntry = {
          ...entry,
          text,
          updatedAt: Date.now(),
          analysis,
        };
        await onSaveEntry(updated);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('idle');
      }
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [text, analysis]);

  // Trigger reflection flow
  const handleReflect = async () => {
    if (!text.trim() || text.trim().length < 5) {
      setReflectError('Write at least a sentence before asking for a reflection.');
      return;
    }

    if (!apiKey) {
      setReflectError('Please configure your Gemini API key in Settings first.');
      return;
    }

    setIsReflecting(true);
    setReflectError(null);

    try {
      const result = await reflectOnEntry(text, apiKey);
      setAnalysis(result);

      // Trigger 3D flip animation
      setFlippedPage(true);
      setMobilePage('reflection');

      // Update stored entry with analysis
      const updatedEntry: JournalEntry = {
        ...entry,
        text,
        updatedAt: Date.now(),
        analysis: result,
      };
      await onSaveEntry(updatedEntry);
    } catch (err) {
      console.error('Reflection failed:', err);
      setReflectError(mapAiErrorToMessage(err));
    } finally {
      setIsReflecting(false);
    }
  };

  const clearReflection = async () => {
    setAnalysis(undefined);
    setFlippedPage(false);
    setMobilePage('write');
    const updated: JournalEntry = {
      ...entry,
      text,
      updatedAt: Date.now(),
      analysis: undefined,
    };
    await onSaveEntry(updated);
  };

  const formattedDate = new Date(entry.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 pb-12 animate-fade-in">
      {/* Mobile Page Switcher */}
      <div className="flex md:hidden items-center justify-between bg-[#3B2016]/80 p-1.5 rounded-2xl border border-[#8C3B1E]/40 text-xs">
        <button
          onClick={() => setMobilePage('write')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobilePage === 'write' ? 'bg-[#8C3B1E] text-[#F3E6D0] font-medium' : 'text-[#F3E6D0]/60'
          }`}
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Writing Page</span>
        </button>
        <button
          onClick={() => setMobilePage('reflection')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobilePage === 'reflection' ? 'bg-[#8C3B1E] text-[#F3E6D0] font-medium' : 'text-[#F3E6D0]/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reflection {analysis && '✓'}</span>
        </button>
      </div>

      {/* Two-Page Spread Book Wrapper */}
      <div className="relative rounded-3xl bg-[#2A160F] p-3 sm:p-5 shadow-2xl border border-[#3B2016]">
        {/* Subtle decorative leather book edge highlight */}
        <div className="absolute inset-x-8 top-1 h-[2px] bg-[#8C3B1E]/40 rounded-full" />
        <div className="absolute inset-x-8 bottom-1 h-[2px] bg-[#8C3B1E]/30 rounded-full" />

        {/* Spread Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl min-h-[580px] sm:min-h-[640px] border border-[#D5C2A5]/40">
          {/* ================= LEFT PAGE: WRITING SPREAD ================= */}
          <div
            className={`parchment-sheet parchment-lined notebook-spine-shadow-left p-6 sm:p-8 flex flex-col justify-between relative transition-opacity duration-300 ${
              mobilePage === 'reflection' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Top Header of Left Page: Date consistent with the page below */}
            <div className="flex items-center justify-between border-b border-[#8C3B1E]/15 pb-2.5 mb-3">
              <span className="font-serif text-base sm:text-lg text-[#2A1A12] font-normal select-none">
                {formattedDate}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-sans text-[#2A1A12]/50 font-mono">
                {saveStatus === 'saving' && <span>Saving...</span>}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-[#8C3B1E]">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                )}
              </div>
            </div>

            {/* Free-writing textarea with NO word counts, NO prompts */}
            <div className="flex-1 flex flex-col relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write whatever is on your mind in the quiet..."
                className="w-full flex-1 bg-transparent resize-none border-none focus:outline-none font-serif text-base sm:text-lg text-[#2A1A12] leading-[32px] placeholder-[#2A1A12]/30 selection:bg-[#E8A33D]/30"
                style={{
                  lineHeight: '32px',
                }}
              />
            </div>

            {/* Bottom bar of left page: Quiet Reflect Button */}
            <div className="pt-3 flex items-center justify-between border-t border-[#8C3B1E]/15 mt-3">
              <span className="text-[11px] font-serif italic text-[#2A1A12]/50">
                CandleWick Sanctuary
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReflect}
                  disabled={isReflecting || !text.trim()}
                  className="py-1.5 px-3.5 rounded-xl bg-[#8C3B1E]/90 hover:bg-[#8C3B1E] disabled:opacity-40 text-[#F3E6D0] font-sans text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  title="Receive a gentle AI reflection"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
                  <span>{isReflecting ? 'Listening...' : 'Reflect'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PAGE: ANALYSIS / CANDLE SPREAD ================= */}
          <div
            className={`parchment-sheet notebook-spine-shadow-right p-6 sm:p-8 flex flex-col justify-between relative perspective-1200 ${
              mobilePage === 'write' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* When Error Occurs */}
            {reflectError && !isReflecting && (
              <div className="my-auto bg-[#3B2016]/10 border border-[#8C3B1E]/40 rounded-2xl p-6 text-center space-y-3">
                <p className="font-serif text-sm text-[#8C3B1E] leading-relaxed">
                  {reflectError}
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {!apiKey && (
                    <button
                      onClick={onOpenSettings}
                      className="py-1.5 px-3 rounded-xl bg-[#8C3B1E] text-xs text-[#F3E6D0] flex items-center gap-1"
                    >
                      <span>Open Settings</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={handleReflect}
                    className="py-1.5 px-3 rounded-xl bg-[#C8621F] text-xs text-[#F3E6D0] flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try again</span>
                  </button>
                </div>
              </div>
            )}

            {/* When Reflecting (Loading) */}
            {isReflecting && (
              <div className="my-auto flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#E8A33D]/25 blur-lg absolute inset-0" />
                  <svg
                    width="36"
                    height="46"
                    viewBox="0 0 32 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 animate-candle-flame"
                  >
                    <rect x="11" y="22" width="10" height="18" rx="2" fill="#3B2016" />
                    <line x1="16" y1="20" x2="16" y2="15" stroke="#2A1A12" strokeWidth="1.5" />
                    <path
                      d="M16 2C16 2 21 8 21 13C21 16.31 18.76 18 16 18C13.24 18 11 16.31 11 13C11 8 16 2 16 2Z"
                      fill="#E8A33D"
                    />
                    <path
                      d="M16 6C16 6 18.8 10 18.8 13C18.8 14.8 17.5 16 16 16C14.5 16 13.2 14.8 13.2 13C13.2 10 16 6 16 6Z"
                      fill="#FAF3E8"
                    />
                  </svg>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#2A1A12]">
                  Listening in the quiet...
                </h4>
                <p className="text-xs text-[#2A1A12]/60 max-w-xs leading-relaxed">
                  CandleWick is reading your entry with warm attention.
                </p>
              </div>
            )}

            {/* When No Reflection Exists Yet (Default Right Page State) */}
            {!analysis && !isReflecting && !reflectError && (
              <div className="my-auto flex flex-col items-center justify-center text-center p-6 space-y-4 select-none">
                {/* Small candle illustration */}
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#E8A33D]/20 blur-md absolute" />
                  <svg
                    width="32"
                    height="42"
                    viewBox="0 0 32 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 opacity-80"
                  >
                    <rect x="11" y="22" width="10" height="18" rx="2" fill="#8C3B1E" />
                    <line x1="16" y1="20" x2="16" y2="15" stroke="#2A1A12" strokeWidth="1.5" />
                    <g className="animate-candle-flame">
                      <path
                        d="M16 4C16 4 20 9 20 13C20 15.8 18.2 17.5 16 17.5C13.8 17.5 12 15.8 12 13C12 9 16 4 16 4Z"
                        fill="#E8A33D"
                      />
                      <path
                        d="M16 8C16 8 18 11 18 13.5C18 15 17 16 16 16C15 16 14 15 14 13.5C14 11 16 8 16 8Z"
                        fill="#FAF3E8"
                      />
                    </g>
                  </svg>
                </div>

                {/* Specified line: "Write whatever you wish." */}
                <p className="font-serif text-xl sm:text-2xl text-[#2A1A12]/80 italic">
                  Write whatever you wish.
                </p>

                <p className="text-xs text-[#2A1A12]/50 max-w-xs leading-normal">
                  When your thoughts are resting on the page, tap <em>Reflect</em> on the left for a quiet reading.
                </p>
              </div>
            )}

            {/* When Reflection Exists (Flip Page / Result State) */}
            {analysis && !isReflecting && !reflectError && (
              <div
                className={`flex-1 flex flex-col justify-between space-y-4 ${
                  flippedPage ? 'animate-page-flip' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Top Mode Badge */}
                  <div className="flex items-center justify-between border-b border-[#8C3B1E]/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#8C3B1E] bg-[#8C3B1E]/10 px-2.5 py-0.5 rounded-full border border-[#8C3B1E]/20">
                        {analysis.mode}
                      </span>
                      <span className="text-xs text-[#2A1A12]/60 hidden sm:inline">
                        {analysis.reason}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={clearReflection}
                      className="text-xs text-[#2A1A12]/40 hover:text-[#8C3B1E] flex items-center gap-1 cursor-pointer"
                      title="Clear reflection"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Reflection Text rendered strictly as text (under 180 words) */}
                  <div className="bg-[#FAF3E8]/80 border border-[#E6D4BA] rounded-2xl p-5 sm:p-6 shadow-sm overflow-y-auto max-h-[420px]">
                    <div className="font-serif text-base sm:text-lg leading-relaxed text-[#2A1A12]/95 whitespace-pre-line selection:bg-[#E8A33D]/30">
                      {analysis.reflection}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer of Right Page */}
                <div className="pt-2 flex items-center justify-between border-t border-[#8C3B1E]/15 text-[11px] text-[#2A1A12]/50">
                  <span className="font-mono">
                    {new Date(analysis.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={handleReflect}
                    className="text-[#8C3B1E] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Sparkles className="w-3 h-3 text-[#C8621F]" />
                    <span>Re-reflect</span>
                  </button>
                </div>
              </div>
            )}

            {/* Subtle right page watermark */}
            <div className="pt-2 text-right">
              <span className="text-[10px] text-[#2A1A12]/30 font-serif italic">
                CandleWick
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
