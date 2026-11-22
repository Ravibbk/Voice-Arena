import React, { useState, useMemo } from 'react';
import testDatasetData from '../data/testDataset.json';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Database, 
  PieChart as PieIcon, 
  Filter, 
  ShieldCheck, 
  Mic, 
  Layers, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';

const COLORS = ['#4F46E5', '#059669', '#D97706', '#9333EA', '#E11D48'];

export const TestDataPage: React.FC = () => {
  const dataset = testDatasetData;
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Collect all unique difficulty tags for filtering
  const allTags = useMemo(() => {
    const set = new Set<string>();
    dataset.domains.forEach(d => d.difficultyTags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [dataset]);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    if (selectedTag === 'All') return dataset.domains;
    return dataset.domains.filter(d => d.difficultyTags.includes(selectedTag));
  }, [dataset, selectedTag]);

  // Donut chart data
  const chartData = dataset.domains.map(d => ({
    name: d.name,
    value: d.hours,
    files: d.files,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>Held-Out Private Test Corpus</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Corpus Composition & Acoustic Partitions
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-4xl mt-2 leading-relaxed">
          {dataset.datasetMetadata.name} ({dataset.datasetMetadata.version}): 60.0 hours across 123 unconstrained audio files recorded under zero-contamination research protocols.
        </p>
      </div>

      {/* Dataset Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Total Duration</div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white my-1">
            {dataset.datasetMetadata.totalDurationHours} hrs
          </div>
          <div className="text-xs text-slate-500">123 distinct WAV audio files</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Active Speakers</div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 my-1">
            {dataset.datasetMetadata.totalSpeakers}
          </div>
          <div className="text-xs text-slate-500">Multi-accent & multi-lingual</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Double Annotated QA</div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 my-1">
            {dataset.datasetMetadata.doubleAnnotatedPercentage}%
          </div>
          <div className="text-xs text-slate-500">12.0h stratified split</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Inter-Annotator Agreement</div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white my-1">
            {dataset.datasetMetadata.interAnnotatorAgreementDer}%
          </div>
          <div className="text-xs text-slate-500">Human DER ceiling (0.0s collar)</div>
        </div>
      </div>

      {/* Recharts Donut Chart Section */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              <span>Acoustic Domain Partition (Total 60 Hours)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stratified across 5 conversational environments reflecting unconstrained enterprise voice workflows.
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="font-bold text-indigo-300">{data.name}</div>
                        <div className="font-mono text-emerald-400">
                          {data.value} Hours ({Math.round((data.value / 60) * 100)}% of dataset)
                        </div>
                        <div className="text-slate-400">{data.files} recording files</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filterable Acoustic Domain Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Domain Specifications & Recording Conditions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter acoustic partitions by difficulty tags or inspect physical device configurations:
            </p>
          </div>

          {/* Difficulty Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Tag:
            </span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 w-40">Domain</th>
                <th className="p-3 w-28">Hours / Files</th>
                <th className="p-3 w-32">Speakers</th>
                <th className="p-3 w-40">Languages / Accents</th>
                <th className="p-3">Recording Devices & Environment</th>
                <th className="p-3 w-48">Difficulty Challenges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredDomains.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{d.description}</div>
                  </td>

                  <td className="p-3 font-mono">
                    <div className="font-bold text-slate-900 dark:text-white">{d.hours.toFixed(1)} hrs</div>
                    <div className="text-slate-500 text-[11px]">{d.files} files</div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                      {d.overlapPercentage}% overlap
                    </div>
                  </td>

                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    <span className="font-mono font-semibold">{d.speakerRange}</span>
                  </td>

                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    <div className="flex flex-wrap gap-1">
                      {d.languages.map((l, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    <div className="font-medium text-slate-800 dark:text-slate-200 mb-0.5">
                      {d.devices.join(', ')}
                    </div>
                    <div className="text-[11px] italic">{d.acousticEnvironment}</div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {d.difficultyTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Pass Protocol Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Human Ground-Truth Generation Pipeline
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Pass 1: Primary Phonetician</strong>
            <p className="leading-relaxed">
              Trained linguist listens with studio headphones, placing sub-10ms boundary markers on continuous vocal onset/offset transitions in Praat.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Pass 2: Blind Quality Audit</strong>
            <p className="leading-relaxed">
              20% stratified audio (12.0h) is independently labeled by a secondary annotator without access to Pass 1 tags to compute Inter-Annotator Agreement.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Pass 3: Lead Adjudication</strong>
            <p className="leading-relaxed">
              Senior speech scientist reviews disagreements where timestamp delta exceeds 150ms collar or speaker cluster identity deviates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
