/**
 * Utility functions for common operations
 */

// Convert string or number price to number
export const toNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatPriceFixed = (price: string | number | null | undefined): string => {
  return toNumber(price).toFixed(2);
};

export const calculateDiscount = (original: number, discount: number): number => {
  return Math.round(((original - discount) / original) * 100);
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
