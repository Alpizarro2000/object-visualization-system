//DatesMenu.js
import { useState, useEffect } from "react";
import ApiTools from './Api';

const DatesMenu = ({ sceneId, onSelectDate }) => {
  const [dates, setDates] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ApiTools.GetDates(sceneId);
        if (response.status === 200) {
          const data = response.data;
          if (data.length === 0) {
            console.log("No dates found for the scene");
          } else {
            const dateButtons = data.map((item) => (
              <button key={item.date_and_time} onClick={() => onSelectDate(item.date_and_time)}>
                {item.date_and_time}
              </button>
            ));
            setDates(dateButtons); // Set the array of buttons
            setDataLoaded(true);
          }
        } else {
          console.log("Error fetching dates: " + response.statusText);
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    }
  
    // Reset dates and dataLoaded state when sceneId changes
    setDates([]);
    setDataLoaded(false);
  
    // Fetch data for the new sceneId
    fetchData();
  }, [sceneId, onSelectDate]); // Include sceneId and onSelectDate in the dependency array
   // Include sceneId and onSelectDate in the dependency array

  return (
    dataLoaded && 
    <div className="dates__menu">
      <button className="dates-menu-btn">Dates</button>
      <div className="dates-dropdown-content">
        {dates} {/* Render the array of buttons */}
      </div>
    </div>
  );
};

export default DatesMenu;
