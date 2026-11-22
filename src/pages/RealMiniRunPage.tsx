import React, { useState } from 'react';
import realMiniRunData from '../data/realMiniRun.json';
import { MeasuredRunClip, MeasuredRunEntry } from '../types';
import { 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Cpu, 
  FileCode, 
  ExternalLink,
  ShieldAlert,
  Mic,
  Volume2
} from 'lucide-react';

export const RealMiniRunPage: React.FC = () => {
  const data = realMiniRunData;
  const clips = data.testClips as unknown as MeasuredRunClip[];
  const runs = data.measuredRuns as unknown as MeasuredRunEntry[];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedClip, setSelectedClip] = useState<MeasuredRunClip>(clips[0]);

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Non-negotiable Real Run Emerald Badge */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{data.badge}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empirical Mini-Benchmark: Measured Local Results
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-4xl mt-2 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Execution Environment & Reproducibility Card */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base text-white">Local Execution Environment</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            Hardware Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Compute Device</span>
            <span className="font-bold text-slate-200">{data.executionEnvironment.hardware}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Host OS / Kernel</span>
            <span className="font-bold text-slate-200">{data.executionEnvironment.os}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">CUDA / Python</span>
            <span className="font-bold text-slate-200">{data.executionEnvironment.cudaVersion} • {data.executionEnvironment.pythonVersion}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Scoring Toolkits</span>
            <span className="font-bold text-emerald-400">{data.executionEnvironment.scoringTools}</span>
          </div>
        </div>
      </div>

      {/* Public Reference Clips Selector */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-500" />
            <span>Public Evaluation Audio Clips (AMI & VoxConverse)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selected standardized open corpora snippets used for reproducible local verification:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clips.map(clip => {
            const isSelected = selectedClip.clipId === clip.clipId;
            return (
              <div
                key={clip.clipId}
                onClick={() => setSelectedClip(clip)}
                className={`cursor-pointer rounded-xl border p-4 transition-all text-xs space-y-2 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{clip.corpus}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {clip.duration}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {clip.fileName} ({clip.sampleRate})
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                  {clip.acousticProfile}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono text-[10px]">
                  <span>Speakers: <strong>{clip.groundTruthSpeakers}</strong></span>
                  <span className="text-rose-600 dark:text-rose-400">Overlap: {clip.overlapRatio}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Clip Reference RTTM Preview & Interactive Audio Player */}
      <div className="space-y-3">
        {/* Audio Player */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Audio Playback:</span>
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedClip.fileName}</code>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                16kHz mono audio excerpt. Listen to verify simultaneous speaker overlapping and rapid turn-taking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <audio
              key={selectedClip.fileName}
              controls
              className="h-9 w-full sm:w-72 accent-emerald-600"
              src={`/audio/${selectedClip.fileName}`}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        {/* Reference RTTM */}
        <div className="bg-slate-950 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>NIST Ground-Truth RTTM Reference ({selectedClip.fileName})</span>
            </span>
            <span className="text-emerald-400 text-[11px]">Validated Standard Format</span>
          </div>
          <pre className="bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
            {selectedClip.referenceRttmSnippet}
          </pre>
        </div>
      </div>

      {/* Measured Runs Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Measured Local & API Results Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zero hallucinated versions. Slot 4 is marked ready for additional custom local evaluations.
          </p>
        </div>

        <div className="space-y-4">
          {runs.map((run, idx) => {
            const isCustomSlot = run.localRunSlot.includes('FILL IN');

            return (
              <div
                key={idx}
                className={`rounded-2xl border p-6 transition-all ${
                  isCustomSlot
                    ? 'border-dashed border-amber-300 dark:border-amber-700/80 bg-amber-50/40 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {run.systemName}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          isCustomSlot
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {run.localRunSlot}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Provider: <strong className="text-slate-800 dark:text-slate-200">{run.provider}</strong></span>
                      <span>•</span>
                      <span>Type: <strong className="text-slate-800 dark:text-slate-200">{run.systemType}</strong></span>
                      <span>•</span>
                      <span>Version: <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{run.exactVersion}</code></span>
                    </div>
                  </div>

                  {/* Measured Score Pills */}
                  {!isCustomSlot ? (
                    <div className="flex items-center gap-3 font-mono">
                      <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 min-w-[90px]">
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Strict DER (0.0s)</div>
                        <div className="text-xl font-extrabold text-emerald-900 dark:text-emerald-300">{run.measuredDerStrict00s}%</div>
                      </div>

                      <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[90px]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Legacy (0.25s)</div>
                        <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{run.measuredDerLegacy025s}%</div>
                      </div>

                      <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[80px]">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">JER %</div>
                        <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{run.measuredJer}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold">
                      [READY FOR YOUR NEXT LOCAL RUN]
                    </div>
                  )}
                </div>

                {/* CLI Command & Failure Notes */}
                <div className="pt-4 space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                      <span>Exact CLI Command Executed:</span>
                      <button
                        onClick={() => copyCommand(run.cliCommand, idx)}
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                      {run.cliCommand}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                      dscore Evaluation Command:
                    </div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                      {run.scoringCommand}
                    </div>
                  </div>

                  {/* Failure notes */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Observed Acoustic Failure Diagnostics:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {run.observedFailureNotes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
