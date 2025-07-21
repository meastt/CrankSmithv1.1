import React from 'react';
import Link from 'next/link';
import SEOHead from '../components/SEOHead';
import { useState } from 'react';
import { bikeConfig, componentDatabase } from '../lib/components';
import { calculateRealPerformance } from '../lib/calculateRealPerformance';

export default function PerformanceAnalysis() {
  // State for user selections
  const [bikeType, setBikeType] = useState('road');
  const config = bikeConfig[bikeType];
  const cranksets = componentDatabase.cranksets.filter(c => c.bikeType === bikeType);
  const cassettes = componentDatabase.cassettes.filter(c => c.bikeType === bikeType);
  const [setup, setSetup] = useState({
    wheel: config.defaultSetup.wheel,
    tire: config.tireWidths[0],
    crankset: cranksets[0],
    cassette: cassettes[0]
  });
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    try {
      const res = calculateRealPerformance(setup, setup, 'mph');
      setResults(res.current.metrics);
    } catch (e) {
      setResults(null);
    }
  };

  return (
    <>
      <SEOHead 
        title="Cycling Performance Analysis | CrankSmith"
        description="Estimate your speed and climbing performance based on your bike setup."
        keywords="cycling performance analysis, bike speed calculator, cadence analysis, cycling efficiency, power analysis, training zones"
        url="https://cranksmith.com/performance-analysis"
      />
      <div className="min-h-screen bg-gradient-to-br from-brand-blue via-brand-purple to-brand-green flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white/90 dark:bg-neutral-900/90 rounded-2xl shadow-xl p-6 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4 text-center text-brand-blue">Performance Analysis</h1>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Bike Type</label>
            <select className="input-field w-full" value={bikeType} onChange={e => setBikeType(e.target.value)}>
              {Object.keys(bikeConfig).map(type => (
                <option key={type} value={type}>{bikeConfig[type].name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Crankset</label>
            <select className="input-field w-full" value={setup.crankset?.id} onChange={e => setSetup(s => ({ ...s, crankset: cranksets.find(c => c.id === e.target.value) }))}>
              {cranksets.map(c => (
                <option key={c.id} value={c.id}>{c.model} {c.variant}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Cassette</label>
            <select className="input-field w-full" value={setup.cassette?.id} onChange={e => setSetup(s => ({ ...s, cassette: cassettes.find(c => c.id === e.target.value) }))}>
              {cassettes.map(c => (
                <option key={c.id} value={c.id}>{c.model} {c.variant}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Wheel</label>
              <select className="input-field w-full" value={setup.wheel} onChange={e => setSetup(s => ({ ...s, wheel: e.target.value }))}>
                {config.wheelSizes.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Tire Width</label>
              <select className="input-field w-full" value={setup.tire} onChange={e => setSetup(s => ({ ...s, tire: e.target.value }))}>
                {config.tireWidths.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-primary w-full mt-2" onClick={handleCalculate}>Analyze</button>
          {results && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/40 rounded-xl p-4 text-center">
              <div className="text-lg font-semibold mb-2 text-brand-blue">Estimated Performance</div>
              <div className="flex flex-wrap justify-center gap-4">
                <div>
                  <div className="font-bold text-xl">{results.highSpeed} mph</div>
                  <div className="text-xs text-neutral-500">Top Speed (90 RPM)</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{results.lowSpeed} mph</div>
                  <div className="text-xs text-neutral-500">Climbing Speed (90 RPM)</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{results.highRatio}</div>
                  <div className="text-xs text-neutral-500">Highest Gear Ratio</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{results.lowRatio}</div>
                  <div className="text-xs text-neutral-500">Lowest Gear Ratio</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}