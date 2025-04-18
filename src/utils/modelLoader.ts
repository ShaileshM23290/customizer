import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Group } from 'three';

// Setup Draco loader for compressed models
const setupDracoLoader = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  return dracoLoader;
};

/**
 * Loads a 3D model from the given path
 * @param path Path to the GLTF/GLB model
 * @returns Promise that resolves with the loaded 3D model
 */
export const loadModel = (path: string): Promise<Group> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    // Optional: Use Draco compression if available in the model
    const dracoLoader = setupDracoLoader();
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        resolve(model);
      },
      (progress) => {
        // Optional: Handle loading progress
        console.log(`Loading model: ${Math.round(progress.loaded / progress.total * 100)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
};

/**
 * Updates a material property on a model
 * @param model The 3D model to update
 * @param materialName Name of the material to update
 * @param property Property to update (e.g., 'color', 'map')
 * @param value New value for the property
 */
export const updateModelMaterial = (
  model: Group,
  materialName: string,
  property: string,
  value: any
): void => {
  model.traverse((child: any) => {
    if (child.isMesh && child.material) {
      if (child.material.name === materialName || materialName === '*') {
        // Update the material property
        child.material[property] = value;
        
        // Make sure textures and materials update
        if (property === 'map' || property === 'normalMap' || property === 'roughnessMap') {
          child.material.needsUpdate = true;
        }
      }
    }
  });
}; 