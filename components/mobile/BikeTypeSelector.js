// components/mobile/BikeTypeSelector.js - Mobile-optimized bike type selection
import { bikeConfig } from '../../lib/components';

export default function BikeTypeSelector({ bikeType, setBikeType, onNext }) {
  const bikeTypes = [
    {
      id: 'road',
      name: 'Road Bike',
      description: 'Speed and efficiency on paved roads',
      emoji: '🚴‍♂️',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      features: ['Lightweight', 'Aerodynamic', 'Fast']
    },
    {
      id: 'gravel',
      name: 'Gravel Bike', 
      description: 'Versatile for mixed terrain adventures',
      emoji: '🚵‍♀️',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
      features: ['Versatile', 'Comfortable', 'Durable']
    },
    {
      id: 'mtb',
      name: 'Mountain Bike',
      description: 'Built for off-road trails and technical terrain',
      emoji: '🚵‍♂️',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      features: ['Rugged', 'Suspension', 'Technical']
    }
  ];

  const handleSelection = (typeId) => {
    setBikeType(typeId);
    // Small delay for better UX feedback
    setTimeout(() => {
      onNext();
    }, 200);
  };

  return (
    <div className="mobile-screen" style={{ padding: '20px' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'white' }}>
          Choose Your Bike
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Select your bike type to get started with gear optimization
        </p>
      </div>

      {/* Bike Type Cards */}
      <div className="space-y-4">
        {bikeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelection(type.id)}
            className="bike-type-card w-full text-left"
            style={{
              background: bikeType === type.id ? type.gradient : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${bikeType === type.id ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '16px',
              padding: '20px',
              transition: 'all 0.3s ease',
              transform: bikeType === type.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow: bikeType === type.id ? '0 8px 32px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{type.emoji}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>
                  {type.name}
                </h3>
                <p className="mb-3 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {type.features.map((feature, index) => (
                    <span
                      key={index}
                      className="feature-tag"
                      style={{
                        background: bikeType === type.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              {bikeType === type.id && (
                <div className="check-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} 
                          d="M5 13l4 4L19 7" style={{ color: 'white' }} />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      {bikeType && (
        <div className="mt-8">
          <button
            onClick={onNext}
            className="continue-btn w-full"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            <span>Continue Setup</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Don't worry, you can always change this later in settings
        </p>
      </div>
    </div>
  );
}