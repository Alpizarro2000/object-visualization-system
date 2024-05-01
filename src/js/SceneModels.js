// SceneModels.js
import { useState, useEffect, useRef } from "react";
import 'aframe';
import ApiTools from './Api';
import ReturnModel from './ReturnModel';

const SceneModels = ({ sceneId, sceneDate }) => { // Changed prop name to sceneDate
    const [contents, setContents] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const entityRefs = useRef([]); // Create a ref for the a-entity elements. We'll be using this to recover and modify entity properties

    useEffect(() => {
        // Call GetScene and handle the response using async/await
        async function fetchData() {
            try {
                const response = await ApiTools.GetModels(sceneId, sceneDate); // Use sceneDate instead of scene_date
                if (response.status === 200) {
                    const data = response.data;
                    if (data === "") {
                        console.log("Nonexistent scene");
                    } else {
                        // Map over data and call ReturnModel for each item
                        const models = data.map(item => ReturnModel(item));
                        // Set the state contents with the mapped models
                        setContents(models);
                        setDataLoaded(true); // Set dataLoaded to true after contents have been updated
                    }
                } else {
                    console.log("response.status = " + response.status);
                }
            } catch (error) {
                console.error("Error fetching scene:", error);
            }
        }

        fetchData();
    }, [sceneId, sceneDate]); // Call fetchData whenever sceneId or sceneDate changes

    return (
        dataLoaded && 
        contents // Pass entityRefs to RenderEntities
    );
}

export default SceneModels;
