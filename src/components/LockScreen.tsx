import React, { useState } from 'react';
import { CandleLogo } from './CandleLogo.tsx';
import { KeyRound, ShieldAlert, Unlock } from 'lucide-react';
import { getRememberedApiKey, verifyPassphrase } from '../lib/crypto.ts';
import { setActiveCryptoKey } from '../lib/storage.ts';

interface LockScreenProps {
  onUnlock: (apiKey: string | null) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    setError(null);
    setIsVerifying(true);

    try {
      const { valid, key } = await verifyPassphrase(passphrase);
      if (valid && key) {
        setActiveCryptoKey(key);

        // Check if there was a remembered key
        let resolvedApiKey = sessionStorage.getItem('candlewick_session_apikey');
        if (!resolvedApiKey) {
          const storedKey = await getRememberedApiKey(key);
          if (storedKey) {
            resolvedApiKey = storedKey;
            sessionStorage.setItem('candlewick_session_apikey', storedKey);
          }
        }

        onUnlock(resolvedApiKey || null);
      } else {
        setError('Incorrect passphrase. Please try again.');
      }
    } catch (err) {
      console.error('Unlock error:', err);
      setError('An error occurred while decrypting. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F120C] text-[#F3E6D0]">
      {/* Background warm amber glow */}
      <div className="absolute w-96 h-96 bg-[#E8A33D]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-7">
          <CandleLogo size="lg" className="mb-4" />
          <h1 className="font-serif text-2xl font-medium tracking-tight text-[#F3E6D0]">
            The study is quiet
          </h1>
          <p className="text-sm text-[#F3E6D0]/70 mt-1.5">
            Enter your passphrase to unlock your encrypted journal.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                autoFocus
                required
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-[#1F120C]/80 border border-[#8C3B1E]/70 rounded-2xl px-4 py-3 text-base text-[#F3E6D0] placeholder-[#F3E6D0]/40 focus:outline-none focus:border-[#E8A33D] transition-all pr-11"
              />
              <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E8A33D]/60 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-200 bg-red-950/60 border border-red-800/60 rounded-xl p-2.5 text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !passphrase}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] font-medium text-sm transition-all duration-200 shadow-md hover:shadow-[#C8621F]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Unlock className="w-4 h-4 text-[#E8A33D]" />
            <span>{isVerifying ? 'Unlocking...' : 'Unlock Journal'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#8C3B1E]/30 text-center">
          <p className="text-xs text-[#F3E6D0]/50 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E8A33D]/70 shrink-0" />
            <span>Client-side AES-GCM encrypted. No passphrase recovery.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
