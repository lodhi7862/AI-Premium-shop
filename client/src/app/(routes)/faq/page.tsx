'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const FAQPage: React.FC = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy on most items. If you\'re not satisfied with your purchase, you can return it for a full refund or exchange.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business days delivery.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer:
        'Once your order ships, you\'ll receive a tracking number via email that you can use to monitor your package.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience.',
    },
    {
      question: 'Is my payment information secure?',
      answer:
        'Yes, we use industry-standard SSL encryption to protect your payment information. Your data is never stored on our servers.',
    },
    {
      question: 'Can I cancel my order?',
      answer:
        'You can cancel orders within 24 hours of placing them. After that, the order will have been processed for shipment.',
    },
    {
      question: 'Do you offer discounts for bulk orders?',
      answer:
        'Yes! Contact our sales team at bulk@premium.com for custom quotes on large orders.',
    },
  ];

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
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          Find answers to common questions about our store and services
        </p>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Didn't find your answer?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help. Contact us anytime.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
