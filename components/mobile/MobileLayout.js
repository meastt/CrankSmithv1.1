// components/mobile/MobileLayout.js - Mobile-first layout with bottom navigation
import { useState, useEffect } from 'react';

export default function MobileLayout({ 
  children, 
  currentScreen, 
  setCurrentScreen, 
  isOnline,
  hasResults 
}) {
  const [safeAreaTop, setSafeAreaTop] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  // Handle safe area for notched devices
  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const top = computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0px';
      const bottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0px';
      
      setSafeAreaTop(parseInt(top) || 0);
      setSafeAreaBottom(parseInt(bottom) || 0);
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  const navigationItems = [
    {
      id: 'calculator',
      label: 'Calculator',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'results',
      label: 'Results',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      disabled: !hasResults
    },
    {
      id: 'garage',
      label: 'Garage',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div 
      className="mobile-app"
      style={{
        height: '100vh',
        height: '100dvh', // Dynamic viewport height for mobile
        display: 'flex',
        flexDirection: 'column',
        background: '#010309',
        color: 'white',
        paddingTop: `${safeAreaTop}px`,
        paddingBottom: `${safeAreaBottom}px`,
        overflow: 'hidden'
      }}
    >
      {/* Status Bar */}
      <div className="mobile-status-bar px-4 py-2 flex justify-between items-center text-xs"
           style={{ 
             background: 'rgba(0, 0, 0, 0.1)',
             borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
           }}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full" 
               style={{ background: isOnline ? '#00A651' : '#DC2626' }}></div>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L12 5.45l7.15 7.5L20 11.47l-.85 1.48L12 7.05l-7.15 7.9z"/>
          </svg>
          <span>100%</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="mobile-content"
        style={{
          flex: 1,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '0',
          position: 'relative'
        }}
      >
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav 
        className="mobile-nav"
        style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 0',
          position: 'relative',
          zIndex: 100
        }}
      >
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setCurrentScreen(item.id)}
            disabled={item.disabled}
            className="nav-item"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              background: 'none',
              border: 'none',
              color: currentScreen === item.id ? '#3B82F6' : item.disabled ? '#666' : '#999',
              transition: 'color 0.2s ease',
              minHeight: '56px',
              cursor: item.disabled ? 'not-allowed' : 'pointer'
            }}
          >
            <div className="mb-1" style={{ 
              opacity: item.disabled ? 0.3 : 1,
              transform: currentScreen === item.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}>
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
            {currentScreen === item.id && (
              <div 
                className="nav-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '24px',
                  height: '2px',
                  background: '#3B82F6',
                  borderRadius: '1px 1px 0 0'
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}