import React from 'react';
import Head from 'next/head';
import '../globals/styles.css';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg] text-[--color-text-primary]">
      <Head>
        <title>CrankSmith</title>
        <meta name="description" content="Forged for the Road, Built to Ride" />
      </Head>
      <header className="header">
        <h1>CrankSmith</h1>
        <p className="tagline">Forged for the Road, Built to Ride</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 CrankSmith. All rights reserved.</p>
      </footer>
    </div>
  );
}
