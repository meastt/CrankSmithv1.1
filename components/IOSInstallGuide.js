// components/IOSInstallGuide.js - iOS-specific install instructions
import { useState } from 'react';

export default function IOSInstallGuide({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isChromeIOS, setIsChromeIOS] = useState(false);

  // Check if it's Chrome on iOS
  useState(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = navigator.userAgent.includes('CriOS') || navigator.userAgent.includes('Chrome');
    setIsChromeIOS(isIOSDevice && isChrome);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CrankSmith - Bike Gear Calculator',
          text: isChromeIOS 
            ? 'Check out this awesome bike gear calculator! For the best experience, open in Safari and add to home screen.'
            : 'Add CrankSmith to your home screen for quick access!',
          url: window.location.href
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  const steps = isChromeIOS ? [
    {
      title: 'Chrome iOS Limitation',
      description: 'Chrome on iOS has limited PWA support. For the best experience, you\'ll need to use Safari.',
      icon: '⚠️',
      color: '#EF4444'
    },
    {
      title: 'Open in Safari',
      description: 'Copy this URL and open it in Safari, or use the share button below to open in Safari.',
      icon: '🌐',
      color: '#3B82F6'
    },
    {
      title: 'Add to Home Screen',
      description: 'In Safari, tap the share button (square with arrow), then scroll down and tap "Add to Home Screen".',
      icon: '📱',
      color: '#10B981'
    }
  ] : [
    {
      title: 'Tap Share Button',
      description: 'Tap the share button (square with arrow) in the bottom toolbar of Safari.',
      icon: '📤',
      color: '#3B82F6'
    },
    {
      title: 'Add to Home Screen',
      description: 'Scroll down in the share menu and tap "Add to Home Screen".',
      icon: '📱',
      color: '#10B981'
    },
    {
      title: 'Confirm Installation',
      description: 'Tap "Add" to install CrankSmith on your home screen.',
      icon: '✅',
      color: '#10B981'
    }
  ];

  return (
    <div style={{
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
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: isChromeIOS ? '#EF4444' : '#3B82F6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 15px'
          }}>
            {isChromeIOS ? '⚠️' : '📱'}
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {isChromeIOS ? 'Chrome iOS Detected' : 'Install CrankSmith'}
          </h2>
          <p style={{ margin: '10px 0 0 0', color: '#6B7280' }}>
            {isChromeIOS 
              ? 'Chrome on iOS has limited PWA support. Follow these steps for the best experience.'
              : 'Add CrankSmith to your home screen for quick access'
            }
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '30px' }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '20px',
              opacity: index <= currentStep ? 1 : 0.5
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: step.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                marginRight: '15px',
                flexShrink: 0
              }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {index + 1}. {step.title}
                </h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.4' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chrome iOS Warning */}
        {isChromeIOS && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span>
              <strong style={{ color: '#991B1B' }}>Chrome iOS Limitation</strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', lineHeight: '1.4' }}>
              Chrome on iOS doesn't support PWA installation. For the full app experience with offline access, 
              home screen shortcut, and push notifications, please use Safari.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {navigator.share && (
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {isChromeIOS ? '📤 Share & Open in Safari' : '📤 Share'}
            </button>
          )}
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>

        {/* Alternative for Chrome iOS */}
        {isChromeIOS && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 10px 0' }}>
              Or bookmark this page in Chrome for quick access:
            </p>
            <button
              onClick={() => {
                // Try to add bookmark (this may not work in all browsers)
                try {
                  window.external.AddFavorite(window.location.href, 'CrankSmith');
                } catch (e) {
                  alert('To bookmark: Tap the menu button (⋮) in Chrome, then tap "Add to Bookmarks"');
                }
              }}
              style={{
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📚 Add Bookmark
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 