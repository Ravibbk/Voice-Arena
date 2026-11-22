import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import systemsData from '../data/systems.json';
import resultsData from '../data/results.json';
import { System, BenchmarkResult } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  ArrowLeft, 
  ExternalLink, 
  Cpu, 
  Cloud, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  Zap, 
  Copy 
} from 'lucide-react';

export const SystemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const systems = systemsData as unknown as System[];
  const batchResults = resultsData.overallResults as unknown as BenchmarkResult[];

  const system = systems.find(s => s.id === id);
  const result = batchResults.find(r => r.systemId === id);

  if (!system || !result) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">No benchmark record found for identifier: {id}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </Link>
      </div>
    );
  }

  // Audio condition chart data
  const conditionData = Object.entries(result.perConditionDer).map(([name, der]) => ({
    condition: name,
    der: der,
  }));

  // Identify Best & Worst condition
  const sortedConditions = [...conditionData].sort((a, b) => a.der - b.der);
  const bestCondition = sortedConditions[0];
  const worstCondition = sortedConditions[sortedConditions.length - 1];

  // Specific failure mode diagnostics tailored to diarization challenges
  const failureModes = [
    {
      title: 'Overlapping Speech Segments',
      severity: result.overlapDer > 25 ? 'High' : 'Moderate',
      metric: `${result.overlapDer}% Overlap DER`,
      description: 'When two speakers talk simultaneously or interrupt, the acoustic embedding vector blends features from both vocal tracts.',
      impact: 'Missed speech on the secondary interrupting speaker and brief speaker confusion frames.',
      mitigation: 'Enable multi-speaker separation front-end or neural continuous speech separation (CSS).',
    },
    {
      title: 'Short Backchannels ("mm-hm", "yeah")',
      severity: 'Moderate',
      metric: `${result.miss}% Missed Speech`,
      description: 'Sub-300ms affirmative feedback sounds often fail voice activity detection (VAD) energy thresholds.',
      impact: 'Listener affirmative turns are dropped or merged into the primary speaker’s continuous turn.',
      mitigation: 'Lower VAD onset threshold and tighten agglomerative cluster distance parameters.',
    },
    {
      title: 'Similar Voices & Same-Gender Acoustics',
      severity: 'Low to Moderate',
      metric: `${result.confusion}% Speaker Confusion`,
      description: 'Speakers with similar fundamental frequencies (F0), formant profiles, or acoustic resonance can collapse into one cluster.',
      impact: 'Speaker label swapping across extended conversational sections.',
      mitigation: 'Incorporate longer temporal context windows for x-vector / ECAPA-TDNN extraction.',
    },
    {
      title: '8kHz Telephony Band-Pass Degradation',
      severity: result.perConditionDer['Phone Call (8kHz)'] > 13 ? 'High' : 'Low',
      metric: `${result.perConditionDer['Phone Call (8kHz)']}% Phone DER`,
      description: 'Narrowband telephone audio (300Hz–3.4kHz) strips high-frequency spectral cues crucial for vocal tract differentiation.',
      impact: 'Elevated cluster distortion and false alarm boundaries near line noise bursts.',
      mitigation: 'Fine-tune acoustic encoders on upsampled 8kHz AMR/G.711 corpora with noise augmentation.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  system.systemType === 'Open-Source'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {system.systemType}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {system.executionMethod}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                Version: {system.version}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {system.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
              {system.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="text-slate-600 dark:text-slate-400">
                Organization: <strong className="text-slate-900 dark:text-white">{system.company}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-400">
                License: <strong className="text-slate-900 dark:text-white">{system.license}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-400">
                Pricing: <strong className="text-slate-900 dark:text-white">{system.pricingModel}</strong>
              </span>
            </div>
          </div>

          {/* Key Overall DER Card */}
          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 min-w-[200px] text-center">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Overall Benchmark DER
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 my-1">
              {result.der.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              95% CI: [{result.ci[0]}% – {result.ci[1]}%]
            </span>
            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              0.0s Collar • Overlaps Scored
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Best & Worst Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Condition */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Optimal Acoustic Condition
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {bestCondition.condition} ({bestCondition.der}% DER)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Demonstrates lowest error rate with well-separated speaker embeddings and minimal room reverberation artifacts.
            </p>
          </div>
        </div>

        {/* Worst Condition */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Most Challenging Condition
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {worstCondition.condition} ({worstCondition.der}% DER)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Suffers from degraded signal-to-noise ratio or complex multi-speaker turn overlapping requiring domain-specific adaptation.
            </p>
          </div>
        </div>
      </div>

      {/* Condition Bar Chart Section */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Diarization Error Rate Across Audio Conditions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lower DER (%) is better. Tested across held-out condition partitions under 0.0s strict collar.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Metric: dscore (NIST-DER)
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="condition" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#94A3B8', opacity: 0.3 }}
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 11 }}
                unit="%" 
                axisLine={{ stroke: '#94A3B8', opacity: 0.3 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs">
                        <div className="font-bold text-indigo-300">{payload[0].payload.condition}</div>
                        <div className="mt-1 font-mono text-emerald-400">
                          DER: {payload[0].value}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="der" radius={[6, 6, 0, 0]}>
                {conditionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.der === bestCondition.der ? '#059669' : entry.der === worstCondition.der ? '#E11D48' : '#4F46E5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Modes Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Observed Failure Modes & Acoustic Edge Cases
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Concrete diagnostic profiles identifying where and why the system fails on real conversational speech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {failureModes.map((fm, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {fm.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {fm.metric}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {fm.description}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] space-y-1">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Failure Impact: </span>
                  <span className="text-slate-500 dark:text-slate-400">{fm.impact}</span>
                </div>
                <div>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Engineering Fix: </span>
                  <span className="text-slate-500 dark:text-slate-400">{fm.mitigation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reproducibility & Run Settings Card */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">
              Evaluation Reproducibility Protocol
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
            Deterministic Pipeline
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          All system evaluations are executed in isolated container environments with pinned random seeds and deterministic floating-point flags. Transcripts are converted to standard NIST RTTM formats and evaluated against the ground-truth using <code>dscore</code>.
        </p>

        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400">Standard Scoring Invocation:</div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between overflow-x-auto">
            <span>
              python -m dscore.score -r test_references.rttm -s {system.id}_hypotheses.rttm --collar 0.0 --ignore_overlaps False
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-mono">Collar Tolerance</div>
            <div className="font-bold text-white mt-0.5">0.0s Strict</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-mono">Speaker Count</div>
            <div className="font-bold text-white mt-0.5">Blind / Unconstrained</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-mono">Audio Format</div>
            <div className="font-bold text-white mt-0.5">16kHz / 8kHz Mono WAV</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-mono">Bootstrap Iterations</div>
            <div className="font-bold text-white mt-0.5">B = 2,000 files</div>
          </div>
        </div>
      </div>
    </div>
  );
};
