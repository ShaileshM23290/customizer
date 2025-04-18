import React from 'react';
import { useCustomizerStore } from '../store/customizer';

interface PriceDisplayProps {
  currency: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ currency }) => {
  const price = useCustomizerStore((state) => state.price);
  
  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(price);
  };
  
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700 font-medium">Total Price</span>
      <span className="text-2xl font-bold text-primary-700">{formatPrice(price, currency)}</span>
    </div>
  );
};

export default PriceDisplay; 