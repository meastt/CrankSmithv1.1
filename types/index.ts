// types/index.ts - Cleaned and Organized Type Definitions

// ============================================================================
// CORE BIKE CALCULATOR TYPES
// ============================================================================

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

// ============================================================================
// COMPATIBILITY SYSTEM TYPES
// ============================================================================

export interface CompatibilitySummary {
  status: 'compatible' | 'warning' | 'error' | 'incomplete';
  title: string;
  message: string;
  criticalIssues: string[];
  minorWarnings: string[];
  actionItems: string[];
}

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
  actions?: ToastAction[];
}

export interface ToastAPI {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ============================================================================
// DROPDOWN COMPONENT TYPES
// ============================================================================

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

// ============================================================================
// CALCULATOR STATE MANAGEMENT
// ============================================================================

export interface ValidationResult {
  isComplete: boolean;
  missing: string[];
  completion: number;
}

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

// ============================================================================
// BIKE FIT CALCULATOR TYPES
// ============================================================================

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

// Validation ranges for body measurements (in cm)
export interface MeasurementValidationRanges {
  inseam: { min: number; max: number };
  torso: { min: number; max: number };
  armLength: { min: number; max: number };
}

export interface BikeFitResults {
  saddleHeight: {
    lemond: number;
    holmes: number;
    hamley: number;
    competitive: number;
  };
  reach: number;
  stack: number;
  handlebarDrop: {
    comfort: number;
    sport: number;
    aggressive: number;
  };
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

// ============================================================================
// PWA AND SERVICE WORKER TYPES
// ============================================================================

export interface ServiceWorkerMessage {
  type: 'CACHE_UPDATED' | 'OFFLINE_READY' | 'UPDATE_AVAILABLE';
  payload?: any;
}

// ============================================================================
// DATA PERSISTENCE TYPES (FOR FUTURE USE)
// ============================================================================

/**
 * Configuration data that can be saved/loaded by users
 * Note: Currently used in localStorage, may be moved to database in future
 */
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

/**
 * Riley AI message format
 * Note: Used in Ask Riley chat interface
 */
export interface RileyMessage {
  type: 'user' | 'riley';
  content: string;
  timestamp: string;
}

// ============================================================================
// API RESPONSE TYPES (FOR FUTURE API ENDPOINTS)
// ============================================================================

/**
 * Standard API response wrapper
 * Note: Prepared for future backend API integration
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Riley AI API response format
 * Note: Used by Riley AI chat endpoint
 */
export interface RileyAPIResponse extends APIResponse {
  response?: string;
}

// ============================================================================
// MEASUREMENT VALIDATION TYPES
// ============================================================================

export interface MeasurementValidationResult {
  isValid: boolean;
  valueInMm: number | null;
  error?: string;
}
