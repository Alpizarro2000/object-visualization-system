// App.js
import React, { useState , useRef , useEffect} from "react";
import 'aframe';
import KeyboardShortcut from "./Shortcuts";
import ScenesMenu from "./ScenesMenu";
import ApiTools from './Api'; // Import axios functions from GetScene.js

export function App() {
  const [selectedSceneId, setSelectedSceneId] = useState(null); // State to store the selected scene ID
  const [saveWasTriggered, setSaveAsTriggered] = useState(false); // State to trigger saving
  const sceneRef = useRef(null);


  const handleUndo = () => {
    console.log('Undo action'); // Replace with your undo logic
  };

  const handleSave = async () => {
    const entities = document.querySelectorAll('a-entity');
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
      }
    }
    setSaveAsTriggered(!saveWasTriggered);
    setSaveAsTriggered(!saveWasTriggered);
  };

  useEffect(() => {
  const sceneEl = sceneRef.current;
  if (sceneEl) {
    const enterVRButton = document.createElement('button');
    enterVRButton.textContent = 'Enter VR';
    enterVRButton.style.position = 'fixed';
    enterVRButton.style.bottom = '20px';
    enterVRButton.style.right = '20px';
    enterVRButton.style.padding = '12px 24px';
    enterVRButton.style.fontSize = '16px';
    enterVRButton.style.color = 'white';
    enterVRButton.style.background = 'rgba(0,0,0,0.8)';
    enterVRButton.style.border = 'none';
    enterVRButton.style.borderRadius = '4px';
    enterVRButton.style.cursor = 'pointer';
    enterVRButton.addEventListener('click', () => {
      sceneEl.enterVR();
    });

    document.body.appendChild(enterVRButton);

    // Cleanup function to remove the button when component unmounts
    return () => {
      document.body.removeChild(enterVRButton);
    };
  }
}, []);

  return (
    <>
    <a-scene vr-mode-ui="enabled: true" ref={sceneRef}>
      <a-light type="ambient" color="#888"></a-light>
      <a-light type="directional" color="#fff" intensity="0.5" position="-1 1 -1"></a-light>
      <a-camera position="0 1.6 0" />
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
