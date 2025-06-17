import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';

export default function DrivetrainBuilder() {
  const [config, setConfig] = useState({
    chainring: '',
    cassette: [],
    wheelSize: '',
  });

  return (
    <div>
      <SEOHead
        title="CrankSmith - Custom Drivetrain Builder"
        description="Build and analyze your custom drivetrain configuration"
        url="https://cranksmith.com/builder"
        image="/og-image.jpg"
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Drivetrain Builder</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
            {/* Configuration form will go here */}
            <p className="text-gray-600">Builder interface coming soon...</p>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Analysis</h2>
            {/* Analysis results will go here */}
            <p className="text-gray-600">Analysis results will appear here...</p>
          </div>
        </div>
      </main>
    </div>
  );
} 