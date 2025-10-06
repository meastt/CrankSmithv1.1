import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - CrankSmith"
        description="Learn how CrankSmith protects your privacy. We don't collect personal data, track users, or store your information. Your privacy is our priority."
        url="https://cranksmith.com/privacy"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-carbon-black dark:via-neutral-900 dark:to-neutral-800">
        <div className="container-responsive py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-black mb-6 text-neutral-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we protect your data and respect your privacy.
              </p>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
                  <strong>Last updated:</strong> December 16, 2024
                </p>

                <h2>Our Privacy-First Approach</h2>
                <p>
                  CrankSmith is designed with privacy as a core principle. We believe that you should be able to use professional cycling tools without compromising your personal data or privacy.
                </p>

                <h2>What We Don't Collect</h2>
                <p>We are proud to say that CrankSmith does not collect, store, or process any personal data, including:</p>
                <ul>
                  <li>Personal information (name, email, address)</li>
                  <li>Bike configurations or calculations</li>
                  <li>Usage patterns or analytics</li>
                  <li>Location data</li>
                  <li>Device information</li>
                  <li>IP addresses (beyond basic server logs)</li>
                </ul>

                <h2>How Our Tools Work</h2>
                <p>
                  All calculations performed by CrankSmith happen locally in your browser. Your data never leaves your device, ensuring complete privacy and security.
                </p>

                <h3>Local Storage</h3>
                <p>
                  We may use your browser's local storage to save your preferences (like theme settings) and bike configurations for your convenience. This data stays on your device and is not transmitted to our servers.
                </p>

                <h2>Third-Party Services</h2>
                <p>
                  CrankSmith may use the following third-party services that have their own privacy policies:
                </p>

                <h3>Analytics</h3>
                <p>
                  We use Vercel Analytics to understand how our website is used. This service collects anonymous usage statistics and does not identify individual users.
                </p>

                <h3>Hosting</h3>
                <p>
                  Our website is hosted on Vercel, which may collect basic server logs including IP addresses for security and performance purposes.
                </p>

                <h2>Cookies and Tracking</h2>
                <p>
                  CrankSmith does not use cookies for tracking purposes. We may use essential cookies for functionality (like remembering your theme preference), but these do not track your activity across other websites.
                </p>

                <h2>Data Security</h2>
                <p>
                  Since we don't collect personal data, there's no personal information to secure. However, we implement industry-standard security measures to protect our website and ensure it remains available and secure.
                </p>

                <h2>Children's Privacy</h2>
                <p>
                  CrankSmith is suitable for users of all ages. Since we don't collect personal information, we don't have specific concerns about children's privacy. However, we recommend parental supervision for children under 13.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy or CrankSmith's privacy practices, please contact us through our website.
                </p>

                <h2>Your Rights</h2>
                <p>
                  Since we don't collect personal data, there's no personal information to access, modify, or delete. However, you can clear your browser's local storage at any time to remove any saved preferences or configurations.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">
                    Privacy Summary
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    <strong>Bottom line:</strong> CrankSmith doesn't collect, store, or share your personal data. All calculations happen on your device, and your information stays private.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}