/**
 * CandleWick - Client-Side Cryptography via Web Crypto API
 * PBKDF2 (100,000 iterations, SHA-256) + AES-GCM 256-bit encryption at rest
 */

const SALT_STORAGE_KEY = 'candlewick_salt_v1';
const CANARY_STORAGE_KEY = 'candlewick_canary_v1';
const CANARY_PLAINTEXT = 'CANDLEWICK_VERIFIED_KEY_CANARY';
const REMEMBERED_KEY_STORAGE = 'candlewick_enc_apikey_v1';
const REMEMBERED_KEY_IV = 'candlewick_enc_apikey_iv_v1';

// Convert Uint8Array to Base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Gets or creates the PBKDF2 salt for this browser profile
 */
export function getOrCreateSalt(): Uint8Array {
  const existing = localStorage.getItem(SALT_STORAGE_KEY);
  if (existing) {
    return base64ToBuffer(existing);
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_STORAGE_KEY, bufferToBase64(salt));
  return salt;
}

/**
 * Derives an AES-GCM CryptoKey from a user passphrase using PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = getOrCreateSalt();

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string with AES-GCM and returns { ciphertext, iv } in base64
 */
export async function encryptText(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const enc = new TextEncoder();
  const data = enc.encode(plaintext);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    data
  );

  return {
    ciphertext: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
  };
}

/**
 * Decrypts a base64 ciphertext with AES-GCM using base64 iv
 */
export async function decryptText(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToBuffer(ciphertextBase64);
  const iv = base64ToBuffer(ivBase64);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
    },
    key,
    ciphertext as unknown as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

/**
 * Checks if the user has already configured a passphrase
 */
export function isSecurityInitialized(): boolean {
  return localStorage.getItem(CANARY_STORAGE_KEY) !== null;
}

/**
 * Initializes security by setting up a canary encrypted with the derived key
 */
export async function initializeSecurity(passphrase: string): Promise<CryptoKey> {
  const key = await deriveKeyFromPassphrase(passphrase);
  const { ciphertext, iv } = await encryptText(CANARY_PLAINTEXT, key);
  localStorage.setItem(CANARY_STORAGE_KEY, JSON.stringify({ ciphertext, iv }));
  return key;
}

/**
 * Verifies a passphrase against the stored canary
 */
export async function verifyPassphrase(passphrase: string): Promise<{ valid: boolean; key?: CryptoKey }> {
  const storedCanary = localStorage.getItem(CANARY_STORAGE_KEY);
  if (!storedCanary) {
    return { valid: false };
  }

  try {
    const { ciphertext, iv } = JSON.parse(storedCanary);
    const key = await deriveKeyFromPassphrase(passphrase);
    const decrypted = await decryptText(ciphertext, iv, key);
    if (decrypted === CANARY_PLAINTEXT) {
      return { valid: true, key };
    }
  } catch {
    // Decryption failure indicates wrong passphrase
  }
  return { valid: false };
}

/**
 * Updates the passphrase and returns new CryptoKey
 */
export async function changePassphrase(newPassphrase: string): Promise<CryptoKey> {
  // Generate a fresh salt for security
  const freshSalt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_STORAGE_KEY, bufferToBase64(freshSalt));

  const newKey = await deriveKeyFromPassphrase(newPassphrase);
  const { ciphertext, iv } = await encryptText(CANARY_PLAINTEXT, newKey);
  localStorage.setItem(CANARY_STORAGE_KEY, JSON.stringify({ ciphertext, iv }));
  return newKey;
}

/**
 * Stores the user's Gemini API key encrypted on device
 */
export async function saveRememberedApiKey(apiKey: string, key: CryptoKey): Promise<void> {
  const { ciphertext, iv } = await encryptText(apiKey, key);
  localStorage.setItem(REMEMBERED_KEY_STORAGE, ciphertext);
  localStorage.setItem(REMEMBERED_KEY_IV, iv);
}

/**
 * Retrieves the stored Gemini API key if present and decrypts it
 */
export async function getRememberedApiKey(key: CryptoKey): Promise<string | null> {
  const ciphertext = localStorage.getItem(REMEMBERED_KEY_STORAGE);
  const iv = localStorage.getItem(REMEMBERED_KEY_IV);
  if (!ciphertext || !iv) return null;

  try {
    return await decryptText(ciphertext, iv, key);
  } catch {
    return null;
  }
}

/**
 * Clears remembered API key
 */
export function removeRememberedApiKey(): void {
  localStorage.removeItem(REMEMBERED_KEY_STORAGE);
  localStorage.removeItem(REMEMBERED_KEY_IV);
}

/**
 * Checks if a remembered API key is present in local storage
 */
export function hasRememberedApiKey(): boolean {
  return localStorage.getItem(REMEMBERED_KEY_STORAGE) !== null;
}
