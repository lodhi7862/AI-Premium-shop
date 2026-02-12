'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react';

const ContactPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          We'd love to hear from you. Get in touch with us today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageCircle className="text-blue-600 dark:text-blue-200" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Chat</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chat with our support team in real-time
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              Start Chat →
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                <Phone className="text-green-600 dark:text-green-200" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Phone</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Call our support team weekdays 9AM-5PM
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              1-800-PREMIUM-1
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Mail className="text-orange-600 dark:text-orange-200" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Email us anytime and we'll get back to you quickly
            </p>
            <p className="text-blue-600 hover:text-blue-700 font-semibold">
              support@premium.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>

            {submitted && (
              <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
