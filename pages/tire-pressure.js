import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TirePressure() {
  const [riderWeight, setRiderWeight] = useState('');
  const [bikeWeight, setBikeWeight] = useState('');
  const [tireWidth, setTireWidth] = useState('');
  const [surfaceType, setSurfaceType] = useState('road');
  const [isTubeless, setIsTubeless] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState('dry');
  const [ridingStyle, setRidingStyle] = useState('normal');
  const [pressure, setPressure] = useState({
    base: null,
    ranges: {
      comfort: null,
      balanced: null,
      performance: null
    }
  });
  const [weightUnit, setWeightUnit] = useState('lb');
  const [wheelSize, setWheelSize] = useState('700c');

  const convertWeight = (weight, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === 'kg' && toUnit === 'lb') return weight * 2.20462;
    if (fromUnit === 'lb' && toUnit === 'kg') return weight / 2.20462;
    return weight;
  };

  const calculatePressure = () => {
    const riderWeightKg = convertWeight(Number(riderWeight), weightUnit, 'kg');
    const bikeWeightKg = convertWeight(Number(bikeWeight), weightUnit, 'kg');
    const totalWeightKg = riderWeightKg + bikeWeightKg;
    const totalWeightLb = totalWeightKg * 2.20462;
    let minPSI = 0;
    let maxPSI = 0;
    let basePSI = 0;
    let width = Number(tireWidth);

    // Wheel size adjustment factor
    let wheelSizeFactor = 0;
    if (surfaceType === 'mtb') {
      switch (wheelSize) {
        case '29': wheelSizeFactor = 0; break;    // Base case
        case '27.5': wheelSizeFactor = 2; break;  // +2 PSI
        case '26': wheelSizeFactor = 4; break;    // +4 PSI
      }
    } else {
      switch (wheelSize) {
        case '700c': wheelSizeFactor = 0; break;  // Base case
        case '650b': wheelSizeFactor = 2; break;  // +2 PSI
      }
    }

    if (surfaceType === 'road') {
      // Road tires: 23–32mm
      if (width <= 25) {
        basePSI = 100;
        basePSI += ((totalWeightLb - 150) / 10) * 5; // 5 PSI per 10 lbs above/below 150
        minPSI = 85;
        maxPSI = 110;
      } else if (width <= 32) {
        basePSI = 75;
        basePSI += ((totalWeightLb - 150) / 10) * 5;
        minPSI = 60;
        maxPSI = 85;
      } else {
        basePSI = 70;
        minPSI = 60;
        maxPSI = 85;
      }
    } else if (surfaceType === 'gravel') {
      // Gravel tires: 38–50mm
      if (width <= 42) {
        basePSI = 38;
        basePSI += ((totalWeightLb - 160) / 10) * 2; // 2 PSI per 10 lbs above/below 160
        minPSI = 32;
        maxPSI = 45;
      } else {
        basePSI = 32;
        basePSI += ((totalWeightLb - 160) / 10) * 2;
        minPSI = 28;
        maxPSI = 38;
      }
    } else if (surfaceType === 'mtb') {
      // MTB tires: 2.2–2.6"
      if (width <= 2.3) {
        basePSI = 25;
        basePSI += ((totalWeightLb - 170) / 10) * 1; // 1 PSI per 10 lbs above/below 170
        minPSI = 22;
        maxPSI = 28;
      } else {
        basePSI = 21;
        basePSI += ((totalWeightLb - 170) / 10) * 1;
        minPSI = 18;
        maxPSI = 25;
      }
    }

    // Apply wheel size adjustment
    basePSI += wheelSizeFactor;
    minPSI += wheelSizeFactor;
    maxPSI += wheelSizeFactor;

    // Tubeless adjustment
    if (isTubeless) basePSI -= 2;
    // Weather adjustment
    if (weatherCondition === 'wet' || weatherCondition === 'muddy') basePSI -= 2;
    // Riding style adjustment
    if (ridingStyle === 'aggressive' || ridingStyle === 'racing') basePSI += 2;
    if (ridingStyle === 'comfort') basePSI -= 2;

    // Clamp to min/max
    basePSI = Math.max(minPSI, Math.min(maxPSI, basePSI));
    
    // Calculate ranges
    const range = maxPSI - minPSI;
    const comfortPSI = Math.round(minPSI + (range * 0.2));
    const balancedPSI = Math.round(minPSI + (range * 0.5));
    const performancePSI = Math.round(minPSI + (range * 0.8));
    
    setPressure({
      base: Math.round(basePSI),
      ranges: {
        comfort: comfortPSI,
        balanced: balancedPSI,
        performance: performancePSI
      }
    });
  };

  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>Tire Pressure Calculator | CrankSmith</title>
        <meta name="description" content="Calculate optimal tire pressure for your bike based on weight, conditions, and riding style" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="hero-title text-4xl font-bold mb-8">Tire Pressure Calculator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weight Unit
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setWeightUnit('kg')}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      weightUnit === 'kg'
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                  <button
                    onClick={() => setWeightUnit('lb')}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      weightUnit === 'lb'
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Pounds (lb)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rider Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  value={riderWeight}
                  onChange={(e) => setRiderWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                  placeholder={`Enter weight in ${weightUnit}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bike Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  value={bikeWeight}
                  onChange={(e) => setBikeWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                  placeholder={`Enter weight in ${weightUnit}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tire Width (mm)
                </label>
                <input
                  type="number"
                  value={tireWidth}
                  onChange={(e) => setTireWidth(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                  placeholder="Enter tire width"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Surface Type
                </label>
                <select
                  value={surfaceType}
                  onChange={(e) => setSurfaceType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                >
                  <option value="road">Road</option>
                  <option value="gravel">Gravel</option>
                  <option value="mtb">Mountain Bike</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Setup
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsTubeless(true)}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      isTubeless
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Tubeless
                  </button>
                  <button
                    onClick={() => setIsTubeless(false)}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      !isTubeless
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Tubes
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weather
                </label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                >
                  <option value="dry">Dry</option>
                  <option value="wet">Wet</option>
                  <option value="muddy">Muddy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Riding Style
                </label>
                <select
                  value={ridingStyle}
                  onChange={(e) => setRidingStyle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35] focus:ring-opacity-20"
                >
                  <option value="comfort">Comfort</option>
                  <option value="normal">Normal</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <button
                onClick={calculatePressure}
                className="px-8 py-4 rounded-xl font-medium transition-all text-lg"
                style={{ 
                  background: 'var(--accent-blue)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0, 115, 230, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 115, 230, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 115, 230, 0.2)';
                }}
              >
                Calculate
              </button>
            </div>

            <div className="space-y-6">
              {pressure && (
                <>
                  <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                    <h2 className="text-2xl font-bold text-[var(--accent-blue)] mb-4">Recommended Pressure</h2>
                    <div className="text-4xl font-bold text-white mb-2">
                      {pressure.base} PSI
                    </div>
                    <div className="text-sm text-gray-400">
                      Range: {pressure.ranges.comfort}–{pressure.ranges.performance} PSI
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                      <h3 className="text-lg font-semibold text-[var(--accent-blue)] mb-2">Comfort Range</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {pressure.ranges.comfort} PSI
                      </div>
                      <p className="text-sm text-gray-400">
                        Maximum grip and comfort, ideal for rough terrain and long rides
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                      <h3 className="text-lg font-semibold text-[var(--accent-blue)] mb-2">Balanced Range</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {pressure.ranges.balanced} PSI
                      </div>
                      <p className="text-sm text-gray-400">
                        Optimal balance of grip, comfort, and rolling efficiency
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                      <h3 className="text-lg font-semibold text-[var(--accent-blue)] mb-2">Performance Range</h3>
                      <div className="text-2xl font-bold text-white mb-1">
                        {pressure.ranges.performance} PSI
                      </div>
                      <p className="text-sm text-gray-400">
                        Maximum efficiency and speed, ideal for smooth surfaces
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 