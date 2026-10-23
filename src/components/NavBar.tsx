import React from 'react';
import { Home, BookOpen, PenTool, Settings, Lock, Sparkles } from 'lucide-react';
import { CandleLogo } from './CandleLogo.tsx';
import type { TabType } from '../types.ts';

interface NavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSettings: () => void;
  onLock: () => void;
  onOpenWeeklyReflection: () => void;
  isWeekend: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenSettings,
  onLock,
  onOpenWeeklyReflection,
  isWeekend,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#1F120C]/90 backdrop-blur-md border-b border-[#3B2016]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <CandleLogo onClick={() => onTabChange('home')} />

        {/* Center: Three primary tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-[#3B2016]/60 p-1.5 rounded-2xl border border-[#8C3B1E]/30" aria-label="Main Navigation">
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#8C3B1E] text-[#F3E6D0] shadow-sm'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/30'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden xs:inline">Home</span>
          </button>

          <button
            onClick={() => onTabChange('journals')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'journals'
                ? 'bg-[#8C3B1E] text-[#F3E6D0] shadow-sm'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden xs:inline">Journals</span>
          </button>

          <button
            onClick={() => onTabChange('notebook')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentTab === 'notebook'
                ? 'bg-[#8C3B1E] text-[#F3E6D0] shadow-sm'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/30'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden xs:inline">Notebook</span>
          </button>
        </nav>

        {/* Right Actions: Weekend prompt, Lock, Settings */}
        <div className="flex items-center gap-2">
          {isWeekend && (
            <button
              onClick={onOpenWeeklyReflection}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8621F]/20 border border-[#E8A33D]/60 text-[#E8A33D] hover:bg-[#C8621F]/30 hover:border-[#E8A33D] text-xs font-medium transition-all cursor-pointer shadow-sm"
              title="Weekend fireside weekly reflection is ready"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Weekend Reflection</span>
            </button>
          )}

          <button
            onClick={onLock}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#3B2016]/60 border border-[#8C3B1E]/40 text-[#F3E6D0]/80 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/40 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Lock journal"
          >
            <Lock className="w-4 h-4 text-[#E8A33D]" />
            <span className="hidden lg:inline">Lock</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#3B2016]/60 border border-[#8C3B1E]/40 text-[#F3E6D0]/80 hover:text-[#F3E6D0] hover:bg-[#8C3B1E]/40 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
