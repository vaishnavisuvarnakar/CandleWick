/**
 * CandleWick - AI Reflection Engine
 * Powered directly by Google Gemini API using the user's private key
 */

import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import type { ReflectionAnalysis, ReflectionMode } from '../types.ts';

// Recommended Gemini Flash model constant
export const GEMINI_FLASH_MODEL = 'gemini-3.8-flash';

// Zod schema for validating Step 1 classification
export const ClassificationSchema = z.object({
  mode: z.enum(['listen', 'advise', 'celebrate', 'process', 'concern']),
  reason: z.string().optional().default(''),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

/**
 * System instruction for Step 1: Mode Classifier
 */
const CLASSIFICATION_SYSTEM_INSTRUCTION = `You are an empathic, attentive reader classifying a personal journal entry into exactly one of five emotional modes.

The modes are:
- "listen": Venting, expressing feelings, wanting to be heard, not asking for answers, processing day-to-day heaviness without seeking advice.
- "advise": Explicitly or implicitly asking what to do, seeking options, struggling with a decision, or looking for practical direction.
- "celebrate": Sharing good news, milestones, gratitude, relief, joy, or an achievement.
- "process": Working through a complex thought, untangling conflicting emotions, seeking self-understanding, open to gentle reflection and guiding questions.
- "concern": Signs of serious distress, crisis, hopelessness, severe depression, or self-harm.

Default to "listen" if you are unsure.
Return valid JSON matching the schema with fields "mode" and "reason" (a brief 1-sentence explanation).`;

/**
 * Step 1: Classify the journal entry
 */
export async function classifyEntry(
  entryText: string,
  apiKey: string
): Promise<{ mode: ReflectionMode; reason: string }> {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: GEMINI_FLASH_MODEL,
      contents: `Please classify this journal entry:\n\n"""\n${entryText}\n"""`,
      config: {
        systemInstruction: CLASSIFICATION_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: {
              type: Type.STRING,
              description: 'The classified mode: listen, advise, celebrate, process, or concern.',
            },
            reason: {
              type: Type.STRING,
              description: 'Brief reason for the classification.',
            },
          },
          required: ['mode'],
        },
        temperature: 0.2,
      },
    });

    const rawText = response.text?.trim() || '{}';
    const parsedJson = JSON.parse(rawText);
    const validated = ClassificationSchema.safeParse(parsedJson);

    if (validated.success) {
      return {
        mode: validated.data.mode,
        reason: validated.data.reason || 'Gentle reflection based on your words.',
      };
    } else {
      console.warn('Classification schema mismatch, falling back to "listen":', validated.error);
      return {
        mode: 'listen',
        reason: 'Listening quietly to your thoughts.',
      };
    }
  } catch (error) {
    console.error('Classification error:', error);
    // On failure or schema issue, fall back to "listen"
    return {
      mode: 'listen',
      reason: 'Listening quietly to your thoughts.',
    };
  }
}

/**
 * System instruction mapping per mode for Step 2
 */
function getSystemInstructionForMode(mode: ReflectionMode): string {
  const modeInstructions: Record<ReflectionMode, string> = {
    listen: `You are CandleWick, a quiet presence in a candlelit study.
Tone: Warm, brief, gentle, attentive.
Instructions:
- Reflect back what the writer said in your own soothing words.
- Validate their feeling without exaggerating or dramatizing.
- NO advice whatsoever.
- NO silver linings ("At least...", "Look on the bright side...").
- Keep your response under 180 words.`,

    advise: `You are CandleWick, a quiet presence in a candlelit study.
Tone: Warm, grounded, respectful, non-prescriptive.
Instructions:
- Acknowledge and validate their situation first.
- Offer 2 to 3 gentle, concrete options or perspectives to explore.
- Frame them strictly as possibilities or suggestions, never as instructions or commands.
- Keep your response under 180 words.`,

    celebrate: `You are CandleWick, a quiet presence in a candlelit study.
Tone: Genuine, warm, specific cheer.
Instructions:
- Express genuine delight and acknowledgement about what they specifically described.
- Honor the effort or moment without hollow flattery.
- Keep your response under 180 words.`,

    process: `You are CandleWick, a quiet presence in a candlelit study.
Tone: Contemplative, patient, thoughtful.
Instructions:
- Gently reflect the themes you hear in their writing.
- Ask one or two open-ended questions that invite deeper reflection at their own pace.
- Do not steer them toward a forced conclusion.
- Keep your response under 180 words.`,

    concern: `IMPORTANT SAFETY OVERRIDE:
Drop the journaling persona completely.
Respond with calm, genuine care and dignity.
Do not diagnose, do not lecture, and do not make medical claims.
Encourage the writer to reach out to a trusted person in their life or local emergency services / a crisis helpline.
Do not fabricate or invent specific phone numbers. Simply suggest connecting with someone safe, a local support line, or professional help.
Keep the response brief, calm, and under 180 words.`,
  };

  const globalRules = `
GLOBAL RULES FOR ALL RESPONSES:
- Validate feelings but never endorse harmful beliefs or indulge in empty flattery.
- No diagnosing or clinical labels.
- No medical claims.
- Never claim or pretend to be a therapist or doctor.
- Maximum 180 words.
- Plain, warm, human language.`;

  return `${modeInstructions[mode]}\n\n${globalRules}`;
}

