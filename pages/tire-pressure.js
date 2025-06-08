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
  const [pressure, setPressure] = useState(null);
  const [weightUnit, setWeightUnit] = useState('lb');

  const convertWeight = (weight, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === 'kg' && toUnit === 'lb') return weight * 2.20462;
    if (fromUnit === 'lb' && toUnit === 'kg') return weight / 2.20462;
    return weight;
  };

  const calculatePressure = () => {
    const riderWeightKg = convertWeight(Number(riderWeight), weightUnit, 'kg');
    const bikeWeightKg = convertWeight(Number(bikeWeight), weightUnit, 'kg');
    
    let basePressure = 0;
    
    const totalWeight = riderWeightKg + bikeWeightKg;
    
    switch (surfaceType) {
      case 'road':
        basePressure = totalWeight * 0.7;
        break;
      case 'gravel':
        basePressure = totalWeight * 0.6;
        break;
      case 'mtb':
        basePressure = totalWeight * 0.5;
        break;
    }

    const widthFactor = 1 - (Number(tireWidth) - 25) * 0.01;
    basePressure *= widthFactor;

    if (isTubeless) {
      basePressure *= 0.9;
    }

    switch (weatherCondition) {
      case 'wet':
        basePressure *= 0.95;
        break;
      case 'muddy':
        basePressure *= 0.9;
        break;
    }

    switch (ridingStyle) {
      case 'aggressive':
        basePressure *= 1.1;
        break;
      case 'comfort':
        basePressure *= 0.9;
        break;
    }

    setPressure(Math.round(basePressure));
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

            {pressure && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Recommended Pressure</h2>
                <p className="text-3xl font-bold text-blue-400">{pressure} PSI</p>
                <p className="mt-2 text-sm text-gray-300">
                  This is a starting point. Adjust based on feel and conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 