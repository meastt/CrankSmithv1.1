// pages/bike-fit.tsx - Comprehensive bike fit calculator with TypeScript
import React, { useState, useEffect, ReactElement } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import { toast } from '../components/Toast';
import { 
  BodyMeasurements, 
  BikeFitResults, 
  BikeFitCalculations,
  FlexibilityLevel,
  RidingStyle,
  ExperienceLevel,
  MeasurementValidationRanges,
  MeasurementValidationResult
} from '../types';

// Validation ranges for body measurements (in millimeters)
const validationRanges: MeasurementValidationRanges = {
  inseam: { min: 250, max: 1200 }, // 25cm to 120cm (9.8" to 47.2")
  torso: { min: 200, max: 850 },   // 20cm to 85cm (7.9" to 33.5")  
  armLength: { min: 200, max: 950 } // 20cm to 95cm (7.9" to 37.4")
};

// Input validation function
const validateMeasurement = (
  field: 'inseam' | 'torso' | 'armLength', 
  value: string, 
  units: 'metric' | 'imperial'
): MeasurementValidationResult => {
  // Check if input is empty
  if (!value || value.trim() === '') {
    return { isValid: false, valueInMm: null };
  }

  // Parse the numeric value
  const numValue = parseFloat(value.trim());
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      valueInMm: null, 
      error: `Please enter a valid number for ${field}` 
    };
  }

  // Check for negative values
  if (numValue <= 0) {
    return { 
      isValid: false, 
      valueInMm: null, 
      error: `${field} must be a positive number` 
    };
  }

  // Convert to millimeters for validation
  const valueInMm = units === 'imperial' ? numValue * 25.4 : numValue * 10;
  const range = validationRanges[field];

  // Check realistic ranges
  if (valueInMm < range.min || valueInMm > range.max) {
    const minDisplay = units === 'imperial' ? 
      (range.min / 25.4).toFixed(1) : (range.min / 10).toFixed(1);
    const maxDisplay = units === 'imperial' ? 
      (range.max / 25.4).toFixed(1) : (range.max / 10).toFixed(1);
    const unitLabel = units === 'imperial' ? 'inches' : 'cm';
    
    return { 
      isValid: false, 
      valueInMm: null, 
      error: `${field} must be between ${minDisplay} and ${maxDisplay} ${unitLabel}` 
    };
  }

  return { isValid: true, valueInMm: Math.round(valueInMm) };
};

// Bike fit calculation methods and formulas
const bikeFitCalculations: BikeFitCalculations = {
  // Saddle height calculations using different methods
  saddleHeight: {
    lemond: (inseam: number) => inseam * 0.883,
    holmes: (inseam: number) => inseam * 0.885,
    hamley: (inseam: number) => inseam * 1.09,
    competitive: (inseam: number) => inseam * 0.875
  },
  
  // Reach calculations based on torso and arm length
  reach: (torso: number, armLength: number, flexibility: FlexibilityLevel, ridingStyle: RidingStyle) => {
    const baseReach = torso * 0.47 + armLength * 0.15;
    const flexibilityFactor = {
      low: 0.92,
      average: 1.0,
      high: 1.08
    }[flexibility] || 1.0;
    
    const styleFactor = {
      comfort: 0.90,
      endurance: 0.95,
      sport: 1.0,
      aggressive: 1.05,
      racing: 1.08
    }[ridingStyle] || 1.0;
    
    return baseReach * flexibilityFactor * styleFactor;
  },
  
  // Stack calculations for handlebar height
  stack: (torso: number, flexibility: FlexibilityLevel, ridingStyle: RidingStyle, experience: ExperienceLevel) => {
    const baseStack = torso * 0.48;
    
    const flexibilityFactor = {
      low: 1.15,
      average: 1.08,
      high: 1.0
    }[flexibility] || 1.08;
    
    const styleFactor = {
      comfort: 1.20,
      endurance: 1.10,
      sport: 1.0,
      aggressive: 0.92,
      racing: 0.85
    }[ridingStyle] || 1.0;
    
    const experienceFactor = {
      beginner: 1.10,
      intermediate: 1.05,
      advanced: 1.0,
      professional: 0.95
    }[experience] || 1.0;
    
    return baseStack * flexibilityFactor * styleFactor * experienceFactor;
  }
};

