export default function Privacy() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="hero-title">Privacy Policy</h1>
        <p className="hero-subtitle max-w-2xl mx-auto">
          How CrankSmith collects, uses, and protects your information
        </p>
      </div>

      <div className="space-y-8">
        <section className="card">
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
            <p>
              CrankSmith ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Information We Collect
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Email address (when you subscribe or create an account)</li>
                <li>Name (if provided)</li>
                <li>Bike configuration data you input</li>
                <li>Performance analysis results</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Usage Information
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>App usage analytics and performance metrics</li>
                <li>Device information (type, operating system, version)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Crash reports and error logs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            How We Use Your Information
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide and maintain the CrankSmith service</li>
              <li>Process your gear calculations and analysis</li>
              <li>Send you service updates and notifications</li>
              <li>Improve our app's performance and features</li>
              <li>Provide customer support</li>
              <li>Detect and prevent technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Information Sharing
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>We do not sell, trade, or rent your personal information. We may share your information only in these limited circumstances:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>With service providers who help us operate the app (analytics, hosting, support)</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Data Security
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Data Retention
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. You may request deletion of your data by contacting us at mike@cranksmith.com.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Your Rights
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p>To exercise these rights, contact us at mike@cranksmith.com.</p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Children's Privacy
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              CrankSmith is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Changes to This Privacy Policy
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Contact Us
          </h2>
          <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:mike@cranksmith.com" 
                className="btn-primary inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                mike@cranksmith.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}