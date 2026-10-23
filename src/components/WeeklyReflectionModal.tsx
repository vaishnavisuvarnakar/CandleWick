import React, { useEffect, useState } from 'react';
import { X, Sparkles, RefreshCw, Feather } from 'lucide-react';
import { FireplaceIllustration } from './FireplaceIllustration.tsx';
import type { JournalEntry } from '../types.ts';
import { generateWeeklyReflection, mapAiErrorToMessage } from '../lib/ai.ts';

interface WeeklyReflectionModalProps {
  onClose: () => void;
  entries: JournalEntry[];
  apiKey: string | null;
  onOpenSettings: () => void;
}

export const WeeklyReflectionModal: React.FC<WeeklyReflectionModalProps> = ({
  onClose,
  entries,
  apiKey,
  onOpenSettings,
}) => {
  const [reflection, setReflection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter entries from last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentEntries = entries.filter((e) => e.createdAt >= sevenDaysAgo);

  const fetchReflection = async () => {
    if (recentEntries.length < 2) return;

    if (!apiKey) {
      setError('Please set your Gemini API key in Settings to receive your weekly reflection.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateWeeklyReflection(
        recentEntries.map((e) => ({ text: e.text, createdAt: e.createdAt })),
        apiKey
      );
      setReflection(result);
    } catch (err) {
      console.error('Weekly reflection error:', err);
      setError(mapAiErrorToMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recentEntries.length >= 2 && !reflection && !isLoading && !error) {
      fetchReflection();
    }
  }, [recentEntries.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F120C]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#3B2016] border border-[#8C3B1E]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F3E6D0] my-8 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl text-[#F3E6D0]/60 hover:text-[#F3E6D0] hover:bg-[#1F120C]/40 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fireplace illustration banner at the top */}
        <div className="mb-5 flex justify-center">
          <FireplaceIllustration variant="compact" className="scale-90 sm:scale-100" />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[#F3E6D0]">
            Fireside Weekly Reflection
          </h2>
          <p className="text-xs text-[#F3E6D0]/70 mt-1">
            Looking back across your entries from the past seven days.
          </p>
        </div>

        {/* Case 1: Fewer than 2 entries */}
        {recentEntries.length < 2 ? (
          <div className="bg-[#1F120C]/60 border border-[#8C3B1E]/40 rounded-2xl p-6 text-center space-y-3">
            <Feather className="w-8 h-8 text-[#E8A33D] mx-auto opacity-75" />
            <h3 className="font-serif text-lg font-medium text-[#F3E6D0]">
              Take your time
            </h3>
            <p className="text-sm text-[#F3E6D0]/80 max-w-md mx-auto leading-relaxed">
              Write a little more this week before reflecting—at least 2 entries are needed so CandleWick can gently listen for recurring themes.
            </p>
            <p className="text-xs text-[#E8A33D]/80 pt-1">
              Currently found {recentEntries.length} {recentEntries.length === 1 ? 'entry' : 'entries'} in the last 7 days.
            </p>
          </div>
        ) : (
          /* Case 2: Enough entries */
          <div className="space-y-4">
            {isLoading && (
              <div className="bg-[#1F120C]/60 border border-[#8C3B1E]/40 rounded-2xl p-8 text-center space-y-3">
                <div className="w-8 h-8 mx-auto relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#E8A33D]/30 border-t-[#E8A33D] animate-spin" />
                </div>
                <p className="font-serif text-base text-[#F3E6D0]">
                  Gathering your words by the hearth...
                </p>
                <p className="text-xs text-[#F3E6D0]/60">
                  Reading across {recentEntries.length} entries with quiet care.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-[#1F120C]/60 border border-red-800/40 rounded-2xl p-5 text-center space-y-3">
                <p className="text-sm text-red-200">{error}</p>
                <div className="flex justify-center gap-3 pt-2">
                  {!apiKey && (
                    <button
                      onClick={onOpenSettings}
                      className="py-1.5 px-4 rounded-xl bg-[#C8621F] text-xs font-medium text-[#F3E6D0]"
                    >
                      Open Settings
                    </button>
                  )}
                  <button
                    onClick={fetchReflection}
                    className="py-1.5 px-4 rounded-xl bg-[#8C3B1E] text-xs font-medium text-[#F3E6D0] flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try again</span>
                  </button>
                </div>
              </div>
            )}

            {reflection && !isLoading && (
              <div className="bg-[#FAF3E8] text-[#2A1A12] border border-[#E6D4BA] rounded-2xl p-6 sm:p-7 shadow-inner space-y-4 max-h-[50vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-xs font-sans text-[#8C3B1E] uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8621F]" />
                  <span>The Week in Review ({recentEntries.length} entries)</span>
                </div>
                <div className="font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line text-[#2A1A12]/95 selection:bg-[#E8A33D]/30">
                  {reflection}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-[#8C3B1E] hover:bg-[#C8621F] text-[#F3E6D0] font-medium text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
