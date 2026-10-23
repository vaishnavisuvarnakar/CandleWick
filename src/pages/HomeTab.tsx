import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  PenTool,
  BookOpen,
  Settings,
  Sparkles,
  Calendar,
  Heart,
  Compass,
  Smile,
  HelpCircle,
} from 'lucide-react';
import { FireplaceIllustration } from '../components/FireplaceIllustration.tsx';
import type { JournalEntry, ReflectionMode } from '../types.ts';

interface HomeTabProps {
  entries: JournalEntry[];
  onNavigateToNotebook: (entryId?: string) => void;
  onNavigateToJournals: () => void;
  onOpenSettings: () => void;
  onOpenWeeklyReflection: () => void;
  isWeekend: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  entries,
  onNavigateToNotebook,
  onNavigateToJournals,
  onOpenSettings,
  onOpenWeeklyReflection,
  isWeekend,
}) => {
  // Compute entries per day for the last 7 days
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const past7DaysData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextDay = new Date(d);
    nextDay.setDate(d.getDate() + 1);

    const count = entries.filter((e) => {
      const entryTime = new Date(e.createdAt).getTime();
      return entryTime >= d.getTime() && entryTime < nextDay.getTime();
    }).length;

    past7DaysData.push({
      day: dayNames[d.getDay()],
      count,
      fullDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    });
  }

  // Compute breakdown of reflection modes used ("What you needed lately")
  const modeCounts: Record<ReflectionMode, number> = {
    listen: 0,
    advise: 0,
    celebrate: 0,
    process: 0,
    concern: 0,
  };

  let totalReflections = 0;
  entries.forEach((e) => {
    if (e.analysis?.mode) {
      modeCounts[e.analysis.mode] = (modeCounts[e.analysis.mode] || 0) + 1;
      totalReflections++;
    }
  });

  const modeDescriptions: Record<ReflectionMode, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
    listen: {
      label: 'To be heard',
      icon: <Heart className="w-4 h-4 text-[#E8A33D]" />,
      color: '#E8A33D',
      desc: 'Quiet listening without advice or silver linings',
    },
    advise: {
      label: 'Gentle direction',
      icon: <Compass className="w-4 h-4 text-[#C8621F]" />,
      color: '#C8621F',
      desc: 'Concrete options and gentle perspectives',
    },
    celebrate: {
      label: 'Celebration',
      icon: <Smile className="w-4 h-4 text-[#E8A33D]" />,
      color: '#E8A33D',
      desc: 'Shared warmth and honoring milestones',
    },
    process: {
      label: 'Untangling thoughts',
      icon: <HelpCircle className="w-4 h-4 text-[#8C3B1E]" />,
      color: '#8C3B1E',
      desc: 'Guiding questions and reflective depth',
    },
    concern: {
      label: 'Care & safety',
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      color: '#e11d48',
      desc: 'Calm support and compassionate grounding',
    },
  };

  const primaryModes: ReflectionMode[] = ['listen', 'advise', 'celebrate', 'process'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner with Cozy Fireplace and Armchair illustration */}
      <section className="relative">
        <FireplaceIllustration variant="banner" />
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#F3E6D0]">
              Good evening in the study
            </h1>
            <p className="text-sm text-[#F3E6D0]/70 mt-1">
              Pull up an armchair. The candle is lit, and the pages are quiet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToNotebook()}
              className="py-2.5 px-5 rounded-2xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] font-medium text-sm transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-[#E8A33D]" />
              <span>Sit down to write</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-2xl bg-[#3B2016]/80 border border-[#8C3B1E]/40 text-[#F3E6D0]/80 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/50 transition-colors cursor-pointer"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Weekend Banner Alert if Saturday or Sunday */}
      {isWeekend && (
        <section className="bg-gradient-to-r from-[#3B2016]/80 via-[#8C3B1E]/30 to-[#3B2016]/80 border border-[#E8A33D]/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8A33D]/20 border border-[#E8A33D]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#E8A33D]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#F3E6D0]">
                Weekend Fireside Reflection
              </h2>
              <p className="text-xs text-[#F3E6D0]/75 mt-0.5">
                The week has quieted down. Take a moment to gather your words and reflect on recent themes.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWeeklyReflection}
            className="py-2.5 px-5 rounded-xl bg-[#E8A33D] hover:bg-[#C8621F] text-[#1F120C] font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Reflect on this week
          </button>
        </section>
      )}

      {/* Grid: Soft Activity & Reflection Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soft Bar Chart: Entries per day this week (NO goals, NO streaks) */}
        <section className="bg-[#3B2016]/50 border border-[#8C3B1E]/30 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F3E6D0]">
              <Calendar className="w-4 h-4 text-[#E8A33D]" />
              <h2 className="font-serif text-lg font-medium">This Week’s Writing</h2>
            </div>
            <span className="text-xs text-[#F3E6D0]/60">7-day view</span>
          </div>

          <p className="text-xs text-[#F3E6D0]/70 leading-normal">
            A quiet record of your visits to the desk. No targets or goals—write only when you wish.
          </p>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={past7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#F3E6D0"
                  opacity={0.6}
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#8C3B1E', opacity: 0.3 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#F3E6D0"
                  opacity={0.6}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#8C3B1E', opacity: 0.3 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(140, 59, 30, 0.15)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#1F120C] border border-[#8C3B1E] rounded-xl px-3 py-2 text-xs shadow-lg text-[#F3E6D0]">
                          <p className="font-medium">{data.fullDate}</p>
                          <p className="text-[#E8A33D] mt-0.5">
                            {data.count} {data.count === 1 ? 'entry' : 'entries'} written
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {past7DaysData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count > 0 ? '#C8621F' : '#3B2016'}
                      opacity={entry.count > 0 ? 0.9 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Reflection Mode Breakdown: What you needed lately (Block/Card Widgets Format) */}
        <section className="bg-[#3B2016]/50 border border-[#8C3B1E]/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#F3E6D0]">
                <Sparkles className="w-4 h-4 text-[#E8A33D]" />
                <h2 className="font-serif text-lg font-medium">What you needed lately</h2>
              </div>
              <span className="text-xs text-[#E8A33D]/90 font-mono bg-[#8C3B1E]/30 border border-[#8C3B1E]/50 px-2 py-0.5 rounded-full">
                {totalReflections} {totalReflections === 1 ? 'reflection' : 'reflections'}
              </span>
            </div>

            <p className="text-xs text-[#F3E6D0]/70 mt-1 leading-normal">
              The gentle tones CandleWick listened with when you asked to reflect.
            </p>
          </div>

          {/* Block / Card Widgets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {primaryModes.map((mode) => {
              const count = modeCounts[mode];
              const percent = totalReflections > 0 ? Math.round((count / totalReflections) * 100) : 0;
              const meta = modeDescriptions[mode];

              return (
                <div
                  key={mode}
                  className="bg-[#1F120C]/65 hover:bg-[#1F120C]/90 border border-[#8C3B1E]/40 hover:border-[#E8A33D]/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${meta.color}15`,
                          borderColor: `${meta.color}40`,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-xl sm:text-2xl font-semibold text-[#F3E6D0] leading-none block">
                          {count}
                        </span>
                        <span className="text-[10px] text-[#F3E6D0]/50 font-mono">
                          {totalReflections > 0 ? `${percent}%` : '0%'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-xs sm:text-sm text-[#F3E6D0] group-hover:text-[#FAF3E8]">
                        {meta.label}
                      </h3>
                      <p className="text-[11px] text-[#F3E6D0]/60 line-clamp-2 mt-0.5 leading-snug">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom mini progress bar */}
                  <div className="h-1.5 w-full bg-[#3B2016]/80 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalReflections > 0 ? Math.max(percent, count > 0 ? 12 : 0) : 0}%`,
                        backgroundColor: meta.color,
                        opacity: count > 0 ? 0.95 : 0.25,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Quick link to recent entries */}
      {entries.length > 0 && (
        <section className="bg-[#3B2016]/30 border border-[#8C3B1E]/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base font-medium text-[#F3E6D0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#E8A33D]" />
              <span>Recent Entries</span>
            </h2>
            <button
              onClick={onNavigateToJournals}
              className="text-xs text-[#E8A33D] hover:underline cursor-pointer"
            >
              View all ({entries.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {entries.slice(0, 3).map((entry) => {
              const preview = entry.text.split('\n')[0].trim() || 'Untitled entry';
              const dateStr = new Date(entry.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={entry.id}
                  onClick={() => onNavigateToNotebook(entry.id)}
                  className="bg-[#1F120C]/50 hover:bg-[#1F120C]/80 border border-[#8C3B1E]/40 hover:border-[#E8A33D]/60 rounded-2xl p-4 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between text-xs text-[#F3E6D0]/60 mb-2">
                    <span>{dateStr}</span>
                    {entry.analysis?.mode && (
                      <span className="text-[10px] uppercase font-semibold text-[#E8A33D] bg-[#8C3B1E]/40 px-2 py-0.5 rounded-full">
                        {entry.analysis.mode}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-sm text-[#F3E6D0]/90 line-clamp-2 group-hover:text-[#F3E6D0]">
                    {preview}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
