import React, { useState } from 'react';
import {
  X,
  Key,
  Lock,
  Download,
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
} from 'lucide-react';
import {
  changePassphrase,
  getRememberedApiKey,
  hasRememberedApiKey,
  removeRememberedApiKey,
  saveRememberedApiKey,
  verifyPassphrase,
} from '../lib/crypto.ts';
import {
  deleteAllData,
  exportEncryptedBackup,
  exportPlainMarkdown,
  getActiveCryptoKey,
  importEncryptedBackup,
  reencryptAllEntries,
} from '../lib/storage.ts';

interface SettingsModalProps {
  onClose: () => void;
  apiKey: string | null;
  onApiKeyChange: (newKey: string | null) => void;
  onOpenPrivacy: () => void;
  onOpenDevEval: () => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  apiKey,
  onApiKeyChange,
  onOpenPrivacy,
  onOpenDevEval,
  onDataReset,
}) => {
  // Tabs within settings
  const [activeSection, setActiveSection] = useState<'general' | 'passphrase' | 'backup' | 'danger'>('general');

  // API Key state
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [rememberKey, setRememberKey] = useState(hasRememberedApiKey());
  const [apiKeySuccess, setApiKeySuccess] = useState<string | null>(null);

  // Passphrase state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Export / Import state
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Delete all data state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // API Key handlers
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputKey.trim();
    if (!clean) {
      handleRemoveApiKey();
      return;
    }

    sessionStorage.setItem('candlewick_session_apikey', clean);
    const cryptoKey = getActiveCryptoKey();

    if (rememberKey && cryptoKey) {
      await saveRememberedApiKey(clean, cryptoKey);
    } else {
      removeRememberedApiKey();
    }

    onApiKeyChange(clean);
    setApiKeySuccess('API key updated securely in memory.');
    setTimeout(() => setApiKeySuccess(null), 3000);
  };

  const handleRemoveApiKey = () => {
    sessionStorage.removeItem('candlewick_session_apikey');
    removeRememberedApiKey();
    setInputKey('');
    setRememberKey(false);
    onApiKeyChange(null);
    setApiKeySuccess('API key removed from this session.');
    setTimeout(() => setApiKeySuccess(null), 3000);
  };

  // Passphrase change handler
  const handleChangePassphrase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPass.length < 6) {
      setPassError('New passphrase must be at least 6 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New passphrases do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      // 1. Verify current passphrase
      const { valid } = await verifyPassphrase(currentPass);
      if (!valid) {
        setPassError('Current passphrase is incorrect.');
        setIsChangingPass(false);
        return;
      }

      // 2. Derive new key and re-encrypt all entries
      const newKey = await changePassphrase(newPass);
      await reencryptAllEntries(newKey);

      // 3. Re-encrypt remembered API key if active
      if (apiKey && hasRememberedApiKey()) {
        await saveRememberedApiKey(apiKey, newKey);
      }

      setPassSuccess('Passphrase successfully changed and entries re-encrypted.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      console.error('Failed to change passphrase:', err);
      setPassError('An error occurred during re-encryption. Please try again.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Export handlers
  const handleExportBackup = async () => {
    try {
      const backupJson = await exportEncryptedBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `candlewick-encrypted-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleExportMarkdown = async () => {
    try {
      const md = await exportPlainMarkdown();
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `candlewick-journal-${date}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export Markdown: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importEncryptedBackup(text);
      setImportStatus(`Successfully restored ${res.count} encrypted records!`);
      setTimeout(() => setImportStatus(null), 4000);
    } catch (err) {
      setImportStatus('Failed to import: ' + (err instanceof Error ? err.message : 'Invalid backup'));
    }
  };

  // Delete all data handler
  const handleDeleteAllData = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAllData();
      onDataReset();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete all data.');
      setIsDeleting(false);
    }
  };

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

        <h2 className="font-serif text-2xl font-medium text-[#F3E6D0] mb-5 tracking-tight">
          Settings & Sanctuary Controls
        </h2>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#8C3B1E]/40 pb-3 mb-6 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveSection('general')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'general'
                ? 'bg-[#C8621F] text-[#F3E6D0] font-medium'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0]'
            }`}
          >
            Gemini API Key
          </button>
          <button
            onClick={() => setActiveSection('passphrase')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'passphrase'
                ? 'bg-[#C8621F] text-[#F3E6D0] font-medium'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0]'
            }`}
          >
            Change Passphrase
          </button>
          <button
            onClick={() => setActiveSection('backup')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'backup'
                ? 'bg-[#C8621F] text-[#F3E6D0] font-medium'
                : 'text-[#F3E6D0]/70 hover:text-[#F3E6D0]'
            }`}
          >
            Backup & Export
          </button>
          <button
            onClick={() => setActiveSection('danger')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'danger'
                ? 'bg-red-900/60 text-red-200 font-medium'
                : 'text-red-300/70 hover:text-red-200'
            }`}
          >
            Delete All Data
          </button>
        </div>

        {/* SECTION: GENERAL / API KEY */}
        {activeSection === 'general' && (
          <form onSubmit={handleSaveApiKey} className="space-y-4">
            <div className="bg-[#1F120C]/50 border border-[#8C3B1E]/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
                  <Key className="w-4 h-4" />
                  <span>Google Gemini API Key (BYOK)</span>
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
                CandleWick never shares or stores your key on a server. It connects straight from your browser to Google’s API using the official SDK.
              </p>

              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2.5 text-sm text-[#F3E6D0] placeholder-[#F3E6D0]/40 focus:outline-none focus:border-[#E8A33D]"
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

              {apiKeySuccess && (
                <div className="flex items-center gap-2 text-xs text-amber-200 bg-[#8C3B1E]/30 p-2.5 rounded-lg border border-[#8C3B1E]/40">
                  <CheckCircle2 className="w-4 h-4 text-[#E8A33D]" />
                  <span>{apiKeySuccess}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemoveApiKey}
                  className="text-xs text-red-300/80 hover:text-red-200 underline cursor-pointer"
                >
                  Remove Key from Session
                </button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] text-sm font-medium transition-colors cursor-pointer"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SECTION: PASSPHRASE */}
        {activeSection === 'passphrase' && (
          <form onSubmit={handleChangePassphrase} className="space-y-4">
            <div className="bg-[#1F120C]/50 border border-[#8C3B1E]/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-[#E8A33D] font-medium text-sm">
                <Lock className="w-4 h-4" />
                <span>Re-encrypt Journal with New Passphrase</span>
              </div>
              <p className="text-xs text-[#F3E6D0]/70 leading-normal">
                All existing journal entries in IndexedDB will be decrypted with your current key and re-encrypted with your new key.
              </p>

              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="text-xs text-[#F3E6D0]/60 block mb-1">Current Passphrase</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2 text-sm text-[#F3E6D0] focus:outline-none focus:border-[#E8A33D]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#F3E6D0]/60 block mb-1">New Passphrase (min 6 characters)</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2 text-sm text-[#F3E6D0] focus:outline-none focus:border-[#E8A33D]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#F3E6D0]/60 block mb-1">Confirm New Passphrase</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-[#3B2016]/90 border border-[#8C3B1E]/60 rounded-xl px-3.5 py-2 text-sm text-[#F3E6D0] focus:outline-none focus:border-[#E8A33D]"
                  />
                </div>
              </div>

              {passError && (
                <div className="text-xs text-red-200 bg-red-950/60 border border-red-800/60 rounded-lg p-2.5">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="text-xs text-amber-200 bg-[#8C3B1E]/30 border border-[#8C3B1E]/50 rounded-lg p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8A33D]" />
                  <span>{passSuccess}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChangingPass}
                className="py-2.5 px-5 rounded-xl bg-[#C8621F] hover:bg-[#8C3B1E] text-[#F3E6D0] text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isChangingPass ? 'Re-encrypting...' : 'Update Passphrase'}
              </button>
            </div>
          </form>
        )}

        {/* SECTION: BACKUP & EXPORT */}
        {activeSection === 'backup' && (
          <div className="space-y-4">
            <div className="bg-[#1F120C]/50 border border-[#8C3B1E]/40 rounded-2xl p-4.5 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#E8A33D] flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Download Encrypted Backup File</span>
                </h4>
                <p className="text-xs text-[#F3E6D0]/70 mt-1 leading-normal">
                  Creates an encrypted JSON snapshot containing all your journal records. Can only be opened with your passphrase.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="mt-3 py-2 px-4 rounded-xl bg-[#8C3B1E] hover:bg-[#C8621F] text-[#F3E6D0] text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Encrypted Backup (.json)</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#8C3B1E]/30">
                <h4 className="text-sm font-medium text-[#E8A33D] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Download as Plain Markdown</span>
                </h4>
                <p className="text-xs text-[#F3E6D0]/70 mt-1 leading-normal">
                  Exports your complete journal into a single readable Markdown document with dates and reflections.
                </p>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="mt-3 py-2 px-4 rounded-xl bg-[#8C3B1E] hover:bg-[#C8621F] text-[#F3E6D0] text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export as Markdown (.md)</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#8C3B1E]/30">
                <h4 className="text-sm font-medium text-[#E8A33D] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Restore from Encrypted Backup</span>
                </h4>
                <p className="text-xs text-[#F3E6D0]/70 mt-1 leading-normal">
                  Restore previously exported encrypted JSON records into this journal.
                </p>
                <label className="mt-3 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#3B2016] border border-[#8C3B1E]/70 hover:border-[#E8A33D] text-[#F3E6D0] text-xs font-medium transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#E8A33D]" />
                  <span>Select Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
                {importStatus && (
                  <p className="text-xs text-amber-200 mt-2">{importStatus}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: DANGER ZONE */}
        {activeSection === 'danger' && (
          <div className="space-y-4">
            <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-red-300 font-medium text-sm">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Delete All Data</span>
              </div>
              <p className="text-xs text-red-200/80 leading-relaxed">
                This action is <strong>irreversible</strong>. It permanently wipes all encrypted journal entries from your browser IndexedDB, removes cryptographic salts and canaries, and clears all session keys.
              </p>

              <div className="pt-2">
                <label className="text-xs text-[#F3E6D0]/70 block mb-1">
                  Type <span className="font-mono text-red-300 font-bold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-[#1F120C] border border-red-800/60 rounded-xl px-3.5 py-2 text-sm text-red-200 placeholder-red-900/50 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAllData}
                  className="py-2.5 px-5 rounded-xl bg-red-800 hover:bg-red-700 disabled:opacity-40 text-red-100 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Permanently Wipe All Data'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer links: Privacy & Dev Eval */}
        <div className="mt-7 pt-4 border-t border-[#8C3B1E]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F3E6D0]/70">
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 text-[#E8A33D] hover:underline cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Architecture</span>
          </button>

          <button
            onClick={onOpenDevEval}
            className="flex items-center gap-1.5 text-[#F3E6D0]/50 hover:text-[#E8A33D] transition-colors cursor-pointer"
            title="Evaluate classifier on 20 benchmark entries"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Dev / Benchmark Evaluator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
