# Product Customizer Demo

This is a demonstration of the Product Customizer package showing how it can be used to create interactive 3D product configurators.

## Running the Demo

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and navigate to http://localhost:5173

## Demo Features

The demo showcases:

- Two different products (cabinet and chair) with customization options
- Real-time 3D rendering of products
- Various option types:
  - Color picker
  - Dimension sliders
  - Count controls
  - Toggle switches
  - Dropdown selects
- Real-time price updates
- Responsive design for mobile and desktop

## Demo Models

The demo requires 3D models to function properly:

1. Place your model files in the `/public/models/` directory:
   - `cabinet.glb` - For the cabinet example
   - `chair.glb` - For the chair example

2. If you don't have your own models, you can download free or paid models from:
   - [Sketchfab](https://sketchfab.com/)
   - [TurboSquid](https://www.turbosquid.com/)
   - [CGTrader](https://www.cgtrader.com/)

## Handle Images

For the handle style options, place image thumbnails in `/public/images/handles/`:
- `minimal.png`
- `classic.png`
- `modern.png`
- `none.png`

## Troubleshooting

- If the models don't appear, check the browser console for errors
- Make sure your browser supports WebGL (the demo includes a fallback notice)
- Check that the model file paths match the paths in the configuration

## Building for Production

To build the demo for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory and can be served using any static file server. 