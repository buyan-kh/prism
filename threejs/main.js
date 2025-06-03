import * as THREE from "three";
import { initScene } from "./sceneSetup.js";
import { buildSceneFromJson, addInteractivity } from "./sceneBuilder.js";
import { FirstPersonControls } from "./controls.js";

// Get the container element
const container = document.getElementById("scene");

// Initialize the Three.js scene
const { scene, camera, renderer } = initScene(container);

// Initialize first-person controls
const controls = new FirstPersonControls(camera, renderer);

// Add the controls object to the scene (required for PointerLockControls)
scene.add(controls.getObject());

// 💕 ROMANTIC DATE SCENE - Candlelit Dinner 💕
const exampleScene = {
  scene: "romantic_dinner",
  npcs: [
    { id: "girlfriend", role: "female", state: "smiling", pos: [0, 0, -2] },
  ],
  props: [
    { type: "furniture", model: "restaurant_table", pos: [0, 0, -1.5] },
    { type: "furniture", model: "restaurant_chair", pos: [0, 0, -0.8] }, // Your chair
    { type: "furniture", model: "restaurant_chair", pos: [0, 0, -2.2] }, // Her chair
    { type: "decoration", model: "flowers", pos: [0.3, 0.85, -1.5] },
    { type: "decoration", model: "flowers", pos: [-0.3, 0.85, -1.5] },
  ],
};

// Alternative scene examples you can uncomment:

// Enhanced Medical Facility Emergency Room
/*
const exampleScene = {
  scene: "medical_facility",
  npcs: [
    { id: "doctor_1", role: "paramedic", state: "treating", pos: [-3, 0, -2] },
    { id: "patient_1", role: "injured", state: "bleeding", pos: [-2, 0, -2] },
    { id: "nurse_1", role: "paramedic", state: "monitoring", pos: [2, 0, -4] },
    { id: "patient_2", role: "unconscious", pos: [3, 0, -4] },
    { id: "doctor_2", role: "paramedic", state: "examining", pos: [0, 0, -8] },
    { id: "patient_3", role: "injured", state: "stable", pos: [1, 0, -8] },
    { id: "security", role: "paramedic", state: "patrolling", pos: [-5, 0, -6] }
  ],
  props: [
    { type: "medical", model: "ambulance", pos: [-8, 0, 0] },
    { type: "medical", model: "stretcher", pos: [0, 0, -2] },
    { type: "medical", model: "equipment", pos: [4, 0, -2] },
    { type: "furniture", model: "desk", pos: [-1, 0, -10] },
    { type: "medical", model: "equipment", pos: [2, 0, -8] }
  ]
};
*/

// Crime Scene Investigation
/*
const exampleScene = {
  scene: "crime_scene",
  npcs: [
    { id: "detective_1", role: "paramedic", state: "investigating", pos: [-2, 0, -3] },
    { id: "forensic_1", role: "paramedic", state: "collecting_evidence", pos: [1, 0, -5] },
    { id: "witness_1", role: "injured", state: "questioning", pos: [3, 0, -2] },
    { id: "officer_1", role: "paramedic", state: "securing", pos: [-4, 0, -1] }
  ],
  props: [
    { type: "vehicle", model: "police_car", pos: [-6, 0, 2] },
    { type: "evidence", model: "crime_tape", pos: [0, 0, -4] },
    { type: "furniture", model: "desk", pos: [2, 0, -6] }
  ]
};
*/

// Military Checkpoint
/*
const exampleScene = {
  scene: "military_checkpoint", 
  npcs: [
    { id: "guard_1", role: "paramedic", state: "on_duty", pos: [-2, 0, -2] },
    { id: "guard_2", role: "paramedic", state: "patrolling", pos: [2, 0, -2] },
    { id: "civilian_1", role: "injured", state: "waiting", pos: [0, 0, -5] },
    { id: "officer", role: "paramedic", state: "commanding", pos: [0, 0, 0] }
  ],
  props: [
    { type: "military", model: "barrier", pos: [-3, 0, -1] },
    { type: "military", model: "barrier", pos: [3, 0, -1] },
    { type: "vehicle", model: "military_truck", pos: [0, 0, -8] },
    { type: "equipment", model: "watchtower", pos: [5, 0, 0] }
  ]
};
*/

// Build the scene from JSON
buildSceneFromJson(exampleScene, scene);

// Add click interactions
addInteractivity(scene, camera, renderer);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  // Update controls
  controls.update(deltaTime);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

console.log("Three.js scene initialized successfully!");
console.log("🌹 Welcome to your romantic dinner date! 🌹");
console.log("Click the screen to enter first-person mode");
console.log(
  "Controls: WASD to walk, mouse to look around, Space/Shift for up/down"
);
console.log("Click on objects to see their details");

// Export for potential external use
export { scene, camera, renderer, exampleScene };
