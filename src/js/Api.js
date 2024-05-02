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

const UploadExistingModelChanges = async (model_instance_id, date_and_time, position, scale, rotation) => {
    try {
        // Make a POST request to the server
        const response = await axios.post('http://localhost:2023/api/UploadExistingModelChanges', {
            model_instance_id: model_instance_id,
            date_and_time: date_and_time,
            position: position,
            scale: scale,
            rotation: rotation
        });
        return response.data;
    } catch (error) {
        console.error('Error inserting or updating content changes:', error);
        throw error; // Rethrow the error for handling by the caller
    }
};



const UploadNewModelChanges = async (scene_id, file_modified_url, date_and_time, position, scale, rotation) => {
    const response = await axios.post('http://localhost:2023/api/UploadNewModelChanges', {
        scene_id: scene_id,
        file_modified_url: file_modified_url,
        date_and_time: date_and_time,
        position: position,
        scale: scale,
        rotation: rotation
    });
    return response;
};


const CreateScene = async (scene_name) => {
    try {
        const response = await axios.post(`http://localhost:2023/api/CreateScene/${scene_name}`);
        return response.data;
    } catch (error) {
        console.error('Error creating scene:', error);
        throw error;
    }
};

const ApiTools = { GetModels, GetFiles, GetScenes, GetDates, UploadExistingModelChanges, UploadNewModelChanges, CreateScene };

export default ApiTools;