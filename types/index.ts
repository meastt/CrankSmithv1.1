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

// Enhanced Toast System Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

export interface ToastAPI {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// Searchable Dropdown Types
export interface DropdownOption {
  id: string;
  label: string;
  model?: string;
  variant?: string;
  teeth?: number[];
  speeds?: string;
  weight?: number;
  bikeType?: string;
  subtitle?: string;
  value?: any;
}

export interface GroupedOptions {
  [groupName: string]: DropdownOption[];
}

// Enhanced Calculator State Types
export interface CalculatorState {
  bikeType: string;
  currentSetup: BikeSetup;
  proposedSetup: BikeSetup;
  results: AnalysisResults | null;
  loading: boolean;
  speedUnit: 'mph' | 'kmh';
  compatibilityResults: CompatibilitySummary | null;
  validation: {
    current: ValidationResult;
    proposed: ValidationResult;
    canAnalyze: boolean;
    totalCompletion: number;
  };
}

// PWA Types
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface ServiceWorkerMessage {
  type: 'CACHE_UPDATED' | 'OFFLINE_READY' | 'UPDATE_AVAILABLE';
  payload?: any;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface RileyAPIResponse extends APIResponse {
  response?: string;
}

// Bike Fit Calculator Types
export type FlexibilityLevel = 'low' | 'average' | 'high';
export type RidingStyle = 'comfort' | 'endurance' | 'sport' | 'aggressive' | 'racing';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type MeasurementUnits = 'metric' | 'imperial';

export interface BodyMeasurements {
  inseam: number | null;
  torso: number | null;
  armLength: number | null;
  flexibility: FlexibilityLevel;
  ridingStyle: RidingStyle;
  experience: ExperienceLevel;
  units: MeasurementUnits;
}

// Validation ranges for body measurements (in mm)
export interface MeasurementValidationRanges {
  inseam: { min: number; max: number };
  torso: { min: number; max: number };
  armLength: { min: number; max: number };
}

export interface SaddleHeightResults {
  lemond: number;
  holmes: number;
  hamley: number;
  competitive: number;
}

export interface HandlebarDropOptions {
  comfort: number;
  sport: number;
  aggressive: number;
}

export interface BikeFitResults {
  saddleHeight: SaddleHeightResults;
  reach: number;
  stack: number;
  handlebarDrop: HandlebarDropOptions;
}

export interface BikeFitCalculations {
  saddleHeight: {
    lemond: (inseam: number) => number;
    holmes: (inseam: number) => number;
    hamley: (inseam: number) => number;
    competitive: (inseam: number) => number;
  };
  reach: (torso: number, armLength: number, flexibility: FlexibilityLevel, ridingStyle: RidingStyle) => number;
  stack: (torso: number, flexibility: FlexibilityLevel, ridingStyle: RidingStyle, experience: ExperienceLevel) => number;
}
