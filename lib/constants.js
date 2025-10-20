// lib/constants.js - Application constants and configuration values

// Calculation Constants
export const CALCULATION_CONSTANTS = {
  DEFAULT_CADENCE_RPM: 90,
  CHAIN_WEIGHT_GRAMS: 257,
  DERAILLEUR_WEIGHT_GRAMS: 232,
  MM_TO_KM: 1e-6,
  KMH_TO_MPH: 0.621371,
  MM_TO_INCHES: 1 / 25.4,
};

// Wheel Sizes (ISO standard in mm)
export const WHEEL_SIZES = {
  '700c': 622,
  '650b': 584,
  '26-inch': 559,
  '27.5-inch': 584,
  '29-inch': 622,
};

// Default Values
export const DEFAULTS = {
  TIRE_WIDTH_MM: 25,
  CASSETTE_RANGE: [11, 28],
  SPEED_UNIT: 'mph',
};

// API & Performance Constants
export const API_CONSTANTS = {
  RILEY_MAX_TOKENS: 1024,
  RILEY_TEMPERATURE: 0.7,
  API_TIMEOUT_MS: 30000,
  REQUEST_DELAY_MS: 1000,
};

// Service Worker Constants
export const PWA_CONSTANTS = {
  UPDATE_CHECK_INTERVAL_MS: 600000, // 10 minutes
  UPDATE_NOTIFICATION_DURATION_MS: 10000,
  MAX_SAVED_CONFIGS: 10,
};

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 60000, // 1 minute
  MAX_REQUESTS: 10,
};

// Storage Keys
export const STORAGE_KEYS = {
  CONFIGS: 'cranksmith_configs',
  SPEED_UNIT: 'cranksmith_speed_unit',
  DESKTOP_PREFERRED: 'cranksmith_desktop_preference',
  MOBILE_SUGGESTED_TODAY: 'cranksmith_mobile_suggested_today',
  LAST_SUGGESTION_DATE: 'cranksmith_last_suggestion_date',
};

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION_MS: 3000,
  RILEY_DELAY_MS: 2000,
  DEBOUNCE_DELAY_MS: 300,
};
