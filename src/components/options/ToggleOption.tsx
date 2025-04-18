import React from 'react';
import { ProductOption } from '../../types';

interface ToggleOptionProps {
  option: ProductOption;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ option, value, onChange }) => {
  const currentVariant = option.variants.find(v => v.value === value);
  const additionalPrice = currentVariant?.price || 0;
  
  const toggleValue = () => {
    onChange(!value);
  };
  
  return (
    <div className="option-group">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">{option.name}</label>
          {option.description && (
            <span className="text-xs text-gray-500 block mt-1">{option.description}</span>
          )}
        </div>
        
        <div className="flex items-center">
          {additionalPrice > 0 && value && (
            <span className="mr-2 text-sm text-primary-600">+${additionalPrice.toFixed(2)}</span>
          )}
          
          {/* Toggle switch */}
          <button
            type="button"
            className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
              value ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onClick={toggleValue}
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Optional: Button-style selection */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {option.variants.map((variant) => {
          const isSelected = value === variant.value;
          return (
            <button
              key={variant.id}
              type="button"
              className={`px-4 py-2 text-sm rounded-md transition-colors text-center ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => onChange(variant.value as boolean)}
            >
              {variant.name}
              {variant.price ? ` (+$${variant.price.toFixed(2)})` : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToggleOption; 