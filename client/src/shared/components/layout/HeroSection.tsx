/**
 * Hero Section Component
 * Main landing section with animated hero content
 */

import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-down">
          AI Enhanced Shopping Experience
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
          Discover products with intelligent recommendations powered by cutting-edge AI technology
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 animate-fade-in-up animation-delay-600">
          Start Shopping
        </button>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
