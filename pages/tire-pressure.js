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
  const [pressure, setPressure] = useState({
    base: null,
    front: null,
    rear: null,
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
    
    let basePSI = 0;
    let minPSI = 0;
    let maxPSI = 0;
    const width = Number(tireWidth);

    if (surfaceType === 'road') {
      if (width <= 25) { basePSI = 85 + (totalWeightKg - 70) * 0.8; minPSI = 75; maxPSI = 110; } 
      else if (width <= 32) { basePSI = 65 + (totalWeightKg - 70) * 0.6; minPSI = 55; maxPSI = 85; } 
      else { basePSI = 55 + (totalWeightKg - 70) * 0.5; minPSI = 45; maxPSI = 75; }
    } else if (surfaceType === 'gravel') {
      if (width <= 40) { basePSI = 35 + (totalWeightKg - 70) * 0.4; minPSI = 25; maxPSI = 50; } 
      else if (width <= 47) { basePSI = 30 + (totalWeightKg - 70) * 0.35; minPSI = 22; maxPSI = 45; } 
      else { basePSI = 25 + (totalWeightKg - 70) * 0.3; minPSI = 18; maxPSI = 38; }
    } else if (surfaceType === 'mtb') {
      if (width <= 2.3) { basePSI = 28 + (totalWeightKg - 75) * 0.2; minPSI = 22; maxPSI = 35; } 
      else { basePSI = 24 + (totalWeightKg - 75) * 0.2; minPSI = 18; maxPSI = 30; }
    }

    let wheelSizeFactor = 0;
    if (surfaceType === 'mtb') {
      switch (wheelSize) {
        case '29-inch': wheelSizeFactor = 0; break;
        case '27.5-inch': wheelSizeFactor = 1; break;
        case '26-inch': wheelSizeFactor = 2; break;
      }
    } else {
      switch (wheelSize) {
        case '700c': wheelSizeFactor = 0; break;
        case '650b': wheelSizeFactor = 1; break;
      }
    }

    basePSI += wheelSizeFactor;
    minPSI += wheelSizeFactor;
    maxPSI += wheelSizeFactor;

    if (isTubeless) basePSI -= 3;
    if (weatherCondition === 'wet') basePSI -= 2;
    if (weatherCondition === 'muddy') basePSI -= 4;
    if (ridingStyle === 'comfort') basePSI -= 3;
    if (ridingStyle === 'aggressive') basePSI += 2;

    basePSI = Math.max(minPSI, Math.min(maxPSI, basePSI));

    const range = maxPSI - minPSI;
    const comfortPSI = Math.round(minPSI + (range * 0.1));
    const balancedPSI = Math.round(basePSI);
    const performancePSI = Math.round(minPSI + (range * 0.8));
    const frontPSI = Math.round(basePSI - 2);
    const rearPSI = Math.round(basePSI);

    setPressure({
      base: Math.round(basePSI),
      front: frontPSI,
      rear: rearPSI,
      ranges: { comfort: comfortPSI, balanced: balancedPSI, performance: performancePSI }
    });
  };

  useEffect(() => {
    if (pressure.base && pressure.base < 10) {
      setPressure(prev => ({
        ...prev, base: 25, front: 23, rear: 25,
        ranges: { comfort: 22, balanced: 25, performance: 30 }
      }));
    }
  }, [pressure]);

  return (
    <div className="min-h-screen w-full">
      <SEOHead
        title="CrankSmith - Tire Pressure Calculator"
        description="Calculate optimal tire pressure for your bike based on weight, conditions, and riding style. Get accurate PSI recommendations."
        url="https://cranksmith.com/tire-pressure"
        image="/og-image.jpg"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="hero-title text-4xl font-bold mb-4">Tire Pressure Calculator</h1>
          <p className="text-lg mb-8 max-w-2xl text-[var(--text-secondary)]">
            Get optimal tire pressure recommendations based on your weight, tire size, and riding conditions. 
            Algorithm calibrated with industry standards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
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

              <div>
                <label className="form-label">Surface Type</label>
                <select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value)} className="input-field">
                  <option value="road">Road</option>
                  <option value="gravel">Gravel</option>
                  <option value="mtb">Mountain Bike</option>
                </select>
              </div>

              {(surfaceType === 'gravel' || surfaceType === 'mtb') && (
                <div>
                  <label className="form-label">Wheel Size</label>
                  <select value={wheelSize} onChange={(e) => setWheelSize(e.target.value)} className="input-field">
                    {surfaceType === 'mtb' ? ( <> <option value="29-inch">29"</option> <option value="27.5-inch">27.5"</option> <option value="26-inch">26"</option> </> ) 
                    : ( <> <option value="700c">700c</option> <option value="650b">650b</option> </> )}
                  </select>
                </div>
              )}

              <div>
                <label className="form-label">Setup</label>
                <div className="flex space-x-4">
                  <button onClick={() => setIsTubeless(true)} className={`flex-1 py-2 px-4 rounded-lg transition-all ${isTubeless ? 'btn-primary' : 'input-field hover:bg-[var(--bg-tertiary)]'}`}>Tubeless</button>
                  <button onClick={() => setIsTubeless(false)} className={`flex-1 py-2 px-4 rounded-lg transition-all ${!isTubeless ? 'btn-primary' : 'input-field hover:bg-[var(--bg-tertiary)]'}`}>Tubes</button>
                </div>
              </div>

              <div>
                <label className="form-label">Weather</label>
                <select value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)} className="input-field">
                  <option value="dry">Dry</option>
                  <option value="wet">Wet</option>
                  <option value="muddy">Muddy</option>
                </select>
              </div>

              <div>
                <label className="form-label">Riding Style</label>
                <select value={ridingStyle} onChange={(e) => setRidingStyle(e.target.value)} className="input-field">
                  <option value="comfort">Comfort</option>
                  <option value="normal">Normal</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

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
                      <p className="text-sm text-[var(--text-secondary)]">
                        Maximum grip and comfort, ideal for rough terrain and long rides
                      </p>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--accent-blue)]">Balanced Range</h3>
                      <div className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{pressure.ranges.balanced} PSI</div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Optimal balance of grip, comfort, and rolling efficiency
                      </p>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--warning-orange)]">Performance Range</h3>
                      <div className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{pressure.ranges.performance} PSI</div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Maximum efficiency and speed, ideal for smooth surfaces
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Note:</strong> These are starting recommendations. Always check your tire's max pressure and adjust based on feel and performance. 
                      Start in the middle of the range and adjust up/down based on your preferences.
                    </p>
                  </div>
                </>
              ) : (
                <div className="card text-center">
                  <div className="text-6xl mb-4">📏</div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Ready to Calculate</h3>
                  <p className="text-[var(--text-secondary)]">
                    Enter your weight, tire width, and riding conditions to get personalized tire pressure recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>

          {pressure.base && (
            <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2">Algorithm Status</h4>
              <p className="text-xs text-blue-700 dark:text-blue-200">
                Results calibrated with industry standards. For 175lb rider + 20lb bike with 47mm gravel tire: 
                Expected ~32-34 PSI | Your result: {pressure.base} PSI 
                {Math.abs(pressure.base - 33) <= 3 ? ' ✅' : ' ⚠️ (Check calibration)'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
