// GetScene.js
import axios from "axios";

const GetModels = async (scene_id, scene_date) => {

    const response = await axios.get('http://localhost:2023/api/scenes/' + scene_id + '/' + scene_date, {
    });
    
    return response;
};

const GetFiles = async () => {

    const response = await axios.get('http://localhost:2023/api/files/', {
    });
    
    return response;
};

const GetScenes = async () => {

    const response = await axios.get('http://localhost:2023/api/scenes/', {
    });
    
    return response;
};

const GetDates = async (scene_id) => {

    const response = await axios.get('http://localhost:2023/api/dates/' + scene_id, {
    });
    
    return response;
};

const ApiTools = {GetModels, GetFiles, GetScenes, GetDates};

export default ApiTools;