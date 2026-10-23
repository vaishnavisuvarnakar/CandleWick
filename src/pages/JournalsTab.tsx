import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Calendar,
  Check,
  ChevronRight,
} from 'lucide-react';
import { FireplaceIllustration } from '../components/FireplaceIllustration.tsx';
import type { JournalEntry } from '../types.ts';

interface JournalsTabProps {
  entries: JournalEntry[];
  onSelectEntry: (id: string) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => Promise<void>;
  onOpenWeeklyReflection: () => void;
  isWeekend: boolean;
}

export const JournalsTab: React.FC<JournalsTabProps> = ({
  entries,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
  onOpenWeeklyReflection,
  isWeekend,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group entries by human-friendly date header
  const groupEntriesByDate = (entriesList: JournalEntry[]) => {
    const groups: { [key: string]: JournalEntry[] } = {};
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    entriesList.forEach((entry) => {
      const entryDate = new Date(entry.createdAt);
      const entryDateStr = entryDate.toDateString();

      let header = entryDate.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });

      if (entryDateStr === todayStr) {
        header = 'Today';
      } else if (entryDateStr === yesterdayStr) {
        header = 'Yesterday';
      }

      if (!groups[header]) {
        groups[header] = [];
      }
      groups[header].push(entry);
    });

    return groups;
  };

  const grouped = groupEntriesByDate(entries);

  // Download single entry as Markdown
  const handleDownloadMarkdown = (entry: JournalEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateFormatted = new Date(entry.createdAt).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    let md = `# CandleWick Entry — ${dateFormatted}\n\n`;
    md += `${entry.text}\n\n`;
    if (entry.analysis) {
      md += `> **CandleWick Reflection (${entry.analysis.mode.toUpperCase()})**\n>\n`;
      md += `> ${entry.analysis.reflection.split('\n').join('\n> ')}\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeDate = new Date(entry.createdAt).toISOString().slice(0, 10);
    a.href = url;
    a.download = `candlewick-entry-${safeDate}-${entry.id.slice(0, 6)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share entry via Web Share API or copy-to-clipboard fallback
  const handleShareEntry = async (entry: JournalEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateFormatted = new Date(entry.createdAt).toLocaleDateString();
    const shareText = `${entry.text.slice(0, 200)}...\n\n— Written in CandleWick (${dateFormatted})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `CandleWick Journal Entry - ${dateFormatted}`,
          text: entry.text,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was dismissed or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(entry.text);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      alert('Unable to copy to clipboard.');
    }
  };

  // Handle delete with confirmation dialog
  const confirmDelete = async () => {
    if (!deletingId) return;
    await onDeleteEntry(deletingId);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header bar: Title, Add Entry, Weekly Reflection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3B2016] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#F3E6D0]">
            Journals
          </h1>
          <p className="text-xs sm:text-sm text-[#F3E6D0]/70 mt-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} stored safely on this device
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenWeeklyReflection}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              isWeekend
                ? 'bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] shadow-md ring-1 ring-[#E8A33D]/60'
                : 'bg-[#3B2016] hover:bg-[#8C3B1E]/60 text-[#F3E6D0] border border-[#8C3B1E]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>Weekly reflection</span>
          </button>

          <button
            onClick={onNewEntry}
            className="py-2 px-4 rounded-xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] text-xs sm:text-sm font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E8A33D]" />
            <span>Add entry</span>
          </button>
        </div>
      </div>

      {/* Empty State: Armchair & lit fireplace */}
      {entries.length === 0 ? (
        <div className="my-12 flex flex-col items-center justify-center text-center p-8 bg-[#3B2016]/30 border border-[#8C3B1E]/30 rounded-3xl">
          <FireplaceIllustration variant="spot" className="mb-6" />
          <h2 className="font-serif text-2xl font-medium text-[#F3E6D0]">
            Nothing here yet. Take a seat.
          </h2>
          <p className="text-sm text-[#F3E6D0]/70 max-w-sm mt-2 leading-relaxed">
            The fire is burning quietly. There are no word counts or schedules here—write whenever you feel like unburdening your mind.
          </p>
          <button
            onClick={onNewEntry}
            className="mt-6 py-3 px-6 rounded-2xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] font-medium text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E8A33D]" />
            <span>Write your first entry</span>
          </button>
        </div>
      ) : (
        /* Entries List Grouped by Date */
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateHeader, groupEntries]) => (
            <div key={dateHeader} className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#E8A33D]/90 px-1">
                <Calendar className="w-3.5 h-3.5 text-[#8C3B1E]" />
                <span>{dateHeader}</span>
              </div>

              <div className="space-y-3">
                {groupEntries.map((entry) => {
                  const firstLine =
                    entry.text.split('\n')[0].trim() || 'Untitled entry';
                  const dateStr = new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <article
                      key={entry.id}
                      onClick={() => onSelectEntry(entry.id)}
                      className="group bg-[#3B2016]/40 hover:bg-[#3B2016]/70 border border-[#8C3B1E]/40 hover:border-[#E8A33D]/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2.5 text-xs text-[#F3E6D0]/60">
                          <span className="font-mono">{dateStr}</span>
                          {entry.analysis?.mode && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase text-[#E8A33D] bg-[#8C3B1E]/50 px-2 py-0.5 rounded-full border border-[#8C3B1E]">
                              <Sparkles className="w-3 h-3 text-[#E8A33D]" />
                              <span>{entry.analysis.mode}</span>
                            </span>
                          )}
                        </div>

                        {/* First line preview rendered strictly as text */}
                        <h3 className="font-serif text-base sm:text-lg text-[#F3E6D0] group-hover:text-[#FAF3E8] truncate">
                          {firstLine}
                        </h3>

                        {entry.text.split('\n').length > 1 && (
                          <p className="text-xs text-[#F3E6D0]/60 line-clamp-1">
                            {entry.text.split('\n').slice(1).join(' ').trim()}
                          </p>
                        )}
                      </div>

                      {/* Entry Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={(e) => handleDownloadMarkdown(entry, e)}
                          className="p-2 rounded-xl text-[#F3E6D0]/70 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/40 transition-colors"
                          title="Download as Markdown"
                          aria-label="Download as Markdown"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleShareEntry(entry, e)}
                          className="p-2 rounded-xl text-[#F3E6D0]/70 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/40 transition-colors relative"
                          title="Share entry or copy to clipboard"
                          aria-label="Share entry"
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                          {copiedId === entry.id && (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-[#1F120C] text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap">
                              Copied!
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(entry.id);
                          }}
                          className="p-2 rounded-xl text-red-300/70 hover:text-red-200 hover:bg-red-950/40 transition-colors"
                          title="Delete entry"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="pl-1 text-[#F3E6D0]/40 group-hover:text-[#E8A33D] transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F120C]/85 backdrop-blur-sm">
          <div className="bg-[#3B2016] border border-[#8C3B1E]/80 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-[#F3E6D0]">
            <h4 className="font-serif text-lg font-medium text-red-200">
              Delete this entry?
            </h4>
            <p className="text-xs text-[#F3E6D0]/80 leading-relaxed">
              This entry will be permanently removed from your encrypted device storage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="py-2 px-4 rounded-xl bg-[#1F120C]/60 hover:bg-[#1F120C] text-xs font-medium text-[#F3E6D0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 rounded-xl bg-red-800 hover:bg-red-700 text-xs font-medium text-red-100 transition-colors cursor-pointer"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
