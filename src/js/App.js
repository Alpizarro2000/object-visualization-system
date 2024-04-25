// App.js
import React from "react";
import 'aframe';
import Scene from "./Scene"

export function App() {
  return (
    <a-scene device-orientation-permission-ui="enabled: false">
      <a-camera position="1 1 1" scale="10 10 10">
      </a-camera>
      <a-entity scale="0.004 0.004 0.004">
      <Scene scene_id={2}/>
      </a-entity>
      <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" scale="10 10 0" color="green" />
      <a-sky color="lightblue"></a-sky>
    </a-scene>
  );
}

export default App;
