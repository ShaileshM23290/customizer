import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Group, Object3D } from 'three';

interface ModelDebuggerProps {
  model: Group | null;
}

interface ModelObject {
  name: string;
  object: Object3D;
  visible: boolean;
}

const ModelDebugger: React.FC<ModelDebuggerProps> = ({ model }) => {
  const [objects, setObjects] = useState<ModelObject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Add a ref to track if we've already extracted objects to prevent repeated processing
  const [objectsExtracted, setObjectsExtracted] = useState(false);

  // Extract all objects from the model - only do this once when model changes
  useEffect(() => {
    if (!model || objectsExtracted) return;

    const extractedObjects: ModelObject[] = [];

    model.traverse((object) => {
      if (object.type === 'Mesh' || object.type === 'Group') {
        // Skip the scene object and objects without names
        if (object.name && !object.name.includes('Scene')) {
          extractedObjects.push({
            name: object.name,
            object: object,
            visible: object.visible
          });
        }
      }
    });

    setObjects(extractedObjects);
    setObjectsExtracted(true);
  }, [model, objectsExtracted]);

  // Handle toggling object visibility - memoize to prevent recreation on renders
  const toggleObjectVisibility = useCallback((objectName: string) => {
    setObjects(prevObjects => {
      // Create a new array to avoid mutating state directly
      return prevObjects.map(obj => {
        if (obj.name === objectName) {
          // Toggle visibility in a single operation
          const newVisibility = !obj.visible;
          // Update the actual 3D object visibility
          obj.object.visible = newVisibility;
          // Return a new object with updated visibility
          return { ...obj, visible: newVisibility };
        }
        return obj;
      });
    });
  }, []);

  // Filter objects based on search term - memoize to prevent recalculation on every render
  const filteredObjects = useMemo(() =>
    objects.filter(obj => obj.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [objects, searchTerm]
  );

  // Group the objects by their type for better organization - memoize for performance
  const groupedObjects = useMemo(() => {
    return filteredObjects.reduce<Record<string, ModelObject[]>>((groups, obj) => {
      // Extract a group name from the object name (e.g., "Box024_Material_#5_0" -> "Box")
      const parts = obj.name.split(/[_\d]/); // Split by underscore or digits
      const groupKey = parts[0] || 'Other';

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(obj);
      return groups;
    }, {});
  }, [filteredObjects]);

  // Flag for when no objects are found after filtering
  const noObjectsFound = useMemo(() =>
    filteredObjects.length === 0 && searchTerm !== '',
    [filteredObjects.length, searchTerm]
  );

  // Bulk toggle for a specific group - memoize to prevent recreation
  const toggleGroupVisibility = useCallback((groupObjects: ModelObject[], setVisible: boolean) => {
    setObjects(prevObjects => {
      // Create a new array with updated visibility for the group objects
      return prevObjects.map(obj => {
        const matchingGroupObj = groupObjects.find(groupObj => groupObj.name === obj.name);
        if (matchingGroupObj) {
          // Update the actual 3D object visibility
          obj.object.visible = setVisible;
          // Return a new object with updated visibility
          return { ...obj, visible: setVisible };
        }
        return obj;
      });
    });
  }, []);

  // Bulk toggle for all objects - memoize to prevent recreation
  const toggleAllVisibility = useCallback((setVisible: boolean) => {
    setObjects(prevObjects => {
      // Update all objects with the new visibility in a single state update
      const updatedObjects = prevObjects.map(obj => {
        // Update the actual 3D object visibility
        obj.object.visible = setVisible;
        // Return a new object with updated visibility
        return { ...obj, visible: setVisible };
      });
      return updatedObjects;
    });
  }, []);

  // Memoize the clear search handler
  const handleClearSearch = useCallback(() => setSearchTerm(''), []);

  if (!model) {
    return <div className="p-4 bg-gray-700 rounded text-gray-300">No model loaded.</div>;
  }

  if (objects.length === 0) {
    return <div className="p-4 bg-gray-700 rounded text-gray-300">No objects found in the model.</div>;
  }

  return (
    <div className="rounded-lg">
      <p className="text-sm text-gray-400 mb-4">
        Toggle object visibility to see which parts of the model correspond to which objects.
      </p>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search objects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* No results message */}
      {noObjectsFound && (
        <div className="text-center p-4 bg-gray-700 rounded-md text-gray-400">
          No objects found matching "{searchTerm}"
        </div>
      )}

      {/* Object groups */}
      {Object.entries(groupedObjects).map(([group, groupObjects]) => (
        <div key={group} className="mb-6 max-h-[200px] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h4 className="font-medium mb-2 pb-1 border-b border-gray-700 text-gray-300">{group} ({groupObjects.length})</h4>
            <div className="flex gap-2">
              <button
                onClick={() => toggleGroupVisibility(groupObjects, true)}
                className="px-2 py-1 text-xs bg-green-800 text-green-200 rounded hover:bg-green-700 transition-colors"
              >
                Show All
              </button>
              <button
                onClick={() => toggleGroupVisibility(groupObjects, false)}
                className="px-2 py-1 text-xs bg-red-800 text-red-200 rounded hover:bg-red-700 transition-colors"
              >
                Hide All
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {groupObjects.sort((a, b) => a.name.localeCompare(b.name)).map((obj) => (
              <div key={obj.name} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded transition-colors">
                <span
                  className={`text-sm truncate max-w-xs ${obj.visible ? 'font-medium text-gray-200' : 'text-gray-500'}`}
                  title={obj.name}
                >
                  {obj.name}
                </span>
                <button
                  onClick={() => toggleObjectVisibility(obj.name)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${obj.visible ? 'bg-primary-600' : 'bg-gray-600'
                    }`}
                  aria-pressed={obj.visible}
                  aria-label={`Toggle visibility of ${obj.name}`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${obj.visible ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bulk actions */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleAllVisibility(true)}
            className="px-3 py-1 bg-green-800 text-green-200 text-sm rounded hover:bg-green-700 transition-colors"
          >
            Show All Objects
          </button>
          <button
            onClick={() => toggleAllVisibility(false)}
            className="px-3 py-1 bg-red-800 text-red-200 text-sm rounded hover:bg-red-700 transition-colors"
          >
            Hide All Objects
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Total objects: {objects.length} | Visible: {objects.filter(o => o.visible).length} | Hidden: {objects.filter(o => !o.visible).length}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModelDebugger); 