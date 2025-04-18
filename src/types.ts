export interface OptionVariant {
  id: string;
  name: string;
  thumbnail?: string;
  value: string | number | boolean;
  previewImage?: string;
  price?: number;
  disabled?: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'color' | 'material' | 'dimension' | 'count' | 'toggle' | 'select';
  description?: string;
  variants: OptionVariant[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CustomizerConfig {
  productId: string;
  productName: string;
  modelPath: string;
  texturePath?: string;
  backgroundImage?: string;
  initialPrice: number;
  currency: string;
  options: ProductOption[];
  scale?: Vector3;
  rotation?: Vector3;
  position?: Vector3;
  onConfigChange?: (config: Record<string, any>) => void;
  onAddToCart?: (config: Record<string, any>) => void;
}

export interface CustomizerState {
  selectedOptions: Record<string, any>;
  price: number;
  setOption: (optionId: string, value: any) => void;
  resetOptions: () => void;
  calculatePrice: () => number;
}

export interface ProductCustomizerProps {
  config: CustomizerConfig;
  className?: string;
}
