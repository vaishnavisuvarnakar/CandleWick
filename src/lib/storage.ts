/**
 * CandleWick - Encrypted Storage Layer via Dexie IndexedDB
 * Text and analysis are encrypted at rest with AES-GCM 256-bit
 */

import Dexie, { type Table } from 'dexie';
import type { JournalEntry, StoredEncryptedEntry } from '../types.ts';
import { decryptText, encryptText } from './crypto.ts';

class CandleWickDatabase extends Dexie {
  entries!: Table<StoredEncryptedEntry, string>;

  constructor() {
    super('CandleWickDB');
    this.version(1).stores({
      entries: 'id, createdAt, updatedAt',
    });
  }
}

export const db = new CandleWickDatabase();

// In-memory active CryptoKey for the current unlocked session
let activeCryptoKey: CryptoKey | null = null;

export function setActiveCryptoKey(key: CryptoKey | null): void {
  activeCryptoKey = key;
}

export function getActiveCryptoKey(): CryptoKey | null {
  return activeCryptoKey;
}

export function isStorageUnlocked(): boolean {
  return activeCryptoKey !== null;
}

/**
 * Saves or updates a journal entry (encrypts text and analysis)
 */
export async function saveEntry(entry: JournalEntry): Promise<void> {
  if (!activeCryptoKey) {
    throw new Error('Journal is locked. Passphrase required to save.');
  }

  const payloadToEncrypt = JSON.stringify({
    text: entry.text,
    analysis: entry.analysis || null,
  });

  const { ciphertext, iv } = await encryptText(payloadToEncrypt, activeCryptoKey);

  const storedRecord: StoredEncryptedEntry = {
    id: entry.id,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt || Date.now(),
    encryptedPayload: ciphertext,
    iv: iv,
  };

  await db.entries.put(storedRecord);
}

/**
 * Retrieves and decrypts a single entry by ID
 */
export async function getEntry(id: string): Promise<JournalEntry | undefined> {
  if (!activeCryptoKey) {
    throw new Error('Journal is locked. Passphrase required to read.');
  }

  const record = await db.entries.get(id);
  if (!record) return undefined;

  try {
    const decryptedPayload = await decryptText(
      record.encryptedPayload,
      record.iv,
      activeCryptoKey
    );
    const parsed = JSON.parse(decryptedPayload);

    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      text: parsed.text || '',
      analysis: parsed.analysis || undefined,
    };
  } catch (err) {
    console.error('Failed to decrypt entry:', err);
    throw new Error('Failed to decrypt entry with current key.');
  }
}

/**
 * Lists and decrypts all entries, ordered newest first
 */
export async function listEntries(): Promise<JournalEntry[]> {
  if (!activeCryptoKey) {
    return [];
  }

  const records = await db.entries.orderBy('createdAt').reverse().toArray();
  const entries: JournalEntry[] = [];

  for (const record of records) {
    try {
      const decrypted = await decryptText(
        record.encryptedPayload,
        record.iv,
        activeCryptoKey
      );
      const parsed = JSON.parse(decrypted);
      entries.push({
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        text: parsed.text || '',
        analysis: parsed.analysis || undefined,
      });
    } catch {
      // In case of a damaged record, continue with others
    }
  }

  return entries;
}

/**
 * Deletes an entry by ID
 */
export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

/**
 * Exports all entries as an encrypted JSON backup file
 */
export async function exportEncryptedBackup(): Promise<string> {
  const records = await db.entries.toArray();
  const salt = localStorage.getItem('candlewick_salt_v1') || '';
  const canary = localStorage.getItem('candlewick_canary_v1') || '';

  const backupData = {
    version: 1,
    app: 'CandleWick',
    exportedAt: new Date().toISOString(),
    salt,
    canary,
    records,
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * Imports an encrypted JSON backup
 */
export async function importEncryptedBackup(jsonString: string): Promise<{ count: number }> {
  const data = JSON.parse(jsonString);
  if (!data || !Array.isArray(data.records)) {
    throw new Error('Invalid backup file format.');
  }

  await db.entries.bulkPut(data.records);
  return { count: data.records.length };
}

/**
 * Exports all decrypted entries as clean, readable Markdown
 */
export async function exportPlainMarkdown(): Promise<string> {
  const entries = await listEntries();
  if (entries.length === 0) {
    return '# CandleWick Journal\n\nNo entries found.\n';
  }

  let md = `# CandleWick Journal Archive\n*Exported on ${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}*\n\n---\n\n`;

  for (const entry of entries) {
    const dateStr = new Date(entry.createdAt).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    md += `## ${dateStr}\n\n`;
    md += `${entry.text.trim()}\n\n`;

    if (entry.analysis) {
      md += `> **CandleWick Reflection (${entry.analysis.mode.toUpperCase()})**\n>\n`;
      md += `> ${entry.analysis.reflection.split('\n').join('\n> ')}\n\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

/**
 * Re-encrypts all stored entries when the user changes passphrase
 */
export async function reencryptAllEntries(newKey: CryptoKey): Promise<void> {
  if (!activeCryptoKey) {
    throw new Error('Storage must be unlocked to re-encrypt.');
  }

  const entries = await listEntries();
  const updatedRecords: StoredEncryptedEntry[] = [];

  for (const entry of entries) {
    const payloadToEncrypt = JSON.stringify({
      text: entry.text,
      analysis: entry.analysis || null,
    });

    const { ciphertext, iv } = await encryptText(payloadToEncrypt, newKey);
    updatedRecords.push({
      id: entry.id,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      encryptedPayload: ciphertext,
      iv: iv,
    });
  }

  await db.entries.clear();
  await db.entries.bulkPut(updatedRecords);
  activeCryptoKey = newKey;
}

/**
 * Irreversibly deletes all data from Dexie and local storage
 */
export async function deleteAllData(): Promise<void> {
  await db.entries.clear();
  activeCryptoKey = null;
  localStorage.removeItem('candlewick_salt_v1');
  localStorage.removeItem('candlewick_canary_v1');
  localStorage.removeItem('candlewick_enc_apikey_v1');
  localStorage.removeItem('candlewick_enc_apikey_iv_v1');
  sessionStorage.removeItem('candlewick_session_apikey');
}
