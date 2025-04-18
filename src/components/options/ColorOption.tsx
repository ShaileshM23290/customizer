import React from 'react';
import { ProductOption } from '../../types';

interface ColorOptionProps {
  option: ProductOption;
  value: string;
  onChange: (value: string) => void;
}

const ColorOption: React.FC<ColorOptionProps> = ({ option, value, onChange }) => {
  return (
    <div className="option-group">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{option.name}</label>
        {option.description && (
          <span className="text-xs text-gray-500">{option.description}</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {option.variants.map((variant) => {
          const isSelected = value === variant.value;
          const colorValue = variant.value as string;
          const disabled = variant.disabled || false;
          
          return (
            <button
              key={variant.id}
              type="button"
              className={`
                relative w-10 h-10 rounded-full border-2 
                ${isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}
              `}
              style={{ backgroundColor: colorValue }}
              onClick={() => !disabled && onChange(colorValue)}
              disabled={disabled}
              title={variant.name}
              aria-label={`${option.name}: ${variant.name}`}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isLightColor(colorValue) ? 'black' : 'white'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to determine if a color is light or dark
// to decide whether to use black or white check mark
const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light (brightness > 128)
  return brightness > 128;
};

export default ColorOption; 