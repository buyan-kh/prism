import * as THREE from "three";

export function initScene(container) {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue for outdoor crash site
  scene.fog = new THREE.Fog(0x87ceeb, 20, 100);

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Position camera at standing height for first-person view
  camera.position.set(0, 1.6, 5);

  // Create renderer with better quality settings
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Enhanced lighting setup
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  // Main directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(10, 20, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  // Secondary fill light
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
  fillLight.position.set(-5, 10, -5);
  scene.add(fillLight);

  // Add a more realistic ground with texture
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  // Create a simple procedural texture for the ground
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Create a concrete/asphalt pattern
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(0, 0, 512, 512);

  // Add some noise/texture
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 60 + 20}, ${
      Math.random() * 60 + 20
    }, ${Math.random() * 60 + 20}, 0.3)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const groundTexture = new THREE.CanvasTexture(canvas);
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(10, 10);

  const groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexture,
    color: 0x888888,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Add some environmental details (distant buildings/walls for context)
  const wallGeometry = new THREE.BoxGeometry(1, 4, 30);
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8a8a8a });

  // Background walls
  const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall1.position.set(-20, 2, 0);
  wall1.castShadow = true;
  scene.add(wall1);

  const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.position.set(20, 2, 0);
  wall2.castShadow = true;
  scene.add(wall2);

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize);

  return { scene, camera, renderer };
}
