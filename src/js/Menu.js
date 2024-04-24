// Menu.js
import React from 'react';

const Menu = ({ entities, onSelect }) => {
  return (
    <a-entity position="0 -0.5 -1" rotation="0 0 0" visible="true">
      {entities.map((entity, index) => (
        <a-box key={index} position={`0 ${-index * 0.55} 0`} depth="0.1" height="0.4" width="1"
               color="#FFF" opacity="0.8" onClick={() => onSelect(entity.id)}>
          <a-text value={entity.name} align="center" color="#000" width="4"></a-text>
        </a-box>
      ))}
    </a-entity>
  );
};

export default Menu;