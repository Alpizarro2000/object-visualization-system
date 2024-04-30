import { useState, useEffect, React } from "react";
import { createRoot } from "react-dom/client";
import 'aframe';
import SceneModels from "./SceneModels";
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const ScenesMenu = () => {
  const [contents, setContents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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
            // Map (run a process over each element in an array) over data and call ReturnModel for each item
            const scenes = data.map(item => (
              <button className="sceneGetter" key={`SpawnScene${item.scene_id}`} onClick={() => SetScene(item)}>
                Scene {item.scene_name}
              </button>
            ));
            // Set the state contents with the mapped models
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

  function SetScene(scene) {
    var presentScene = document.getElementById('current__scene');
    if (presentScene == null) {
      const element = document.getElementById('root');
      const sceneRoot = createRoot(element);

      sceneRoot.render(
        <React.StrictMode>
          <SceneModels scene_id={scene.scene_id}/>
        </React.StrictMode>
      );
    } else {
 
    }
  }

  return (
    dataLoaded && 
    <>
      <div className="scenes__menu">{contents}</div>
    </>
  );
}

export default ScenesMenu;