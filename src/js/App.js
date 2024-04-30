// App.js
import React from "react";
import 'aframe';
import AvailableModelsMenu from './AvailableModelsMenu';
import SceneModels from "./SceneModels";
import ScenesMenu from "./ScenesMenu";
import '../css/gui-tool-styles.css';

export function App() {
  return (
    <a-scene vr-mode-ui="enabled: true">
      <div class="scene__title">Untitled</div>
      <a-camera position="0 1.6 0">
      </a-camera>
      <AvailableModelsMenu/>
      <SceneModels scene_id={3}/>
      <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" scale="10 10 0" color="green" />
      <a-sky color="lightblue"></a-sky>
    </a-scene>
  );
}

export default App;
