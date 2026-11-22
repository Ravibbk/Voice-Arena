import React, { useState, useMemo } from 'react';
import systemsData from '../data/systems.json';
import resultsData from '../data/results.json';
import { System, BenchmarkResult } from '../types';
import { computePairedBootstrap } from '../utils/bootstrap';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  GitCompare, 
  Scale, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Activity, 
  RotateCcw 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComparePage: React.FC = () => {
  const systems = systemsData as unknown as System[];
  const results = resultsData.overallResults as unknown as BenchmarkResult[];

  const [systemAId, setSystemAId] = useState<string>('pyannote-community');
  const [systemBId, setSystemBId] = useState<string>('deepgram-nova');

  const systemA = systems.find(s => s.id === systemAId) || systems[0];
  const systemB = systems.find(s => s.id === systemBId) || systems[1];

  const resultA = results.find(r => r.systemId === systemAId) || results[0];
  const resultB = results.find(r => r.systemId === systemBId) || results[1];

  // Client-side paired bootstrap calculation
  const bootstrapResult = useMemo(() => {
    return computePairedBootstrap(
      resultA.sampleFileDers,
      resultB.sampleFileDers,
      systemA.name,
      systemB.name,
      2000
    );
  }, [resultA, resultB, systemA, systemB]);

  // Per-condition head-to-head chart data
  const conditionChartData = useMemo(() => {
    const conditions = ['Meeting', 'Phone Call (8kHz)', 'Podcast / Interview', 'Medical', 'Noisy Room'];
    return conditions.map(c => ({
      condition: c,
      [systemA.name]: resultA.perConditionDer[c] ?? 0,
      [systemB.name]: resultB.perConditionDer[c] ?? 0,
    }));
  }, [resultA, resultB, systemA, systemB]);

  const swapSystems = () => {
    const temp = systemAId;
    setSystemAId(systemBId);
    setSystemBId(temp);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Methodology Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Statistical Significance Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Paired Head-to-Head Comparison
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl mt-1 leading-relaxed">
          Evaluate whether the performance difference between two systems is statistically reliable using paired file-level bootstrap resampling (B=2,000) rather than naive independent confidence intervals.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* System A Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              System A (Baseline)
            </label>
            <select
              value={systemAId}
              onChange={e => setSystemAId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {systems.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company} • {s.systemType})
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{systemA.executionMethod}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                DER: {resultA.der}%
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={swapSystems}
              title="Swap Systems"
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* System B Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              System B (Candidate)
            </label>
            <select
              value={systemBId}
              onChange={e => setSystemBId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {systems.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company} • {s.systemType})
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{systemB.executionMethod}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                DER: {resultB.der}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Paired Bootstrap Verdict Requirement */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
          bootstrapResult.verdictType === 'systemA'
            ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
            : bootstrapResult.verdictType === 'systemB'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Paired Bootstrap Significance Verdict
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                B = 2,000 resamples
              </span>
            </div>

            {/* Verdict Badge */}
            <div className="flex items-center gap-3">
              <div
                className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${
                  bootstrapResult.verdictType === 'systemA'
                    ? 'text-indigo-900 dark:text-indigo-300'
                    : bootstrapResult.verdictType === 'systemB'
                    ? 'text-emerald-900 dark:text-emerald-300'
                    : 'text-amber-900 dark:text-amber-300'
                }`}
              >
                {bootstrapResult.verdictType !== 'tie' ? (
                  <CheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 shrink-0" />
                )}
                <span>{bootstrapResult.verdict}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Mean paired difference across test audio files is{' '}
              <strong className="font-mono font-bold">
                {bootstrapResult.meanDiff > 0 ? `+${bootstrapResult.meanDiff}%` : `${bootstrapResult.meanDiff}%`} DER
              </strong>{' '}
              with empirical 95% bootstrap confidence interval of{' '}
              <strong className="font-mono font-bold">
                [{bootstrapResult.ciLow}%, {bootstrapResult.ciHigh}%]
              </strong>{' '}
              (p-value: <code className="font-mono text-xs">{bootstrapResult.pValue}</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center min-w-[220px]">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
              Delta (DER_A - DER_B)
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">
              {bootstrapResult.meanDiff > 0 ? `+${bootstrapResult.meanDiff}%` : `${bootstrapResult.meanDiff}%`}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              CI: [{bootstrapResult.ciLow}%, {bootstrapResult.ciHigh}%]
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* DER */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            DER % (0.0s Collar)
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{systemA.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultA.der}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{systemB.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultB.der}%</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            Delta: {(resultA.der - resultB.der).toFixed(1)}%
          </div>
        </div>

        {/* JER */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            JER % (Jaccard)
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{systemA.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultA.jer}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{systemB.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultB.jer}%</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            Delta: {(resultA.jer - resultB.jer).toFixed(1)}%
          </div>
        </div>

        {/* Overlap DER */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            Overlap DER %
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{systemA.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultA.overlapDer}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{systemB.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultB.overlapDer}%</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            Delta: {(resultA.overlapDer - resultB.overlapDer).toFixed(1)}%
          </div>
        </div>

        {/* Speed (RTF) */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            Inference RTF
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{systemA.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultA.speedRtf}x</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{systemB.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">{resultB.speedRtf}x</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            Ratio: {(resultA.speedRtf / Math.max(0.001, resultB.speedRtf)).toFixed(1)}x speedup
          </div>
        </div>

        {/* Cost */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
            Cost ($/Audio Hr)
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{systemA.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">${resultA.costPerHour.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{systemB.name.split('/')[0]}</div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">${resultB.costPerHour.toFixed(2)}</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
            Diff: ${(resultA.costPerHour - resultB.costPerHour).toFixed(2)} / hr
          </div>
        </div>
      </div>

      {/* Head-to-Head Per Condition Chart */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Head-to-Head DER by Acoustic Condition
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct comparison of error rates across meeting, phone, podcast, medical, and noisy domains.
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
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
                      <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="font-bold text-slate-300">{payload[0].payload.condition}</div>
                        {payload.map((entry, idx) => (
                          <div key={idx} className="font-mono flex items-center justify-between gap-4">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-bold">{entry.value}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey={systemA.name} fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey={systemB.name} fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
