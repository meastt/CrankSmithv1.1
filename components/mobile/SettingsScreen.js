// components/mobile/SettingsScreen.js - Mobile settings and app management
import { useState } from 'react';

export default function SettingsScreen({
  speedUnit,
  setSpeedUnit,
  isOnline,
  installPrompt,
  onInstallApp,
  onExportData
}) {
  const [showAbout, setShowAbout] = useState(false);

  const handleSpeedUnitChange = (unit) => {
    setSpeedUnit(unit);
    localStorage.setItem('cranksmith_speed_unit', unit);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      localStorage.removeItem('cranksmith_configs');
      localStorage.removeItem('cranksmith_speed_unit');
      window.location.reload();
    }
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'speed-unit',
          label: 'Speed Unit',
          type: 'toggle',
          value: speedUnit,
          options: [
            { value: 'mph', label: 'MPH' },
            { value: 'kmh', label: 'KM/H' }
          ],
          onChange: handleSpeedUnitChange
        }
      ]
    },
    {
      title: 'App',
      items: [
        ...(installPrompt ? [{
          id: 'install',
          label: 'Install App',
          type: 'action',
          icon: '📱',
          description: 'Add CrankSmith to your home screen',
          action: onInstallApp
        }] : []),
        {
          id: 'export',
          label: 'Export Data',
          type: 'action',
          icon: '📤',
          description: 'Download your saved configurations',
          action: onExportData
        },
        {
          id: 'clear',
          label: 'Clear All Data',
          type: 'action',
          icon: '🗑️',
          description: 'Remove all saved configurations',
          action: clearAllData,
          destructive: true
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          id: 'about',
          label: 'About CrankSmith',
          type: 'action',
          icon: 'ℹ️',
          description: 'Learn more about the app',
          action: () => setShowAbout(true)
        },
        {
          id: 'version',
          label: 'Version',
          type: 'info',
          value: '1.0.0 (Mobile Beta)'
        },
        {
          id: 'status',
          label: 'Connection Status',
          type: 'status',
          value: isOnline ? 'Online' : 'Offline',
          color: isOnline ? '#10B981' : '#EF4444'
        }
      ]
    }
  ];

  return (
    <div className="mobile-screen settings-screen" style={{ padding: '0', height: '100%' }}>
      {/* Header */}
      <div className="settings-header" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
        color: 'white'
      }}>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Customize your CrankSmith experience
        </p>
      </div>

      {/* Settings Content */}
      <div className="settings-content" style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '20px'
      }}>
        <div className="space-y-8">
          {settingSections.map((section) => (
            <div key={section.title} className="setting-section">
              <h2 className="section-title text-lg font-semibold mb-4 text-white">
                {section.title}
              </h2>
              <div className="section-items space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="setting-item"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    {/* Toggle Type (Speed Unit) */}
                    {item.type === 'toggle' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{item.label}</div>
                        </div>
                        <div className="toggle-container" style={{
                          display: 'flex',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '2px'
                        }}>
                          {item.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => item.onChange(option.value)}
                              className="toggle-option"
                              style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                background: item.value === option.value ? 'white' : 'transparent',
                                color: item.value === option.value ? '#000' : 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Type */}
                    {item.type === 'action' && (
                      <button
                        onClick={item.action}
                        className="action-item w-full text-left"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: item.destructive ? '#EF4444' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div className="action-icon text-xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                                          <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {item.description}
              </div>
                          )}
                        </div>
                                        <svg className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                      </button>
                    )}

                    {/* Info Type */}
                    {item.type === 'info' && (
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{item.label}</div>
                        <div style={{ color: 'var(--text-tertiary)' }}>{item.value}</div>
                      </div>
                    )}

                    {/* Status Type */}
                    {item.type === 'status' && (
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span style={{ color: item.color }}>{item.value}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="settings-footer mt-8 pt-6" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Made with ❤️ by cyclists, for cyclists
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-placeholder)' }}>
            © 2024 CrankSmith. All rights reserved.
          </p>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="about-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal-content"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="modal-header mb-6 text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-xl font-bold text-white mb-2">About CrankSmith</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                The ultimate bike gear calculator
              </p>
            </div>

            <div className="modal-body space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">What We Do</h4>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  CrankSmith helps cyclists optimize their bike setups with real component data, 
                  compatibility checking, and performance analysis. Make informed decisions about 
                  your gear upgrades.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Features</h4>
                <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Real component database</li>
                  <li>• Compatibility analysis</li>
                  <li>• Performance calculations</li>
                  <li>• Save configurations</li>
                  <li>• Mobile-optimized experience</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Built For Cyclists</h4>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Created by riders who understand the frustration of incompatible parts and 
                  suboptimal setups. Every calculation is based on real-world data.
                </p>
              </div>
            </div>

            <div className="modal-actions mt-6">
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}