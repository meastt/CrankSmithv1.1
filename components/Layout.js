import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>CrankSmith</title>
        <meta name="description" content="Optimize your bike's performance with CrankSmith's gear ratio calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white">
        {children}
      </div>
    </>
  );
}
