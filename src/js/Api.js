// Api.js
import axios from "axios";

const getFile = async (file_id) => {

    const response = await axios.get('http://localhost:2023/api/files/' + file_id, {
    });
    
    //console.log(response)
    return response;
};

export default getFile;