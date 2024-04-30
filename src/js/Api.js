// GetScene.js
import axios from "axios";

const GetModels = async (scene_id) => {

    const response = await axios.get('http://localhost:2023/api/scenes/' + scene_id, {
    });
    
    //console.log(response)
    return response;
};

const GetFiles = async () => {

    const response = await axios.get('http://localhost:2023/api/files/', {
    });
    
    //console.log(response)
    return response;
};

const GetScenes = async () => {

    const response = await axios.get('http://localhost:2023/api/scenes', {
    });
    
    //console.log(response)
    return response;
};

const ApiTools = {GetModels, GetFiles, GetScenes};

export default ApiTools;