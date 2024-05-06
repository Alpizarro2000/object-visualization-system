// App.js
/* global AFRAME */
import React, { useState , useRef , useEffect} from "react";
import 'aframe';
import * as THREE from 'three';
import KeyboardShortcut from "./Shortcuts";
import ScenesMenu from "./ScenesMenu";
import ApiTools from './Api'; // Import axios functions from GetScene.js

export function App() {
  const [selectedSceneId, setSelectedSceneId] = useState(null); // State to store the selected scene ID
  const [saveWasTriggered, setSaveAsTriggered] = useState(false); // State to trigger saving
  const sceneRef = useRef(null);

  if (!AFRAME.components['grab-and-release']) {
    AFRAME.registerComponent('grab-and-release', {
      init: function() {
          this.grabbedEl = null;
          this.originalParent = null; // Store the original parent
          this.originalRotation = null; // Store the original rotation as a THREE.Euler
          this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
          this.el.addEventListener('triggerup', this.onTriggerUp.bind(this));
      },
  
      onTriggerDown: function(evt) {
          const intersectedEls = this.el.components.raycaster.intersectedEls;
          if (intersectedEls.length > 0 && !this.grabbedEl) {
              this.grabbedEl = intersectedEls[0];
              this.originalParent = this.grabbedEl.object3D.parent; // Remember the original parent
              this.originalRotation = this.grabbedEl.object3D.rotation.clone(); // Remember the original rotation
              this.el.object3D.attach(this.grabbedEl.object3D);
              this.grabbedEl.object3D.visible = true;
          }
      },
  
      onTriggerUp: function(evt) {
          if (this.grabbedEl) {
              const worldPos = new THREE.Vector3();
              this.grabbedEl.object3D.getWorldPosition(worldPos);
  
              // Remove from controller and re-parent
              this.el.object3D.remove(this.grabbedEl.object3D);
              this.originalParent.add(this.grabbedEl.object3D); // Reattach to the original parent
  
              // Reset position in global space
              this.grabbedEl.object3D.position.set(worldPos.x, worldPos.y, worldPos.z);
              this.grabbedEl.object3D.rotation.copy(this.originalRotation); // Restore the original rotation
              this.grabbedEl.object3D.visible = true;
  
              this.grabbedEl = null;
              this.originalParent = null;
              this.originalRotation = null;
          }
      }
  });
  }
  if (!AFRAME.components['pullz']) {
    AFRAME.registerComponent('pullz', {
      init: function() {
          this.el.addEventListener('abuttondown', () => this.moving = true);
          this.el.addEventListener('abuttonup', () => this.moving = false);
          this.moving = false;
      },
      tick: function() {
          if (this.moving) {
              let intersected = this.el.components.raycaster.getIntersection(this.el.sceneEl.querySelector('.grabbable'));
              if (intersected && intersected.object) {
                  let position = intersected.object.position;
                  position.z += 0.05; // Adjust to control the speed of pulling
                  intersected.object.position.copy(position);
              }
          }
      }
  });
  }
  if (!AFRAME.components['pushz']) {
    AFRAME.registerComponent('pushz', {
      init: function() {
          this.el.addEventListener('bbuttondown', () => this.moving = true);
          this.el.addEventListener('bbuttonup', () => this.moving = false);
          this.moving = false;
      },
      tick: function() {
          if (this.moving) {
              let intersected = this.el.components.raycaster.getIntersection(this.el.sceneEl.querySelector('.grabbable'));
              if (intersected && intersected.object) {
                  let position = intersected.object.position;
                  position.z -= 0.05; // Adjust to control the speed of pushing
                  intersected.object.position.copy(position);
              }
          }
      }
  });
  }
  if (!AFRAME.components['pushx']) {
    AFRAME.registerComponent('pushx', {
      init: function() {
          this.el.addEventListener('xbuttondown', () => this.moving = true);
          this.el.addEventListener('xbuttonup', () => this.moving = false);
          this.moving = false;
      },
      tick: function() {
          if (this.moving) {
              let intersected = this.el.components.raycaster.getIntersection(this.el.sceneEl.querySelector('.grabbable'));
              if (intersected && intersected.object) {
                  let position = intersected.object.position;
                  position.x -= 0.05; // Adjust to control the speed of pushing
                  intersected.object.position.copy(position);
              }
          }
      }
  });
  }
  if (!AFRAME.components['pullx']) {
    AFRAME.registerComponent('pullx', {
      init: function() {
          this.el.addEventListener('ybuttondown', () => this.moving = true);
          this.el.addEventListener('ybuttonup', () => this.moving = false);
          this.moving = false;
      },
      tick: function() {
          if (this.moving) {
              let intersected = this.el.components.raycaster.getIntersection(this.el.sceneEl.querySelector('.grabbable'));
              if (intersected && intersected.object) {
                  let position = intersected.object.position;
                  position.x += 0.05; // Adjust to control the speed of pulling
                  intersected.object.position.copy(position);
              }
          }
      }
  });
  }
  if (!AFRAME.components['thumbstick-rotate']) {
    AFRAME.registerComponent('thumbstick-rotate', {
      schema: {
          rotationSpeed: {type: 'number', default: 0.05} // Speed of rotation
      },
  
      init: function() {
          this.grabbedEl = null;
          this.el.addEventListener('triggerdown', evt => {
              const intersectedEls = this.el.components.raycaster.intersectedEls;
              if (intersectedEls.length > 0) {
                  this.grabbedEl = intersectedEls[0]; // Grab the first intersected element
              }
          });
          this.el.addEventListener('triggerup', evt => {
              this.grabbedEl = null; // Release the object
          });
          this.el.addEventListener('thumbstickmoved', this.onThumbstickMoved.bind(this));
      },
  
      onThumbstickMoved: function(evt) {
          if (!this.grabbedEl) return;
  
          const rotationSpeed = this.data.rotationSpeed * (2 * Math.PI / 360); // Convert degrees to radians
  
          // Rotate around Y-axis when thumbstick is moved left
          if (evt.detail.x < -0.95) {
              this.grabbedEl.object3D.rotateY(rotationSpeed);
          }
  
          // Rotate around X-axis when thumbstick is moved up
          if (evt.detail.y < -0.95) {
              this.grabbedEl.object3D.rotateX(rotationSpeed);
          }
      }
  });
  }
  if (!AFRAME.components['grip-delete']) {
    AFRAME.registerComponent('grip-delete', {
      init: function() {
          // Bind the gripDown method to maintain the correct 'this' context
          this.gripDown = this.gripDown.bind(this);
  
          // Add event listener for grip button down
          this.el.addEventListener('gripdown', this.gripDown);
      },
  
      gripDown: function(evt) {
          // Check for the specific hand if needed, e.g., if (evt.detail.hand === 'right')
          let intersectedEls = this.el.components.raycaster.intersectedEls;
          if (intersectedEls.length > 0) {
              let targetEl = intersectedEls[0]; // Get the first intersected element that would be "grabbed"
              console.log("Deleting object:", targetEl);
              targetEl.parentNode.removeChild(targetEl); // Remove the element from the scene
          }
      },
  
      remove: function() {
          // Clean up event listeners when the component is removed
          this.el.removeEventListener('gripdown', this.gripDown);
      }
  });
  }

{/*
AFRAME.registerComponent('interactable', {
    init: function () {
      this.moving = false; // Flag for object movement
  
      this.el.addEventListener('abuttondown', () => this.moving = true);
      this.el.addEventListener('aaxismove', this.handleMove.bind(this));
      this.el.addEventListener('abuttonup', () => this.moving = false);
  
      this.el.addEventListener('bbuttondown', () => this.moving = true);
      this.el.addEventListener('baxismove', this.handleMove.bind(this));
      this.el.addEventListener('bbuttonup', () => this.moving = false);
    },
    handleMove: function () {
      if (!this.moving) return;
  
      let intersected = this.el.components.raycaster.getIntersection(this.el.sceneEl.querySelector('.grabbable'));
      if (!intersected || !intersected.object) return;
  
      let objectPosition = intersected.object.position;
      const camera = this.el.sceneEl.camera;
  
      // Get camera's lookAt vector (direction camera is facing)
      let direction = camera.getWorldDirection(new THREE.Vector3());
  
      // Differentiate movement based on button (pull or push)
      const pullMultiplier = (this.el.id === 'controllerA') ? 1 : -1;
      direction.multiplyScalar(pullMultiplier); // Apply sign for pull/push
  
      objectPosition.add(direction.multiplyScalar(0.1)); // Adjust movement speed
  
      intersected.object.position.copy(objectPosition);
    }
  });*/}


  const handleUndo = () => {
    console.log('Undo action'); // Replace with your undo logic
  };

  const handleSave = async () => {
    const entities = document.querySelectorAll('a-entity:not(#leftHand):not(#rightHand)');
    const dateAndTime = new Date().toISOString(); // Generate dateAndTime once
    for (const entity of entities) {
      const entityId = entity.getAttribute('id');
      const entityClass = entity.getAttribute('class');
  
      if (entityId) {
        const fileModifiedUrl = entity.getAttribute('gltf-model'); // Assuming 'gltf-model' attribute contains the modified file URL
        const position = entity.getAttribute('position');
        const scale = entity.getAttribute('scale');
        const rotation = entity.getAttribute('rotation');

        const correctPosition = `${position['x']} ${position['y']} ${position['z']}`;
        const correctScale = `${scale['x']} ${scale['y']} ${scale['z']}`
        const correctRotation = `${rotation['x']} ${rotation['y']} ${rotation['z']}`

        await ApiTools.UploadExistingModelChanges(entityId, fileModifiedUrl, dateAndTime, correctPosition, correctScale, correctRotation ); // Pass dateAndTime to UploadExistingModelChanges
      } else if (entityClass && entityClass.includes('nModel')) {
        if (!selectedSceneId) {
          console.error("No scene selected for the new model instance.");
          continue; // Skip to the next iteration
        }
  
        // Get file_id from the database based on file_modified_url
        const fileModifiedUrl = entity.getAttribute('gltf-model'); // Assuming 'gltf-model' attribute contains the modified file URL
  
        const position = entity.getAttribute('position');
        const scale = entity.getAttribute('scale');
        const rotation = entity.getAttribute('rotation');
        
        const correctPosition = `${position['x']} ${position['y']} ${position['z']}`;
        const correctScale = `${scale['x']} ${scale['y']} ${scale['z']}`
        const correctRotation = `${rotation['x']} ${rotation['y']} ${rotation['z']}`

        const newModelInstanceId = await ApiTools.UploadNewModelChanges(selectedSceneId, fileModifiedUrl, dateAndTime, correctPosition, correctScale, correctRotation); // Pass dateAndTime to UploadNewModelChanges

        // Set the new id returned by the stored procedure
        entity.setAttribute('id', newModelInstanceId.data[0].new_model_instance_id);
  
        // Remove the 'nModel' class
        entity.removeAttribute('class', 'nModel');
        entity.setAttribute('class', 'grabbable');
      }
    }
    setSaveAsTriggered(!saveWasTriggered);
    setSaveAsTriggered(!saveWasTriggered);
  };

  useEffect(() => {
    const enterARButton = document.createElement('button');
    enterARButton.textContent = 'Enter AR';
    enterARButton.style.position = 'fixed';
    enterARButton.style.bottom = '20px';
    enterARButton.style.right = '20px';
    enterARButton.style.padding = '12px 24px';
    enterARButton.style.fontSize = '16px';
    enterARButton.style.color = 'white';
    enterARButton.style.background = 'rgba(0,0,0,0.8)';
    enterARButton.style.border = 'none';
    enterARButton.style.borderRadius = '4px';
    enterARButton.style.cursor = 'pointer';
    enterARButton.addEventListener('click', () => {
        document.querySelector('a-scene').enterAR();
    });

    document.body.appendChild(enterARButton);

    return () => {
        if (enterARButton.parentNode) {
            enterARButton.parentNode.removeChild(enterARButton);
        }
    };
}, []);

  return (
    <>
    <a-scene vr-mode-ui="enabled: true" ref={sceneRef}>
      <a-light type="ambient" color="#888"></a-light>
      <a-light type="directional" color="#fff" intensity="0.5" position="-1 1 -1"></a-light>
      <a-camera position="0 1.6 0" />
      <a-entity id="rightHand"
              oculus-touch-controls="hand: right"
              raycaster="objects: .grabbable; showLine: true"
              grab-and-release pullz pushz pushx pullx thumbstick-rotate grip-delete>
      </a-entity>
      <a-entity id="leftHand"
                oculus-touch-controls="hand: left"
                raycaster="objects: .grabbable; showLine: true"
                pushx pullx thumbstick-rotate>
      </a-entity>

      <ScenesMenu 
        onSceneSelection={setSelectedSceneId}
        triggerSave={handleSave}
        setSaveAsTriggered={saveWasTriggered}
      /> {/* Pass setSelectedSceneId to ScenesMenu */}
      <KeyboardShortcut onUndo={handleUndo} onSave={handleSave} />
      <a-plane position="0 0 0" rotation="-90 0 0" width="50" height="50" scale="10 10 0" color="#69615b"/>
      <a-sky color="lightblue" />
    </a-scene>
    </>
  );
}

export default App;
