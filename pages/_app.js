// pages/_app.js
import '../styles/globals.css';  // ✅ This is the only place global CSS should be imported
import Head from 'next/head';
import Layout from '../components/Layout';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
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
