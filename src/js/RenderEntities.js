// RenderEntities.js
import React from 'react';
import 'aframe';

function RenderEntities({ entities, entityRefs }) {
  // Map over the array of entities and generate <a-entity> elements for each object
  const renderedEntities = entities.map((entity, index) => (
    <a-entity
      class="grabbable"
      key={index}
      ref={el => entityRefs.current[index] = el} // Add a ref to each a-entity element
      gltf-model={entity.props && entity.props['gltf-model']}
      position={entity.props && entity.props['position']}
      scale={entity.props && entity.props['scale']} 
      rotation={entity.props && entity.props['rotation']}
      material="color: white; shader: flat"
    />
  ));

  // Render the array of <a-entity> elements within an <a-scene>
  return (
    renderedEntities
  );
}

export default RenderEntities;
