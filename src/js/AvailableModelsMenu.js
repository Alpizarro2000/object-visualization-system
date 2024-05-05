// AvailableModelsMenu.js
import React, { useState, useEffect } from "react";
import 'aframe';
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const AvailableModelsMenu = ({ showModelsMenu }) => {
    const [buttons, setButtons] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ApiTools.GetFiles();
                if (response.status === 200) {
                    const data = response.data;
                    if (data === "") {
                        console.log("No models found");
                    } else {
                        const buttons = data.map((item) => (
                            <button
                                id={`modelSpawn${item.file_id}`}
                                className="modelSpawner button"
                                key={`SpawnFile${item.file_id}`}
                                onClick={() => SpawnModel(item)}
                            >
                                {item.file_name}
                            </button>
                        ));
                        setButtons(buttons);
                        setDataLoaded(true);
                    }
                } else {
                    console.log("response.status = " + response.status);
                }
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        }

        if (!dataLoaded) {
            fetchData();
        }
    }, [dataLoaded, showModelsMenu]);

    function SpawnModel(modelData) {
        const sceneLayout = document.querySelector('a-scene');
        if (sceneLayout) {
            const player = sceneLayout.camera.el;
            const position = player.getAttribute('position');

            const entity = document.createElement('a-entity');
            entity.setAttribute('class', `nModel`);
            entity.setAttribute('gltf-model', `url(${modelData.file_url})`);
            entity.setAttribute('position', position);
            entity.setAttribute('scale', "0.001 0.001 0.001");
            entity.setAttribute('rotation', "0 0 0");
    
            sceneLayout.appendChild(entity);
        }
    }

    if (!showModelsMenu) {
        return null; // If showModelsMenu is false, don't render anything
    }
    
    return (
        dataLoaded && 
        <>
            <div className="menu spawner__menu">{buttons}</div>
        </>
    );
}

export default AvailableModelsMenu;
