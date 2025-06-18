// components/InstallBanner.js - Top banner for app installation
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA } from '../lib/pwa-utils';

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const checkInstallability = async () => {
      // Don't show if already installed as PWA
      if (checkIfPWA()) return;
      
      // Don't show if user dismissed recently
      const dismissedTime = localStorage.getItem('cranksmith_banner_dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 60 * 60 * 1000) { // 1 hour
        return;
      }

      // Check if app can be installed
      if (canInstall()) {
        const prompt = await getInstallPrompt();
        if (prompt) {
          setDeferredPrompt(prompt);
          setShowBanner(true);
        }
      }
    };

    // Check after page loads
    const timer = setTimeout(checkInstallability, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      const success = await installPWA(deferredPrompt);
      if (success) {
        setShowBanner(false);
        // Show success message
        alert('🎉 CrankSmith installed successfully! You can now access it from your home screen.');
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal for 1 hour
    localStorage.setItem('cranksmith_banner_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="install-banner" style={{
      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      color: 'white',
      padding: '12px 20px',
      position: 'relative',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🚴
          </div>
          <div>
            <div className="font-semibold text-sm">Install CrankSmith App</div>
            <div className="text-xs opacity-90">Get offline access & home screen shortcut</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: isInstalling ? 'not-allowed' : 'pointer',
              opacity: isInstalling ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </button>
          
          <button
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
} 