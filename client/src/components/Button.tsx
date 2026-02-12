/**
 * Button Component - Reusable button with variants
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-brand-gold text-white hover:bg-opacity-90 shadow-lg',
      secondary: 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400',
      ghost: 'text-brand-gold hover:bg-brand-gold hover:bg-opacity-10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⟳</span>
            {props.children}
          </>
        ) : (
          props.children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
