// Constants
export const CADENCE_RPM = 90
export const MM_TO_KM = 1e-6
export const KMH_TO_MPH = 0.621371

// Wheel sizes in mm (ISO standard)
export const WHEEL_SIZES = {
  '700c': 622,
  '650b': 584,
  '26-inch': 559,
  '27.5-inch': 584,
  '29-inch': 622
}

// Calculate wheel circumference in mm
export function calculateWheelCircumference(wheelSize, tireWidth) {
  const rimDiameter = WHEEL_SIZES[wheelSize]
  if (!rimDiameter) throw new Error(`Invalid wheel size: ${wheelSize}`)
  
  const totalDiameter = rimDiameter + (2 * parseFloat(tireWidth))
  return Math.PI * totalDiameter
}

// Calculate gear ratio
export function calculateGearRatio(chainringTeeth, cogTeeth) {
  return chainringTeeth / cogTeeth
}

// Calculate speed at given cadence
export function calculateSpeed(gearRatio, wheelCircumference, unit = 'KMH') {
  const distancePerRevolution = gearRatio * wheelCircumference
  const speedKmh = distancePerRevolution * CADENCE_RPM * MM_TO_KM * 60
  
  if (unit === 'MPH') {
    return (speedKmh * KMH_TO_MPH).toFixed(1)
  }
  return speedKmh.toFixed(1)
}

// Calculate gear inches
export function calculateGearInches(gearRatio, wheelSize, tireWidth) {
  const wheelDiameterMm = WHEEL_SIZES[wheelSize] + (2 * parseFloat(tireWidth))
  const wheelDiameterInches = wheelDiameterMm / 25.4
  return gearRatio * wheelDiameterInches
}

// Check derailleur compatibility
export function checkDerailleurCompatibility(crankset, cassette) {
  const warnings = []
  const maxCog = Math.max(...cassette.teeth)
  const minCog = Math.min(...cassette.teeth)
  const maxChainring = Math.max(...crankset.teeth)
  const minChainring = Math.min(...crankset.teeth)
  
  // Total capacity calculation
  const totalCapacity = (maxChainring - minChainring) + (maxCog - minCog)
  
  if (maxCog > 34) {
    warnings.push(`Large cassette (${maxCog}T) may require long-cage derailleur`)
  }
  
  if (totalCapacity > 37) {
    warnings.push(`Total capacity (${totalCapacity}T) exceeds standard derailleur limits`)
  }
  
  // Chain line issues
  const extremeRatio = minChainring / maxCog
  if (extremeRatio < 0.8) {
    warnings.push('Extreme gear ratios may cause chain line issues')
  }
  
  return warnings
}

// Compare two setups
export function compareSetups(currentSetup, proposedSetup, speedUnit = 'KMH') {
  const currentWheelCircumference = calculateWheelCircumference(currentSetup.wheel, currentSetup.tire)
  const proposedWheelCircumference = calculateWheelCircumference(proposedSetup.wheel, proposedSetup.tire)
  
  // Calculate gear ratios
  const currentHighRatio = calculateGearRatio(
    currentSetup.crankset.teeth[0], 
    currentSetup.cassette.teeth[0]
  )
  const proposedHighRatio = calculateGearRatio(
    proposedSetup.crankset.teeth[0], 
    proposedSetup.cassette.teeth[0]
  )
  
  const currentLowRatio = calculateGearRatio(
    currentSetup.crankset.teeth[currentSetup.crankset.teeth.length - 1], 
    currentSetup.cassette.teeth[currentSetup.cassette.teeth.length - 1]
  )
  const proposedLowRatio = calculateGearRatio(
    proposedSetup.crankset.teeth[proposedSetup.crankset.teeth.length - 1], 
    proposedSetup.cassette.teeth[proposedSetup.cassette.teeth.length - 1]
  )
  
  // Calculate weights
  const currentWeight = currentSetup.crankset.weight + currentSetup.cassette.weight + 257 + 232 // Chain + derailleur
  const proposedWeight = proposedSetup.crankset.weight + proposedSetup.cassette.weight + 257 + 232
  
  // Calculate gear ranges (cassette range as percentage) - Fixed to use industry standard formula
  const currentGearRange = (((currentSetup.cassette.teeth[currentSetup.cassette.teeth.length - 1] / currentSetup.cassette.teeth[0]) - 1) * 100).toFixed(0)
  const proposedGearRange = (((proposedSetup.cassette.teeth[proposedSetup.cassette.teeth.length - 1] / proposedSetup.cassette.teeth[0]) - 1) * 100).toFixed(0)
  
  return {
    current: {
      metrics: {
        highSpeed: calculateSpeed(currentHighRatio, currentWheelCircumference, speedUnit),
        lowSpeed: calculateSpeed(currentLowRatio, currentWheelCircumference, speedUnit),
        highRatio: currentHighRatio.toFixed(2),
        lowRatio: currentLowRatio.toFixed(2),
        gearRange: currentGearRange
      },
      totalWeight: currentWeight,
      gearRange: currentGearRange,
      warnings: checkDerailleurCompatibility(currentSetup.crankset, currentSetup.cassette),
    },
    proposed: {
      metrics: {
        highSpeed: calculateSpeed(proposedHighRatio, proposedWheelCircumference, speedUnit),
        lowSpeed: calculateSpeed(proposedLowRatio, proposedWheelCircumference, speedUnit),
        highRatio: proposedHighRatio.toFixed(2),
        lowRatio: proposedLowRatio.toFixed(2),
        gearRange: proposedGearRange
      },
      totalWeight: proposedWeight,
      gearRange: proposedGearRange,
      warnings: checkDerailleurCompatibility(proposedSetup.crankset, proposedSetup.cassette),
    },
    comparison: {
      weightChange: proposedWeight - currentWeight,
      speedGain: parseFloat(calculateSpeed(proposedHighRatio, proposedWheelCircumference, speedUnit)) - parseFloat(calculateSpeed(currentHighRatio, currentWheelCircumference, speedUnit)),
      climbingImprovement: currentLowRatio - proposedLowRatio,
      rangeIncrease: parseInt(proposedGearRange) - parseInt(currentGearRange),
      speedUnit: speedUnit
    },
  }
}