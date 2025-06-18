// components/mobile/InstallPrompt.js - Mobile-specific install prompt
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA } from '../../lib/pwa-utils';

export default function MobileInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const checkInstallability = async () => {
      // Don't show if already installed as PWA
      if (checkIfPWA()) return;
      
      // Don't show if user dismissed recently
      const dismissedTime = localStorage.getItem('cranksmith_mobile_install_dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 12 * 60 * 60 * 1000) { // 12 hours
        return;
      }

      // Check if app can be installed
      if (canInstall()) {
        const prompt = await getInstallPrompt();
        if (prompt) {
          setDeferredPrompt(prompt);
          // Show after user has used the app for a bit
          setTimeout(() => setShowPrompt(true), 10000);
        }
      }
    };

    checkInstallability();
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      const success = await installPWA(deferredPrompt);
      if (success) {
        setShowPrompt(false);
        // Show success message
        alert('🎉 CrankSmith installed! You can now access it from your home screen.');
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 12 hours
    localStorage.setItem('cranksmith_mobile_install_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="mobile-install-prompt" style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="flex items-center gap-4 mb-4">
        <div style={{
          width: '48px',
          height: '48px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🚴
        </div>
        <div>
          <h3 className="font-bold text-lg">Install CrankSmith</h3>
          <p className="text-sm opacity-90">Get the full app experience</p>
        </div>
      </div>

      <div className="benefits mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span>✓</span>
          <span>Works offline</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>✓</span>
          <span>Home screen access</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>✓</span>
          <span>Faster loading</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isInstalling ? 'not-allowed' : 'pointer',
            opacity: isInstalling ? 0.7 : 1
          }}
        >
          {isInstalling ? 'Installing...' : 'Install App'}
        </button>
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Later
        </button>
      </div>
    </div>
  );
} 