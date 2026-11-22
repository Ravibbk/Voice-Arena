import React from 'react';
import { FilterState, TrackType, SpeakerCountFilter, AudioDomainFilter, LanguageFilter, DeviceFilter, SystemTypeFilter, CollarSetting, OverlapSetting, SpeakerCountSetting } from '../../types';
import { SlidersHorizontal, RotateCcw, Cpu, Radio, VolumeX, ShieldAlert } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border-y border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Filter Row: Track & Scoring Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          {/* Track Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-500" />
              Evaluation Track:
            </span>
            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
              {(['Batch (Offline)', 'Streaming (Live)'] as TrackType[]).map(track => (
                <button
                  key={track}
                  onClick={() => onFilterChange('track', track)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    filters.track === track
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>

          {/* Scoring Controls Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Collar:</span>
              <select
                value={filters.collar}
                onChange={e => onFilterChange('collar', e.target.value as CollarSetting)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="0.0s Strict [DIHARD]">0.0s Strict [DIHARD]</option>
                <option value="0.25s Legacy [AMI]">0.25s Legacy [AMI]</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Overlaps:</span>
              <select
                value={filters.overlaps}
                onChange={e => onFilterChange('overlaps', e.target.value as OverlapSetting)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Scored">Scored (Default)</option>
                <option value="Ignored">Ignored (Relaxed)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Speaker Count:</span>
              <select
                value={filters.speakerCountKnowledge}
                onChange={e => onFilterChange('speakerCountKnowledge', e.target.value as SpeakerCountSetting)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Not Told [Main]">Not Told [Main Track]</option>
                <option value="Told [Oracle]">Told [Oracle Secondary]</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Granular Acoustic & System Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Domain */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Audio Domain
            </label>
            <select
              value={filters.domain}
              onChange={e => onFilterChange('domain', e.target.value as AudioDomainFilter)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Domains (60h)</option>
              <option value="Meeting">Meeting (20h)</option>
              <option value="Phone Call (8kHz)">Phone Call 8kHz (15h)</option>
              <option value="Podcast / Interview">Podcast / Interview (12h)</option>
              <option value="Medical">Medical (8h)</option>
              <option value="Noisy Room">Noisy Room (5h)</option>
            </select>
          </div>

          {/* Speakers */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Speaker Count
            </label>
            <select
              value={filters.speakerCount}
              onChange={e => onFilterChange('speakerCount', e.target.value as SpeakerCountFilter)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Speakers (2–10)</option>
              <option value="2">2 Speakers (Dyadic)</option>
              <option value="3–5">3–5 Speakers (Group)</option>
              <option value="6+">6+ Speakers (Crowd)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Language / Accent
            </label>
            <select
              value={filters.language}
              onChange={e => onFilterChange('language', e.target.value as LanguageFilter)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Languages</option>
              <option value="English">Standard English</option>
              <option value="Indian English">Indian English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish Code-Switch</option>
            </select>
          </div>

          {/* Device */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Device Mic
            </label>
            <select
              value={filters.device}
              onChange={e => onFilterChange('device', e.target.value as DeviceFilter)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Devices</option>
              <option value="Close Mic">Close Mic (SM7B/Lav)</option>
              <option value="Far-Field">Far-Field Array</option>
              <option value="Phone Line">Phone Line (PSTN/AMR)</option>
              <option value="Laptop Mic">Laptop Mic</option>
            </select>
          </div>

          {/* System Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              System Type
            </label>
            <select
              value={filters.systemType}
              onChange={e => onFilterChange('systemType', e.target.value as SystemTypeFilter)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-md border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Architectures (12)</option>
              <option value="Open-Source">Open-Source (Self-Host)</option>
              <option value="Commercial API">Commercial Pure Diarization</option>
              <option value="STT + Diarization">STT + Diarization</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
