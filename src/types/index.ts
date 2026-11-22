export type SystemType = 'Open-Source' | 'Commercial API' | 'STT + Diarization';
export type ExecutionMethod = 'Self-Hosted GPU' | 'Managed API';
export type TrackType = 'Batch (Offline)' | 'Streaming (Live)';

export interface System {
  id: string;
  name: string;
  company: string;
  systemType: SystemType;
  executionMethod: ExecutionMethod;
  supportedTracks: TrackType[];
  version: string;
  license: string;
  pricingModel: string;
  costPerHour: number;
  description: string;
  websiteUrl: string;
  docsUrl: string;
  repoUrl: string;
  supportedLanguages: string[];
  maxRecommendedSpeakers: number;
  minSegmentLength: string;
  streamingSupported: boolean;
  strengths: string[];
  limitations: string[];
}

export interface BenchmarkResult {
  systemId: string;
  track: TrackType;
  collar: string;
  overlaps: string;
  speakerCountKnowledge: string;
  der: number;
  ci: [number, number];
  ciHalfWidth: number;
  miss: number;
  falseAlarm: number;
  confusion: number;
  jer: number;
  overlapDer: number;
  speakerCountAccuracy: number;
  speedRtf: number;
  latencyP95?: string;
  costPerHour: number;
  hoursTested: number;
  filesTested: number;
  perConditionDer: Record<string, number>;
  perSpeakerCountDer: Record<string, number>;
  perLanguageDer: Record<string, number>;
  perDeviceDer: Record<string, number>;
  sampleFileDers: number[];
}

export type SpeakerCountFilter = 'All' | '2' | '3–5' | '6+';
export type AudioDomainFilter = 'All' | 'Meeting' | 'Phone Call (8kHz)' | 'Podcast / Interview' | 'Medical' | 'Noisy Room';
export type LanguageFilter = 'All' | 'English' | 'Indian English' | 'Hindi' | 'Hinglish';
export type DeviceFilter = 'All' | 'Close Mic' | 'Far-Field' | 'Phone Line' | 'Laptop Mic';
export type SystemTypeFilter = 'All' | 'Open-Source' | 'Commercial API' | 'STT + Diarization';
export type CollarSetting = '0.0s Strict [DIHARD]' | '0.25s Legacy [AMI]';
export type OverlapSetting = 'Scored' | 'Ignored';
export type SpeakerCountSetting = 'Not Told [Main]' | 'Told [Oracle]';

export interface FilterState {
  track: TrackType;
  speakerCount: SpeakerCountFilter;
  domain: AudioDomainFilter;
  language: LanguageFilter;
  device: DeviceFilter;
  systemType: SystemTypeFilter;
  collar: CollarSetting;
  overlaps: OverlapSetting;
  speakerCountKnowledge: SpeakerCountSetting;
}

export interface RankedItem {
  rank: number | string;
  rankGroup: string;
  isStatisticalTie: boolean;
  system: System;
  result: BenchmarkResult;
  effectiveDer: number;
  effectiveCi: [number, number];
  effectiveJer: number;
  effectiveOverlapDer: number;
  effectiveSpeakerCountAcc: number;
  effectiveSpeed: string;
  effectiveCost: number;
}

export interface BootstrapComparisonResult {
  meanDiff: number;
  ciLow: number;
  ciHigh: number;
  pValue: number;
  verdict: 'System A reliably better (p < 0.05)' | 'System B reliably better (p < 0.05)' | 'No reliable difference (CIs overlap)';
  verdictType: 'systemA' | 'systemB' | 'tie';
  pairedDiffs: number[];
  resampleDist: number[];
  systemAName: string;
  systemBName: string;
}

export interface TestDomainInfo {
  id: string;
  name: string;
  hours: number;
  files: number;
  speakerRange: string;
  overlapPercentage: number;
  languages: string[];
  devices: string[];
  acousticEnvironment: string;
  difficultyTags: string[];
  description: string;
}

export interface MeasuredRunClip {
  clipId: string;
  corpus: string;
  fileName: string;
  duration: string;
  sampleRate: string;
  groundTruthSpeakers: number;
  overlapRatio: string;
  acousticProfile: string;
  referenceRttmSnippet: string;
}

export interface MeasuredRunEntry {
  systemName: string;
  provider: string;
  systemType: string;
  exactVersion: string;
  executionMode: string;
  cliCommand: string;
  scoringCommand: string;
  measuredDerStrict00s: number;
  measuredDerLegacy025s: number;
  measuredJer: number;
  missedSpeech: number;
  falseAlarm: number;
  speakerConfusion: number;
  predictedSpeakerCount: number;
  groundTruthSpeakerCount: number;
  measuredRtf: number;
  observedFailureNotes: string;
  localRunSlot: string;
}
