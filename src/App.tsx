/**
 * CandleWick - Private, Cozy Journaling App
 * Client-only static architecture for Vercel/Web
 */

import React, { useEffect, useState } from 'react';
import type { JournalEntry, TabType } from './types.ts';
import { isSecurityInitialized } from './lib/crypto.ts';
import {
  deleteEntry,
  getActiveCryptoKey,
  isStorageUnlocked,
  listEntries,
  saveEntry,
  setActiveCryptoKey,
} from './lib/storage.ts';

import { EmberBackground } from './components/EmberBackground.tsx';
import { NavBar } from './components/NavBar.tsx';
import { SetupModal } from './components/SetupModal.tsx';
import { LockScreen } from './components/LockScreen.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { WeeklyReflectionModal } from './components/WeeklyReflectionModal.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';

import { HomeTab } from './pages/HomeTab.tsx';
import { JournalsTab } from './pages/JournalsTab.tsx';
import { NotebookTab } from './pages/NotebookTab.tsx';
import { DevEvalPage } from './pages/DevEvalPage.tsx';

export default function App() {
  // Security & Authentication State
  const [isInitialized, setIsInitialized] = useState<boolean>(() => isSecurityInitialized());
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isStorageUnlocked());
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return sessionStorage.getItem('candlewick_session_apikey');
  });

  // Routing and Tabs
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isDevEval, setIsDevEval] = useState<boolean>(() => {
    return (
      window.location.pathname.includes('/dev/eval') ||
      window.location.hash === '#dev-eval' ||
      window.location.search.includes('dev=eval')
    );
  });
  const [is404, setIs404] = useState<boolean>(false);

  // Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showWeeklyReflection, setShowWeeklyReflection] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  // Journal Entries State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState<boolean>(false);

  // Weekend calculation (0 is Sunday, 6 is Saturday)
  const isWeekend = (() => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  })();

  // Listen to hash/URL changes for dev eval routing
  useEffect(() => {
    const handleUrlChange = () => {
      const match =
        window.location.pathname.includes('/dev/eval') ||
        window.location.hash === '#dev-eval' ||
        window.location.search.includes('dev=eval');
      setIsDevEval(match);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Fetch entries from encrypted IndexedDB when unlocked
  const refreshEntries = async () => {
    if (!isStorageUnlocked()) return;
    setIsLoadingEntries(true);
    try {
      const list = await listEntries();
      setEntries(list);

      // If active entry is selected, keep it updated
      if (activeEntry) {
        const found = list.find((e) => e.id === activeEntry.id);
        if (found) {
          setActiveEntry(found);
        }
      }
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      refreshEntries();
    }
  }, [isUnlocked]);

  // Handle first-time setup completion
  const handleSetupComplete = (configuredKey: string | null) => {
    setApiKey(configuredKey);
    setIsInitialized(true);
    setIsUnlocked(true);
    refreshEntries();
  };

  // Handle unlock
  const handleUnlock = (resolvedApiKey: string | null) => {
    if (resolvedApiKey) {
      setApiKey(resolvedApiKey);
    }
    setIsUnlocked(true);
    refreshEntries();
  };

  // Handle lock journal
  const handleLockJournal = () => {
    setActiveCryptoKey(null);
    setIsUnlocked(false);
  };

  // Handle creating a new entry
  const handleCreateNewEntry = () => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      text: '',
    };
    setActiveEntry(newEntry);
    setCurrentTab('notebook');
  };

  // Handle selecting an existing entry
  const handleSelectEntry = (id: string) => {
    const found = entries.find((e) => e.id === id);
    if (found) {
      setActiveEntry(found);
      setCurrentTab('notebook');
    }
  };

  // Handle saving an entry from Notebook
  const handleSaveEntry = async (entryToSave: JournalEntry) => {
    await saveEntry(entryToSave);
    setActiveEntry(entryToSave);
    await refreshEntries();
  };

  // Handle deleting an entry
  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
    await refreshEntries();
  };

  // Handle full data reset
  const handleDataReset = () => {
    setEntries([]);
    setActiveEntry(null);
    setApiKey(null);
    setIsUnlocked(false);
    setIsInitialized(false);
    setShowSettings(false);
  };

  // Ensure an active entry exists if user goes to notebook
  useEffect(() => {
    if (currentTab === 'notebook' && !activeEntry && isUnlocked) {
      if (entries.length > 0) {
        setActiveEntry(entries[0]);
      } else {
        handleCreateNewEntry();
      }
    }
  }, [currentTab, activeEntry, isUnlocked, entries.length]);

  // If first-time user: display SetupModal
  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-[#1F120C] text-[#F3E6D0] relative flex items-center justify-center">
        <EmberBackground />
        <SetupModal onComplete={handleSetupComplete} />
      </main>
    );
  }

  // If locked: display LockScreen
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#1F120C] text-[#F3E6D0] relative flex items-center justify-center">
        <EmberBackground />
        <LockScreen onUnlock={handleUnlock} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F120C] text-[#F3E6D0] flex flex-col relative selection:bg-[#E8A33D]/30 selection:text-[#FAF3E8]">
      {/* Background drifting embers */}
      <EmberBackground />

      {/* Top Navigation */}
      <NavBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setIsDevEval(false);
          setIs404(false);
          setCurrentTab(tab);
        }}
        onOpenSettings={() => setShowSettings(true)}
        onLock={handleLockJournal}
        onOpenWeeklyReflection={() => setShowWeeklyReflection(true)}
        isWeekend={isWeekend}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 relative z-10">
        {/* Friendly 404 Handler */}
        {is404 ? (
          <div className="my-16 text-center max-w-md mx-auto space-y-4 p-8 bg-[#3B2016]/40 border border-[#8C3B1E]/40 rounded-3xl">
            <h2 className="font-serif text-3xl font-medium text-[#F3E6D0]">
              Lost in the corridors
            </h2>
            <p className="text-sm text-[#F3E6D0]/70 leading-relaxed">
              The candle flickers in an empty corner. There are no journal entries or notebooks here.
            </p>
            <button
              onClick={() => {
                setIs404(false);
                setCurrentTab('home');
              }}
              className="mt-2 py-2.5 px-6 rounded-2xl bg-[#C8621F] hover:bg-[#8C3B1E] text-xs font-semibold text-[#F3E6D0] transition-colors cursor-pointer"
            >
              Return to the Study
            </button>
          </div>
        ) : isDevEval ? (
          /* Dev Eval Benchmark Page */
          <DevEvalPage
            apiKey={apiKey}
            onBack={() => setIsDevEval(false)}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : currentTab === 'home' ? (
          /* Home Dashboard Tab */
          <HomeTab
            entries={entries}
            onNavigateToNotebook={(entryId) => {
              if (entryId) {
                handleSelectEntry(entryId);
              } else {
                handleCreateNewEntry();
              }
            }}
            onNavigateToJournals={() => setCurrentTab('journals')}
            onOpenSettings={() => setShowSettings(true)}
            onOpenWeeklyReflection={() => setShowWeeklyReflection(true)}
            isWeekend={isWeekend}
          />
        ) : currentTab === 'journals' ? (
          /* Journals List Tab */
          <JournalsTab
            entries={entries}
            onSelectEntry={handleSelectEntry}
            onNewEntry={handleCreateNewEntry}
            onDeleteEntry={handleDeleteEntry}
            onOpenWeeklyReflection={() => setShowWeeklyReflection(true)}
            isWeekend={isWeekend}
          />
        ) : currentTab === 'notebook' && activeEntry ? (
          /* Notebook Tab (Two-page spread) */
          <NotebookTab
            entry={activeEntry}
            onSaveEntry={handleSaveEntry}
            apiKey={apiKey}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : (
          <div className="text-center py-16 text-[#F3E6D0]/60 font-serif">
            Opening your pages...
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          apiKey={apiKey}
          onApiKeyChange={(newKey) => setApiKey(newKey)}
          onOpenPrivacy={() => {
            setShowSettings(false);
            setShowPrivacy(true);
          }}
          onOpenDevEval={() => {
            setShowSettings(false);
            setIsDevEval(true);
          }}
          onDataReset={handleDataReset}
        />
      )}

      {/* Weekly Reflection Modal */}
      {showWeeklyReflection && (
        <WeeklyReflectionModal
          onClose={() => setShowWeeklyReflection(false)}
          entries={entries}
          apiKey={apiKey}
          onOpenSettings={() => {
            setShowWeeklyReflection(false);
            setShowSettings(true);
          }}
        />
      )}

      {/* Plain-Language Privacy Modal */}
      {showPrivacy && (
        <PrivacyModal onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
}
