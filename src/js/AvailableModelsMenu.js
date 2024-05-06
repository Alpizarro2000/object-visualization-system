import React, { useState, useEffect } from "react";
import 'aframe';
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const AvailableModelsMenu = ({ showModelsMenu }) => {
    const [buttons, setButtons] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [rotation, setRotation] = useState("0 0 0");
    const [scale, setScale] = useState("0.001 0.001 0.001");

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
                                onClick={() => setSelectedModel(item)}
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

    function handleSpawnModel() {
        if (!selectedModel) return;

        const sceneLayout = document.querySelector('a-scene');
        if (sceneLayout) {
            const player = sceneLayout.camera.el;
            const position = player.getAttribute('position');

            const entity = document.createElement('a-entity');
            entity.setAttribute('class', `nModel`);
            entity.setAttribute('gltf-model', `url(${selectedModel.file_url})`);
            entity.setAttribute('position', position);
            entity.setAttribute('scale', scale);
            entity.setAttribute('rotation', rotation);

            sceneLayout.appendChild(entity);
        }

        // Reset selected model and form values after spawning
        setSelectedModel(null);
        setRotation("0 0 0");
        setScale("0.001 0.001 0.001");
    }

    function handleCancel() {
        // Reset selected model and form values on cancel
        setSelectedModel(null);
        setRotation("0 0 0");
        setScale("0.001 0.001 0.001");
    }

    function handleChangeRotation(event) {
        setRotation(event.target.value);
    }

    function handleChangeScale(event) {
        setScale(event.target.value);
    }

    if (!showModelsMenu) {
        return null; // If showModelsMenu is false, don't render anything
    }

    if (selectedModel) {
        return (
            <div className="menu spawner__menu something_else">
                <h2>Spawn {selectedModel.file_name}</h2>
                <form className="rotationAndScale">
                    <label>
                        Rotation:
                        <input type="text" value={rotation} onChange={handleChangeRotation} />
                    </label>
                    <label>
                        Scale:
                        <input type="text" value={scale} onChange={handleChangeScale} />
                    </label>
                    <button onClick={handleSpawnModel}>Spawn</button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        );
    }

    return (
        <div className="menu spawner__menu">
            {buttons}
        </div>
    );
}

export default AvailableModelsMenu;
