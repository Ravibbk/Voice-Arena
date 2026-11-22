import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const TopBanner: React.FC = () => {
  const { isSnapshotMode } = useTheme();

  if (isSnapshotMode) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold">Evaluation Transparency:</strong> Design mockup with illustrative benchmark data. Only the{' '}
            <Link
              to="/real-run"
              className="underline font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 inline-flex items-center gap-1"
            >
              'Real Mini-Run' page
            </Link>{' '}
            contains measured results.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/methodology#qa-integrity"
            className="text-amber-800 dark:text-amber-300 hover:underline inline-flex items-center gap-1 text-xs font-mono"
          >
            Anti-Contamination Protocol
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
