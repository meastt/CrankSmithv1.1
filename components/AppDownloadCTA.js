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
    <section className="app-download-cta py-16 bg-[var(--bg-secondary)] border-t border-b border-[var(--border-light)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
            Get the Full CrankSmith Experience
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-[var(--text-secondary)]">
            Download our mobile app for offline access, faster performance, and a native app experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* App Features */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center text-xl">
                  📱
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Mobile App</h3>
                  <p className="text-[var(--text-secondary)]">
                    Optimized for mobile devices with touch-friendly interface and gesture controls
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center text-xl">
                  🔄
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Offline Access</h3>
                  <p className="text-[var(--text-secondary)]">
                    Works without internet connection - perfect for bike shops and trailside calculations
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
                  <p className="text-[var(--text-secondary)]">
                    Instant calculations and smooth animations for the best user experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center">
            <div className="bg-gradient-blue rounded-3xl p-10 border border-white/10 shadow-glow-lg">
              <div className="w-30 h-30 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl">
                🚴
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Download CrankSmith</h3>
              <p className="mb-8 text-[var(--text-secondary)]">
                Get the complete bike gear calculator experience on your device
              </p>

              {showInstallButton ? (
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className={`bg-white/20 text-white border-2 border-white/30 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 w-full max-w-70 ${
                    isInstalling ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-white/30'
                  }`}
                >
                  {isInstalling ? 'Installing...' : 'Install App'}
                </button>
              ) : (
                <div className="space-y-4">
                  <a
                    href="/mobile"
                    className="bg-white/20 text-white border-2 border-white/30 rounded-2xl px-8 py-4 text-lg font-semibold no-underline inline-block transition-all duration-200 w-full max-w-70 hover:bg-white/30"
                  >
                    Try Mobile App
                  </a>
                  
                  {isMobile && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      Tap "Add to Home Screen" in your browser menu
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 text-xs text-[var(--text-secondary)]">
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
              <p className="text-[var(--text-secondary)] mb-4">"Finally, a gear calculator that actually works offline!"</p>
              <p className="text-sm text-[var(--text-tertiary)]">- Mountain Biker</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-[var(--text-secondary)] mb-4">"The mobile app is so much faster than the website"</p>
              <p className="text-sm text-[var(--text-tertiary)]">- Road Cyclist</p>
            </div>
            <div className="card">
              <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-[var(--text-secondary)] mb-4">"Perfect for bike shop consultations"</p>
              <p className="text-sm text-[var(--text-tertiary)]">- Bike Mechanic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 