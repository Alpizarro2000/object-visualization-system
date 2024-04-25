import React from 'react';

const RenderEntities = ({ entities }) => {
  // Map over the array of entities and generate <a-entity> elements for each object
  const renderedEntities = entities.map((entity, index) => (
    <a-entity
      key={index}
      gltf-model={entity.props && entity.props['gltf-model']}
      position={entity.props && entity.props['position']}
      scale={entity.props && entity.props['scale']} 
      rotation={entity.props && entity.props['rotation']}
      material="color: white; shader: flat"
    />
  ));

  // Render the array of <a-entity> elements within an <a-scene>
  return (
    <a-scene>
      {renderedEntities}
    </a-scene>
  );
};

export default RenderEntities;