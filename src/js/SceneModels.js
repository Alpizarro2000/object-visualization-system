import React, { useState, useEffect } from "react";
import 'aframe';
import ApiTools from './Api';
import ReturnModel from './ReturnModel';
import AvailableModelsMenu from './AvailableModelsMenu';

const SceneModels = ({ sceneId, sceneDate }) => {
    const [contents, setContents] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ApiTools.GetModels(sceneId, sceneDate);
                if (response.status === 200) {
                    const data = response.data;
                    if (data === "") {
                        console.log("Nonexistent scene");
                    } else {
                        const models = data.map(item => ReturnModel(item));
                        setContents(models);
                        setDataLoaded(true);
                    }
                } else {
                    console.log("response.status = " + response.status);
                }
            } catch (error) {
                console.error("Error fetching scene:", error);
            }
        }
        fetchData();
    }, [sceneId, sceneDate]);

    return (
        <>
            {dataLoaded && <AvailableModelsMenu/>}
            {contents}
        </>
    );
}

export default SceneModels;
