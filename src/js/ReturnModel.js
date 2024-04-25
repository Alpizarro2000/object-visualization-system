export function ReturnModel(modelData) {
    return(
        <a-entity
            key={modelData.model_instance_id}
            id={modelData.model_instance_id}
            gltf-model={"url(" + modelData.file_url + ")"}
            position={modelData.position}
            scale={modelData.scale}
            material="color: white; shader: flat"
            rotation={modelData.rotation}
          >
          </a-entity>
    )
};

export default ReturnModel;