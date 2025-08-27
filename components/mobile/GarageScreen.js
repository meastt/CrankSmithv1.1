// components/mobile/GarageScreen.js - Mobile garage for saved configurations
import { useState } from 'react';

export default function GarageScreen({ savedConfigs, setSavedConfigs, onLoadConfig }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(null);

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

  const generateShareUrl = (config) => {
    // Create a shareable URL with the configuration parameters
    const params = new URLSearchParams();
    
    // Add bike type and setup parameters
    params.set('bikeType', config.bikeType || 'road');
    
    // Add current setup data if available
    if (config.currentSetup?.crankset?.id) {
      params.set('crankset', config.currentSetup.crankset.id);
    }
    if (config.currentSetup?.cassette?.id) {
      params.set('cassette', config.currentSetup.cassette.id);
    }
    if (config.currentSetup?.wheel) {
      params.set('wheel', config.currentSetup.wheel);
    }
    if (config.currentSetup?.tire) {
      params.set('tire', config.currentSetup.tire);
    }
    
    // Add proposed setup data if different
    if (config.proposedSetup?.crankset?.id && config.proposedSetup.crankset.id !== config.currentSetup?.crankset?.id) {
      params.set('proposedCrankset', config.proposedSetup.crankset.id);
    }
    if (config.proposedSetup?.cassette?.id && config.proposedSetup.cassette.id !== config.currentSetup?.cassette?.id) {
      params.set('proposedCassette', config.proposedSetup.cassette.id);
    }
    
    // Add a flag to indicate this is a shared configuration
    params.set('shared', 'true');
    params.set('configName', encodeURIComponent(config.name));
    
    return `${window.location.origin}/calculator?${params.toString()}`;
  };

  const generateShareText = (config) => {
    const results = config.results;
    if (!results?.proposed) {
      return `Check out my ${config.bikeType} bike setup on CrankSmith: ${config.name}`;
    }
    
    const topSpeed = results.proposed.metrics?.highSpeed;
    const weight = results.proposed.totalWeight;
    const range = results.proposed.gearRange;
    
    return `Check out my ${config.bikeType} bike setup on CrankSmith! ${topSpeed ? `Top speed: ${topSpeed} mph, ` : ''}${weight ? `Weight: ${weight}g, ` : ''}${range ? `Range: ${range}%` : ''}`;
  };

  const handleShareConfig = async (config) => {
    const shareUrl = generateShareUrl(config);
    const shareText = generateShareText(config);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CrankSmith - ${config.name}`,
          text: shareText,
          url: shareUrl
        });
        setShowShareMenu(null);
      } catch (error) {
        console.log('Native sharing failed or cancelled, falling back to clipboard');
        handleCopyConfigLink(config);
      }
    } else {
      handleCopyConfigLink(config);
    }
  };

  const handleCopyConfigLink = async (config) => {
    const shareUrl = generateShareUrl(config);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Configuration link copied to clipboard! Share it with others to show your bike setup.');
      setShowShareMenu(null);
    } catch (error) {
      console.error('Failed to copy link:', error);
      
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          alert('Configuration link copied to clipboard!');
          setShowShareMenu(null);
        } else {
          alert(`Copy this link to share your configuration:\n\n${shareUrl}`);
        }
      } catch (fallbackError) {
        console.error('All copy methods failed:', fallbackError);
        alert(`Copy this link to share your configuration:\n\n${shareUrl}`);
      }
    }
  };

  const handleExportConfig = (config) => {
    try {
      const exportData = {
        ...config,
        exportedAt: new Date().toISOString(),
        exportedFrom: 'CrankSmith Mobile'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cranksmith-${config.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      setShowShareMenu(null);
      alert('Configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting configuration:', error);
      alert('Failed to export configuration. Please try again.');
    }
  };

  const handleExportAsPDF = async (config) => {
    // This is a placeholder for PDF export functionality
    // In a real implementation, you would use a library like jsPDF or html2canvas
    alert('PDF export feature coming soon! For now, you can share the link or export as JSON.');
    setShowShareMenu(null);
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowShareMenu(showShareMenu === config.id ? null : config.id)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        color: '#3B82F6'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                      </svg>
                    </button>
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

      {/* Share Menu */}
      {showShareMenu && (
        <div 
          className="share-menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'flex-end'
          }}
          onClick={() => setShowShareMenu(null)}
        >
          <div 
            className="share-panel"
            style={{
              width: '100%',
              background: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '20px 20px 0 0',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="share-header mb-4">
              <h3 className="text-lg font-semibold text-white text-center">Share & Export</h3>
              <p className="text-sm text-center mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {savedConfigs.find(c => c.id === showShareMenu)?.name}
              </p>
            </div>
            <div className="share-options space-y-3">
              {/* Native Share Option */}
              <button
                onClick={() => handleShareConfig(savedConfigs.find(c => c.id === showShareMenu))}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <div className="text-left">
                  <div className="font-medium">Share Configuration</div>
                  <div className="text-xs opacity-75">Share via apps or social media</div>
                </div>
              </button>

              {/* Copy Link Option */}
              <button
                onClick={() => handleCopyConfigLink(savedConfigs.find(c => c.id === showShareMenu))}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <div className="text-left">
                  <div className="font-medium">Copy Link</div>
                  <div className="text-xs opacity-75">Copy shareable URL to clipboard</div>
                </div>
              </button>

              {/* Export as JSON */}
              <button
                onClick={() => handleExportConfig(savedConfigs.find(c => c.id === showShareMenu))}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <div className="text-left">
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-xs opacity-75">Download configuration file</div>
                </div>
              </button>

              {/* Export as PDF (placeholder) */}
              <button
                onClick={() => handleExportAsPDF(savedConfigs.find(c => c.id === showShareMenu))}
                className="share-option"
                style={{
                  width: '100%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <div className="text-left">
                  <div className="font-medium">Export as PDF</div>
                  <div className="text-xs opacity-75">Generate printable report (coming soon)</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}