import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Head>
        <title>Tire Pressure Calculator | CrankSmith</title>
        <meta name="description" content="Calculate optimal tire pressure for your bike based on weight, conditions, and riding style" />
      </Head>

      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">CrankSmith</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/calculator" className="text-gray-300 hover:text-white">
                Gear Calculator
              </Link>
              <Link href="/tire-pressure" className="text-white font-medium">
                Tire Pressure
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Tire Pressure Calculator</h1>
          
          <div className="bg-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex justify-end mb-4">
              <div className="flex rounded-xl p-1" 
                   style={{ 
                     background: 'var(--surface-primary)', 
                     border: '1px solid var(--border-subtle)' 
                   }}>
                {['kg', 'lb'].map(unit => (
                  <button
                    key={unit}
                    onClick={() => setWeightUnit(unit)}
                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      weightUnit === unit 
                        ? 'text-white shadow-sm' 
                        : 'hover:opacity-70'
                    }`}
                    style={{
                      background: weightUnit === unit 
                        ? 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' 
                        : 'transparent',
                      color: weightUnit === unit ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {unit.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rider Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  value={riderWeight}
                  onChange={(e) => setRiderWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter your weight in ${weightUnit}`}
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
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter bike weight in ${weightUnit}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Surface Type
              </label>
              <select
                value={surfaceType}
                onChange={(e) => {
                  setSurfaceType(e.target.value);
                  // Reset tire width when surface type changes
                  setTireWidth('');
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="road">Road</option>
                <option value="gravel">Gravel</option>
                <option value="mtb">Mountain Bike</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tire Width {surfaceType === 'mtb' ? '(inches)' : '(mm)'}
              </label>
              {surfaceType === 'mtb' ? (
                <select
                  value={tireWidth}
                  onChange={(e) => setTireWidth(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tire width</option>
                  <option value="2.2">2.2"</option>
                  <option value="2.25">2.25"</option>
                  <option value="2.3">2.3"</option>
                  <option value="2.35">2.35"</option>
                  <option value="2.4">2.4"</option>
                  <option value="2.5">2.5"</option>
                  <option value="2.6">2.6"</option>
                </select>
              ) : (
                <select
                  value={tireWidth}
                  onChange={(e) => setTireWidth(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tire width</option>
                  {surfaceType === 'road' ? (
                    <>
                      <option value="23">23mm</option>
                      <option value="25">25mm</option>
                      <option value="28">28mm</option>
                      <option value="30">30mm</option>
                      <option value="32">32mm</option>
                    </>
                  ) : (
                    <>
                      <option value="38">38mm</option>
                      <option value="40">40mm</option>
                      <option value="42">42mm</option>
                      <option value="45">45mm</option>
                      <option value="47">47mm</option>
                      <option value="50">50mm</option>
                    </>
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wheel Size
              </label>
              <select
                value={wheelSize}
                onChange={(e) => setWheelSize(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {surfaceType === 'mtb' ? (
                  <>
                    <option value="29">29"</option>
                    <option value="27.5">27.5"</option>
                    <option value="26">26"</option>
                  </>
                ) : (
                  <>
                    <option value="700c">700c</option>
                    <option value="650b">650b</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="tubeless"
                checked={isTubeless}
                onChange={(e) => setIsTubeless(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="tubeless" className="ml-2 block text-sm text-gray-300">
                Tubeless Setup
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weather Condition
              </label>
              <select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="comfort">Comfort</option>
                <option value="normal">Normal</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <button
              onClick={calculatePressure}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Calculate Pressure
            </button>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Recommended Pressure</h2>
              {pressure.base ? (
                <>
                  <p className="text-3xl font-bold text-blue-400">{pressure.base} PSI</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Comfort Range:</span>
                      <span className="font-medium">{pressure.ranges.comfort} PSI</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Balanced Range:</span>
                      <span className="font-medium">{pressure.ranges.balanced} PSI</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Performance Range:</span>
                      <span className="font-medium">{pressure.ranges.performance} PSI</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    <p className="mb-2"><strong>Comfort Range:</strong> Better grip, smoother ride, more comfortable on rough terrain</p>
                    <p className="mb-2"><strong>Balanced Range:</strong> Good mix of comfort and performance, ideal for most riding</p>
                    <p><strong>Performance Range:</strong> Faster rolling, better cornering, more responsive handling</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-300">Enter your details above to calculate recommended pressure</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 