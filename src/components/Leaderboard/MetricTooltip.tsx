import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface MetricTooltipProps {
  label: string;
  title: string;
  description: string;
  formula?: string;
  benchmarkContext?: string;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  label,
  title,
  description,
  formula,
  benchmarkContext,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1 group">
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(prev => !prev)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-0.5 rounded focus:outline-none"
        aria-label={`About ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 rounded-lg shadow-2xl text-left pointer-events-none transition-all">
          <div className="font-bold text-xs text-indigo-300 mb-1">{title}</div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{description}</p>
          {formula && (
            <div className="bg-slate-950/70 p-1.5 rounded font-mono text-[10px] text-emerald-400 mb-1.5 border border-slate-800">
              {formula}
            </div>
          )}
          {benchmarkContext && (
            <div className="text-[10px] text-slate-400 italic">
              Rigor note: {benchmarkContext}
            </div>
          )}
          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};
