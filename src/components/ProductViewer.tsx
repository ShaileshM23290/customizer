import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, Color, Object3D, Vector3 } from 'three';
import { loadModel, updateModelMaterial } from '../utils/modelLoader';
import { useCustomizerStore } from '../store/customizer';
import { Vector3 as Vector3Type } from '../types';

interface ProductViewerProps {
  modelPath: string;
  onModelLoaded?: (model: Group) => void;
  scale?: Vector3Type;
  rotation?: Vector3Type;
  position?: Vector3Type;
}

const ProductViewer: React.FC<ProductViewerProps> = ({
  modelPath,
  onModelLoaded,
  scale,
  rotation,
  position
}) => {
  const [model, setModel] = useState<Group | null>(null);
  const [structuralParts, setStructuralParts] = useState<Record<string, Object3D[]>>({});
  const modelRef = useRef<Group>(null);
  const { scene } = useThree();
  const selectedOptions = useCustomizerStore((state) => state.selectedOptions);

  // Track previous options to avoid unnecessary updates
  const prevOptionsRef = useRef<Record<string, any>>({});

  // Memoize structuralParts to avoid recreation on re-renders
  const memoizedStructuralParts = useMemo(() => structuralParts, [structuralParts]);

  // Load the model on component mount - only depend on modelPath
  useEffect(() => {
    let isMounted = true;

    const loadProductModel = async () => {
      try {
        const loadedModel = await loadModel(modelPath);

        // Only update state if component is still mounted
        if (!isMounted) return;

        // Set initial scale based on props or defaults
        loadedModel.scale.set(
          scale ? scale.x : 0.5,
          scale ? scale.y : 0.5,
          scale ? scale.z : 0.5
        );

        // Set initial position based on props or defaults
        loadedModel.position.set(
          position ? position.x : 0,
          position ? position.y : -0.7,
          position ? position.z : 0
        );

        // Set initial rotation based on props or defaults (converting from degrees to radians if needed)
        loadedModel.rotation.set(
          rotation ? rotation.x : 0,
          rotation ? rotation.y : Math.PI / 4, // 45 degrees in radians
          rotation ? rotation.z : 0
        );

        // Enable shadows on the model
        loadedModel.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Extract structural parts for dynamic modifications
        const extractedParts: Record<string, Object3D[]> = {
          drawers: [],
          columns: [],
          shelves: [],
          legs: [],
          handles: [],
        };

        // Find and categorize the key structural parts
        loadedModel.traverse((child: any) => {
          if (child.type === 'Mesh' || child.type === 'Group') {
            const name = child.name.toLowerCase();

            // Categorize based on name patterns
            if (name.includes('drawer')) extractedParts.drawers.push(child);
            if (name.includes('column') || name.includes('divider')) extractedParts.columns.push(child);
            if (name.includes('shelf')) extractedParts.shelves.push(child);
            if (name.includes('leg')) extractedParts.legs.push(child);
            if (name.includes('handle')) extractedParts.handles.push(child);
          }
        });

        setStructuralParts(extractedParts);
        setModel(loadedModel);

        // Call the onModelLoaded callback if provided
        if (onModelLoaded) {
          onModelLoaded(loadedModel);
        }
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };

    loadProductModel();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [modelPath, onModelLoaded, scale, rotation, position]);

  // Cache these functions with useCallback to prevent recreation on re-renders
  const updateDrawerCount = useCallback((count: number) => {
    if (!model || !structuralParts.drawers?.length) return;

    // Example implementation - modify based on your model structure
    structuralParts.drawers.forEach((drawer, index) => {
      // Show only the correct number of drawers
      drawer.visible = index < count;

      // Reposition drawers based on count for even spacing
      if (drawer.visible) {
        const drawerHeight = 0.2; // Adjust based on your model
        const totalHeight = count * drawerHeight;
        const startY = totalHeight / 2 - drawerHeight / 2;

        drawer.position.y = startY - index * drawerHeight;
      }
    });
  }, [model, structuralParts.drawers]);

  const updateColumnCount = useCallback((count: number) => {
    if (!model || !structuralParts.columns?.length) return;

    // Basic implementation - this would need to be customized for your specific model
    const visibleColumns = structuralParts.columns.slice(0, count);
    const cabinetWidth = selectedOptions.width as number || 100;

    // Calculate spacing between columns
    if (count > 1) {
      const spacing = cabinetWidth / (count + 1);

      visibleColumns.forEach((column, index) => {
        column.visible = true;
        // Position columns evenly
        column.position.x = -cabinetWidth / 2 + spacing * (index + 1);
      });
    }

    // Hide extra columns
    structuralParts.columns.slice(count).forEach(column => {
      column.visible = false;
    });
  }, [model, structuralParts.columns, selectedOptions.width]);

  const toggleModelParts = useCallback((partType: keyof typeof structuralParts, visible: boolean) => {
    if (!model) return;

    const parts = structuralParts[partType] || [];
    parts.forEach(part => {
      part.visible = visible;
    });
  }, [model, structuralParts]);

  const updateHandleStyle = useCallback((style: string) => {
    if (!model || !structuralParts.handles?.length) return;

    // Show only handles that match the selected style
    structuralParts.handles.forEach(handle => {
      const handleName = handle.name.toLowerCase();

      if (style === 'none') {
        // Hide all handles if "none" is selected
        handle.visible = false;
      } else {
        // Show only handles that match the selected style
        handle.visible = handleName.includes(style);
      }
    });
  }, [model, structuralParts.handles]);

  const updateModelDimension = useCallback((model: Group, dimension: string, value: number) => {
    if (!model) return;

    // Default scale factors (customize based on your base model dimensions)
    const baseWidth = 100;
    const baseHeight = 80;
    const baseDepth = 40;

    // Calculate scale factor based on original dimensions
    let scaleX = model.scale.x;
    let scaleY = model.scale.y;
    let scaleZ = model.scale.z;

    // Update specific dimension
    if (dimension.includes('width')) {
      scaleX = value / baseWidth;
    } else if (dimension.includes('height')) {
      scaleY = value / baseHeight;
    } else if (dimension.includes('depth')) {
      scaleZ = value / baseDepth;
    }

    // Apply scaling
    model.scale.set(scaleX, scaleY, scaleZ);

    // After scaling, update other elements that might need repositioning
    if (dimension.includes('width') || dimension.includes('height')) {
      // Reposition internal elements if needed
      updateColumnCount(selectedOptions.drawers as number || 2);
    }
  }, [selectedOptions.drawers, updateColumnCount]);

  // Use shallow comparison to only update when specific values change
  useEffect(() => {
    if (!model) return;

    const optionsToCheck = Object.entries(selectedOptions);
    let hasChanges = false;

    // Check if we have actual changes to process
    for (const [key, value] of optionsToCheck) {
      if (prevOptionsRef.current[key] !== value) {
        hasChanges = true;
        break;
      }
    }

    // Skip the update if no values have changed
    if (!hasChanges) return;

    // Use a single animation frame for all updates to batch 3D changes
    let animationFrameId: number;

    animationFrameId = requestAnimationFrame(() => {
      // Apply material updates based on selected options
      Object.entries(selectedOptions).forEach(([optionId, value]) => {
        const prevValue = prevOptionsRef.current[optionId];

        // Skip if value hasn't changed
        if (prevValue === value) return;

        // Handle color options
        if (optionId.includes('color') || optionId.includes('material')) {
          if (typeof value === 'string' && value.startsWith('#')) {
            updateModelMaterial(model, optionId.replace('_color', ''), 'color', new Color(value));
          }
        }

        // Handle material maps (textures)
        if (optionId.includes('texture') && typeof value === 'string') {
          // This would need a texture loader implementation
        }

        // Handle dimensions (width, height, depth)
        if (optionId.includes('width') || optionId.includes('height') || optionId.includes('depth')) {
          updateModelDimension(model, optionId, value as number);
        }

        // Handle structural changes (number of drawers, columns, etc.)
        if (optionId === 'drawers' && typeof value === 'number' && prevValue !== value) {
          updateDrawerCount(value);
        }

        // Handle column count
        if (optionId === 'columns' && typeof value === 'number' && prevValue !== value) {
          updateColumnCount(value);
        }

        // Handle toggle options (like legs)
        if (optionId === 'with_legs' && typeof value === 'boolean' && prevValue !== value) {
          toggleModelParts('legs', value);
        }

        // Handle style selections
        if (optionId === 'handle_style' && prevValue !== value) {
          updateHandleStyle(value as string);
        }
      });

      // Update our reference of previous values
      prevOptionsRef.current = { ...selectedOptions };
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    model,
    selectedOptions,
    updateDrawerCount,
    updateColumnCount,
    toggleModelParts,
    updateHandleStyle,
    updateModelDimension
  ]);

  // Log model structure for debugging - only run once when model is loaded
  useEffect(() => {
    if (model) {
      console.log("Model objects loaded:");
      model.traverse((object) => {
        if (object.type === 'Mesh' || object.type === 'Group') {
          console.log(`- Object: ${object.name}`);
        }
      });
    }
  }, [model]);

  if (!model) {
    return null;
  }

  return <primitive ref={modelRef} object={model} />;
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ProductViewer); 