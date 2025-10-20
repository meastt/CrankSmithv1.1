// calculateRealPerformance.js - Real calculations using component data
export function calculateRealPerformance(currentSetup, proposedSetup, speedUnit = 'mph') {
  // REMOVED: Debug logging for production performance

  // Calculate current setup metrics
  const currentMetrics = calculateSetupMetrics(currentSetup, speedUnit);
  const proposedMetrics = calculateSetupMetrics(proposedSetup, speedUnit);

  // Calculate comparison
  const comparison = {
    speedChange: proposedMetrics.highSpeed - currentMetrics.highSpeed,
    weightChange: proposedMetrics.totalWeight - currentMetrics.totalWeight,
    rangeChange: proposedMetrics.gearRange - currentMetrics.gearRange,
    speedUnit: speedUnit
  };

  return {
    current: {
      metrics: {
        highSpeed: currentMetrics.highSpeed.toFixed(1),
        lowSpeed: currentMetrics.lowSpeed.toFixed(1),
        highRatio: currentMetrics.highRatio.toFixed(2),
        lowRatio: currentMetrics.lowRatio.toFixed(2)
      },
      totalWeight: currentMetrics.totalWeight,
      gearRange: currentMetrics.gearRange.toFixed(0),
      setup: currentSetup
    },
    proposed: {
      metrics: {
        highSpeed: proposedMetrics.highSpeed.toFixed(1),
        lowSpeed: proposedMetrics.lowSpeed.toFixed(1),
        highRatio: proposedMetrics.highRatio.toFixed(2),
        lowRatio: proposedMetrics.lowRatio.toFixed(2)
      },
      totalWeight: proposedMetrics.totalWeight,
      gearRange: proposedMetrics.gearRange.toFixed(0),
      setup: proposedSetup
    },
    comparison
  };
}

function calculateSetupMetrics(setup, speedUnit) {
  // Get component data
  const crankset = setup.crankset;
  const cassette = setup.cassette;
  const wheelSize = setup.wheel;
  const tireWidth = setup.tire;

  if (!crankset || !cassette || !wheelSize) {
    throw new Error('Missing required components for calculation');
  }

  // Calculate gear ratios
  const chainringTeeth = crankset.teeth || [];
  const cassetteRange = cassette.teeth || [11, 28]; // fallback

  // High gear = largest chainring / smallest cassette cog
  const highRatio = Math.max(...chainringTeeth) / Math.min(...cassetteRange);
  
  // Low gear = smallest chainring / largest cassette cog  
  const lowRatio = Math.min(...chainringTeeth) / Math.max(...cassetteRange);

  // Calculate wheel circumference (in meters)
  const wheelCircumference = getWheelCircumference(wheelSize, tireWidth);

  // Calculate speeds at 90 RPM
  const cadence = 90; // RPM
  const highSpeed = calculateSpeed(highRatio, cadence, wheelCircumference, speedUnit);
  const lowSpeed = calculateSpeed(lowRatio, cadence, wheelCircumference, speedUnit);

  // Calculate total weight
  const totalWeight = (crankset.weight || 0) + (cassette.weight || 0);

  // Calculate gear range percentage
  const gearRange = ((highRatio / lowRatio) - 1) * 100;

  return {
    highSpeed,
    lowSpeed,
    highRatio,
    lowRatio,
    totalWeight,
    gearRange
  };
}

function getWheelCircumference(wheelSize, tireWidth) {
  // Wheel diameter in mm, then add tire width to get total diameter
  const wheelDiameters = {
    '700c': 622,      // ISO 622mm
    '650b': 584,      // ISO 584mm  
    '29-inch': 622,   // Same as 700c
    '27.5-inch': 584, // Same as 650b
    '26-inch': 559    // ISO 559mm
  };

  const wheelDiameter = wheelDiameters[wheelSize] || 622; // Default to 700c
  const tireWidthNum = parseFloat(tireWidth) || 25; // Default to 25mm
  
  // Total diameter = wheel + (2 × tire width)
  const totalDiameter = wheelDiameter + (2 * tireWidthNum);
  
  // Circumference in meters
  return (totalDiameter * Math.PI) / 1000;
}

function calculateSpeed(gearRatio, cadenceRPM, wheelCircumference, speedUnit) {
  // Distance per revolution = gear ratio × wheel circumference
  const distancePerRev = gearRatio * wheelCircumference; // meters
  
  // Distance per minute = distance per rev × cadence
  const distancePerMinute = distancePerRev * cadenceRPM; // meters/minute
  
  // Convert to speed
  const speedMS = distancePerMinute / 60; // meters/second
  
  if (speedUnit.toLowerCase() === 'mph') {
    return speedMS * 2.237; // Convert to mph
  } else {
    return speedMS * 3.6; // Convert to km/h
  }
}

// Helper function to validate setup completeness
export function validateSetupComplete(setup) {
  const required = ['wheel', 'tire', 'crankset', 'cassette'];
  const missing = required.filter(field => {
    const value = setup[field];
    if (field === 'crankset' || field === 'cassette') {
      return !value || typeof value !== 'object' || !value.teeth;
    }
    return !value || (typeof value === 'string' && value.trim() === '');
  });

  const completion = ((required.length - missing.length) / required.length) * 100;

  return {
    isComplete: missing.length === 0,
    missing,
    completion
  };
} 