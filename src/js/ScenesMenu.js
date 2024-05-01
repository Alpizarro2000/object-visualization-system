// ScenesMenu.js
import { useState, useEffect } from "react";
import 'aframe';
import DatesMenu from './DatesMenu';
import SceneModels from "./SceneModels";
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const ScenesMenu = () => {
  const [contents, setContents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null); // State to store the selected scene ID
  const [selectedDate, setSelectedDate] = useState('latest');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ApiTools.GetScenes();
        if (response.status === 200) {
          const data = response.data;
          if (data.length === 0) {
            console.log("No registered scenes");
          } else {
            setContents(data);
            setDataLoaded(true);
          }
        } else {
          console.log("Error fetching scenes: " + response.statusText);
        }
      } catch (error) {
        console.error("Error fetching scenes:", error);
      }
    }
    fetchData();
  }, []);

  function handleSceneSelection(sceneId) {
    setSelectedScene(sceneId);
    setSelectedDate('latest');
  }
  

  function handleSelectDate(date) {
    setSelectedDate(date);
  }

  return (
    dataLoaded && 
    <>
      <div className="scenes__menu">
        {contents.map(item => (
          <button key={item.scene_id} onClick={() => handleSceneSelection(item.scene_id)}>
            Scene {item.scene_name}
          </button>
        ))}
      </div>
      {selectedScene && <SceneModels key={selectedScene} sceneId={selectedScene} sceneDate={selectedDate} />}
      {selectedScene && selectedDate && dataLoaded && <DatesMenu key={selectedDate} sceneId={selectedScene} onSelectDate={handleSelectDate} />}
    </>
  );
}

export default ScenesMenu;
