import React, { useState } from "react";
import { Entity } from "aframe-react";
import ObjModel from "./ObjModel";
import Menu from './Menu';//huhiuhih

export function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [positions, setPositions] = useState({
    1: { x: -5, y: 0, z: -10 },
    2: { x: 0, y: 0, z: 0 },
    3: { x: 5, y: 0, z: 0 }
  });

  const entities = [
    { id: '1', name: 'PortaScanner' },
    { id: '2', name: 'LevelingFeet' },
    { id: '3', name: 'MesaTrabajo2' }
  ];

  const handleMouseDown = (event) => {
    event.preventDefault();  // Prevent default behavior to stop camera movement
    const intersectedEntity = event.detail.intersection.object.el;  // Get the A-Frame element
    if (intersectedEntity) {
        setSelectedEntity(intersectedEntity.getAttribute('id'));
        const cameraEl = document.querySelector('a-camera');
        cameraEl.setAttribute('look-controls', 'enabled: false'); // Disable camera movement
    }
  };

  const handleSelect = (id) => {
    // Set the selected entity position to the default position or a visible position
    let newPos = { x: 0, y: 0.5, z: -2 }; // Adjust initial spawn position as needed
    setPositions(prev => ({ ...prev, [id]: newPos }));
    setSelectedEntity(id);
  };

  return (
    <a-scene device-orientation-permission-ui="enabled: false">
      <a-camera>
        <Menu entities={entities} onSelect={handleSelect} />
      </a-camera>
      <a-entity environment="preset: forest; dressingAmount: 500"></a-entity>
      <ObjModel entities={entities.map(e => e.name)} positions={positions} onMouseDown={handleMouseDown} />
      <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" scale="10 10 0" color="green" />
      <a-box position="10 2 3"></a-box>
      <a-sky color="lightblue"></a-sky>
    </a-scene>
  );
}

export default App;
