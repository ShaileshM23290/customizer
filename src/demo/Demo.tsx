import React, { useState, useEffect } from 'react';
import { ProductCustomizer } from '../index';
import { CustomizerConfig, Vector3 } from '../types';
import Button from '../components/ui/Button';

// Simulated API response for available models
// In a real application, this would be fetched from the server
const simulateModelFetch = () => {
  return Promise.resolve([

    {
      id: 'kitchen',
      name: 'Kitchen',
      path: '/models/kitchen.glb',
      price: 2499.99,
      scale: { x: 4, y: 4, z: 4 },
      rotation: { x: 0, y: 3, z: 0 },
      position: { x: 0.5, y: -0.5, z: 0 }
    },
    {
      id: 'tv_unit',
      name: 'TV Unit',
      path: '/models/tv_unit__furniture.glb',
      price: 199.99,
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      rotation: { x: 0, y: 90, z: 0 },
      position: { x: 0, y: -1, z: 0 }
    },
    {
      id: 'sofa',
      name: 'Sofa',
      path: '/models/sofa.glb',
      price: 299.99,
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      rotation: { x: 0, y: 120, z: 0 },
      position: { x: 0, y: 0, z: 0 }
    },
  ]);
};

// Base customizer configuration
const getModelConfig = (model: any): CustomizerConfig => ({
  productId: `demo-${model.name.toLowerCase().replace(/\s/g, '-')}`,
  productName: model.name,
  modelPath: model.path,
  initialPrice: model.price,
  currency: 'USD',
  options: [],
  scale: model.scale,
  rotation: model.rotation,
  position: model.position,
  onConfigChange: (config) => {
    console.log('Configuration changed:', config);
  },
  onAddToCart: (config) => {
    console.log('Added to cart with configuration:', config);
    alert('Product added to cart!');
  },
});

// Define a fallback notice component for when WebGL is not available
const WebGLNotice = () => (
  <div className="p-8 bg-red-900 rounded-lg border border-red-700 text-center">
    <h3 className="text-lg font-bold text-red-300 mb-2">WebGL Required</h3>
    <p className="text-red-300">
      Your browser doesn't support WebGL or it's disabled. The 3D product customizer requires WebGL to function.
      Please enable WebGL or try a different browser.
    </p>
  </div>
);

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-400"></div>
  </div>
);

// The main Demo component
const Demo: React.FC = () => {
  // State to track if WebGL is supported
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  // State to track available models
  const [models, setModels] = useState<Array<{
    id: string,
    name: string,
    path: string,
    price: number,
    scale: Vector3,
    rotation: Vector3,
    position: Vector3
  }>>([]);
  // State to track which model is currently active
  const [activeModel, setActiveModel] = useState<string>('');
  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for WebGL support and fetch models when component mounts
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setHasWebGL(!!gl);

    // Fetch available models
    setIsLoading(true);
    simulateModelFetch()
      .then(fetchedModels => {
        setModels(fetchedModels);
        if (fetchedModels.length > 0) {
          setActiveModel(fetchedModels[0].id);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch models:', error);
        setIsLoading(false);
      });
  }, []);

  // Get the active model configuration
  const activeModelData = models.find(model => model.id === activeModel);
  const activeConfig = activeModelData
    ? getModelConfig(activeModelData)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Showcase</h2>
        <p className="text-gray-500 dark:text-gray-400">Choose a model to customize</p>
      </div>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          {/* Model tabs */}
          {models.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {models.map(model => (
                <Button
                  key={model.id}
                  variant={activeModel === model.id ? 'primary' : 'secondary'}
                  onClick={() => setActiveModel(model.id)}
                >
                  {model.name}
                </Button>
              ))}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {hasWebGL ? (
              activeConfig ? (
                <ProductCustomizer key={activeModel} config={activeConfig} />
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No models available. Please add GLB files to the models directory.
                </div>
              )
            ) : (
              <WebGLNotice />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Demo; 