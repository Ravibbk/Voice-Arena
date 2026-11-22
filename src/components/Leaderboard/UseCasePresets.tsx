import React from 'react';
import { FilterState } from '../../types';
import { Users, PhoneCall, Stethoscope, Radio, ArrowRight } from 'lucide-react';

interface UseCasePresetsProps {
  activePreset: string | null;
  onApplyPreset: (presetKey: string, newFilters: Partial<FilterState>) => void;
}

export const UseCasePresets: React.FC<UseCasePresetsProps> = ({
  activePreset,
  onApplyPreset,
}) => {
  const presets = [
    {
      id: 'meeting-notes',
      name: 'Meeting Notes',
      icon: Users,
      badge: '3–5+ speakers',
      filterTarget: {
        track: 'Batch (Offline)' as const,
        domain: 'Meeting' as const,
        speakerCount: '3–5' as const,
        overlaps: 'Scored' as const,
        collar: '0.0s Strict [DIHARD]' as const,
      },
      callout: 'Optimizes for multi-speaker overlap & accurate speaker count.',
      description: 'Simultaneous debate, unconstrained floor turns, and whiteboard discussions.',
    },
    {
      id: 'call-centre',
      name: 'Call Centre',
      icon: PhoneCall,
      badge: '2 speakers • 8kHz',
      filterTarget: {
        track: 'Batch (Offline)' as const,
        domain: 'Phone Call (8kHz)' as const,
        speakerCount: '2' as const,
        device: 'Phone Line' as const,
      },
      callout: 'Optimizes for 8kHz telephony audio & cost per hour.',
      description: 'PSTN/cellular bandwidth constraints, agent-caller cross-talk, high volume processing.',
    },
    {
      id: 'medical-scribe',
      name: 'Medical Scribe',
      icon: Stethoscope,
      badge: '2–3 speakers • Privacy',
      filterTarget: {
        track: 'Batch (Offline)' as const,
        domain: 'Medical' as const,
        speakerCount: '2' as const,
        systemType: 'Open-Source' as const, // self-hosted for HIPAA / on-prem privacy
      },
      callout: 'Optimizes for short backchannels & self-hosted privacy.',
      description: 'Clinical consultation, soft affirmative backchannels ("mm-hm"), zero data retention.',
    },
    {
      id: 'live-voice-agent',
      name: 'Live Voice Agent',
      icon: Radio,
      badge: 'Streaming • Low Latency',
      filterTarget: {
        track: 'Streaming (Live)' as const,
        domain: 'All' as const,
        speakerCount: '2' as const,
      },
      callout: 'Optimizes for real-time streaming & low RTF.',
      description: 'Real-time conversational agents, fast WebSocket chunking, sub-300ms p95 latency.',
    },
  ];

  return (
    <div className="py-5 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              One-Click Use-Case Presets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your product workflow to automatically configure benchmark scoring filters:
            </p>
          </div>
          {activePreset && (
            <button
              onClick={() => onApplyPreset('clear', {
                track: 'Batch (Offline)',
                speakerCount: 'All',
                domain: 'All',
                language: 'All',
                device: 'All',
                systemType: 'All',
                collar: '0.0s Strict [DIHARD]',
                overlaps: 'Scored',
                speakerCountKnowledge: 'Not Told [Main]',
              })}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium self-start sm:self-auto"
            >
              Reset to Full Benchmark
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map(p => {
            const Icon = p.icon;
            const isSelected = activePreset === p.id;

            return (
              <div
                key={p.id}
                onClick={() => onApplyPreset(p.id, p.filterTarget)}
                className={`relative cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between text-left group ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-snug">
                    {p.description}
                  </p>
                </div>

                {/* Micro-callout requirement */}
                <div
                  className={`pt-2 border-t text-[11px] font-medium flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="italic">{p.callout}</span>
                  <ArrowRight
                    className={`w-3 h-3 transition-transform ${
                      isSelected
                        ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
