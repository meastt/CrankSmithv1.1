// pages/_app.js - FIXED VERSION
// Critical Bug Fix: Simplified mobile routing that doesn't confuse users
// Quick Win: Less intrusive mobile detection

import '../styles/globals.css';
import Head from 'next/head';
import Layout from '../components/Layout';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { registerServiceWorker, handleMobileRouting, isMobileApp } from '../lib/pwa-utils';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastContainer } from '../components/Toast';
import EmailCollectionPopup from '../components/EmailCollectionPopup';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Handle mobile routing suggestions (non-intrusive)
    handleMobileRouting(router);
  }, [router]);

  // Use different layout for mobile app
  const isMobileAppPage = isMobileApp(router.pathname);
  
  if (isMobileAppPage) {
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
          <meta name='impact-site-verification' value='8d751d83-117e-4b87-b7c0-253d7bb08754' />
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
        <meta name='impact-site-verification' value='8d751d83-117e-4b87-b7c0-253d7bb08754' />
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
      
      {/* Main App Content with Error Boundary */}
      <ErrorBoundary context="page">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
      
      {/* Toast Notifications */}
      <ToastContainer />
      
      {/* Email Collection Popup */}
      <EmailCollectionPopup />
    </>
  );
}