// App.js
import React from "react";
import 'aframe';
import AvailableModelsMenu from './AvailableModelsMenu';
import ScenesMenu from "./ScenesMenu";
import Scene from "./Scene"

export function App() {
  return (
    <a-scene vr-mode-ui="enabled: true">
      <a-camera position="0 1.6 0" scale="10 10 10">
      </a-camera>
      <AvailableModelsMenu/>
      <ScenesMenu/>
      <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" scale="10 10 0" color="green" />
      <a-sky color="lightblue"></a-sky>
    </a-scene>
  );
}

export default App;
