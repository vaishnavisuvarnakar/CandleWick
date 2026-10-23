import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, Cpu, HeartHandshake } from 'lucide-react';
import { CandleLogo } from './CandleLogo.tsx';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F120C]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#3B2016] border border-[#8C3B1E]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F3E6D0] my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#F3E6D0]/60 hover:text-[#F3E6D0] hover:bg-[#1F120C]/40 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <CandleLogo size="sm" />
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#F3E6D0]">
            Privacy & Architecture Design
          </h2>
        </div>

        <div className="space-y-6 text-sm text-[#F3E6D0]/85 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          {/* Main Manifesto */}
          <div className="bg-[#1F120C]/60 border border-[#8C3B1E]/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-base">
              <ShieldCheck className="w-5 h-5 text-[#E8A33D]" />
              <span>Zero-Server, Client-Only Guarantee</span>
            </div>
            <p>
              CandleWick was engineered specifically as a static single-page application. There is <strong>no backend server</strong>, no remote database, no user tracking, no cookies, and no analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Local Storage & Encryption */}
            <div className="bg-[#1F120C]/40 border border-[#8C3B1E]/30 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
                <Lock className="w-4 h-4 text-[#E8A33D]" />
                <span>Client-Side AES-GCM 256-bit</span>
              </div>
              <p className="text-xs text-[#F3E6D0]/80">
                Your passphrase derives a strong cryptographic key using <strong>PBKDF2 with 100,000 iterations</strong> and a unique salt. Every single journal entry and reflection is encrypted at rest in your browser’s IndexedDB with a unique 12-byte IV.
              </p>
            </div>

            {/* What is sent to Gemini */}
            <div className="bg-[#1F120C]/40 border border-[#8C3B1E]/30 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
                <Cpu className="w-4 h-4 text-[#E8A33D]" />
                <span>Direct BYOK AI Calls</span>
              </div>
              <p className="text-xs text-[#F3E6D0]/80">
                When (and only when) you click <em>Reflect</em> or <em>Weekly reflection</em>, only that specific text is transmitted directly from your browser to Google’s Gemini API using your personal API key. We never see it, and no third-party intermediary exists.
              </p>
            </div>
          </div>

          {/* Backup & Portability */}
          <div className="bg-[#1F120C]/40 border border-[#8C3B1E]/30 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
              <HardDrive className="w-4 h-4 text-[#E8A33D]" />
              <span>Complete Data Sovereignty</span>
            </div>
            <p className="text-xs text-[#F3E6D0]/80">
              You can export your complete journal at any time as an encrypted JSON backup file or as clean, standard Markdown. You can also permanently purge all data and encryption salts with a single click.
            </p>
          </div>

          {/* Open-Source Libraries Used */}
          <div className="pt-2 border-t border-[#8C3B1E]/30">
            <h3 className="font-serif text-base font-medium text-[#F3E6D0] mb-3 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#E8A33D]" />
              <span>Open-Source Foundations</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-[#F3E6D0]/70 list-disc list-inside">
              <li><strong>Dexie.js:</strong> Minimalist, reactive IndexedDB wrapper for browser persistence.</li>
              <li><strong>Web Crypto API:</strong> Native W3C browser cryptography (SubtleCrypto: PBKDF2, AES-GCM).</li>
              <li><strong>@google/genai:</strong> Official Google Gen AI TypeScript SDK for Gemini Flash models.</li>
              <li><strong>Zod:</strong> TypeScript-first schema validation for reflection classification.</li>
              <li><strong>Recharts:</strong> Accessible, composable charting for cozy writing reflections.</li>
              <li><strong>Lucide React:</strong> Warm, unobtrusive iconography.</li>
              <li><strong>Tailwind CSS:</strong> Pure modern utility styling without external runtime bloat.</li>
            </ul>
          </div>
        </div>

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
