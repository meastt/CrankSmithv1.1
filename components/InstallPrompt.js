// components/InstallPrompt.js - Smart install prompt for PWA
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA } from '../lib/pwa-utils';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if we can show the install prompt
    const checkInstallability = async () => {
      // Don't show if already installed as PWA
      if (checkIfPWA()) return;
      
      // Don't show if user dismissed recently
      const dismissedTime = localStorage.getItem('cranksmith_install_dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
        return;
      }

      // Check if app can be installed
      if (canInstall()) {
        const prompt = await getInstallPrompt();
        if (prompt) {
          setDeferredPrompt(prompt);
          setShowPrompt(true);
        }
      }
    };

    // Delay showing prompt to let user explore first
    const timer = setTimeout(checkInstallability, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      const success = await installPWA(deferredPrompt);
      if (success) {
        setShowPrompt(false);
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
    setShowPrompt(false);
    setHasDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem('cranksmith_install_dismissed', Date.now().toString());
  };

  if (!showPrompt || hasDismissed) return null;

  return (
    <div className="install-prompt-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="install-prompt" style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* App Icon */}
        <div className="text-center mb-6">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
            borderRadius: '20px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>
            🚴
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Install CrankSmith</h3>
          <p className="text-gray-300 text-sm">
            Get the full app experience with offline access and home screen shortcut
          </p>
        </div>

        {/* Benefits */}
        <div className="benefits mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="text-gray-300 text-sm">Works offline</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="text-gray-300 text-sm">Home screen access</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="text-gray-300 text-sm">Faster loading</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="text-gray-300 text-sm">Push notifications</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons space-y-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isInstalling ? 'not-allowed' : 'pointer',
              opacity: isInstalling ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isInstalling ? 'Installing...' : 'Install App'}
          </button>
          
          <button
            onClick={handleDismiss}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Maybe Later
          </button>
        </div>

        {/* Platform-specific instructions */}
        <div className="platform-hint mt-4 text-center">
          <p className="text-xs text-gray-400">
            {navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') 
              ? 'Tap the share button, then "Add to Home Screen"'
              : 'Tap "Install" to add to your home screen'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 