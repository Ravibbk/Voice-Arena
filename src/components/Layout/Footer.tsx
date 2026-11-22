import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, ShieldCheck, Terminal, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] text-slate-500 dark:text-slate-400 text-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Voice Arena Research Lab</span>
            </div>
            <p className="leading-relaxed">
              Advancing rigorous, reproducible, and vendor-neutral evaluation protocols for conversational speech AI and speaker diarization.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private 60h Zero-Leakage Corpus</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider">
              Evaluation Standards
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://dihardchallenge.github.io/dihard3"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-slate-900 dark:hover:text-white"
                >
                  DIHARD III Scoring Rules (0.0s Collar)
                </a>
              </li>
              <li>
                <a
                  href="https://chimechallenge.github.io/chime-8"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-slate-900 dark:hover:text-white"
                >
                  CHiME-8 Multi-Mic DASR Protocol
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nryant/dscore"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-slate-900 dark:hover:text-white"
                >
                  dscore Scoring Engine (NIST NIST-DER)
                </a>
              </li>
              <li>
                <a
                  href="https://pyannote.github.io/pyannote-metrics"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-slate-900 dark:hover:text-white"
                >
                  pyannote.metrics Diarization Toolkit
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider">
              Research Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="hover:underline hover:text-slate-900 dark:hover:text-white">
                  Leaderboard & Dynamic Slices
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:underline hover:text-slate-900 dark:hover:text-white">
                  Paired Difference Bootstrap Engine
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:underline hover:text-slate-900 dark:hover:text-white">
                  Evaluation Methodology & QA
                </Link>
              </li>
              <li>
                <Link to="/test-data" className="hover:underline hover:text-slate-900 dark:hover:text-white">
                  Held-Out Dataset Specifications
                </Link>
              </li>
              <li>
                <Link to="/real-run" className="hover:underline hover:text-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Measured Real Mini-Run
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider">
              Methodological Rigor
            </h4>
            <p className="text-[11px] leading-relaxed">
              Confidence intervals computed via paired file-level bootstrap (B=2,000 resamples). Ranks denote true statistical separation; overlapping intervals receive shared tied rank status.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Terminal className="w-3 h-3" />
                <span>dscore --collar 0.0 --overlap</span>
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            &copy; 2024 Voice Arena Research Lab. Built by <strong className="font-semibold text-slate-800 dark:text-slate-200">Ravindra Kumar</strong> for verifiable Speech AI benchmarking.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/methodology#personas" className="hover:underline">
              Persona Matrix
            </Link>
            <Link to="/methodology#reflection" className="hover:underline">
              Engineering Reflection
            </Link>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>SPA Static Build (Render Ready)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
