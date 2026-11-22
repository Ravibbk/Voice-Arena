import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Activity, 
  BarChart3, 
  GitCompare, 
  BookOpen, 
  Database, 
  Sparkles, 
  Sun, 
  Moon, 
  Camera, 
  X,
  Volume2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, isSnapshotMode, toggleSnapshotMode } = useTheme();

  return (
    <>
      {/* If snapshot mode is on, render a small floating escape pill */}
      {isSnapshotMode && (
        <div className="fixed top-3 right-3 z-50 bg-slate-900/90 text-white border border-slate-700 rounded-full px-3 py-1.5 text-xs shadow-xl flex items-center gap-2 backdrop-blur-md">
          <span>Snapshot Clean Mode</span>
          <button
            onClick={toggleSnapshotMode}
            className="hover:bg-slate-700 p-0.5 rounded-full transition"
            title="Exit Snapshot Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main sticky navbar */}
      {!isSnapshotMode && (
        <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Brand & Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                      VOICE ARENA
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 font-mono border border-indigo-200 dark:border-indigo-800/60">
                      DIARIZATION
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                    Rigorous Speech AI Benchmarks
                  </p>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  Leaderboard
                </NavLink>

                <NavLink
                  to="/compare"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </NavLink>

                <NavLink
                  to="/methodology"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BookOpen className="w-4 h-4" />
                  Methodology
                </NavLink>

                <NavLink
                  to="/test-data"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Database className="w-4 h-4" />
                  Test Data
                </NavLink>

                <NavLink
                  to="/real-run"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 font-medium ${
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-semibold ring-1 ring-emerald-300 dark:ring-emerald-700'
                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/60'
                    }`
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span>Real Mini-Run</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </NavLink>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              {/* Clean Snapshot Mode Button */}
              <button
                onClick={toggleSnapshotMode}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Hide header, controls, and banners for clean PDF or slide screenshots"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Clean Snapshot</span>
              </button>

              {/* Light/Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="p-2 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 text-xs overflow-x-auto">
            <NavLink to="/" end className="px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
              Leaderboard
            </NavLink>
            <NavLink to="/compare" className="px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
              Compare
            </NavLink>
            <NavLink to="/methodology" className="px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
              Methodology
            </NavLink>
            <NavLink to="/test-data" className="px-2.5 py-1 rounded text-slate-600 dark:text-slate-300">
              Test Data
            </NavLink>
            <NavLink to="/real-run" className="px-2.5 py-1 rounded text-emerald-600 dark:text-emerald-400 font-semibold">
              Real Run
            </NavLink>
          </div>
        </header>
      )}
    </>
  );
};
