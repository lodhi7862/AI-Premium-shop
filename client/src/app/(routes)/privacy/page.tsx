'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to AI Premium Shop (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;). We are committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We may collect information about you in a variety of ways. The information we may
              collect on the site includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Personal Data: Email address, name, phone number, address</li>
              <li>
                Financial Data: Financial information, such as data related to your payment method
              </li>
              <li>Data From Third Parties: Data from social media platforms and payment providers</li>
              <li>Mobile Device Data: Device identifiers, device type, and mobile operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Use of Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Having accurate information about you permits us to provide you with a smooth,
              efficient, and customized experience. Specifically, we may use information collected
              about you via the site to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Generate a personal profile about you</li>
              <li>Increase the efficiency and operation of the site</li>
              <li>Monitor and analyze usage and trends to improve your experience with the site</li>
              <li>Notify you of updates to the site</li>
              <li>Process your transactions and send related information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Disclosure of Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may share information we have collected about you in certain situations:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mt-4">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of
                information about you is necessary to comply with the law
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with
                parties who perform services for us
              </li>
              <li>
                <strong>Business Transfers:</strong> Your information may be transferred as part of a
                merger, sale, or acquisition of all or part of our business
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Security of Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We use administrative, technical, and physical security measures to protect your
              personal information. While we have taken reasonable steps to secure the personal
              information you provide to us, please be aware that no security measures are perfect
              or impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 mt-4">
              <li>Email: privacy@premium.com</li>
              <li>Phone: 1-800-PREMIUM-1</li>
              <li>Address: 123 Premium Street, Tech City, TC 12345</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
