// pages/mobile.js - Mobile-first PWA version of CrankSmith
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MobileLayout from '../components/mobile/MobileLayout';
import BikeTypeSelector from '../components/mobile/BikeTypeSelector';
import ComponentSelector from '../components/mobile/ComponentSelector';
import ResultsScreen from '../components/mobile/ResultsScreen';
import GarageScreen from '../components/mobile/GarageScreen';
import SettingsScreen from '../components/mobile/SettingsScreen';
import MobileInstallPrompt from '../components/mobile/InstallPrompt';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';
import { bikeConfig, getComponentsForBikeType, componentDatabase } from '../lib/components';
import { CompatibilityChecker } from '../lib/compatibilityChecker';
import ErrorBoundary from '../components/ErrorBoundary';

export default function MobileApp() {
  const router = useRouter();
  
  // Main app state
  const [currentScreen, setCurrentScreen] = useState('calculator'); // calculator, results, garage, settings
  const [bikeType, setBikeType] = useState('');
  const [currentSetup, setCurrentSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  });
  const [proposedSetup, setProposedSetup] = useState({
    wheel: '',
    tire: '',
    crankset: null,
    cassette: null
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speedUnit, setSpeedUnit] = useState('mph');
  const [savedConfigs, setSavedConfigs] = useState([]);

  // Mobile-specific state
  const [setupStep, setSetupStep] = useState(1); // 1: bike type, 2: current setup, 3: proposed setup
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);

  const compatibilityChecker = new CompatibilityChecker();

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedUnit = localStorage.getItem('cranksmith_speed_unit');
      if (savedUnit) setSpeedUnit(savedUnit);

      const savedConfigs = localStorage.getItem('cranksmith_configs');
      if (savedConfigs) setSavedConfigs(JSON.parse(savedConfigs));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    
    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const calculateResults = async () => {
    const currentValidation = validateSetupComplete(currentSetup);
    const proposedValidation = validateSetupComplete(proposedSetup);

    if (!currentValidation.isComplete || !proposedValidation.isComplete) {
      alert('Please complete both setups before analyzing');
      return;
    }

    setLoading(true);
    try {
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const realResults = calculateRealPerformance(currentSetup, proposedSetup, speedUnit);
      
      // Add compatibility check
      const compatibility = compatibilityChecker.checkCompatibility(proposedSetup, bikeType);
      const compatibilitySummary = compatibilityChecker.generateCompatibilitySummary(compatibility);
      
      setResults({
        ...realResults,
        compatibility: compatibilitySummary
      });
      
      setCurrentScreen('results');
    } catch (error) {
      console.error('Error calculating results:', error);
      alert('Error calculating results. Please check your component selections.');
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = () => {
    if (!results) return;

    const config = {
      id: Date.now(),
      name: `${bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} Setup ${new Date().toLocaleDateString()}`,
      bikeType,
      currentSetup,
      proposedSetup,
      results,
      created_at: new Date().toISOString()
    };

    try {
      const updatedConfigs = [...savedConfigs, config];
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('cranksmith_configs', JSON.stringify(updatedConfigs));
      
      // Show success feedback
      alert('Configuration saved to garage!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration');
    }
  };

  const resetCalculator = () => {
    setBikeType('');
    setCurrentSetup({ wheel: '', tire: '', crankset: null, cassette: null });
    setProposedSetup({ wheel: '', tire: '', crankset: null, cassette: null });
    setResults(null);
    setSetupStep(1);
    setCurrentScreen('calculator');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'calculator':
        if (setupStep === 1 || !bikeType) {
          return (
            <BikeTypeSelector
              bikeType={bikeType}
              setBikeType={setBikeType}
              onNext={() => setSetupStep(2)}
            />
          );
        }
        return (
          <ComponentSelector
            bikeType={bikeType}
            currentSetup={currentSetup}
            setCurrentSetup={setCurrentSetup}
            proposedSetup={proposedSetup}
            setProposedSetup={setProposedSetup}
            setupStep={setupStep}
            setSetupStep={setSetupStep}
            onCalculate={calculateResults}
            loading={loading}
            onReset={resetCalculator}
          />
        );
      
      case 'results':
        return (
          <ResultsScreen
            results={results}
            speedUnit={speedUnit}
            bikeType={bikeType}
            onSave={saveConfiguration}
            onBack={() => setCurrentScreen('calculator')}
            onNewCalculation={resetCalculator}
          />
        );
      
      case 'garage':
        return (
          <GarageScreen
            savedConfigs={savedConfigs}
            setSavedConfigs={setSavedConfigs}
            onLoadConfig={(config) => {
              setBikeType(config.bikeType);
              setCurrentSetup(config.currentSetup);
              setProposedSetup(config.proposedSetup);
              setResults(config.results);
              setCurrentScreen('results');
            }}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            speedUnit={speedUnit}
            setSpeedUnit={setSpeedUnit}
            isOnline={isOnline}
            installPrompt={installPrompt}
            onInstallApp={handleInstallApp}
            onExportData={() => {
              const dataStr = JSON.stringify(savedConfigs, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'cranksmith-backup.json';
              link.click();
            }}
          />
        );
      
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <>
      <Head>
        <title>CrankSmith Mobile - Bike Gear Calculator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CrankSmith" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <MobileLayout
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        isOnline={isOnline}
        hasResults={!!results}
      >
        <ErrorBoundary context="page" fallback={<div className="p-8 text-center text-gray-500">Error loading mobile screen. Please try refreshing the page.</div>}>
          {renderCurrentScreen()}
        </ErrorBoundary>
      </MobileLayout>

      {/* Mobile Install Prompt */}
      <MobileInstallPrompt />
    </>
  );
}