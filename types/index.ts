// types/index.ts - COMPLETE FILE
export interface WheelSize {
  id: string;
  label: string;
  iso: number;
}

export interface BikeType {
  id: 'road' | 'gravel' | 'mtb';
  name: string;
  description: string;
  wheelSizes: string[];
  tireWidths: number[];
  defaultSetup: BikeSetup;
}

export interface Component {
  id: string;
  model: string;
  variant: string;
  weight: number;
  bikeType: string;
  speeds: string;
}

export interface Crankset extends Component {
  teeth: number[];
}

export interface Cassette extends Component {
  teeth: number[];
}

export interface BikeSetup {
  wheel: string;
  tire: string;
  crankset: Crankset | null;
  cassette: Cassette | null;
}

export interface GearMetrics {
  highSpeed: string;
  lowSpeed: string;
  highRatio: string;
  lowRatio: string;
}

export interface SetupAnalysis {
  metrics: GearMetrics;
  totalWeight: number;
  gearRange: string;
  setup: BikeSetup;
}

export interface ComparisonResults {
  speedChange: number;
  weightChange: number;
  rangeChange: number;
  speedUnit: string;
}

export interface AnalysisResults {
  current: SetupAnalysis;
  proposed: SetupAnalysis;
  comparison: ComparisonResults;
  compatibility?: CompatibilitySummary;
}

export interface CompatibilityCheck {
  derailleurCapacity: boolean;
  chainLength: boolean;
  speedCompatibility: boolean;
  chainLine: boolean;
}

export interface CompatibilitySummary {
  status: 'compatible' | 'warning' | 'error' | 'incomplete';
  title: string;
  message: string;
  criticalIssues: string[];
  minorWarnings: string[];
  actionItems: string[];
}

export interface ValidationResult {
  isComplete: boolean;
  missing: string[];
  completion: number;
}

export interface SavedConfiguration {
  id: string | number;
  name: string;
  bikeType: string;
  currentSetup: BikeSetup;
  proposedSetup: BikeSetup;
  results: AnalysisResults;
  compatibilityResults?: CompatibilitySummary;
  created_at: string;
}

export interface RileyMessage {
  type: 'user' | 'riley';
  content: string;
  timestamp: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning';
}
