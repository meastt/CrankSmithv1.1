// components/AppDownloadCTA.js - Landing page CTA for app download
import { useState, useEffect } from 'react';
import { canInstall, getInstallPrompt, installPWA, checkIfPWA, isMobileDevice } from '../lib/pwa-utils';

export default function AppDownloadCTA() {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    const checkInstallability = async () => {
      if (checkIfPWA()) return;
      
      if (canInstall()) {
        const prompt = await getInstallPrompt();
        if (prompt) {
          setDeferredPrompt(prompt);
          setShowInstallButton(true);
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
        setShowInstallButton(false);
        alert('🎉 CrankSmith installed successfully! You can now access it from your home screen.');
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <section className="app-download-cta py-16" style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Get the Full CrankSmith Experience
          </h2>
                      <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Download our mobile app for offline access, faster performance, and a native app experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* App Features */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📱
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Mobile App</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Optimized for mobile devices with touch-friendly interface and gesture controls
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🔄
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Offline Access</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Works without internet connection - perfect for bike shops and trailside calculations
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  ⚡
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Instant calculations and smooth animations for the best user experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center">
            <div style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                🚴
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Download CrankSmith</h3>
              <p className="text-gray-200 mb-8">
                Get the complete bike gear calculator experience on your device
              </p>

              {showInstallButton ? (
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: isInstalling ? 'not-allowed' : 'pointer',
                    opacity: isInstalling ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    width: '100%',
                    maxWidth: '280px'
                  }}
                >
                  {isInstalling ? 'Installing...' : 'Install App'}
                </button>
              ) : (
                <div className="space-y-4">
                  <a
                    href="/mobile"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      padding: '16px 32px',
                      fontSize: '18px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      maxWidth: '280px'
                    }}
                  >
                    Try Mobile App
                  </a>
                  
                  {isMobile && (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Tap "Add to Home Screen" in your browser menu
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <p>Free • No ads • Privacy focused</p>
                <p>Works on iOS, Android & Desktop</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-white">What Cyclists Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-4">"Finally, a gear calculator that actually works offline!"</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>- Mountain Biker</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-4">"The mobile app is so much faster than the website"</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>- Road Cyclist</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-4">"Perfect for bike shop consultations"</p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>- Bike Mechanic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 