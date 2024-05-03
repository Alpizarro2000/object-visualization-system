import React, { useState, useEffect } from "react";
import 'aframe';
import DatesMenu from './DatesMenu';
import SceneModels from "./SceneModels";
import ApiTools from './Api';
import '../css/gui-tool-styles.css';

const ScenesMenu = ({ onSceneSelection }) => {
  const [contents, setContents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [showCreateScenePopup, setShowCreateScenePopup] = useState(false);
  const [newSceneName, setNewSceneName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [reloadScenes, setReloadScenes] = useState(false); // State to trigger reloading of scenes

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
  }, [reloadScenes]); // Trigger useEffect on reloadScenes change

  function handleSceneSelection(sceneId) {
    setSelectedScene(sceneId);
    setSelectedDate('latest');
    onSceneSelection(sceneId);
  }
  
  function handleSelectDate(date) {
    setSelectedDate(date);
  }

  function handleCreateScene() {
    setShowCreateScenePopup(true);
  }

  function handleClosePopup() {
    setShowCreateScenePopup(false);
    setCreationMessage("");
  }

  function handleSceneNameChange(event) {
    setNewSceneName(event.target.value);
  }

  async function handleGenerateScene(event) {
    event.preventDefault();
    try {
      const response = await ApiTools.CreateScene(newSceneName);
      setCreationMessage(response);
      if (response === "Scene created successfully.") {
        setNewSceneName("");
        setShowCreateScenePopup(false);
        setReloadScenes(!reloadScenes); // Toggle reloadScenes to trigger reload
      }
    } catch (error) {
      console.error("Error creating scene:", error);
    }
  }

  useEffect(() => {
    // Cleanup function to remove all a-entities when a new scene is selected
    function cleanupScene() {
      const entities = document.querySelectorAll('a-entity');
      entities.forEach(entity => entity.parentNode.removeChild(entity));
    }

    if (selectedScene !== null) {
      cleanupScene(); // Remove all a-entities when a new scene is selected
    }
  }, [selectedScene]);

  const errorMessageClass = creationMessage.startsWith("Name is already taken.") ? "errorMessage" : "";
  const successMessageClass = creationMessage.trim() === "Scene created successfully." ? "successMessage" : "";

  return (
    dataLoaded && 
    <>
      <div className="menu scenes__menu">
        <button className="THE__button" onClick={handleCreateScene}>CREATE SCENE</button>
        {contents.map(item => (
          <button key={item.scene_id} onClick={() => handleSceneSelection(item.scene_id)}>
            Scene {item.scene_name}
          </button>
        ))}
      </div>
      
      {selectedScene && <SceneModels key={selectedScene} sceneId={selectedScene} sceneDate={selectedDate} />}
      {selectedScene && selectedDate && dataLoaded && <DatesMenu key={selectedDate} sceneId={selectedScene} onSelectDate={handleSelectDate} />}
      
      {/* Create Scene Popup */}
      {showCreateScenePopup && (
        <div className="popup">
          <div className="popup__content">
            <h2>Create Scene</h2>
            <div className="popup__buttons_and_form">
              <form onSubmit={handleGenerateScene}>
                <label>
                  Scene name:
                  <input type="text" value={newSceneName} onChange={handleSceneNameChange} />
                </label>
                <div className="formButtons">
                  <button type="submit">Generate</button>
                  <button type="button" onClick={handleClosePopup}>Cancel</button>
                </div>
              </form>
            </div>
            {creationMessage && <p className={`${errorMessageClass} ${successMessageClass}`}>{creationMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default ScenesMenu;
