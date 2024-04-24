// ObjModel.js
import React from "react";

const ObjModel = ({ entities, positions, onMouseDown }) => {
  return (
    <React.Fragment>
      {/*Hardcodeamos las entidades para avanzar con el testeo*/}
      <a-entity
      >
        {entities.includes('PortaScanner') && (
          <a-entity
            id="1"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/PORTA%20SCANER%20DE%20ALUMINIO.gltf?v=1713575054445)"
            position={"-2 0 7"}
            scale="1 1 1"
            material="color: white; shader: flat"
            rotation="0 180 0"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('LevelingFeet') && (
          <a-entity
            id="2"
            gltf-model="url(https://cdn.glitch.global/a45fa6a0-9d2b-42db-85b4-f0400656de01/2019Leveling%20feetM12.gltf?v=1712882234444)"
            position={"2 0.5 7"}
            scale="1 1 1"
            color="blue"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('MesaTrabajo2') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Mesa%20de%20trabajo%202.gltf?v=1713575053245)"
            position={"0 1 9"}
            rotation={"0 180 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('Pieza1') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Pieza1.gltf?v=1713575053873)"
            position={"0 0 3"}
            rotation={"0 180 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('Estructura') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Estructura.gltf?v=1713575056288)"
            position={"2 0 3"}
            rotation={"0 0 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('LevelingFeet') && (
          <a-entity
            id="2"
            gltf-model="url(https://cdn.glitch.global/a45fa6a0-9d2b-42db-85b4-f0400656de01/2019Leveling%20feetM12.gltf?v=1712882234444)"
            position={"2 0 7"}
            scale="1 1 1"
            color="blue"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('MesaTrabajo2') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Mesa%20de%20trabajo%202.gltf?v=1713575053245)"
            position={"0 0 9"}
            rotation={"0 180 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('Pieza1') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Pieza1.gltf?v=1713575053873)"
            position={"0 0 3"}
            rotation={"0 180 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
        {entities.includes('Estructura') && (
          <a-entity
            id="3"
            gltf-model="url(https://cdn.glitch.global/5e3c8503-a0b0-42b0-895a-9c3d28f43ecc/Estructura.gltf?v=1713575056288)"
            position={"2 0 3"}
            rotation={"0 0 0"}
            scale="1 1 1"
            color="red"
            onMouseDown={onMouseDown}
          ></a-entity>
        )}
      </a-entity>
      
    </React.Fragment>
  );
};

export default ObjModel;
