import React, { useState } from 'react';
import Head from 'next/head';

export default function DrivetrainBuilder() {
  const [config, setConfig] = useState({
    chainring: '',
    cassette: [],
    wheelSize: '',
  });

  return (
    <div>
      <Head>
        <title>Cranksmith V2 - Drivetrain Builder</title>
        <meta name="description" content="Build and analyze your custom drivetrain configuration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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