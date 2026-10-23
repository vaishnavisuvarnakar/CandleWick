import React, { useState } from 'react';
import { CandleLogo } from './CandleLogo.tsx';
import { Lock, Key, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { initializeSecurity, saveRememberedApiKey } from '../lib/crypto.ts';
import { setActiveCryptoKey } from '../lib/storage.ts';

interface SetupModalProps {
  onComplete: (apiKey: string | null) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ onComplete }) => {
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passphrase || passphrase.length < 6) {
      setError('Please choose a passphrase with at least 6 characters.');
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Initialize PBKDF2 & AES-GCM security
      const key = await initializeSecurity(passphrase);
      setActiveCryptoKey(key);

      const cleanKey = apiKey.trim();

      // 2. Handle optional API key
      if (cleanKey) {
        sessionStorage.setItem('candlewick_session_apikey', cleanKey);
        if (rememberKey) {
          await saveRememberedApiKey(cleanKey, key);
        }
      }

      onComplete(cleanKey || null);
    } catch (err) {
      console.error('Setup failed:', err);
      setError('Failed to initialize local encryption. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F120C]/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#3B2016] border border-[#8C3B1E]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F3E6D0] my-8">
        {/* Soft amber glow accent */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-6">
          <CandleLogo size="lg" className="mb-3" />
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#F3E6D0] tracking-tight">
            Welcome to Your Sanctuary
          </h2>
          <p className="text-sm text-[#F3E6D0]/80 mt-2 max-w-md leading-relaxed">
            CandleWick runs entirely in your browser with zero servers. Your thoughts are encrypted at rest on this device and remain strictly yours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Passphrase */}
          <div className="bg-[#1F120C]/60 border border-[#8C3B1E]/40 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
              <Lock className="w-4 h-4" />
              <span>1. Choose your private passphrase</span>
            </div>
            <p className="text-xs text-[#F3E6D0]/70 leading-normal">
              Derives an AES-GCM 256-bit key to encrypt every entry in your browser’s IndexedDB.
            </p>

            <div className="space-y-2">
              <input
                type="password"
                required
                placeholder="Passphrase (at least 6 characters)"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2.5 text-sm text-[#F3E6D0] placeholder-[#F3E6D0]/40 focus:outline-none focus:border-[#E8A33D] transition-colors"
              />
              <input
                type="password"
                required
                placeholder="Confirm passphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2.5 text-sm text-[#F3E6D0] placeholder-[#F3E6D0]/40 focus:outline-none focus:border-[#E8A33D] transition-colors"
              />
            </div>

            {/* Warning regarding no recovery */}
            <div className="flex items-start gap-2 pt-1 text-amber-200/90 text-xs bg-[#8C3B1E]/20 p-2.5 rounded-lg border border-[#8C3B1E]/40">
              <ShieldAlert className="w-4 h-4 text-[#E8A33D] shrink-0 mt-0.5" />
              <span>
                <strong>No passphrase recovery:</strong> Because encryption happens client-side without any server, there is no reset link or master key. If lost, your entries cannot be recovered.
              </span>
            </div>
          </div>

          {/* Section: Gemini API Key (BYOK) */}
          <div className="bg-[#1F120C]/60 border border-[#8C3B1E]/40 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
                <Key className="w-4 h-4" />
                <span>2. Gemini API Key (Optional now)</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#E8A33D] hover:underline"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-[#F3E6D0]/70 leading-normal">
              Used only when you ask for a reflection. Kept in memory by default. Never sent anywhere except Google’s Gemini API.
            </p>

            <input
              type="password"
              placeholder="Paste your Gemini API key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2.5 text-sm text-[#F3E6D0] placeholder-[#F3E6D0]/40 focus:outline-none focus:border-[#E8A33D] transition-colors"
            />

            <label className="flex items-center gap-2.5 text-xs text-[#F3E6D0]/80 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={(e) => setRememberKey(e.target.checked)}
                className="accent-[#C8621F] w-4 h-4 rounded cursor-pointer"
              />
              <span>Remember my API key on this device (stored encrypted with your passphrase)</span>
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/50 border border-red-800/60 rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] font-medium text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-[#C8621F]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#E8A33D]" />
            <span>{isSubmitting ? 'Securing Journal...' : 'Light the Candle & Begin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
