// ReturnSceneTitle.js
export function ReturnSceneTitle(scene_name) {
    if (scene_name === "Untitled") {
        return(
            <div className="scene__title" style={{fontStyle: 'italic'}}>
                {scene_name}
            </div>
        )
    }
    else {
        return(
            <div className="scene__title" style={{fontWeight: 'bold'}}>
                {scene_name}
            </div>
        )
    }
    
};

export default ReturnSceneTitle;