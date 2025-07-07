import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function TirePressure() {
  const [riderWeight, setRiderWeight] = useState('');
  const [bikeWeight, setBikeWeight] = useState('');
  const [tireWidth, setTireWidth] = useState('');
  const [surfaceType, setSurfaceType] = useState('road');
  const [isTubeless, setIsTubeless] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState('dry');
  const [ridingStyle, setRidingStyle] = useState('normal');
  const [pressure, setPressure] = useState({ base: null, front: null, rear: null, ranges: { comfort: null, balanced: null, performance: null } });
  const [weightUnit, setWeightUnit] = useState('lb');
  const [wheelSize, setWheelSize] = useState('700c');

  const convertWeight = (weight, fromUnit, toUnit) => { /* ... (no changes needed) ... */ };

  const calculatePressure = () => { /* ... (no changes needed in core logic) ... */ };

  useEffect(() => { /* ... (no changes needed) ... */ }, [pressure]);

  return (
    <div className="min-h-screen w-full">
      <SEOHead
        title="CrankSmith - Tire Pressure Calculator"
        description="Calculate optimal tire pressure for your bike based on weight, conditions, and riding style."
        url="https://cranksmith.com/tire-pressure"
        image="/og-image.jpg"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="hero-title text-4xl font-bold mb-4">Tire Pressure Calculator</h1>
          <p className="text-lg mb-8 max-w-2xl text-[var(--text-secondary)]">
            Get optimal tire pressure recommendations based on your weight, tire size, and riding conditions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* --- Input Fields --- */}
              <div>
                <label className="form-label">Weight Unit</label>
                <div className="flex space-x-4">
                  <button onClick={() => setWeightUnit('kg')} className={`flex-1 py-2 px-4 rounded-lg transition-all ${weightUnit === 'kg' ? 'btn-primary' : 'input-field hover:bg-[var(--bg-tertiary)]'}`}>Kilograms (kg)</button>
                  <button onClick={() => setWeightUnit('lb')} className={`flex-1 py-2 px-4 rounded-lg transition-all ${weightUnit === 'lb' ? 'btn-primary' : 'input-field hover:bg-[var(--bg-tertiary)]'}`}>Pounds (lb)</button>
                </div>
              </div>

              <div>
                <label className="form-label">Rider Weight ({weightUnit})</label>
                <input type="number" value={riderWeight} onChange={(e) => setRiderWeight(e.target.value)} className="input-field" placeholder={`Enter weight in ${weightUnit}`} />
              </div>

              <div>
                <label className="form-label">Bike Weight ({weightUnit})</label>
                <input type="number" value={bikeWeight} onChange={(e) => setBikeWeight(e.target.value)} className="input-field" placeholder={`Enter weight in ${weightUnit}`} />
              </div>

              <div>
                <label className="form-label">Tire Width {surfaceType === 'mtb' ? '(inches)' : '(mm)'}</label>
                <input type="number" step={surfaceType === 'mtb' ? '0.1' : '1'} value={tireWidth} onChange={(e) => setTireWidth(e.target.value)} className="input-field" placeholder={surfaceType === 'mtb' ? 'e.g. 2.35' : 'e.g. 47'} />
                <p className="text-xs mt-1 text-[var(--text-tertiary)]">
                  {surfaceType === 'road' && 'Road: 23-35mm typical'}
                  {surfaceType === 'gravel' && 'Gravel: 35-50mm+ typical'}
                  {surfaceType === 'mtb' && 'MTB: 2.1-2.6" typical'}
                </p>
              </div>

              {/* ... Other select/button inputs (no changes needed) ... */}

              <button
                onClick={calculatePressure}
                disabled={!riderWeight || !bikeWeight || !tireWidth}
                className="w-full px-8 py-4 rounded-xl font-medium transition-all text-lg text-white bg-[var(--accent-blue)] shadow-[0_4px_12px_rgba(0,115,230,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_16px_rgba(0,115,230,0.3)]"
              >
                Calculate Pressure
              </button>
            </div>

            <div className="space-y-6">
              {pressure.base ? (
                <>
                  <div className="card">
                    <h2 className="text-2xl font-bold mb-4 text-[var(--accent-blue)]">Recommended Pressure</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm mb-1 text-[var(--text-secondary)]">Front</div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">{pressure.front} PSI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm mb-1 text-[var(--text-secondary)]">Rear</div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">{pressure.rear} PSI</div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-[var(--text-secondary)]">
                      Range: {pressure.ranges.comfort}–{pressure.ranges.performance} PSI
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--success-green)]">Comfort Range</h3>
                      <div className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{pressure.ranges.comfort} PSI</div>
                      <p className="text-sm text-[var(--text-secondary)]">Maximum grip and comfort for rough terrain.</p>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--accent-blue)]">Balanced Range</h3>
                      <div className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{pressure.ranges.balanced} PSI</div>
                      <p className="text-sm text-[var(--text-secondary)]">Optimal balance of grip, comfort, and efficiency.</p>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--warning-orange)]">Performance Range</h3>
                      <div className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{pressure.ranges.performance} PSI</div>
                      <p className="text-sm text-[var(--text-secondary)]">Maximum efficiency for smooth surfaces.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Note:</strong> These are starting recommendations. Always check your tire's max pressure and adjust based on feel.
                    </p>
                  </div>
                </>
              ) : (
                <div className="card text-center">
                  <div className="text-6xl mb-4">📏</div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Ready to Calculate</h3>
                  <p className="text-[var(--text-secondary)]">
                    Enter your details to get personalized tire pressure recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>

          {pressure.base && (
            <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2">Algorithm Status</h4>
              <p className="text-xs text-blue-700 dark:text-blue-200">
                For 175lb rider + 20lb bike w/ 47mm gravel tire: Expected ~32-34 PSI | Your result: {pressure.base} PSI
                {Math.abs(pressure.base - 33) <= 3 ? ' ✅' : ' ⚠️ (Check calibration)'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