/**
 * Step 2: Generate the reflection based on the classified mode
 */
export async function generateReflection(
  entryText: string,
  mode: ReflectionMode,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getSystemInstructionForMode(mode);

  const response = await ai.models.generateContent({
    model: GEMINI_FLASH_MODEL,
    contents: `Here is the journal entry to reflect upon:\n\n"""\n${entryText}\n"""`,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error('No reflection received from the model.');
  }

  return text;
}

/**
 * Complete Two-Step Reflection Flow
 */
export async function reflectOnEntry(
  entryText: string,
  apiKey: string
): Promise<ReflectionAnalysis> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }

  if (!entryText || entryText.trim().length < 5) {
    throw new Error('ENTRY_TOO_SHORT');
  }

  // Step 1: Classify
  const classification = await classifyEntry(entryText, apiKey);

  // Step 2: Generate response
  const reflectionText = await generateReflection(entryText, classification.mode, apiKey);

  return {
    mode: classification.mode,
    reason: classification.reason,
    reflection: reflectionText,
    timestamp: Date.now(),
  };
}

/**
 * Weekly reflection for past 7 days entries
 */
export async function generateWeeklyReflection(
  entries: { text: string; createdAt: number }[],
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }

  if (entries.length < 2) {
    throw new Error('NOT_ENOUGH_ENTRIES');
  }

  const ai = new GoogleGenAI({ apiKey });

  const compiledEntries = entries
    .map((e, idx) => `[Entry ${idx + 1} - ${new Date(e.createdAt).toLocaleDateString()}]:\n${e.text}`)
    .join('\n\n---\n\n');

  const systemInstruction = `You are CandleWick, offering a weekly fireside reflection on the user's journal entries from the past 7 days.
Rules:
- Strictly under 220 words.
- Structure gently into three thoughts:
  1. Recurring themes or emotions observed across the week.
  2. One thing that seemed to help or bring peace / clarity.
  3. One gentle, open thought or question to carry into the coming week.
- Warm, quiet, supportive tone. No clinical terms, no toxic positivity, no diagnosing.`;

  const response = await ai.models.generateContent({
    model: GEMINI_FLASH_MODEL,
    contents: `Here are my entries from the past 7 days:\n\n${compiledEntries}`,
    config: {
      systemInstruction,
      temperature: 0.6,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error('Failed to generate weekly reflection.');
  }

  return text;
}

/**
 * Friendly error message mapper
 */
export function mapAiErrorToMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('api_key_missing')) {
      return 'Please enter your Google Gemini API key in Settings to receive gentle reflections.';
    }
    if (msg.includes('entry_too_short')) {
      return 'Please write at least a sentence before reflecting.';
    }
    if (msg.includes('not_enough_entries')) {
      return 'Write a little more this week before reflecting—at least 2 entries needed.';
    }
    if (msg.includes('api key not valid') || msg.includes('403') || msg.includes('unauthenticated')) {
      return 'Your Gemini API key appears invalid or expired. Please check your key in Settings.';
    }
    if (msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('quota')) {
      return 'You have reached the Gemini API rate limit. Take a breath and try again in a minute.';
    }
    if (msg.includes('failed to fetch') || msg.includes('network') || !navigator.onLine) {
      return 'Unable to reach the Gemini API. Please check your internet connection and try again.';
    }
  }
  return 'The candle flickered softly, but could not complete the reflection. Please try again.';
}
