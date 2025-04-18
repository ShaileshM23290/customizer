import { create } from 'zustand';
import { CustomizerConfig, ProductOption } from '../types';

// Modified CustomizerState to support the calculatePrice with optional parameter
interface CustomizerState {
  selectedOptions: Record<string, any>;
  price: number;
  setOption: (optionId: string, value: any) => void;
  resetOptions: () => void;
  calculatePrice: (customOptions?: Record<string, any>) => number;
}

// Helper function to shallowly compare objects
const shallowEqual = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
};

export const createCustomizerStore = (config: CustomizerConfig) => {
  // Initialize default selected options
  const initialSelectedOptions: Record<string, any> = {};
  
  config.options.forEach((option: ProductOption) => {
    if (option.defaultValue !== undefined) {
      initialSelectedOptions[option.id] = option.defaultValue;
    } else if (option.variants.length > 0) {
      initialSelectedOptions[option.id] = option.variants[0].value;
    }
  });

  return create<CustomizerState>((set, get) => ({
    selectedOptions: initialSelectedOptions,
    price: config.initialPrice,
    
    setOption: (optionId, value) => {
      set((state) => {
        // Skip update if the value hasn't changed
        if (state.selectedOptions[optionId] === value) {
          return state;
        }
        
        const newSelectedOptions = {
          ...state.selectedOptions,
          [optionId]: value,
        };
        
        // Calculate new price
        const newPrice = get().calculatePrice(newSelectedOptions);
        
        // Notify config change if callback exists
        if (config.onConfigChange) {
          // Debounce the callback to prevent rapid updates
          setTimeout(() => {
            config.onConfigChange?.(newSelectedOptions);
          }, 0);
        }
        
        return {
          selectedOptions: newSelectedOptions,
          price: newPrice,
        };
      });
    },
    
    resetOptions: () => {
      set((state) => {
        // Skip reset if options are already at initial values
        if (shallowEqual(state.selectedOptions, initialSelectedOptions)) {
          return state;
        }
        
        return {
          selectedOptions: initialSelectedOptions,
          price: config.initialPrice,
        };
      });
    },
    
    calculatePrice: (customOptions?) => {
      const optionsToUse = customOptions || get().selectedOptions;
      let totalPrice = config.initialPrice;
      
      // Calculate additional price based on selected options
      config.options.forEach((option) => {
        const selectedValue = optionsToUse[option.id];
        if (selectedValue !== undefined) {
          const selectedVariant = option.variants.find(
            (variant) => variant.value === selectedValue
          );
          
          if (selectedVariant && selectedVariant.price) {
            totalPrice += selectedVariant.price;
          }
        }
      });
      
      return totalPrice;
    },
  }));
};

// This hook is for consuming components to get the customizer state
// and to dispatch actions to the store
export let useCustomizerStore: ReturnType<typeof createCustomizerStore>;

// Initialize store with config
export const initializeCustomizerStore = (config: CustomizerConfig) => {
  useCustomizerStore = createCustomizerStore(config);
  return useCustomizerStore;
}; 