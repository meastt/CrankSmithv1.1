// components/FloatingInstallButton.js - Floating install button
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA } from '../lib/pwa-utils';

export default function FloatingInstallButton() {
  const [showButton, setShowButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkInstallability = async () => {
      // Don't show if already installed as PWA
      if (checkIfPWA()) return;
      
      // Check if app can be installed
      if (canInstall()) {
        const prompt = await getInstallPrompt();
        if (prompt) {
          setDeferredPrompt(prompt);
          setShowButton(true);
        }
      }
    };

    // Check after a short delay
    const timer = setTimeout(checkInstallability, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      const success = await installPWA(deferredPrompt);
      if (success) {
        setShowButton(false);
        // Show success message
        alert('🎉 CrankSmith installed successfully! You can now access it from your home screen.');
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;
  if (!showButton) return null;

  return (
    <div className="floating-install-button fixed bottom-5 right-5 z-50 floating-element">
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`bg-gradient-blue text-white border-none rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 shadow-glow-md flex items-center gap-2 min-w-35 justify-center ${
          isInstalling ? 'btn-disabled' : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-glow-lg'
        }`}
      >
        {isInstalling ? (
          <>
            <div className="loading-spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Installing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Install App
          </>
        )}
      </button>
    </div>
  );
} 