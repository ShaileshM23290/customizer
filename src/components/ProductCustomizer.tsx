import React, { useEffect, useState, Suspense, useRef, useCallback, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { CustomizerConfig, ProductCustomizerProps, Vector3 } from '../types';
import { initializeCustomizerStore, useCustomizerStore } from '../store/customizer';
import ProductViewer from './ProductViewer';
import ModelDebugger from './ModelDebugger';
import { Group, Object3D } from 'three';

// Lazy load these components to avoid circular imports
const OptionsPanel = React.lazy(() => import('./OptionsPanel'));
const PriceDisplay = React.lazy(() => import('./PriceDisplay'));

// This component serves as a bridge between the 3D canvas and UI
const SceneModelProvider = memo(({
  setModelReference,
  modelPath,
  scale,
  rotation,
  position
}: {
  setModelReference: (model: Group) => void,
  modelPath: string,
  scale?: Vector3,
  rotation?: Vector3,
  position?: Vector3
}) => {
  const modelUpdatesRef = useRef<boolean>(false);

  // Memoize the handleModelLoaded function to prevent re-creation on each render
  const handleModelLoaded = useCallback((model: Group) => {
    setModelReference(model);

    // Only trigger the update once for the model, not on every render
    if (!modelUpdatesRef.current) {
      modelUpdatesRef.current = true;

      // Use a timeout to ensure it happens after React has finished its update cycle
      setTimeout(() => {
        if (model) {
          model.traverse((obj: Object3D) => {
            // Mark for update in a type-safe way
            if (obj.type === "Mesh" || obj.type === "Group") {
              obj.userData.needsUpdate = true;
            }
          });
        }
      }, 100);
    }
  }, [setModelReference]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ProductViewer
        modelPath={modelPath}
        onModelLoaded={handleModelLoaded}
        scale={scale}
        rotation={rotation}
        position={position}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
      />
      <Environment preset="apartment" />
    </>
  );
});

// Prevent missing display name ESLint warning
SceneModelProvider.displayName = 'SceneModelProvider';

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ config, className = '' }) => {
  const [storeInitialized, setStoreInitialized] = useState(false);
  const [modelReference, setModelReference] = useState<Group | null>(null);

  // Memoize the setModelReference function to prevent re-creation on each render
  const handleSetModelReference = useCallback((model: Group) => {
    setModelReference(model);
  }, []);

  // Initialize the store with the config
  useEffect(() => {
    initializeCustomizerStore(config);
    setStoreInitialized(true);
  }, [config]);

  if (!storeInitialized) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className={`product-customizer ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* 3D Model Viewer - Takes the left column */}
        <div className="lg:col-span-2 h-[400px] md:h-[600px] bg-gray-100 dark:bg-gray-850 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <Canvas shadows>
            <SceneModelProvider
              modelPath={config.modelPath}
              setModelReference={handleSetModelReference}
              scale={config.scale}
              rotation={config.rotation}
              position={config.position}
            />
          </Canvas>
        </div>

        {/* Right column for debugger and options */}
        <div className="lg:col-span-1 space-y-6">
          {/* Model Debugger Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto max-h-[500px] border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">Model Debugger</h2>
            <ModelDebugger model={modelReference} />
          </div>

          {/* Options Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">{config.productName}</h2>
            <Suspense fallback={<div className="text-gray-500 dark:text-gray-400">Loading options...</div>}>
              <OptionsPanel options={config.options} />
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <PriceDisplay currency={config.currency} />
                <button
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium mt-4 hover:bg-primary-700 transition-colors"
                  onClick={() => {
                    const store = useCustomizerStore.getState();
                    if (config.onAddToCart) {
                      config.onAddToCart(store.selectedOptions);
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 py-2 px-6 rounded-lg font-medium mt-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    useCustomizerStore.getState().resetOptions();
                  }}
                >
                  Reset Options
                </button>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer; 