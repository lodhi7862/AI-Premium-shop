'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const CookiesPage: React.FC = () => {
  const router = useRouter();
  const [cookiePreferences, setCookiePreferences] = React.useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleSaveCookiePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved!');
  };

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
          Cookie Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when
              you visit our website. They are widely used to store and retrieve information about
              browsing habits, user preferences, and personalizing the web experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We use different types of cookies for various purposes:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies are necessary for the proper functioning of the website. They enable
                  basic functions like page navigation and access to secure areas of the website.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website by
                  collecting and reporting anonymous statistical information.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies track your online activity to help display advertisements that are
                  more relevant to you and your interests.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Preference Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies remember your choices and preferences to provide a more personalized
                  experience when you visit our website.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Cookie Preferences
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
              {Object.entries(cookiePreferences).map(([key, value]) => (
                <label key={key} className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    disabled={key === 'essential'}
                    onChange={(e) =>
                      setCookiePreferences((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {key} Cookies
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'essential' && 'Always enabled - required for website functionality'}
                      {key === 'analytics' && 'Help us understand how the site is used'}
                      {key === 'marketing' && 'Help us show more relevant advertisements'}
                      {key === 'preferences' && 'Remember your choices and preferences'}
                    </p>
                  </div>
                </label>
              ))}

              <button
                onClick={handleSaveCookiePreferences}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Some cookies on our website are placed by third parties. These include analytics
              providers, advertising networks, and service providers who help us deliver content
              and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              You have the right to control and manage your cookie preferences. You can:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Accept or reject cookies from our preference center</li>
              <li>Use your browser settings to delete cookies</li>
              <li>Disable cookies in your browser settings</li>
              <li>Opt-out of certain types of cookies</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
