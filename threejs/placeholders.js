import * as THREE from "three";

export function createPlaceholder(modelName, color = 0x888888) {
  let geometry, material, mesh;

  // Reusable wheel geometry and material for vehicles
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.2,
  });

  switch (modelName) {
    case "female":
    case "girl":
    case "woman":
      // Create a detailed female character
      const femaleGroup = new THREE.Group();

      // Body (standing)
      const femaleBodyGeometry = new THREE.CapsuleGeometry(0.25, 1.1, 8, 16);
      const femaleBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff69b4, // Pink dress
        roughness: 0.7,
        metalness: 0.1,
      });
      const femaleBodyMesh = new THREE.Mesh(
        femaleBodyGeometry,
        femaleBodyMaterial
      );
      femaleBodyMesh.position.y = 0.85;
      femaleBodyMesh.castShadow = true;
      femaleGroup.add(femaleBodyMesh);

      // Head
      const femaleHeadGeometry = new THREE.SphereGeometry(0.22, 16, 16);
      const femaleHeadMaterial = new THREE.MeshStandardMaterial({
        color: 0xfdbcb4,
        roughness: 0.9,
        metalness: 0.0,
      });
      const femaleHeadMesh = new THREE.Mesh(
        femaleHeadGeometry,
        femaleHeadMaterial
      );
      femaleHeadMesh.position.y = 1.6;
      femaleHeadMesh.castShadow = true;
      femaleGroup.add(femaleHeadMesh);

      // Hair
      const hairGeometry = new THREE.SphereGeometry(0.26, 16, 16);
      const hairMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // Brown hair
        roughness: 0.8,
      });
      const hairMesh = new THREE.Mesh(hairGeometry, hairMaterial);
      hairMesh.position.set(0, 1.65, -0.05);
      hairMesh.scale.set(1, 0.8, 1.2);
      hairMesh.castShadow = true;
      femaleGroup.add(hairMesh);

      // Arms
      const armGeometry = new THREE.CapsuleGeometry(0.08, 0.6, 8, 16);
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xfdbcb4 });

      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.4, 1.1, 0);
      leftArm.rotation.z = 0.2;
      leftArm.castShadow = true;
      femaleGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.4, 1.1, 0);
      rightArm.rotation.z = -0.2;
      rightArm.castShadow = true;
      femaleGroup.add(rightArm);

      return femaleGroup;

    case "restaurant_table":
      // Create a restaurant table
      const tableGroup = new THREE.Group();

      // Tablecloth
      const tableclothGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.02, 32);
      const tableclothMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
      });
      const tablecloth = new THREE.Mesh(tableclothGeometry, tableclothMaterial);
      tablecloth.position.y = 0.82;
      tablecloth.castShadow = true;
      tableGroup.add(tablecloth);

      // Table top
      const tableTopGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32);
      const tableTopMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.3,
        metalness: 0.1,
      });
      const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
      tableTop.position.y = 0.8;
      tableTop.castShadow = true;
      tableGroup.add(tableTop);

      // Table leg
      const tableLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
      const tableLegMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.4,
        metalness: 0.2,
      });
      const tableLeg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
      tableLeg.position.y = 0.4;
      tableLeg.castShadow = true;
      tableGroup.add(tableLeg);

      // Wine glasses
      const glassGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.15, 16);
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.0,
        metalness: 0.0,
      });

      const glass1 = new THREE.Mesh(glassGeometry, glassMaterial);
      glass1.position.set(-0.3, 0.9, -0.2);
      tableGroup.add(glass1);

      const glass2 = new THREE.Mesh(glassGeometry, glassMaterial);
      glass2.position.set(0.3, 0.9, 0.2);
      tableGroup.add(glass2);

      // Candle
      const candleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8);
      const candleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffe0,
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(0, 0.9, 0);
      tableGroup.add(candle);

      // Add flame light
      const flameLight = new THREE.PointLight(0xffaa00, 0.5, 3);
      flameLight.position.set(0, 1.0, 0);
      flameLight.castShadow = true;
      tableGroup.add(flameLight);

      return tableGroup;

    case "restaurant_chair":
      // Create a restaurant chair
      const chairGroup = new THREE.Group();

      // Seat
      const seatGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
      const seatMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.6,
      });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.y = 0.5;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Backrest
      const backrestGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.05);
      const backrest = new THREE.Mesh(backrestGeometry, seatMaterial);
      backrest.position.set(0, 0.9, -0.22);
      backrest.castShadow = true;
      chairGroup.add(backrest);

      // Chair legs
      const chairLegGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
      const chairLegMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.4,
      });

      const chairLegPositions = [
        [-0.2, 0.25, -0.2],
        [0.2, 0.25, -0.2],
        [-0.2, 0.25, 0.2],
        [0.2, 0.25, 0.2],
      ];

      chairLegPositions.forEach((pos) => {
        const leg = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        chairGroup.add(leg);
      });

      return chairGroup;

    case "flowers":
      // Create a flower bouquet
      const flowerGroup = new THREE.Group();

      // Vase
      const vaseGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 16);
      const vaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x4169e1,
        roughness: 0.2,
        metalness: 0.8,
      });
      const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
      vase.position.y = 0.15;
      vase.castShadow = true;
      flowerGroup.add(vase);

      // Flowers
      const flowerColors = [0xff1493, 0xff69b4, 0xffb6c1, 0xff0000, 0xffffe0];
      for (let i = 0; i < 5; i++) {
        const flowerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({
          color: flowerColors[i],
          roughness: 0.8,
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        const angle = (i / 5) * Math.PI * 2;
        flower.position.set(
          Math.cos(angle) * 0.08,
          0.4 + Math.random() * 0.1,
          Math.sin(angle) * 0.08
        );
        flowerGroup.add(flower);

        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.2, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({
          color: 0x228b22,
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(Math.cos(angle) * 0.05, 0.3, Math.sin(angle) * 0.05);
        flowerGroup.add(stem);
      }

      return flowerGroup;

    case "car_crashed":
      // Enhanced crashed car with more detail
      const carGroup = new THREE.Group();

      // Main body with metallic material
      const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.3,
        metalness: 0.7,
      });
      const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
      bodyMesh.position.y = 0.75;
      bodyMesh.castShadow = true;
      carGroup.add(bodyMesh);

      // Damaged roof
      const roofGeometry = new THREE.BoxGeometry(2.5, 1, 1.8);
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8,
        metalness: 0.3,
      });
      const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
      roofMesh.position.set(0.5, 1.75, 0);
      roofMesh.rotation.z = -0.2;
      roofMesh.castShadow = true;
      carGroup.add(roofMesh);

      // Enhanced wheels
      const positions = [
        [-1.5, 0.4, -0.8],
        [1.5, 0.4, -0.8],
        [-1.5, 0.4, 0.8],
        [1.5, 0.4, 0.8],
      ];

      positions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
      });

      // Add smoke/damage effect
      const smokeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.3,
      });
      const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
      smoke.position.set(1.5, 2, 0);
      carGroup.add(smoke);

      return carGroup;

    case "ambulance":
      // Enhanced ambulance
      const ambulanceGroup = new THREE.Group();

      // Main body with better materials
      const ambBodyGeometry = new THREE.BoxGeometry(5, 2.5, 2.2);
      const ambBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.8,
      });
      const ambBodyMesh = new THREE.Mesh(ambBodyGeometry, ambBodyMaterial);
      ambBodyMesh.position.y = 1.25;
      ambBodyMesh.castShadow = true;
      ambulanceGroup.add(ambBodyMesh);

      // Red cross with emissive material
      const crossGeometry = new THREE.BoxGeometry(0.3, 1, 0.1);
      const crossMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x440000,
        roughness: 0.3,
      });
      const crossV = new THREE.Mesh(crossGeometry, crossMaterial);
      crossV.position.set(2.6, 1.5, 0);
      ambulanceGroup.add(crossV);

      const crossH = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.3, 0.1),
        crossMaterial
      );
      crossH.position.set(2.6, 1.5, 0);
      ambulanceGroup.add(crossH);

      // Wheels
      const ambWheelPositions = [
        [-2, 0.5, -1],
        [2, 0.5, -1],
        [-2, 0.5, 1],
        [2, 0.5, 1],
      ];

      ambWheelPositions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        ambulanceGroup.add(wheel);
      });

      return ambulanceGroup;

    case "stretcher":
      // Enhanced stretcher
      const stretcherGroup = new THREE.Group();

      // Platform with better material
      const platformGeometry = new THREE.BoxGeometry(2, 0.1, 0.8);
      const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        roughness: 0.3,
        metalness: 0.7,
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = 0.8;
      platform.castShadow = true;
      stretcherGroup.add(platform);

      // Metal legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
      const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.2,
        metalness: 0.8,
      });

      const legPositions = [
        [-0.8, 0.4, -0.3],
        [0.8, 0.4, -0.3],
        [-0.8, 0.4, 0.3],
        [0.8, 0.4, 0.3],
      ];

      legPositions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        stretcherGroup.add(leg);
      });

      return stretcherGroup;

    case "desk":
      // Enhanced desk
      const deskGroup = new THREE.Group();

      // Desktop with wood texture
      const desktopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
      const desktopMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.6,
        metalness: 0.1,
      });
      const desktop = new THREE.Mesh(desktopGeometry, desktopMaterial);
      desktop.position.y = 0.8;
      desktop.castShadow = true;
      deskGroup.add(desktop);

      // Legs
      const deskLegGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
      const deskLegMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.5,
      });

      const deskLegPositions = [
        [-0.9, 0.4, -0.4],
        [0.9, 0.4, -0.4],
        [-0.9, 0.4, 0.4],
        [0.9, 0.4, 0.4],
      ];

      deskLegPositions.forEach((pos) => {
        const leg = new THREE.Mesh(deskLegGeometry, deskLegMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      return deskGroup;

    case "equipment":
      // Enhanced medical equipment
      const equipmentGroup = new THREE.Group();

      // Main unit with better materials
      const unitGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.6);
      const unitMaterial = new THREE.MeshStandardMaterial({
        color: 0xe6e6fa,
        roughness: 0.4,
        metalness: 0.6,
      });
      const unit = new THREE.Mesh(unitGeometry, unitMaterial);
      unit.position.y = 0.6;
      unit.castShadow = true;
      equipmentGroup.add(unit);

      // Screen with emissive glow
      const screenGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.05);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000080,
        emissive: 0x000040,
        roughness: 0.1,
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 1, 0.3);
      equipmentGroup.add(screen);

      return equipmentGroup;

    case "injured":
    case "unconscious":
      // Enhanced human figures
      const humanGroup = new THREE.Group();

      // Body with better materials
      const humanBodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
      const humanBodyMaterial = new THREE.MeshStandardMaterial({
        color: modelName === "injured" ? 0xff6b6b : 0x9b59b6,
        roughness: 0.8,
        metalness: 0.1,
      });
      const humanBodyMesh = new THREE.Mesh(
        humanBodyGeometry,
        humanBodyMaterial
      );
      humanBodyMesh.position.y = 0.3;
      humanBodyMesh.rotation.z = Math.PI / 2;
      humanBodyMesh.castShadow = true;
      humanGroup.add(humanBodyMesh);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 8, 6);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xfdbcb4,
        roughness: 0.9,
        metalness: 0.0,
      });
      const headMesh = new THREE.Mesh(headGeometry, headMaterial);
      headMesh.position.set(-0.8, 0.3, 0);
      headMesh.castShadow = true;
      humanGroup.add(headMesh);

      return humanGroup;

    case "paramedic":
      // Enhanced paramedic
      const paramedicGroup = new THREE.Group();

      // Body with medical uniform
      const paramedicBodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
      const paramedicBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 0.7,
        metalness: 0.1,
      });
      const paramedicBodyMesh = new THREE.Mesh(
        paramedicBodyGeometry,
        paramedicBodyMaterial
      );
      paramedicBodyMesh.position.y = 0.9;
      paramedicBodyMesh.castShadow = true;
      paramedicGroup.add(paramedicBodyMesh);

      // Head
      const paramedicHeadGeometry = new THREE.SphereGeometry(0.25, 8, 6);
      const paramedicHeadMaterial = new THREE.MeshStandardMaterial({
        color: 0xfdbcb4,
        roughness: 0.9,
        metalness: 0.0,
      });
      const paramedicHeadMesh = new THREE.Mesh(
        paramedicHeadGeometry,
        paramedicHeadMaterial
      );
      paramedicHeadMesh.position.y = 1.65;
      paramedicHeadMesh.castShadow = true;
      paramedicGroup.add(paramedicHeadMesh);

      // Enhanced medical bag
      const bagGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.3);
      const bagMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.6,
        metalness: 0.2,
      });
      const bagMesh = new THREE.Mesh(bagGeometry, bagMaterial);
      bagMesh.position.set(0.4, 0.5, 0);
      bagMesh.castShadow = true;
      paramedicGroup.add(bagMesh);

      return paramedicGroup;

    default:
      // Default placeholder with better material
      geometry = new THREE.BoxGeometry(1, 1, 1);
      material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.3,
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.name = modelName;
      return mesh;
  }
}

export function createTextLabel(text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 512;
  canvas.height = 128;

  // Style the text with better quality
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.font = "bold 24px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture and material
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.1,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3, 0.75, 1);

  return sprite;
}
