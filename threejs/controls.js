import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class FirstPersonControls {
  constructor(camera, renderer) {
    this.camera = camera;
    this.domElement = renderer.domElement;

    // Initialize PointerLockControls
    this.controls = new PointerLockControls(camera, this.domElement);

    // Movement settings
    this.moveSpeed = 10.0;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
    };

    // Movement vectors
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Initialize
    this.init();
  }

  init() {
    // Add pointer lock controls to scene (this adds the controls object to the scene)
    // We'll handle this in the main.js file

    // Instructions overlay
    this.createInstructions();

    // Event listeners for keys
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    // Pointer lock events
    this.controls.addEventListener("lock", () => {
      this.hideInstructions();
    });

    this.controls.addEventListener("unlock", () => {
      this.showInstructions();
    });
  }

  createInstructions() {
    const instructions = document.createElement("div");
    instructions.id = "instructions";
    instructions.innerHTML = `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 1000;
        cursor: pointer;
      ">
        <h2>Click to Play</h2>
        <p>Use WASD to move around</p>
        <p>Use mouse to look around</p>
        <p>Space/Shift for up/down movement</p>
        <p>Click objects to inspect them</p>
        <small>Press ESC to exit pointer lock</small>
      </div>
    `;

    instructions.addEventListener("click", () => {
      this.controls.lock();
    });

    document.body.appendChild(instructions);
  }

  showInstructions() {
    const instructions = document.getElementById("instructions");
    if (instructions) {
      instructions.style.display = "block";
    }
  }

  hideInstructions() {
    const instructions = document.getElementById("instructions");
    if (instructions) {
      instructions.style.display = "none";
    }
  }

  onKeyDown(event) {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = true;
        break;
      case "KeyS":
        this.keys.backward = true;
        break;
      case "KeyA":
        this.keys.left = true;
        break;
      case "KeyD":
        this.keys.right = true;
        break;
      case "Space":
        event.preventDefault();
        this.keys.up = true;
        break;
      case "ShiftLeft":
        this.keys.down = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = false;
        break;
      case "KeyS":
        this.keys.backward = false;
        break;
      case "KeyA":
        this.keys.left = false;
        break;
      case "KeyD":
        this.keys.right = false;
        break;
      case "Space":
        this.keys.up = false;
        break;
      case "ShiftLeft":
        this.keys.down = false;
        break;
    }
  }

  update(deltaTime) {
    // Only update movement if pointer is locked
    if (!this.controls.isLocked) return;

    // Reset velocity
    this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
    this.velocity.z -= this.velocity.z * 10.0 * deltaTime;
    this.velocity.y -= this.velocity.y * 10.0 * deltaTime;

    // Get direction vectors
    this.direction.z = Number(this.keys.forward) - Number(this.keys.backward);
    this.direction.x = Number(this.keys.right) - Number(this.keys.left);
    this.direction.y = Number(this.keys.up) - Number(this.keys.down);
    this.direction.normalize();

    // Apply movement
    if (this.keys.forward || this.keys.backward) {
      this.velocity.z -= this.direction.z * this.moveSpeed * deltaTime;
    }
    if (this.keys.left || this.keys.right) {
      this.velocity.x -= this.direction.x * this.moveSpeed * deltaTime;
    }
    if (this.keys.up || this.keys.down) {
      this.velocity.y += this.direction.y * this.moveSpeed * deltaTime;
    }

    // Move the camera
    this.controls.moveRight(-this.velocity.x * deltaTime);
    this.controls.moveForward(-this.velocity.z * deltaTime);

    // Handle vertical movement manually since PointerLockControls doesn't support it by default
    this.camera.position.y += this.velocity.y * deltaTime;

    // Prevent going below ground (assuming ground is at y=0)
    if (this.camera.position.y < 0.5) {
      this.camera.position.y = 0.5;
      this.velocity.y = 0;
    }
  }

  // Method to get the controls object for adding to scene
  getObject() {
    return this.controls.getObject();
  }

  // Method to dispose of controls
  dispose() {
    this.controls.dispose();
    const instructions = document.getElementById("instructions");
    if (instructions) {
      instructions.remove();
    }
  }
}
