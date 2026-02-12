/**
 * Footer Component
 */

'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">AI Premium Shop</h3>
            <p className="text-sm text-gray-400">
              Next-generation ecommerce platform powered by AI technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-brand-gold transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-gold transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-brand-gold transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-brand-gold transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-brand-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-brand-gold transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} AI Premium Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
