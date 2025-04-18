import React from 'react';
import { ProductOption } from '../../types';

interface DimensionOptionProps {
  option: ProductOption;
  value: number;
  onChange: (value: number) => void;
}

const DimensionOption: React.FC<DimensionOptionProps> = ({ option, value, onChange }) => {
  const formatValue = (val: number) => {
    return `${val}${option.unit || ''}`;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
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
      
      <div className="space-y-3">
        {/* Slider control */}
        <input
          type="range"
          min={option.min || 0}
          max={option.max || 100}
          step={option.step || 1}
          value={value}
          onChange={handleChange}
          className="w-full"
        />
        
        {/* Value display */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">{formatValue(value)}</span>
          {additionalPrice > 0 && (
            <span className="text-sm text-primary-600">+${additionalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Variant buttons - for preset dimension values */}
        <div className="flex flex-wrap gap-2 pt-2">
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

export default DimensionOption; 