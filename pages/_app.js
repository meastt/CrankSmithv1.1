// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';
import Layout from '../components/Layout';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { registerServiceWorker, isMobileDevice } from '../lib/pwa-utils';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Auto-redirect mobile users to mobile version
    if (typeof window !== 'undefined') {
      const isMobile = isMobileDevice();
      const isOnMobilePage = router.pathname.startsWith('/mobile');
      const isOnLandingPage = router.pathname === '/';
      
      // Redirect mobile users to mobile app unless they're already there
      if (isMobile && !isOnMobilePage && !isOnLandingPage) {
        router.push('/mobile');
      }
    }
  }, [router]);

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
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="CrankSmith" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
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
        
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CrankSmith</title>
        <meta name="description" content="Optimize your bike's performance with CrankSmith's gear ratio calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
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
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}