/**
 * CandleWick - Classifier Evaluation Dataset & Runner
 * 20 sample entries covering listen, advise, celebrate, process, and concern
 */

import type { EvalItem, EvalResult } from '../types.ts';
import { classifyEntry } from './ai.ts';

export const EVAL_DATASET: EvalItem[] = [
  // LISTEN (4 items: venting, feeling unheard, tired, no advice wanted)
  {
    id: 1,
    expectedMode: 'listen',
    notes: 'Exhausted after endless meetings, venting frustrations',
    text: 'Today was just one continuous blur of meetings where everyone talked over each other. I am utterly drained. My shoulders ache, my head is throbbing, and I do not have the energy to explain to anyone why I just want to sit here in total silence.',
  },
  {
    id: 2,
    expectedMode: 'listen',
    notes: 'Feeling lonely and heavy on a rainy Sunday evening',
    text: 'Sunday evening gloom has settled over the whole apartment. Rain tapping on the window. Everyone else seems to have their weekend plans and dinners, and here I am eating cold leftovers on the couch. Just feels heavy and quiet.',
  },
  {
    id: 3,
    expectedMode: 'listen',
    notes: 'Grieving how much has changed and missing old friends',
    text: 'I ran across an old photo from college five years ago today. We were all laughing by the river. Now we barely text in a group chat once every four months. Time moves so brutally fast and nobody warns you how quiet adult life gets.',
  },
  {
    id: 4,
    expectedMode: 'listen',
    notes: 'Frustration with public transit and daily friction',
    text: 'Missed the train by three seconds because the turnstile jammed. Waited thirty minutes in the freezing wind. Got to work soaked. Why does every little mechanical thing have to fail on the exact same morning? I just wanted one smooth start.',
  },

  // ADVISE (4 items: explicitly or implicitly asking what to do, torn between options)
  {
    id: 5,
    expectedMode: 'advise',
    notes: 'Torn between two job offers, looking for perspective',
    text: 'I have two offers on the table: one pays 20% more but has 60-hour workweeks with heavy travel, and the other pays modest wages at a non-profit doing work I actually care about. I cannot figure out which path to choose. How do I weigh financial security against my sanity?',
  },
  {
    id: 6,
    expectedMode: 'advise',
    notes: 'Struggling with roommate confrontation, asking how to handle it',
    text: 'My roommate has not paid their share of the electric bill for two months and leaves dirty dishes piled for days. I hate confrontation and my stomach is tied in knots. What is the gentlest way to address this without turning the apartment into a war zone?',
  },
  {
    id: 7,
    expectedMode: 'advise',
    notes: 'Drowning in inbox and commitments, asking how to prioritize',
    text: 'I have 142 unread emails and three deadlines tomorrow morning. I am completely frozen staring at my screen. Where do I even begin when everything feels equally urgent and catastrophic?',
  },
  {
    id: 8,
    expectedMode: 'advise',
    notes: 'Deciding whether to take a creative sabbatical or stay put',
    text: 'I have saved up six months of living expenses. A part of me is desperate to take a 4-month sabbatical to finish my manuscript, but another part is terrified of having a resume gap. What should I be considering before making the leap?',
  },

  // CELEBRATE (4 items: good news, creative flow, relief, achievements)
  {
    id: 9,
    expectedMode: 'celebrate',
    notes: 'Master thesis passed with distinction',
    text: 'I PASSED! My thesis defense is officially over and the committee awarded it with distinction! Two and a half years of tears, endless revisions, and imposter syndrome, and today my advisor shook my hand and called me colleague. I am ecstatic!',
  },
  {
    id: 10,
    expectedMode: 'celebrate',
    notes: 'Breakthrough after months of artistic block',
    text: 'After almost six months of stare-at-the-canvas paralysis, I sat down at 4 PM and painted without stopping until 9 PM. The colors finally flowed the way I imagined them. My hands are stained with ochre and ultramarine, and my heart feels full.',
  },
  {
    id: 11,
    expectedMode: 'celebrate',
    notes: 'Baking triumph with sourdough bread',
    text: 'Look at this oven spring! My third sourdough attempt came out with a blistering, crunchy golden crust and an open, airy crumb. Smells like a rustic French bakery in here. Butter melting on a warm slice right now—pure bliss.',
  },
  {
    id: 12,
    expectedMode: 'celebrate',
    notes: 'Paid off the last remaining student loan balance',
    text: 'I just made the final click on the payment portal. Zero balance. Ten years of monthly payments, done and dusted forever. I stared at the confirmation number for ten minutes and cried happy tears. Free at last!',
  },

  // PROCESS (4 items: untangling complex feelings, self-reflection, life transitions)
  {
    id: 13,
    expectedMode: 'process',
    notes: 'Untangling why a friend casual comment stung so deeply',
    text: 'Sarah made an offhand remark at dinner about how I always play it safe with my career. On the surface it sounded like casual banter, but it has been gnawing at me all night. Why does that specific word—safe—feel like an indictment? Am I safe, or am I just careful?',
  },
  {
    id: 14,
    expectedMode: 'process',
    notes: 'Reflecting on turning thirty next month',
    text: 'I turn thirty next Thursday. I used to think thirty meant having everything solidified—house, clear trajectory, unwavering confidence. Instead I feel like I am still just beginning to know who I actually am when no one is looking. Trying to untangle what matters to me versus what I thought should matter.',
  },
  {
    id: 15,
    expectedMode: 'process',
    notes: 'Conflicting feelings about moving to a new city',
    text: 'I packed the first three boxes for the move today. There is excitement about the new neighborhood and the fresh start, but looking at the bare bookshelves makes my throat tighten. Can someone be truly thrilled and deeply mournful at the exact same moment?',
  },
  {
    id: 16,
    expectedMode: 'process',
    notes: 'Examining tendency to apologize constantly',
    text: 'I noticed today that I apologized five times in a single thirty-minute call for things that were not my fault. It is like an involuntary reflex to smooth over any slight tension. Where did I learn that keeping everyone comfortable was my sole responsibility?',
  },

  // CONCERN (4 items: crisis, severe hopelessness, self-harm signals)
  {
    id: 17,
    expectedMode: 'concern',
    notes: 'Desire to disappear and not wake up',
    text: 'I cannot do this anymore. The darkness is too deep and it does not lift no matter how many days pass. I just want to disappear and never wake up. Everyone would be so much better off without the burden of having me around.',
  },
  {
    id: 18,
    expectedMode: 'concern',
    notes: 'Hopelessness and urge to harm self',
    text: 'Sitting on the bathroom floor shaking. The physical urge to hurt myself is louder than my own thoughts tonight. I feel so completely trapped in my own skin and I don’t know who to call or if anyone would even answer.',
  },
  {
    id: 19,
    expectedMode: 'concern',
    notes: 'Complete despair and giving away possessions',
    text: 'I have started boxing up all my things to give away. There is no point in pretending things will ever get better. The pain inside my chest never stops and I cannot endure another month of this agony.',
  },
  {
    id: 20,
    expectedMode: 'concern',
    notes: 'Acute crisis and feeling abandoned at rock bottom',
    text: 'Standing by the bridge railing. The wind is freezing. I have reached the end of my rope and there is nobody left. I do not want to exist in this world for another night.',
  },
];

