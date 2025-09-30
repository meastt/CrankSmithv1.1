// pages/bike-fit.tsx - Comprehensive bike fit calculator with TypeScript
import React, { useState, useEffect, ReactElement } from 'react';
import Head from 'next/head';
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

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
          {/* Header */}
          <div className="bg-gradient-to-br from-racing-red via-racing-orange to-steel-blue text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-racing-red/20 to-transparent"></div>
            <div className="container-responsive py-20 lg:py-32 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-6">
                  <span className="badge-racing-accent text-sm font-bold px-4 py-2 uppercase tracking-wider">
                    Professional Bike Fitting
                  </span>
                </div>
                <h1 className="text-responsive-6xl font-black mb-6 leading-tight">
                  Bike Fit <span className="text-gradient-racing">Calculator</span>
                </h1>
                <p className="text-responsive-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
                  Calculate optimal saddle height, reach, and stack based on your body measurements.
                  Get professional bike fitting recommendations tailored to your riding style.
                </p>
                
                {/* Quick stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                    <div className="text-3xl font-black text-white mb-2">4</div>
                    <div className="text-white/90 font-semibold">Methods</div>
                    <div className="text-white/70 text-sm mt-1">Saddle height calculations</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                    <div className="text-3xl font-black text-white mb-2">5</div>
                    <div className="text-white/90 font-semibold">Styles</div>
                    <div className="text-white/70 text-sm mt-1">Riding position options</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                    <div className="text-3xl font-black text-white mb-2">⚡</div>
                    <div className="text-white/90 font-semibold">Instant</div>
                    <div className="text-white/70 text-sm mt-1">Real-time calculations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-responsive py-8">
            <div className="max-w-6xl mx-auto">
              <ErrorBoundary context="bike-fit">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{minHeight: 'calc(100vh - 400px)'}}>
                  
                  {/* Input Panel */}
                  <div className="lg:col-span-1">
                    <div className="card-racing sticky top-4">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                          Body Measurements
                        </h2>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMeasurementChange('units', measurements.units === 'metric' ? 'imperial' : 'metric')}
                            className="px-3 py-1 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            {measurements.units === 'metric' ? 'cm' : 'in'}
                          </button>
                          <button
                            onClick={resetCalculator}
                            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Basic Measurements */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            Measure from floor to crotch while barefoot
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            From shoulder to hip bone
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            From shoulder to fingertip
                          </p>
                        </div>

                        {/* Riding Characteristics */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
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
                        <div className="card-racing border-l-4 border-l-racing-red">
                          <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                            <span className="text-2xl">📏</span>
                            <span>Saddle Height <span className="text-racing-red">Recommendations</span></span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">LeMond Method</div>
                                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">RECOMMENDED</span>
                              </div>
                              <div className="text-3xl font-black text-blue-800 dark:text-blue-200 mb-2">
                                {formatMeasurement(results.saddleHeight.lemond)}
                              </div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                Most widely used formula worldwide
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700 shadow-sm">
                              <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">Holmes Method</div>
                              <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                                {formatMeasurement(results.saddleHeight.holmes)}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                Alternative calculation method
                              </div>
                            </div>
                            {showAdvanced && (
                              <>
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700 shadow-sm">
                                  <div className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">Hamley Method</div>
                                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                                    {formatMeasurement(results.saddleHeight.hamley)}
                                  </div>
                                  <div className="text-xs text-orange-600 dark:text-orange-400">
                                    109% of inseam measurement
                                  </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700 shadow-sm">
                                  <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">Competitive Method</div>
                                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                                    {formatMeasurement(results.saddleHeight.competitive)}
                                  </div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400">
                                    Optimized for racing positions
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">💡</span>
                              <div>
                                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Pro Tip</div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Start with the LeMond method and adjust ±5-10mm based on comfort and pedaling efficiency. Test over multiple rides for optimal results.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reach and Stack Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="card-racing border-l-4 border-l-steel-blue">
                            <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                              <span className="text-2xl">↔️</span>
                              <span>Reach <span className="text-steel-blue">Calculation</span></span>
                            </h3>
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                              <div className="text-4xl font-black text-green-700 dark:text-green-300 mb-3">
                                {formatMeasurement(results.reach)}
                              </div>
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                Horizontal distance from saddle to handlebars
                              </div>
                            </div>
                            <div className="mt-6 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200/50 dark:border-green-700/30">
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-green-700 dark:text-green-300 font-medium">Riding Style:</span>
                                  <span className="capitalize font-bold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-800/50 px-2 py-1 rounded">{measurements.ridingStyle}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-green-700 dark:text-green-300 font-medium">Flexibility:</span>
                                  <span className="capitalize font-bold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-800/50 px-2 py-1 rounded">{measurements.flexibility}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card-racing border-l-4 border-l-racing-orange">
                            <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                              <span className="text-2xl">↕️</span>
                              <span>Stack <span className="text-racing-orange">Calculation</span></span>
                            </h3>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                              <div className="text-4xl font-black text-purple-700 dark:text-purple-300 mb-3">
                                {formatMeasurement(results.stack)}
                              </div>
                              <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                Vertical distance from bottom bracket to handlebars
                              </div>
                            </div>
                            <div className="mt-6 p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg border border-purple-200/50 dark:border-purple-700/30">
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-700 dark:text-purple-300 font-medium">Experience:</span>
                                  <span className="capitalize font-bold text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-800/50 px-2 py-1 rounded">{measurements.experience}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-700 dark:text-purple-300 font-medium">Style Factor:</span>
                                  <span className="capitalize font-bold text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-800/50 px-2 py-1 rounded">{measurements.ridingStyle}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Recommendations */}
                        <div className="card-racing border-l-4 border-l-warning-yellow">
                          <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                            <span className="text-2xl">🎯</span>
                            <span>Additional <span className="text-warning-yellow">Recommendations</span></span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                              <div className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">Handlebar Drop</div>
                              <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Comfort Position</div>
                              <div className="text-2xl font-black text-orange-800 dark:text-orange-200">
                                {formatMeasurement(results.handlebarDrop.comfort)}
                              </div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Handlebar Drop</div>
                              <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Sport Position</div>
                              <div className="text-2xl font-black text-yellow-800 dark:text-yellow-200">
                                {formatMeasurement(results.handlebarDrop.sport)}
                              </div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-700">
                              <div className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">Handlebar Drop</div>
                              <div className="text-sm text-red-600 dark:text-red-400 mb-1">Aggressive Position</div>
                              <div className="text-2xl font-black text-red-800 dark:text-red-200">
                                {formatMeasurement(results.handlebarDrop.aggressive)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                            <div className="flex items-start gap-4">
                              <span className="text-3xl">⚠️</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 text-lg">Important Professional Notes:</h4>
                                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                                  <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                                    <span>These are <strong>starting point recommendations</strong> - fine-tuning is essential</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                                    <span>Consider <strong>professional bike fitting</strong> for optimal results</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                                    <span>Make <strong>small adjustments (2-3mm)</strong> and test over multiple rides</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                                    <span>Account for <strong>saddle tilt, cleat position, and handlebar width</strong></span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="card-racing border-l-4 border-l-steel-blue">
                        <div className="text-center py-20">
                          <div className="mb-8">
                            <div className="text-8xl mb-4 animate-pulse">🚴‍♂️</div>
                            <div className="w-24 h-24 mx-auto bg-gradient-racing rounded-full flex items-center justify-center mb-4 shadow-lg">
                              <span className="text-4xl">📏</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                            Ready to Calculate Your <span className="text-racing-red">Perfect Fit</span>?
                          </h3>
                          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
                            Fill in your body measurements on the left to get personalized bike fit recommendations tailored to your riding style and experience level.
                          </p>
                          <div className="mt-8 flex justify-center">
                            <div className="bg-gradient-to-r from-racing-red/10 to-racing-orange/10 dark:from-racing-red/20 dark:to-racing-orange/20 px-6 py-3 rounded-full border border-racing-red/20 dark:border-racing-red/30">
                              <span className="text-racing-red dark:text-racing-red font-medium">
                                💡 Start by entering your inseam measurement
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </div>
    </>
  );
}