export default function BikeFit(): ReactElement {
  // Body measurements state
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    inseam: null,
    torso: null,
    armLength: null,
    flexibility: 'average',
    ridingStyle: 'endurance',
    experience: 'intermediate',
    units: 'metric'
  });

  // Temporary display values for inputs during typing
  const [displayValues, setDisplayValues] = useState<{[key: string]: string}>({
    inseam: '',
    torso: '',
    armLength: ''
  });

  // Results state
  const [results, setResults] = useState<BikeFitResults | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Calculate bike fit when measurements change
  useEffect(() => {
    const { inseam, torso, armLength, flexibility, ridingStyle, experience } = measurements;
    
    // Only calculate if all measurements are valid numbers
    if (inseam !== null && torso !== null && armLength !== null && 
        inseam > 0 && torso > 0 && armLength > 0) {
      
      try {
        const calculatedStack = bikeFitCalculations.stack(torso, flexibility, ridingStyle, experience);
        
        const newResults: BikeFitResults = {
          saddleHeight: {
            lemond: bikeFitCalculations.saddleHeight.lemond(inseam),
            holmes: bikeFitCalculations.saddleHeight.holmes(inseam),
            hamley: bikeFitCalculations.saddleHeight.hamley(inseam),
            competitive: bikeFitCalculations.saddleHeight.competitive(inseam)
          },
          reach: bikeFitCalculations.reach(torso, armLength, flexibility, ridingStyle),
          stack: calculatedStack,
          handlebarDrop: {
            comfort: calculatedStack - 20,
            sport: calculatedStack - 40,
            aggressive: calculatedStack - 60
          }
        };
        
        setResults(newResults);
      } catch (error) {
        console.error('Bike fit calculation error:', error);
        setResults(null);
        toast.error('Calculation error. Please check your measurements.');
      }
    } else {
      // Clear results if measurements are incomplete
      setResults(null);
    }
  }, [measurements]);

  const handleMeasurementChange = (field: keyof BodyMeasurements, value: any) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatMeasurement = (value: number, showMm: boolean = true): string => {
    if (!value || isNaN(value)) return '--';
    
    if (measurements.units === 'imperial') {
      const inches = value / 25.4;
      return `${inches.toFixed(1)}"`;
    }
    
    return showMm ? `${Math.round(value)}mm` : `${(value / 10).toFixed(1)}cm`;
  };

  const convertToDisplayUnits = (mm: number | null): string => {
    if (mm === null) return '';
    if (measurements.units === 'imperial') {
      return (mm / 25.4).toFixed(1);
    }
    // For metric, show whole numbers when possible, otherwise 1 decimal
    const cm = mm / 10;
    return cm % 1 === 0 ? cm.toString() : cm.toFixed(1);
  };

  const getUnitLabel = (): string => {
    return measurements.units === 'imperial' ? 'inches' : 'cm';
  };

  const handleInputChange = (field: 'inseam' | 'torso' | 'armLength', value: string): void => {
    // Update display value immediately so user sees what they're typing
    setDisplayValues(prev => ({ ...prev, [field]: value }));

    // If input is empty, set to null
    if (!value || value.trim() === '') {
      handleMeasurementChange(field, null);
      return;
    }

    // Additional NaN protection and input sanitization
    const numValue = parseFloat(value.trim());
    if (isNaN(numValue) || !isFinite(numValue)) {
      // Only show error for clearly invalid input (not incomplete numbers)
      if (value.trim().length > 0 && !value.match(/^\d*\.?\d*$/)) {
        toast.error(`Please enter a valid number for ${field}`);
      }
      return;
    }

    // Try to validate and store the value
    const validation = validateMeasurement(field, value, measurements.units);
    
    if (validation.isValid && validation.valueInMm !== null) {
      // Valid input - store the value in mm
      handleMeasurementChange(field, validation.valueInMm);
    }
    // For invalid/incomplete input, don't show validation errors during typing
    // The display value is already updated above, validation will happen on blur
  };

  const handleInputBlur = (field: 'inseam' | 'torso' | 'armLength', value: string): void => {
    // Clear the display value since we're done typing
    setDisplayValues(prev => ({ ...prev, [field]: '' }));

    // Only validate on blur if there's actually a value
    if (!value || value.trim() === '') {
      return;
    }

    const numValue = parseFloat(value.trim());
    if (isNaN(numValue) || !isFinite(numValue)) {
      toast.error(`Please enter a valid number for ${field}`);
      return;
    }

    // Validate the final input
    const validation = validateMeasurement(field, value, measurements.units);
    
    if (validation.isValid && validation.valueInMm !== null) {
      // Valid input - store the value in mm
      handleMeasurementChange(field, validation.valueInMm);
    } else if (validation.error) {
      // Show validation error on blur
      toast.error(validation.error);
    }
  };

  const resetCalculator = (): void => {
    setMeasurements({
      inseam: null,
      torso: null,
      armLength: null,
      flexibility: 'average',
      ridingStyle: 'endurance',
      experience: 'intermediate',
      units: 'metric'
    });
    setResults(null);
    toast.info('Calculator reset successfully');
  };

  return (
    <>
      <Head>
        <title>Professional Bike Fit Calculator | Body Measurements to Bike Setup | CrankSmith</title>
        <meta name="description" content="Free professional bike fit calculator. Calculate optimal saddle height, reach, and stack based on your body measurements. LeMond, Holmes, Hamley methods. Perfect bike fitting for road, mountain, gravel bikes." />
        <meta name="keywords" content="bike fit calculator, bike fitting, saddle height calculator, bike reach calculator, bike stack calculator, LeMond method, Holmes method, bike fit measurements, bicycle fitting, bike position calculator, cycling fit, bike geometry calculator" />
        
        {/* Structured Data for Bike Fit Calculator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Professional Bike Fit Calculator",
              "description": "Calculate optimal saddle height, reach, and stack based on your body measurements using professional bike fitting methods",
              "url": "https://cranksmith.com/bike-fit",
              "applicationCategory": "Sports & Recreation",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Saddle Height Calculation (LeMond Method)",
                "Saddle Height Calculation (Holmes Method)", 
                "Saddle Height Calculation (Hamley Method)",
                "Saddle Height Calculation (Competitive Method)",
                "Reach Calculation",
                "Stack Calculation",
                "Dual Unit Support (Metric/Imperial)",
                "Real-time Calculations"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Cyclists, Bike Fitters, Bike Shops"
              },
              "creator": {
                "@type": "Organization",
                "name": "CrankSmith",
                "url": "https://cranksmith.com"
              },
              "mainEntity": {
                "@type": "HowTo",
                "name": "How to Calculate Bike Fit Measurements",
                "description": "Step-by-step guide to calculate optimal bike fit using body measurements",
                "step": [
                  {
                    "@type": "HowToStep",
                    "name": "Measure Inseam",
                    "text": "Measure from floor to crotch while barefoot"
                  },
                  {
                    "@type": "HowToStep", 
                    "name": "Measure Torso",
                    "text": "Measure from shoulder to hip bone"
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Measure Arm Length", 
                    "text": "Measure from shoulder to fingertip"
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Select Riding Style",
                    "text": "Choose from comfort, endurance, sport, aggressive, or racing"
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Get Results",
                    "text": "View calculated saddle height, reach, and stack measurements"
                  }
                ]
              },
              "keywords": "bike fit calculator, bike fitting, saddle height calculator, bike measurements",
              "inLanguage": "en-US",
              "isAccessibleForFree": true
            })
          }}
        />
        
        {/* Open Graph for Bike Fit */}
        <meta property="og:title" content="Professional Bike Fit Calculator | Body Measurements to Bike Setup | CrankSmith" />
        <meta property="og:description" content="Free professional bike fit calculator. Calculate optimal saddle height, reach, and stack based on your body measurements. LeMond, Holmes, Hamley methods." />
        <meta property="og:url" content="https://cranksmith.com/bike-fit" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cranksmith.com/og-bike-fit.jpg" />
        
        {/* Twitter Card for Bike Fit */}
        <meta name="twitter:title" content="Professional Bike Fit Calculator | Body Measurements to Bike Setup" />
        <meta name="twitter:description" content="Free professional bike fit calculator. Calculate optimal saddle height, reach, and stack based on your body measurements." />
        <meta name="twitter:image" content="https://cranksmith.com/og-bike-fit.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://cranksmith.com/bike-fit" />
      </Head>

      <Layout>
        <div className="bg-[var(--bg-primary)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Bike Fit Calculator
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Calculate optimal saddle height, reach, and stack based on your body measurements. 
                  Get professional bike fitting recommendations tailored to your riding style.
                </p>
                
                {/* Quick stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold">4 Methods</div>
                    <div className="text-blue-100">Saddle height calculations</div>
                  </div>
                  <div className="bg-blue-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold">5 Styles</div>
                    <div className="text-blue-100">Riding position options</div>
                  </div>
                  <div className="bg-blue-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold">Instant</div>
                    <div className="text-blue-100">Real-time calculations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <ErrorBoundary context="bike-fit">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Input Panel */}
                  <div className="lg:col-span-1">
                    <div className="card sticky top-4">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                          Body Measurements
                        </h2>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMeasurementChange('units', measurements.units === 'metric' ? 'imperial' : 'metric')}
                            className="px-3 py-1 text-sm rounded-md border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            {measurements.units === 'metric' ? 'cm' : 'in'}
                          </button>
                          <button
                            onClick={resetCalculator}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Basic Measurements */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Inseam Length ({getUnitLabel()})
                          </label>
                          <input
                            type="number"
                            value={displayValues.inseam || convertToDisplayUnits(measurements.inseam)}
                            onChange={(e) => handleInputChange('inseam', e.target.value)}
                            onBlur={(e) => handleInputBlur('inseam', e.target.value)}
                            className="input-field w-full"
                            placeholder={`Enter inseam in ${getUnitLabel()}`}
                            step={measurements.units === 'metric' ? "1" : "0.5"}
                            min={measurements.units === 'metric' ? "25" : "9.8"}
                            max={measurements.units === 'metric' ? "120" : "47.2"}
                          />
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Measure from floor to crotch while barefoot
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Torso Length ({getUnitLabel()})
                          </label>
                          <input
                            type="number"
                            value={displayValues.torso || convertToDisplayUnits(measurements.torso)}
                            onChange={(e) => handleInputChange('torso', e.target.value)}
                            onBlur={(e) => handleInputBlur('torso', e.target.value)}
                            className="input-field w-full"
                            placeholder={`Enter torso in ${getUnitLabel()}`}
                            step={measurements.units === 'metric' ? "1" : "0.5"}
                            min={measurements.units === 'metric' ? "20" : "7.9"}
                            max={measurements.units === 'metric' ? "85" : "33.5"}
                          />
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            From shoulder to hip bone
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Arm Length ({getUnitLabel()})
                          </label>
                          <input
                            type="number"
                            value={displayValues.armLength || convertToDisplayUnits(measurements.armLength)}
                            onChange={(e) => handleInputChange('armLength', e.target.value)}
                            onBlur={(e) => handleInputBlur('armLength', e.target.value)}
                            className="input-field w-full"
                            placeholder={`Enter arm length in ${getUnitLabel()}`}
                            step={measurements.units === 'metric' ? "1" : "0.5"}
                            min={measurements.units === 'metric' ? "20" : "7.9"}
                            max={measurements.units === 'metric' ? "95" : "37.4"}
                          />
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            From shoulder to fingertip
                          </p>
                        </div>

                        {/* Riding Characteristics */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Flexibility Level
                          </label>
                          <select
                            value={measurements.flexibility}
                            onChange={(e) => handleMeasurementChange('flexibility', e.target.value)}
                            className="input-field w-full"
                          >
                            <option value="low">Low - Limited flexibility</option>
                            <option value="average">Average - Normal flexibility</option>
                            <option value="high">High - Very flexible</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Riding Style
                          </label>
                          <select
                            value={measurements.ridingStyle}
                            onChange={(e) => handleMeasurementChange('ridingStyle', e.target.value)}
                            className="input-field w-full"
                          >
                            <option value="comfort">Comfort - Upright, relaxed</option>
                            <option value="endurance">Endurance - Balanced performance</option>
                            <option value="sport">Sport - Performance oriented</option>
                            <option value="aggressive">Aggressive - Racing position</option>
                            <option value="racing">Racing - Maximum aerodynamics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Experience Level
                          </label>
                          <select
                            value={measurements.experience}
                            onChange={(e) => handleMeasurementChange('experience', e.target.value)}
                            className="input-field w-full"
                          >
                            <option value="beginner">Beginner - New to cycling</option>
                            <option value="intermediate">Intermediate - Regular rider</option>
                            <option value="advanced">Advanced - Experienced cyclist</option>
                            <option value="professional">Professional - Competitive racer</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="lg:col-span-2">
                    {results ? (
                      <div className="space-y-6">
                        
                        {/* Saddle Height Results */}
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                            <span className="text-blue-500">📏</span>
                            Saddle Height Recommendations
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                              <div className="text-sm text-[var(--text-secondary)] mb-1">LeMond Method (Recommended)</div>
                              <div className="text-2xl font-bold text-[var(--text-primary)]">
                                {formatMeasurement(results.saddleHeight.lemond)}
                              </div>
                              <div className="text-xs text-[var(--text-secondary)] mt-1">
                                Most widely used formula
                              </div>
                            </div>
                            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                              <div className="text-sm text-[var(--text-secondary)] mb-1">Holmes Method</div>
                              <div className="text-xl font-semibold text-[var(--text-primary)]">
                                {formatMeasurement(results.saddleHeight.holmes)}
                              </div>
                              <div className="text-xs text-[var(--text-secondary)] mt-1">
                                Alternative calculation
                              </div>
                            </div>
                            {showAdvanced && (
                              <>
                                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                                  <div className="text-sm text-[var(--text-secondary)] mb-1">Hamley Method</div>
                                  <div className="text-xl font-semibold text-[var(--text-primary)]">
                                    {formatMeasurement(results.saddleHeight.hamley)}
                                  </div>
                                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                                    109% of inseam
                                  </div>
                                </div>
                                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                                  <div className="text-sm text-[var(--text-secondary)] mb-1">Competitive Method</div>
                                  <div className="text-xl font-semibold text-[var(--text-primary)]">
                                    {formatMeasurement(results.saddleHeight.competitive)}
                                  </div>
                                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                                    For racing positions
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              💡 <strong>Tip:</strong> Start with the LeMond method and adjust ±5-10mm based on comfort and pedaling efficiency.
                            </p>
                          </div>
                        </div>

                        {/* Reach and Stack Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="card">
                            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                              <span className="text-green-500">↔️</span>
                              Reach
                            </h3>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                {formatMeasurement(results.reach)}
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                Horizontal distance from saddle to handlebars
                              </div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Riding Style:</span>
                                <span className="capitalize font-medium">{measurements.ridingStyle}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Flexibility:</span>
                                <span className="capitalize font-medium">{measurements.flexibility}</span>
                              </div>
                            </div>
                          </div>

                          <div className="card">
                            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                              <span className="text-purple-500">↕️</span>
                              Stack
                            </h3>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                {formatMeasurement(results.stack)}
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                Vertical distance from bottom bracket to handlebars
                              </div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Experience:</span>
                                <span className="capitalize font-medium">{measurements.experience}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Style Factor:</span>
                                <span className="capitalize font-medium">{measurements.ridingStyle}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Recommendations */}
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                            <span className="text-orange-500">🎯</span>
                            Additional Recommendations
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                              <div className="text-sm text-[var(--text-secondary)] mb-1">Handlebar Drop (Comfort)</div>
                              <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {formatMeasurement(results.handlebarDrop.comfort)}
                              </div>
                            </div>
                            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                              <div className="text-sm text-[var(--text-secondary)] mb-1">Handlebar Drop (Sport)</div>
                              <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {formatMeasurement(results.handlebarDrop.sport)}
                              </div>
                            </div>
                            <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                              <div className="text-sm text-[var(--text-secondary)] mb-1">Handlebar Drop (Aggressive)</div>
                              <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {formatMeasurement(results.handlebarDrop.aggressive)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes:</h4>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                              <li>• These are starting point recommendations - fine-tuning is essential</li>
                              <li>• Consider professional bike fitting for optimal results</li>
                              <li>• Make small adjustments (2-3mm) and test over multiple rides</li>
                              <li>• Account for saddle tilt, cleat position, and handlebar width</li>
                            </ul>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="card">
                        <div className="text-center py-16">
                          <div className="text-6xl mb-4">🚴‍♂️</div>
                          <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
                            Enter Your Measurements
                          </h3>
                          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                            Fill in your body measurements on the left to get personalized bike fit recommendations.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}