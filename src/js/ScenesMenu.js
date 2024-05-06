import React, { useState, useEffect } from "react";
import 'aframe';
import DatesMenu from './DatesMenu';
import ReturnSceneTitle from './ReturnSceneTitle';
import SceneModels from "./SceneModels";
import ApiTools from './Api';
import AvailableModelsMenu from './AvailableModelsMenu'; // Import AvailableModelsMenu component
import '../css/gui-tool-styles.css';

const ScenesMenu = ({ onSceneSelection, triggerSave, saveWasTriggered}) => {
  const [contents, setContents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedDate, setSelectedDate] = useState('latest');
  const [showCreateScenePopup, setShowCreateScenePopup] = useState(false);
  const [currentSceneName, setCurrentSceneName] = useState('Untitled');
  const [newSceneName, setNewSceneName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [reloadScenes, setReloadScenes] = useState(false); // State to trigger reloading of scenes
  const [showModelsMenu, setShowModelsMenu] = useState(false); // State to control the visibility of the models menu
  const [showWarning, setShowWarning] = useState(false); // State to control the visibility of the warning text

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

  function handleSceneSelection(sceneId, sceneName) {
    setCurrentSceneName(sceneName);
    setSelectedScene(sceneId);
    setSelectedDate('latest');
    onSceneSelection(sceneId);
  
    // Preserve showModelsMenu state if it was true before the scene change
    if (!showModelsMenu) {
      setShowModelsMenu(false);
    }
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
      const response = await ApiTools.CreateScene(newSceneName)
      setCreationMessage(response[0].message); 
      if (response[0].message === "Scene created successfully.") {
        setShowCreateScenePopup(false);
        setReloadScenes(!reloadScenes); // Toggle reloadScenes to trigger reload
        // Update the selected scene to the newly created scene
        const new_scene_id = response[0].new_scene_id; // Access the new scene ID from the response
        handleSceneSelection(new_scene_id, newSceneName);
        setNewSceneName("");
      }
      else {
        console.log(response[0].message);
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

  // Toggle warning text based on whether the scene is untitled and models menu is toggled
  useEffect(() => {
    setShowWarning(currentSceneName === 'Untitled' && showModelsMenu);
  }, [currentSceneName, showModelsMenu]);

  const errorMessageClass = creationMessage.startsWith("Name is already taken.") ? "errorMessage" : "";
  const successMessageClass = creationMessage.trim() === "Scene created successfully" ? "successMessage" : "";

  return (
    dataLoaded && 
    <>
      {currentSceneName && ReturnSceneTitle(currentSceneName)}
      <div className="menu scenes__menu">
        <button className="THE__button" onClick={handleCreateScene}>CREATE SCENE</button>
        {contents.map(item => (
          <button key={item.scene_id} onClick={() => handleSceneSelection(item.scene_id, item.scene_name)}>
            Scene {item.scene_name}
          </button>
        ))}
      </div>
      <div className="ribbon__menu menu">
        <button className={`save__button ${showModelsMenu}`} onClick={triggerSave}></button>
        <button className={`models__button ${showModelsMenu ? 'models__button--active' : ''}`} onClick={() => setShowModelsMenu(!showModelsMenu)}></button>
      </div>

      {showModelsMenu && <AvailableModelsMenu showModelsMenu={showModelsMenu}/>} {/* Render AvailableModelsMenu when showModelsMenu is true and no scene is selected */}
      {selectedScene && <SceneModels key={selectedScene} sceneId={selectedScene} sceneDate={selectedDate} />}
      {selectedScene && selectedDate && dataLoaded && <DatesMenu key={selectedDate} sceneId={selectedScene} onSelectDate={handleSelectDate} saveWasTriggered={saveWasTriggered}/>}
      
      {/* Create Scene Popup */}
      {showCreateScenePopup && (
        <div className="popup__overlay">
          <div className="popup__content">
            <div className="popup__buttons_and_form">
              <h2>Create Scene</h2>
              <form onSubmit={handleGenerateScene}>
                <label style={{ marginRight: '10px' }}>
                  Scene name:
                </label>
                <input type="text" value={newSceneName} onChange={handleSceneNameChange} />
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

      {/* Warning text for untitled scene and models menu toggled */}
      {showWarning && (
        <div className={`warning-text ${showWarning ? 'slide-in' : ''}`}>
          <p>Warning: models spawned in an untitled scene will be removed on scene creation/change. Please create a scene.</p>
        </div>
      )}
    </>
  );
}

export default ScenesMenu;
