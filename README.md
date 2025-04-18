# 3D Product Customizer

A React-based 3D product customization tool that allows customers to customize products in real-time using Three.js and React Three Fiber.

![Product Customizer Screenshot](./screenshot.png)

## Features

- **Real-time 3D visualization** - See changes instantly as you customize
- **Model Debugging Tools** - Easily inspect and debug 3D models
- **Fully customizable** - Add various options like colors, materials, dimensions
- **Responsive design** - Works on desktop and mobile devices
- **Dark theme** - Easy on the eyes for extended use
- **Dynamic model loading** - Support for multiple GLB models
- **Price calculation** - Automatic price updates based on selected options

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/product-customiser.git
   cd product-customiser
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Adding Your 3D Models

1. Place your GLB models in the `public/models` directory
2. Models will automatically appear as tabs in the demo page
3. For production use, update the model configurations in your application code

## Configuration

The customizer can be configured with various options:

```typescript
const modelConfig = {
  productId: 'unique-id',
  productName: 'Product Name',
  modelPath: '/models/your-model.glb',
  initialPrice: 199.99,
  currency: 'USD',
  options: [
    // Color options
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      variants: [
        { id: 'red', name: 'Red', value: '#FF0000' },
        { id: 'blue', name: 'Blue', value: '#0000FF', price: 10 },
      ]
    },
    // Toggle options
    {
      id: 'feature',
      name: 'Special Feature',
      type: 'toggle',
      variants: [
        { id: 'off', name: 'No', value: false },
        { id: 'on', name: 'Yes', value: true, price: 25 }
      ]
    },
    // Many more options available...
  ]
}
```

## Option Types

The following option types are supported:

- `color` - Color selections with hex values
- `material` - Material selections (textures, etc.)
- `dimension` - Size adjustments (width, height, depth)
- `count` - Numerical options (quantity, number of parts)
- `toggle` - Boolean options (on/off features)
- `select` - Selection from a list of options

## Model Debugger

The built-in model debugger allows you to:

1. View all objects in the 3D model
2. Toggle visibility of individual objects
3. Group objects by type/name
4. Search for specific objects
5. Show/hide groups of objects
6. Monitor object states (visible/hidden)

## Building for Production

```bash
npm run build
# or
yarn build
```

This will create an optimized production build in the `build` folder.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Three.js](https://threejs.org/) - JavaScript 3D library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework 