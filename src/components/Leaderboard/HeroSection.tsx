import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Users, Mic } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="pt-8 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          <span>Voice Arena Benchmark Suite • Fall 2024 Release</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Which speaker diarization system works best for your audio?
        </h1>

        {/* 1-Line Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl font-normal leading-relaxed mb-6">
          Independent, reproducible evaluation across 60 hours of unconstrained multi-party speech with statistical confidence intervals and honest failure mode diagnostics.
        </p>

        {/* Quick Methodology Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-900 dark:text-white">60h</span> Private Held-Out Set
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Overlaps Scored</span>
            <span className="text-[10px] text-slate-400">(DIHARD III rule)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-900 dark:text-white">95%</span> Bootstrap CI
            <span className="text-[10px] text-slate-400">(B=2,000)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
            <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Blind Speaker Count</span>
            <span className="text-[10px] text-slate-400">(Unconstrained)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>20% Double-Annotated QA</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">(3.1% IAA)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
