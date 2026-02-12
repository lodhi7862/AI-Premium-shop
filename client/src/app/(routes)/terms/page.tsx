'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
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
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information
              or software) on AI Premium Shop&apos;s website for personal, non-commercial transitory
              viewing only. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The materials on AI Premium Shop&apos;s website are provided on an &apos;as is&apos; basis. AI Premium
              Shop makes no warranties, expressed or implied, and hereby disclaims and negates all
              other warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Limitations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              In no event shall AI Premium Shop or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the materials on AI
              Premium Shop&apos;s website, even if AI Premium Shop or an authorized representative has
              been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The materials appearing on AI Premium Shop&apos;s website could include technical,
              typographical, or photographic errors. AI Premium Shop does not warrant that any of
              the materials on this website are accurate, complete, or current. AI Premium Shop may
              make changes to the materials contained on this website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Links
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              AI Premium Shop has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does
              not imply endorsement by AI Premium Shop of the site. Use of any such linked website
              is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Modifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              AI Premium Shop may revise these terms of service for this website at any time
              without notice. By using this website, you are agreeing to be bound by the then
              current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws
              of the United States of America, and you irrevocably submit to the exclusive
              jurisdiction of the courts located in this location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 mt-4">
              <li>Email: legal@premium.com</li>
              <li>Phone: 1-800-PREMIUM-1</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
