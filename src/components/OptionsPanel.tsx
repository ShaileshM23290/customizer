import React, { useMemo, useCallback } from 'react';
import { ProductOption } from '../types';
import { useCustomizerStore } from '../store/customizer';
import ColorOption from './options/ColorOption';
import DimensionOption from './options/DimensionOption';
import CountOption from './options/CountOption';
import SelectOption from './options/SelectOption';
import ToggleOption from './options/ToggleOption';

interface OptionsPanelProps {
  options: ProductOption[];
}

// Memoized individual option renderer to avoid re-rendering all options
const Option = React.memo(({ 
  option, 
  value, 
  onChange 
}: { 
  option: ProductOption; 
  value: any; 
  onChange: (value: any) => void; 
}) => {
  switch (option.type) {
    case 'color':
      return <ColorOption option={option} value={value} onChange={onChange} />;
    case 'dimension':
      return <DimensionOption option={option} value={value} onChange={onChange} />;
    case 'count':
      return <CountOption option={option} value={value} onChange={onChange} />;
    case 'select':
      return <SelectOption option={option} value={value} onChange={onChange} />;
    case 'toggle':
      return <ToggleOption option={option} value={value} onChange={onChange} />;
    default:
      return <div>Unsupported option type: {option.type}</div>;
  }
});

Option.displayName = 'Option';

const OptionsPanel: React.FC<OptionsPanelProps> = ({ options }) => {
  const setOption = useCustomizerStore((state) => state.setOption);
  const selectedOptions = useCustomizerStore((state) => state.selectedOptions);

  // Memoize the handleOptionChange to prevent recreation on each render
  const handleOptionChange = useCallback((optionId: string, value: any) => {
    setOption(optionId, value);
  }, [setOption]);

  // Memoize the sorted options to prevent recalculation on each render
  const sortedOptions = useMemo(() => {
    // Group options by type for better organization
    const optionsByType: Record<string, ProductOption[]> = {};
    
    options.forEach(option => {
      const type = option.type;
      if (!optionsByType[type]) {
        optionsByType[type] = [];
      }
      optionsByType[type].push(option);
    });
    
    // Define the order of option types for display
    const typeOrder = ['color', 'material', 'dimension', 'count', 'select', 'toggle'];
    
    // Flatten the grouped options according to the defined order
    return typeOrder.flatMap(type => optionsByType[type] || []);
  }, [options]);

  if (options.length === 0) {
    return <div>No customization options available.</div>;
  }

  return (
    <div className="options-panel space-y-6">
      {sortedOptions.map((option) => (
        <Option
          key={option.id}
          option={option}
          value={selectedOptions[option.id]}
          onChange={(value) => handleOptionChange(option.id, value)}
        />
      ))}
    </div>
  );
};

export default React.memo(OptionsPanel); 