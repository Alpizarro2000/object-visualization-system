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
  const [showCreateScenePopup, setShowCreateScenePopup] = useState(false); // State to manage the visibility of the create scene popup
  const [newSceneName, setNewSceneName] = useState(""); // State to store the new scene name
  const [creationMessage, setCreationMessage] = useState(""); // State to store the message from the creation process

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

  function handleCreateScene() {
    setShowCreateScenePopup(true);
  }

  function handleClosePopup() {
    setShowCreateScenePopup(false);
    // Clear the creation message when closing the popup
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
      // If scene created successfully, clear the new scene name and close the popup
      if (response === "Scene created successfully") {
        setNewSceneName("");
        setShowCreateScenePopup(false);
      }
    } catch (error) {
      console.error("Error creating scene:", error);
    }
  }

  // Define CSS classes for error and success messages
  const errorMessageClass = creationMessage.startsWith("Name is already taken.") ? "errorMessage" : "";
  const successMessageClass = creationMessage.trim() === "Scene created successfully." ? "successMessage" : "";
  console.log("Trimmed creation message:", creationMessage.trim());

  return (
    dataLoaded && 
    <>
      <div className="scenes__menu">
        <button onClick={handleCreateScene}>Create Scene</button>
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
            {/* Display creation message with appropriate color */}
            {creationMessage && <p className={`${errorMessageClass} ${successMessageClass}`}>{creationMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default ScenesMenu;
