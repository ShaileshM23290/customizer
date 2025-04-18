import React from 'react';
import { ProductOption } from '../../types';

interface CountOptionProps {
  option: ProductOption;
  value: number;
  onChange: (value: number) => void;
}

const CountOption: React.FC<CountOptionProps> = ({ option, value, onChange }) => {
  const increment = () => {
    if (option.max !== undefined && value >= option.max) return;
    onChange(value + (option.step || 1));
  };
  
  const decrement = () => {
    if (option.min !== undefined && value <= option.min) return;
    onChange(value - (option.step || 1));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    
    // Validate against min/max
    if (option.min !== undefined && newValue < option.min) return;
    if (option.max !== undefined && newValue > option.max) return;
    
    onChange(newValue);
  };
  
  // Find the variant that matches the current value
  const currentVariant = option.variants.find(v => v.value === value);
  const additionalPrice = currentVariant?.price || 0;
  
  return (
    <div className="option-group">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{option.name}</label>
        {option.description && (
          <span className="text-xs text-gray-500">{option.description}</span>
        )}
      </div>
      
      <div className="flex flex-col space-y-3">
        {/* Number stepper */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={decrement}
            disabled={option.min !== undefined && value <= option.min}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <input
            type="number"
            value={value}
            onChange={handleChange}
            min={option.min}
            max={option.max}
            step={option.step || 1}
            className="w-16 h-full px-2 py-1 text-center border-t border-b border-gray-300"
          />
          
          <button
            type="button"
            className="p-2 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={increment}
            disabled={option.max !== undefined && value >= option.max}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          {additionalPrice > 0 && (
            <span className="ml-3 text-sm text-primary-600">+${additionalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          {option.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                value === variant.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => onChange(variant.value as number)}
            >
              {variant.name}
              {variant.price ? ` (+$${variant.price.toFixed(2)})` : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountOption; 