/**
 * CandleWick - Types & Data Models
 */

export type ReflectionMode = 'listen' | 'advise' | 'celebrate' | 'process' | 'concern';

export interface ReflectionAnalysis {
  mode: ReflectionMode;
  reason: string;
  reflection: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  analysis?: ReflectionAnalysis;
}

export interface StoredEncryptedEntry {
  id: string;
  createdAt: number;
  updatedAt: number;
  encryptedPayload: string; // Base64 ciphertext containing AES-GCM encrypted { text, analysis }
  iv: string; // Base64 12-byte IV
}

export type TabType = 'home' | 'journals' | 'notebook';

export interface EvalItem {
  id: number;
  text: string;
  expectedMode: ReflectionMode;
  notes: string;
}

export interface EvalResult {
  id: number;
  text: string;
  expectedMode: ReflectionMode;
  predictedMode: ReflectionMode;
  reason: string;
  latencyMs: number;
  isCorrect: boolean;
  error?: string;
}
