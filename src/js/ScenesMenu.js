import { useState, useEffect, React } from "react";
import 'aframe';
import SceneModels from "./SceneModels";
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const ScenesMenu = () => {
  const [contents, setContents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null); // State to store the selected scene ID

  useEffect(() => {
    // Call GetScene and handle the response using async/await
    async function fetchData() {
      let shouldContinue = true;

      try {
        const response = await ApiTools.GetScenes();
        if (response.status === 200) {
          const data = response.data;
          if (data === "") {
            console.log("No registered scenes");
          } else {
            // Map over data and create buttons for each scene
            const scenes = data.map(item => (
              <button className="sceneGetter" key={`SpawnScene${item.scene_id}`} onClick={() => SetScene(item)}>
                Scene {item.scene_name}
              </button>
            ));
            // Set the state contents with the mapped buttons
            setContents(scenes);
            setDataLoaded(true); // Set dataLoaded to true after contents have been updated
          }
        } else {
          console.log("response.status = " + response.status);
        }
      } catch (error) {
        console.error("Error fetching scene:", error);
      } finally {
        if (shouldContinue) {
          fetchData();
        }
      }
    }

    fetchData();
  }, []); // Call fetchData once on page load

  // Function to set the selected scene
  function SetScene(scene) {
    // Remove existing scene before setting the new one
    setSelectedScene(null); // Clear the selected scene first
    setTimeout(() => { // Timeout to ensure the selected scene is cleared before setting the new one
      console.log(scene.scene_id)
      setSelectedScene(scene.scene_id); // Set the new selected scene
    }, 0);
  }

  return (
    dataLoaded && 
    <>
      <div className="scenes__menu">{contents}</div>
      {selectedScene && <SceneModels key={selectedScene} scene_id={selectedScene} />} {/* Render SceneModels with the selected scene ID */}
    </>
  );
}

export default ScenesMenu;
