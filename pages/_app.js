// pages/_app.js - FIXED VERSION
// Smart mobile routing that respects user intent

import '../styles/globals.css';
import Head from 'next/head';
import Layout from '../components/Layout';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { registerServiceWorker, isMobileDevice } from '../lib/pwa-utils';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [hasShownMobilePrompt, setHasShownMobilePrompt] = useState(false);

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Smart mobile routing logic
    if (typeof window !== 'undefined') {
      const isMobile = isMobileDevice();
      const isOnMobilePage = router.pathname.startsWith('/mobile');
      const isOnLandingPage = router.pathname === '/';
      
      // Check if user has opted out of mobile suggestions
      const hasOptedOutMobile = localStorage.getItem('cranksmith_desktop_preference') === 'true';
      
      // Only suggest mobile version, don't force it
      if (isMobile && !isOnMobilePage && !isOnLandingPage && !hasOptedOutMobile && !hasShownMobilePrompt) {
        setHasShownMobilePrompt(true);
        
        // Show a friendly prompt instead of auto-redirecting
        const userWantsMobile = window.confirm(
          "👋 We have a mobile-optimized version!\n\n" +
          "Would you like to switch to the mobile app for a better experience?\n\n" +
          "(You can always access the desktop version later)"
        );
        
        if (userWantsMobile) {
          router.push('/mobile');
        } else {
          // Remember user preference
          localStorage.setItem('cranksmith_desktop_preference', 'true');
        }
      }
    }
  }, [router, hasShownMobilePrompt]);

  // Use different layout for mobile app
  const isMobileApp = router.pathname.startsWith('/mobile');
  
  if (isMobileApp) {
    return (
      <>
        <Head>
          <title>CrankSmith Mobile</title>
          <meta name="description" content="Mobile bike gear calculator" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#3B82F6" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="CrankSmith" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TR57T617HK"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TR57T617HK', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Mobile App with Error Boundary */}
        <ErrorBoundary context="page">
          <Component {...pageProps} />
        </ErrorBoundary>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CrankSmith</title>
        <meta name="description" content="Optimize your bike's performance with CrankSmith's gear ratio calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CrankSmith" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TR57T617HK"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TR57T617HK', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      
      {/* Mobile App Suggestion Banner */}
      <ErrorBoundary context="component">
        <MobileAppBanner />
      </ErrorBoundary>
      
      {/* Main App Content with Error Boundary */}
      <ErrorBoundary context="page">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </>
  );
}

// Optional: Add a subtle banner for mobile users who chose desktop
function MobileAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = isMobileDevice();
      const hasOptedOut = localStorage.getItem('cranksmith_desktop_preference') === 'true';
      const isOnCalculator = router.pathname === '/calculator';
      
      // Show banner on calculator page for mobile users who opted for desktop
      if (isMobile && hasOptedOut && isOnCalculator) {
        setShowBanner(true);
      }
    }
  }, [router.pathname]);

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg flex items-center justify-between"
      style={{ fontSize: '14px' }}
    >
      <div className="flex items-center gap-2">
        <span>📱</span>
        <span>Try our mobile app for better touch experience</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => router.push('/mobile')}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium"
        >
          Try Mobile
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}