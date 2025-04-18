import React from 'react';
import { ProductOption } from '../../types';

interface SelectOptionProps {
  option: ProductOption;
  value: string;
  onChange: (value: string) => void;
}

const SelectOption: React.FC<SelectOptionProps> = ({ option, value, onChange }) => {
  const currentVariant = option.variants.find(v => v.value === value);
  const additionalPrice = currentVariant?.price || 0;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="option-group">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{option.name}</label>
        {option.description && (
          <span className="text-xs text-gray-500">{option.description}</span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Dropdown select */}
        <div className="relative">
          <select
            value={value}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {option.variants.map((variant) => (
              <option key={variant.id} value={variant.value as string} disabled={variant.disabled}>
                {variant.name}{variant.price ? ` (+$${variant.price.toFixed(2)})` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Visual preview options */}
        {option.variants.some(v => v.previewImage) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {option.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`flex flex-col items-center p-2 border rounded-md transition-colors ${
                  value === variant.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                } ${variant.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !variant.disabled && onChange(variant.value as string)}
                disabled={variant.disabled}
              >
                {variant.previewImage ? (
                  <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    <img 
                      src={variant.previewImage} 
                      alt={variant.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mb-2 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <span className="text-xs text-center font-medium">{variant.name}</span>
                {variant.price ? <span className="text-xs text-primary-600">+${variant.price.toFixed(2)}</span> : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOption; 