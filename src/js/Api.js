// GetScene.js
import axios from "axios";

const GetScene = async (scene_id) => {

    const response = await axios.get('http://localhost:2023/api/scenes/' + scene_id, {
    });
    
    //console.log(response)
    return response;
};

const GetModels = async () => {

    const response = await axios.get('http://localhost:2023/api/files/', {
    });
    
    //console.log(response)
    return response;
};

export default {GetScene, GetModels};