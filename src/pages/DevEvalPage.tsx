import React, { useState } from 'react';
import { ArrowLeft, Play, RefreshCw, CheckCircle2, XCircle, FlaskConical, ExternalLink } from 'lucide-react';
import { EVAL_DATASET, runClassificationEvals } from '../lib/evals.ts';
import type { EvalResult } from '../types.ts';
import { CandleLogo } from '../components/CandleLogo.tsx';

interface DevEvalPageProps {
  apiKey: string | null;
  onBack: () => void;
  onOpenSettings: () => void;
}

export const DevEvalPage: React.FC<DevEvalPageProps> = ({
  apiKey,
  onBack,
  onOpenSettings,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<EvalResult[] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [avgLatency, setAvgLatency] = useState<number | null>(null);

  const handleStartEval = async () => {
    if (!apiKey) return;

    setIsRunning(true);
    setResults([]);
    setProgress({ current: 0, total: EVAL_DATASET.length });

    try {
      const summary = await runClassificationEvals(
        apiKey,
        (completed, total, latestResult) => {
          setProgress({ current: completed, total });
          setResults((prev) => (prev ? [...prev, latestResult] : [latestResult]));
        }
      );

      setAccuracy(summary.accuracy);
      setAvgLatency(summary.averageLatencyMs);
      setResults(summary.results);
    } catch (err) {
      console.error('Eval failed:', err);
      alert('Eval failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-[#F3E6D0]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3B2016] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#3B2016]/80 hover:bg-[#8C3B1E]/60 text-[#F3E6D0] transition-colors cursor-pointer"
            aria-label="Back to App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#E8A33D]" />
              <h1 className="font-serif text-2xl font-medium tracking-tight">
                Classifier Benchmark & Eval (/dev/eval)
              </h1>
            </div>
            <p className="text-xs text-[#F3E6D0]/70 mt-0.5">
              Testing Gemini Flash reflection mode classification across 20 labeled benchmark entries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!apiKey ? (
            <button
              onClick={onOpenSettings}
              className="py-2 px-4 rounded-xl bg-[#C8621F] text-xs font-medium text-[#F3E6D0] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Set API Key in Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleStartEval}
              disabled={isRunning}
              className="py-2 px-5 rounded-xl bg-[#C8621F] hover:bg-[#8C3B1E] disabled:opacity-50 text-xs sm:text-sm font-medium text-[#F3E6D0] flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E8A33D]" />
                  <span>Evaluating ({progress?.current} / {progress?.total})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#E8A33D]" />
                  <span>{results ? 'Re-run 20 Evals' : 'Run 20 Evals'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Summary Scorecard if completed or in progress */}
      {(accuracy !== null || isRunning) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#3B2016]/60 border border-[#8C3B1E]/40 rounded-2xl p-5 text-center">
            <span className="text-xs text-[#F3E6D0]/60 uppercase tracking-wider block">Accuracy</span>
            <span className="font-serif text-3xl sm:text-4xl font-medium text-[#E8A33D] mt-1 block">
              {accuracy !== null ? `${accuracy}%` : 'Calculating...'}
            </span>
          </div>

          <div className="bg-[#3B2016]/60 border border-[#8C3B1E]/40 rounded-2xl p-5 text-center">
            <span className="text-xs text-[#F3E6D0]/60 uppercase tracking-wider block">Average Latency</span>
            <span className="font-serif text-3xl sm:text-4xl font-medium text-[#F3E6D0] mt-1 block">
              {avgLatency !== null ? `${avgLatency} ms` : 'Measuring...'}
            </span>
          </div>

          <div className="bg-[#3B2016]/60 border border-[#8C3B1E]/40 rounded-2xl p-5 text-center">
            <span className="text-xs text-[#F3E6D0]/60 uppercase tracking-wider block">Evaluated Items</span>
            <span className="font-serif text-3xl sm:text-4xl font-medium text-[#F3E6D0] mt-1 block">
              {results?.length || 0} / {EVAL_DATASET.length}
            </span>
          </div>
        </div>
      )}

      {/* Benchmark Entries Table */}
      <div className="bg-[#3B2016]/40 border border-[#8C3B1E]/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#8C3B1E]/30 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#F3E6D0]">
            Benchmark Dataset (20 items across 5 modes)
          </h2>
          <span className="text-xs text-[#F3E6D0]/60">
            Modes: listen (4), advise (4), celebrate (4), process (4), concern (4)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F120C]/80 border-b border-[#8C3B1E]/40 text-[#F3E6D0]/70">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 w-28">Expected</th>
                <th className="p-3 w-28">Predicted</th>
                <th className="p-3">Journal Excerpt</th>
                <th className="p-3 w-24 text-right">Latency</th>
                <th className="p-3 w-16 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8C3B1E]/20">
              {EVAL_DATASET.map((item) => {
                const res = results?.find((r) => r.id === item.id);

                return (
                  <tr key={item.id} className="hover:bg-[#3B2016]/60 transition-colors">
                    <td className="p-3 text-center font-mono text-[#F3E6D0]/60">{item.id}</td>
                    <td className="p-3">
                      <span className="uppercase font-semibold text-[10px] px-2 py-0.5 rounded-full bg-[#1F120C] text-[#E8A33D] border border-[#8C3B1E]/60">
                        {item.expectedMode}
                      </span>
                    </td>
                    <td className="p-3">
                      {res ? (
                        <span
                          className={`uppercase font-semibold text-[10px] px-2 py-0.5 rounded-full border ${
                            res.isCorrect
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                              : 'bg-red-950/60 text-red-300 border-red-700/60'
                          }`}
                        >
                          {res.predictedMode}
                        </span>
                      ) : (
                        <span className="text-[#F3E6D0]/40 font-mono">—</span>
                      )}
                    </td>
                    <td className="p-3 max-w-md">
                      <p className="text-[#F3E6D0]/90 line-clamp-2 leading-relaxed">
                        {item.text}
                      </p>
                      {res?.reason && (
                        <p className="text-[10px] text-[#E8A33D]/70 mt-1 italic">
                          Model reason: {res.reason}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-[#F3E6D0]/70">
                      {res ? `${res.latencyMs} ms` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      {res ? (
                        res.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-[#F3E6D0]/30 font-mono">pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
