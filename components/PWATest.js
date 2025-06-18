// components/PWATest.js - Debug PWA installation
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA, getAppInfo } from '../lib/pwa-utils';

export default function PWATest() {
  const [appInfo, setAppInfo] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Get app info for debugging
    setAppInfo(getAppInfo());

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 Install prompt detected!', e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('No install prompt available. Check console for details.');
      return;
    }
    
    setIsInstalling(true);
    try {
      console.log('🚀 Triggering install prompt...');
      const result = await deferredPrompt.prompt();
      console.log('📱 Install result:', result);
      
      if (result.outcome === 'accepted') {
        alert('🎉 CrankSmith installed successfully!');
        setDeferredPrompt(null);
      } else {
        alert('❌ Installation was cancelled');
      }
    } catch (error) {
      console.error('Install failed:', error);
      alert('❌ Installation failed: ' + error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const checkInstallability = () => {
    const canInstallApp = canInstall();
    const isPWA = checkIfPWA();
    const hasPrompt = !!deferredPrompt;
    
    console.log('🔍 PWA Status:', {
      canInstall: canInstallApp,
      isPWA,
      hasPrompt,
      userAgent: navigator.userAgent,
      serviceWorker: 'serviceWorker' in navigator
    });
    
    alert(`PWA Status:\n- Can Install: ${canInstallApp}\n- Is PWA: ${isPWA}\n- Has Prompt: ${hasPrompt}\n\nCheck console for details.`);
  };

  return (
    <div className="pwa-test" style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      zIndex: 10000,
      maxWidth: '300px',
      fontSize: '14px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#3B82F6' }}>🔧 PWA Debug</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={checkInstallability}
          style={{
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Check Status
        </button>
        
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            style={{
              background: '#10B981',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: isInstalling ? 'not-allowed' : 'pointer',
              opacity: isInstalling ? 0.7 : 1
            }}
          >
            {isInstalling ? 'Installing...' : 'Install Now'}
          </button>
        )}
      </div>

      {appInfo && (
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <div><strong>Platform:</strong> {appInfo.platform}</div>
          <div><strong>Mobile:</strong> {appInfo.isMobile ? 'Yes' : 'No'}</div>
          <div><strong>PWA:</strong> {appInfo.isPWA ? 'Yes' : 'No'}</div>
          <div><strong>Can Install:</strong> {appInfo.canInstall ? 'Yes' : 'No'}</div>
          <div><strong>Online:</strong> {appInfo.onLine ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '11px', color: '#9CA3AF' }}>
        {deferredPrompt ? '✅ Install prompt ready!' : '⏳ Waiting for install prompt...'}
      </div>
    </div>
  );
} 