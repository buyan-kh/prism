# Three.js Scene Renderer

A 3D scene renderer that creates interactive Three.js scenes from JSON data. This application demonstrates rendering NPCs (characters) and props (objects) in a 3D environment with realistic lighting, shadows, and first-person camera controls.

## Features

- **JSON-driven scene generation**: Load 3D scenes from structured JSON data
- **First-person walking controls**: Immersive WASD movement with pointer lock
- **Visual placeholder system**: Smart placeholder geometries for different object types
- **Click interactions**: Click on objects to view their details
- **Realistic lighting**: Directional and ambient lighting with shadows
- **Character states**: Visual effects for different NPC states (e.g., bleeding effect)
- **Responsive UI**: Real-time scene information display

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**: Navigate to `http://localhost:5173`

## Controls

- **Click the screen**: Enter first-person mode (pointer lock)
- **WASD**: Walk around the scene
- **Mouse**: Look around (automatic when pointer is locked)
- **Space**: Move up/fly
- **Shift**: Move down/crouch
- **ESC**: Exit pointer lock mode
- **Click objects**: Interact with objects in the scene

## JSON Scene Format

The application accepts scene data in the following JSON format:

```json
{
  "scene": "crash_site",
  "npcs": [
    {
      "id": "injured_1",
      "role": "injured",
      "state": "bleeding",
      "pos": [-2, 0, -5]
    }
  ],
  "props": [
    {
      "type": "vehicle",
      "model": "car_crashed",
      "pos": [0, 0, -10]
    }
  ]
}
```

### NPC Object Properties

- `id`: Unique identifier for the NPC
- `role`: Type of character (`injured`, `unconscious`, `paramedic`)
- `state`: Current state (optional, e.g., `bleeding`)
- `pos`: 3D position as `[x, y, z]` array

### Prop Object Properties

- `type`: Category of the prop
- `model`: Specific model name (e.g., `car_crashed`)
- `pos`: 3D position as `[x, y, z]` array

## Supported Object Types

### NPCs

- **injured**: Red colored figure lying down
- **unconscious**: Purple colored figure lying down
- **paramedic**: Green standing figure with medical bag

### Props

- **car_crashed**: Damaged vehicle with tilted roof and wheels

## File Structure

```
threejs/
├── index.html          # Main HTML entry point
├── main.js            # Application entry point
├── sceneSetup.js      # Three.js scene initialization
├── sceneBuilder.js    # JSON to 3D scene conversion
├── placeholders.js    # Placeholder geometry creation
├── controls.js        # First-person camera control system
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Extending the Application

### Adding New Object Types

1. **Add to placeholders.js**: Create new geometry in the `createPlaceholder()` function
2. **Update sceneBuilder.js**: Add any special behaviors or effects
3. **Test with JSON**: Add your new object type to the scene JSON

### Example: Adding a New NPC Type

```javascript
// In placeholders.js
case 'doctor':
  const doctorGroup = new THREE.Group();
  // ... create doctor geometry
  return doctorGroup;
```

### Adding Visual Effects

Special effects can be added in `sceneBuilder.js` based on object states:

```javascript
if (npc.state === "critical") {
  // Add pulsing red effect
  const effect = createPulsingEffect();
  scene.add(effect);
}
```

## Building for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder ready for deployment.

## Browser Compatibility

- Modern browsers with WebGL support and Pointer Lock API
- Chrome 58+, Firefox 55+, Safari 11+, Edge 79+

## Performance Notes

- Placeholder geometries are optimized for performance
- Shadows are enabled for realism but can be disabled for better performance
- Scene supports hundreds of objects with good frame rates
- First-person controls are smooth and responsive

## Future Enhancements

- [ ] Load real 3D models (.glb/.gltf files)
- [ ] Animation system for NPCs
- [ ] Physics integration with collision detection
- [ ] Multiple scene support
- [ ] Real-time scene editing
- [ ] VR/AR support

## Dependencies

- **Three.js**: 3D graphics library with PointerLockControls
- **Vite**: Development server and build tool

## License

MIT License - feel free to use this code in your projects!
