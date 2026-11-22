import React, { useState, useMemo } from 'react';
import { FilterState } from '../types';
import systemsData from '../data/systems.json';
import resultsData from '../data/results.json';
import { System, BenchmarkResult } from '../types';
import { HeroSection } from '../components/Leaderboard/HeroSection';
import { UseCasePresets } from '../components/Leaderboard/UseCasePresets';
import { FilterBar } from '../components/Leaderboard/FilterBar';
import { LeaderboardTable } from '../components/Leaderboard/LeaderboardTable';
import { computeRankings } from '../utils/rankEngine';
import { Award, Layers, Zap, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultFilters: FilterState = {
  track: 'Batch (Offline)',
  speakerCount: 'All',
  domain: 'All',
  language: 'All',
  device: 'All',
  systemType: 'All',
  collar: '0.0s Strict [DIHARD]',
  overlaps: 'Scored',
  speakerCountKnowledge: 'Not Told [Main]',
};

export const LeaderboardPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const systems = systemsData as unknown as System[];
  const batchResults = resultsData.overallResults as unknown as BenchmarkResult[];
  const streamingResults = resultsData.streamingResults as unknown as BenchmarkResult[];

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setActivePreset(null); // Clear preset highlight on manual tweak
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyPreset = (presetKey: string, partialFilters: Partial<FilterState>) => {
    if (presetKey === 'clear') {
      setActivePreset(null);
      setFilters(defaultFilters);
      return;
    }
    setActivePreset(presetKey);
    setFilters(prev => ({ ...prev, ...partialFilters }));
  };

  const handleResetFilters = () => {
    setActivePreset(null);
    setFilters(defaultFilters);
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.track !== defaultFilters.track) count++;
    if (filters.speakerCount !== defaultFilters.speakerCount) count++;
    if (filters.domain !== defaultFilters.domain) count++;
    if (filters.language !== defaultFilters.language) count++;
    if (filters.device !== defaultFilters.device) count++;
    if (filters.systemType !== defaultFilters.systemType) count++;
    if (filters.collar !== defaultFilters.collar) count++;
    if (filters.overlaps !== defaultFilters.overlaps) count++;
    if (filters.speakerCountKnowledge !== defaultFilters.speakerCountKnowledge) count++;
    return count;
  }, [filters]);

  // Compute live rankings with statistical tie detection
  const rankedItems = useMemo(() => {
    return computeRankings(systems, batchResults, streamingResults, filters);
  }, [systems, batchResults, streamingResults, filters]);

  // Key stats
  const bestSystem = rankedItems[0];
  const medianDer = rankedItems.length > 0
    ? rankedItems[Math.floor(rankedItems.length / 2)].effectiveDer
    : 0;

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. One-Click Use-Case Presets */}
      <UseCasePresets
        activePreset={activePreset}
        onApplyPreset={handleApplyPreset}
      />

      {/* 3. Interactive Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Quick Summary Highlights Banner */}
      <div className="bg-slate-50 dark:bg-[#0E1424] border-b border-slate-200 dark:border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 dark:text-slate-400">Current Leader:</span>
              <strong className="text-slate-900 dark:text-white font-semibold">
                {bestSystem ? bestSystem.system.name : 'N/A'} ({bestSystem ? bestSystem.effectiveDer : 0}% DER)
              </strong>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="text-slate-600 dark:text-slate-400">Median DER:</span>
              <strong className="text-slate-900 dark:text-white font-semibold">{medianDer}%</strong>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400">Corpus Scope:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">60h Held-Out / 123 Files</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/compare"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Run Paired Head-to-Head Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Main Ranking Table with Statistical Ties */}
      <LeaderboardTable items={rankedItems} filters={filters} />
    </div>
  );
};
