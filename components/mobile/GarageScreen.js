// components/mobile/GarageScreen.js - Mobile garage for saved configurations
import { useState } from 'react';

export default function GarageScreen({ savedConfigs, setSavedConfigs, onLoadConfig }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDeleteConfig = (configId) => {
    try {
      const updatedConfigs = savedConfigs.filter(config => config.id !== configId);
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('cranksmith_configs', JSON.stringify(updatedConfigs));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting configuration:', error);
      alert('Failed to delete configuration');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBikeTypeEmoji = (bikeType) => {
    switch (bikeType) {
      case 'road': return '🚴‍♂️';
      case 'gravel': return '🚵‍♀️';
      case 'mtb': return '🚵‍♂️';
      default: return '🚲';
    }
  };

  return (
    <div className="mobile-screen garage-screen" style={{ padding: '0', height: '100%' }}>
      {/* Header */}
      <div className="garage-header" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        color: 'white'
      }}>
        <h1 className="text-2xl font-bold mb-2">My Garage</h1>
        <p className="text-purple-100">
          {savedConfigs.length} saved configuration{savedConfigs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Configurations List */}
      <div className="configurations-list" style={{
        flex: 1,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '20px'
      }}>
        {savedConfigs.length > 0 ? (
          <div className="space-y-4">
            {savedConfigs.map((config) => (
              <div
                key={config.id}
                className="config-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  position: 'relative'
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bike-emoji text-2xl">
                      {getBikeTypeEmoji(config.bikeType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base leading-tight">
                        {config.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDate(config.created_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(config.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px',
                      color: '#EF4444'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>

                {/* Performance Summary */}
                {config.results && (
                  <div className="performance-summary mb-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="stat" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Weight</div>
                        <div className="text-sm font-semibold text-white">
                          {config.results.proposed?.totalWeight}g
                        </div>
                      </div>
                      <div className="stat" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Range</div>
                        <div className="text-sm font-semibold text-white">
                          {config.results.proposed?.gearRange}%
                        </div>
                      </div>
                      <div className="stat" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Top Speed</div>
                        <div className="text-sm font-semibold text-white">
                          {config.results.proposed?.metrics?.highSpeed} mph
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Components Summary */}
                <div className="components-summary mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Crankset:</span>
                      <span className="text-white font-medium text-right flex-1 ml-2 truncate">
                        {config.proposedSetup?.crankset?.model || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Cassette:</span>
                      <span className="text-white font-medium text-right flex-1 ml-2 truncate">
                        {config.proposedSetup?.cassette?.model || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Load Button */}
                <button
                  onClick={() => onLoadConfig(config)}
                  className="load-btn"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Load Configuration
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-garage" style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div className="empty-icon text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Empty Garage</h3>
            <p className="text-base leading-relaxed">
              Save your first bike configuration to start building your garage. 
              Perfect setups deserve to be remembered.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="delete-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
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
              maxWidth: '320px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="modal-header mb-4 text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Delete Configuration?</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                This action cannot be undone. The configuration will be permanently removed.
              </p>
            </div>
            <div className="modal-actions space-y-3">
              <button
                onClick={() => handleDeleteConfig(showDeleteConfirm)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}