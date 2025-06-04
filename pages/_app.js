// pages/_app.js
import '../styles/globals.css';  // ✅ This is the only place global CSS should be imported
import Head from 'next/head';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CrankSmith</title>
        <meta name="description" content="Optimize your bike's performance with CrankSmith's gear ratio calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
