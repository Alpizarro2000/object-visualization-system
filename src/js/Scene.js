// Scene.js
import React, { useState, useEffect } from "react";
import 'aframe';
import Api from './Api';
import ReturnModel from './ReturnModel';
import RenderEntities from './RenderEntities';

const Scene = ({ scene_id }) => {
    const [contents, setContents] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        // Call GetScene and handle the response using async/await
        async function fetchData() {
            try {
                const response = await Api.GetScene(scene_id);
                if (response.status === 200) {
                    const data = response.data;
                    if (data === "") {
                        console.log("Nonexistent scene");
                    } else {
                        // Map (run a process over each element in an array) over data and call ReturnModel for each item
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
    }, [scene_id]); // Call fetchData whenever scene_id changes

    // Return RenderEntities only after contents have been updated
    return (
        dataLoaded && 
        RenderEntities(contents)
    );
}

export default Scene;