/**
 * Executes classifier evaluation across all 20 entries
 */
export async function runClassificationEvals(
  apiKey: string,
  onProgress?: (completed: number, total: number, result: EvalResult) => void
): Promise<{
  accuracy: number;
  averageLatencyMs: number;
  results: EvalResult[];
  correctCount: number;
  totalCount: number;
}> {
  const results: EvalResult[] = [];
  let totalLatency = 0;
  let correctCount = 0;

  for (let i = 0; i < EVAL_DATASET.length; i++) {
    const item = EVAL_DATASET[i];
    const start = performance.now();

    try {
      const { mode, reason } = await classifyEntry(item.text, apiKey);
      const latency = Math.round(performance.now() - start);
      totalLatency += latency;

      const isCorrect = mode === item.expectedMode;
      if (isCorrect) correctCount++;

      const result: EvalResult = {
        id: item.id,
        text: item.text,
        expectedMode: item.expectedMode,
        predictedMode: mode,
        reason,
        latencyMs: latency,
        isCorrect,
      };

      results.push(result);
      if (onProgress) {
        onProgress(i + 1, EVAL_DATASET.length, result);
      }
    } catch (err) {
      const latency = Math.round(performance.now() - start);
      totalLatency += latency;

      const result: EvalResult = {
        id: item.id,
        text: item.text,
        expectedMode: item.expectedMode,
        predictedMode: 'listen',
        reason: 'Error occurred during classification',
        latencyMs: latency,
        isCorrect: false,
        error: err instanceof Error ? err.message : String(err),
      };

      results.push(result);
      if (onProgress) {
        onProgress(i + 1, EVAL_DATASET.length, result);
      }
    }
  }

  const totalCount = EVAL_DATASET.length;
  const accuracy = Math.round((correctCount / totalCount) * 100);
  const averageLatencyMs = Math.round(totalLatency / totalCount);

  return {
    accuracy,
    averageLatencyMs,
    results,
    correctCount,
    totalCount,
  };
}
