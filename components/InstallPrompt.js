// components/InstallPrompt.js - PWA Install Prompt
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA, isIOS } from '../lib/pwa-utils';

export default function InstallPrompt({ variant = 'banner' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isChromeIOS, setIsChromeIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if it's Chrome on iOS
    const isIOSDevice = isIOS();
    const isChrome = navigator.userAgent.includes('CriOS') || navigator.userAgent.includes('Chrome');
    setIsChromeIOS(isIOSDevice && isChrome);

    // Don't show install prompt if already installed as PWA
    if (checkIfPWA()) {
      setIsVisible(false);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 Install prompt detected!', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Show prompt for iOS devices (even without native prompt)
    if (isIOSDevice && !checkIfPWA()) {
      setShowIOSGuide(true);
      setIsVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('No install prompt available.');
      return;
    }
    
    setIsInstalling(true);
    try {
      const result = await deferredPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        console.log('🎉 CrankSmith installed successfully!');
        setDeferredPrompt(null);
        setIsVisible(false);
      } else {
        console.log('❌ Installation was cancelled');
      }
    } catch (error) {
      console.error('Install failed:', error);
      alert('Installation failed: ' + error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleIOSInstall = () => {
    if (isChromeIOS) {
      // For Chrome on iOS, show instructions to use Safari
      if (navigator.share) {
        navigator.share({
          title: 'CrankSmith - Bike Gear Calculator',
          text: 'Check out this awesome bike gear calculator! Open in Safari for the best experience.',
          url: window.location.href
        });
      } else {
        alert('Chrome on iOS has limited PWA support.\n\nFor the best experience:\n1. Open this site in Safari\n2. Tap the share button (square with arrow)\n3. Tap "Add to Home Screen"\n\nOr bookmark this page in Chrome for quick access.');
      }
    } else {
      // For Safari on iOS, try to trigger share sheet
      if (navigator.share) {
        navigator.share({
          title: 'CrankSmith - Bike Gear Calculator',
          text: 'Add CrankSmith to your home screen for quick access!',
          url: window.location.href
        });
      } else {
        alert('Tap the share button (square with arrow) in Safari, then scroll down to "Add to Home Screen"');
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't render if not visible
  if (!isVisible) return null;

  // Banner variant
  if (variant === 'banner') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: isChromeIOS ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
        color: 'white',
        padding: '12px 20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {isChromeIOS ? '⚠️ Chrome iOS Detected' : '📱 Install CrankSmith'}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {isChromeIOS 
              ? 'For the best experience, open in Safari' 
              : 'Get quick access to your gear calculator'
            }
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: isInstalling ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </button>
          )}
          
          {showIOSGuide && (
            <button
              onClick={handleIOSInstall}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {isChromeIOS ? 'Safari Guide' : 'Add to Home'}
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              color: 'white',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // Floating button variant
  if (variant === 'floating') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={deferredPrompt ? handleInstall : handleIOSInstall}
          disabled={isInstalling}
          style={{
            background: isChromeIOS ? '#EF4444' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 20px',
            cursor: isInstalling ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isInstalling ? (
            <>⏳ Installing...</>
          ) : isChromeIOS ? (
            <>⚠️ Safari Guide</>
          ) : deferredPrompt ? (
            <>📱 Install App</>
          ) : (
            <>📱 Add to Home</>
          )}
        </button>
      </div>
    );
  }

  // Default card variant
  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{
          background: isChromeIOS ? '#EF4444' : '#3B82F6',
          color: 'white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px'
        }}>
          {isChromeIOS ? '⚠️' : '📱'}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>
            {isChromeIOS ? 'Chrome iOS Detected' : 'Install CrankSmith'}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
            {isChromeIOS 
              ? 'For the best experience, open in Safari' 
              : 'Get quick access to your gear calculator'
            }
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            style={{
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: isInstalling ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isInstalling ? 'Installing...' : 'Install Now'}
          </button>
        )}
        
        {showIOSGuide && (
          <button
            onClick={handleIOSInstall}
            style={{
              background: isChromeIOS ? '#EF4444' : '#F59E0B',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isChromeIOS ? 'Open in Safari' : 'Add to Home Screen'}
          </button>
        )}
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            color: '#6B7280',
            border: '1px solid #D1D5DB',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Maybe Later
        </button>
      </div>

      {isChromeIOS && (
        <div style={{ 
          marginTop: '15px', 
          padding: '12px', 
          background: '#FEF2F2', 
          border: '1px solid #FECACA', 
          borderRadius: '8px',
          fontSize: '13px',
          color: '#991B1B'
        }}>
          <strong>Chrome iOS Limitation:</strong> Chrome on iOS doesn't support PWA installation. 
          For the full app experience, please open this site in Safari and use "Add to Home Screen".
        </div>
      )}
    </div>
  );
} 