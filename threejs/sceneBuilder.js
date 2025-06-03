import * as THREE from "three";
import { createPlaceholder, createTextLabel } from "./placeholders.js";

export function buildSceneFromJson(sceneJson, scene) {
  console.log("Building scene:", sceneJson.scene);

  // Clear existing objects (except lights and ground)
  const objectsToRemove = [];
  scene.traverse((child) => {
    if (
      child.userData.type === "prop" ||
      child.userData.type === "npc" ||
      child.userData.type === "label"
    ) {
      objectsToRemove.push(child);
    }
  });
  objectsToRemove.forEach((obj) => scene.remove(obj));

  // Load props
  if (sceneJson.props) {
    for (const prop of sceneJson.props) {
      console.log("Adding prop:", prop);

      const object = createPlaceholder(prop.model || prop.type);
      object.position.set(...prop.pos);
      object.userData = {
        type: "prop",
        model: prop.model || prop.type,
        originalData: prop,
      };

      // Add some random rotation for realism
      if (prop.model === "car_crashed") {
        object.rotation.y = Math.random() * 0.3 - 0.15; // Small random rotation
      }

      scene.add(object);

      // Add label for props
      const propLabel = createTextLabel(
        `${prop.type}: ${prop.model || "unknown"}`
      );
      propLabel.position.set(prop.pos[0], prop.pos[1] + 2, prop.pos[2]);
      propLabel.userData = { type: "label" };
      scene.add(propLabel);
    }
  }

  // Load NPCs
  if (sceneJson.npcs) {
    for (const npc of sceneJson.npcs) {
      console.log("Adding NPC:", npc);

      const npcMesh = createPlaceholder(npc.role);
      npcMesh.position.set(...npc.pos);
      npcMesh.userData = {
        id: npc.id,
        role: npc.role,
        state: npc.state,
        type: "npc",
        originalData: npc,
      };

      scene.add(npcMesh);

      // Create detailed label text
      let labelText = `${npc.role} (${npc.id})`;
      if (npc.state) {
        labelText += `\nState: ${npc.state}`;
      }

      const npcLabel = createTextLabel(labelText);
      npcLabel.position.set(npc.pos[0], npc.pos[1] + 2.5, npc.pos[2]);
      npcLabel.userData = { type: "label" };
      scene.add(npcLabel);

      // Add special effects for different states
      if (npc.state === "bleeding") {
        // Add red particles or glow effect
        const glowGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.6,
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.set(npc.pos[0], npc.pos[1] + 0.5, npc.pos[2]);
        glowMesh.userData = { type: "effect" };
        scene.add(glowMesh);

        // Animate the glow
        const animate = () => {
          glowMesh.material.opacity = 0.3 + 0.3 * Math.sin(Date.now() * 0.005);
          requestAnimationFrame(animate);
        };
        animate();
      }
    }
  }

  // Update UI
  updateUI(sceneJson);

  console.log("Scene built successfully");
  return scene;
}

function updateUI(sceneJson) {
  const sceneNameEl = document.getElementById("scene-name");
  const npcCountEl = document.getElementById("npc-count");
  const propCountEl = document.getElementById("prop-count");

  if (sceneNameEl) sceneNameEl.textContent = sceneJson.scene || "Unknown";
  if (npcCountEl)
    npcCountEl.textContent = sceneJson.npcs ? sceneJson.npcs.length : 0;
  if (propCountEl)
    propCountEl.textContent = sceneJson.props ? sceneJson.props.length : 0;
}

export function addInteractivity(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const userData = object.userData || object.parent?.userData;

      if (userData && (userData.type === "npc" || userData.type === "prop")) {
        console.log("Clicked object:", userData);
        alert(
          `Clicked: ${userData.type}\nDetails: ${JSON.stringify(
            userData.originalData,
            null,
            2
          )}`
        );
      }
    }
  }

  renderer.domElement.addEventListener("click", onMouseClick);
}
