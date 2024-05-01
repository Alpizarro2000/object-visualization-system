//App.js
import React from "react";
import 'aframe';
import KeyboardShortcut from "./Shortcuts";
import AvailableModelsMenu from './AvailableModelsMenu';
import ScenesMenu from "./ScenesMenu";

export function App() {
  const handleUndo = () => {
    console.log('Undo action'); // Replace with your undo logic
  };

  const handleSave = () => {
    console.log('Save action'); // Replace with your save logic
  };

  return (
    <a-scene vr-mode-ui="enabled: true">
      <div className="scene__title">Untitled</div>
      <a-camera position="0 1.6 0" />
      <AvailableModelsMenu />
      <ScenesMenu />
      <KeyboardShortcut onUndo={handleUndo} onSave={handleSave} />
      <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" scale="10 10 0" color="green" />
      <a-sky color="lightblue" />
    </a-scene>
  );
}

export default App;
