import React, { useState } from 'react';
import { RankedItem, FilterState } from '../../types';
import { Link } from 'react-router-dom';
import { MetricTooltip } from './MetricTooltip';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Cpu, 
  Cloud, 
  AlertCircle, 
  Scale, 
  CheckCircle2, 
  Terminal,
  Zap,
  Info
} from 'lucide-react';

interface LeaderboardTableProps {
  items: RankedItem[];
  filters: FilterState;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ items, filters }) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof RankedItem>('effectiveDer');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const toggleRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const handleSort = (key: keyof RankedItem) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  return (
    <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Table Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Benchmark Rankings ({items.length} Systems Active)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Track: {filters.track} • Collar: {filters.collar.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Miss
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> False Alarm
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Confusion
            </span>
          </div>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                {/* Rank */}
                <th className="py-3 px-3 w-16 text-center">
                  <MetricTooltip
                    label="Rank"
                    title="Statistical Rank Group"
                    description="Systems whose 95% bootstrap confidence intervals overlap are grouped into a statistical tie (e.g. 1–2)."
                  />
                </th>

                {/* System & Company */}
                <th className="py-3 px-4 min-w-[200px]">
                  <span>System & Provider</span>
                </th>

                {/* DER with 95% CI */}
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition">
                  <div className="flex items-center gap-1">
                    <MetricTooltip
                      label="DER % (95% CI)"
                      title="Diarization Error Rate (DER)"
                      formula="DER = (Missed Speech + False Alarm + Speaker Confusion) / Total Speech Time"
                      description="Primary evaluation metric. Lower is better. Computed strictly per DIHARD III rules with 95% percentile bootstrap over files."
                    />
                  </div>
                </th>

                {/* DER Breakdown */}
                <th className="py-3 px-3 min-w-[150px]">
                  <MetricTooltip
                    label="Error Breakdown"
                    title="Component Error Breakdown"
                    description="Visual proportion of Missed Speech (rose), False Alarm (amber), and Speaker Confusion (indigo)."
                  />
                </th>

                {/* JER */}
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition">
                  <MetricTooltip
                    label="JER %"
                    title="Jaccard Error Rate (JER)"
                    formula="JER = 1 - (1/N) * sum(max_overlap(ref_i, hyp_j))"
                    description="Speaker-agnostic turn metric weighting each speaker equally regardless of total speaking duration. Prevents dominant speakers from masking peripheral errors."
                  />
                </th>

                {/* Overlap DER */}
                <th className="py-3 px-3">
                  <MetricTooltip
                    label="Overlap DER %"
                    title="Overlap Segment DER"
                    description="Diarization error rate evaluated exclusively during timestamps where two or more speakers talk at the same time."
                  />
                </th>

                {/* Speaker Count Acc */}
                <th className="py-3 px-3">
                  <MetricTooltip
                    label="Spk Count Acc"
                    title="Speaker Count Accuracy %"
                    description="Percentage of audio recordings where the system's unconstrained clustering accurately estimated the exact true number of speakers."
                  />
                </th>

                {/* Speed (RTF) */}
                <th className="py-3 px-3">
                  <MetricTooltip
                    label="Speed (RTF)"
                    title="Real-Time Factor (RTF) or Latency"
                    formula="RTF = Inference Time / Audio Duration"
                    description="Processing speed. RTF 0.05x means a 60-minute audio file is diarized in 3 minutes. For streaming, p95 WebSocket packet latency is shown."
                  />
                </th>

                {/* Cost */}
                <th className="py-3 px-3">
                  <MetricTooltip
                    label="Cost ($/hr)"
                    title="Processing Cost per Audio Hour"
                    description="Standard API list pricing or estimated GPU cloud compute cost (e.g. AWS/GCP A10G spot instances) per 60 minutes of audio."
                  />
                </th>

                {/* Details Button */}
                <th className="py-3 px-3 text-center">
                  <span>Audit</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedItems.map(item => {
                const isExpanded = expandedRowId === item.system.id;
                const { system, result, effectiveDer, effectiveCi, isStatisticalTie, rankGroup } = item;

                // Total error components for the stacked bar
                const totalComp = result.miss + result.falseAlarm + result.confusion;
                const missPct = Math.round((result.miss / totalComp) * 100);
                const faPct = Math.round((result.falseAlarm / totalComp) * 100);
                const confPct = 100 - missPct - faPct;

                return (
                  <React.Fragment key={system.id}>
                    <tr
                      className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer ${
                        isExpanded ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                      onClick={() => toggleRow(system.id)}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span
                            className={`inline-block font-extrabold text-sm px-2 py-0.5 rounded ${
                              item.rank === 1 || rankGroup === '1' || rankGroup === '1–2'
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            #{rankGroup}
                          </span>
                          {/* Statistical Tie Badge Requirement */}
                          {isStatisticalTie && (
                            <span
                              className="mt-1 text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-0.5 whitespace-nowrap"
                              title="95% Bootstrap Confidence Interval overlaps adjacent system. Statistically indistinguishable separation."
                            >
                              <Scale className="w-2.5 h-2.5" />
                              <span>Stat Tie</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* System & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                to={`/system/${system.id}`}
                                onClick={e => e.stopPropagation()}
                                className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                {system.name}
                                <ExternalLink className="w-3 h-3 text-slate-400 hover:text-indigo-500" />
                              </Link>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {system.company}
                              </span>
                              <span>•</span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                                  system.systemType === 'Open-Source'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                                    : system.systemType === 'Commercial API'
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                                    : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                }`}
                              >
                                {system.systemType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DER % with 95% CI */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {effectiveDer.toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            ±{((effectiveCi[1] - effectiveCi[0]) / 2).toFixed(1)}%{' '}
                            <span className="text-slate-400">[{effectiveCi[0]}–{effectiveCi[1]}]</span>
                          </span>
                        </div>
                      </td>

                      {/* DER Error Breakdown (Stacked Bar with Tooltip) */}
                      <td className="py-3.5 px-3">
                        <div
                          className="w-full h-4 rounded-md overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          title={`Missed Speech: ${result.miss}% (${missPct}% of error)\nFalse Alarm: ${result.falseAlarm}% (${faPct}% of error)\nSpeaker Confusion: ${result.confusion}% (${confPct}% of error)`}
                        >
                          <div
                            style={{ width: `${missPct}%` }}
                            className="bg-rose-500 hover:opacity-90 transition"
                          />
                          <div
                            style={{ width: `${faPct}%` }}
                            className="bg-amber-400 hover:opacity-90 transition"
                          />
                          <div
                            style={{ width: `${confPct}%` }}
                            className="bg-indigo-600 hover:opacity-90 transition"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                          <span>{result.miss}% m</span>
                          <span>{result.falseAlarm}% fa</span>
                          <span>{result.confusion}% cf</span>
                        </div>
                      </td>

                      {/* JER % */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {item.effectiveJer.toFixed(1)}%
                      </td>

                      {/* Overlap DER */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {item.effectiveOverlapDer.toFixed(1)}%
                      </td>

                      {/* Speaker Count Acc */}
                      <td className="py-3.5 px-3 font-mono">
                        <span
                          className={`font-semibold ${
                            item.effectiveSpeakerCountAcc >= 85
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : item.effectiveSpeakerCountAcc >= 75
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.effectiveSpeakerCountAcc.toFixed(1)}%
                        </span>
                      </td>

                      {/* Speed (RTF) */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {item.effectiveSpeed}
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        ${item.effectiveCost.toFixed(2)}
                      </td>

                      {/* Expand Toggle */}
                      <td className="py-3.5 px-3 text-center text-slate-400">
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          aria-label="Expand system drawer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Row Drawer Requirement */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-indigo-100 dark:border-indigo-950">
                        <td colSpan={10} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                            {/* Column 1: Verification & Version Rule */}
                            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Version Integrity</span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Exact Model Version:
                              </div>
                              <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 p-1 rounded border border-amber-200 dark:border-amber-900/60 font-semibold">
                                {system.version}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Execution: {system.executionMethod}
                              </div>
                            </div>

                            {/* Column 2: Run Date & Settings */}
                            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Benchmark Run Settings</span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Track: <strong className="text-slate-800 dark:text-slate-200">{result.track}</strong>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Collar: <strong className="text-slate-800 dark:text-slate-200">{filters.collar}</strong>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Overlaps: <strong className="text-slate-800 dark:text-slate-200">{filters.overlaps}</strong>
                              </div>
                            </div>

                            {/* Column 3: Data & Scope */}
                            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Scale className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Corpus Scope</span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Evaluated Audio: <strong className="text-slate-800 dark:text-slate-200">{result.hoursTested.toFixed(1)} hours</strong>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Files Evaluated: <strong className="text-slate-800 dark:text-slate-200">{result.filesTested} files</strong>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                Bootstrap: 2,000 resamples
                              </div>
                            </div>

                            {/* Column 4: Action Link */}
                            <div className="flex flex-col justify-between p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60">
                              <div>
                                <span className="font-bold text-indigo-950 dark:text-indigo-200">
                                  Full System Profile
                                </span>
                                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-1">
                                  Inspect condition breakdowns, failure mode analyses, and reproducibility recipe.
                                </p>
                              </div>
                              <Link
                                to={`/system/${system.id}`}
                                className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition"
                              >
                                <span>View Full System Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistical Footnote */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              Statistical separation verified via 95% bootstrap confidence intervals over {items[0]?.result.filesTested || 123} test recordings.
            </span>
          </div>
          <div className="font-mono text-[10px]">
            Engine: dscore v1.8 (NIST standard)
          </div>
        </div>
      </div>
    </div>
  );
};
