// DatesMenu.js
import { useState, useEffect } from "react";
import ApiTools from './Api';

const DatesMenu = ({ sceneId, onSelectDate }) => {
  const [dateButtons, setDateButtons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datesExist, setDatesExist] = useState(false); // State to track if dates exist for the scene

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Set loading state to true when fetching data
      try {
        const response = await ApiTools.GetDates(sceneId);
        if (response.status === 200) {
          const data = response.data;
          if (data.length === 0) {
            console.log("No dates found for the scene");
            setDatesExist(false); // Set datesExist to false if there are no dates
          } else {
            const newDateButtons = data.map((item) => (
              <button key={item.date_and_time} onClick={() => onSelectDate(item.date_and_time)}>
                {item.date_and_time}
              </button>
            ));
            setDateButtons(newDateButtons); // Update only the date buttons
            setDatesExist(true); // Set datesExist to true if dates are available
          }
        } else {
          console.log("Error fetching dates: " + response.statusText);
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      } finally {
        setLoading(false); // Set loading state to false regardless of success or failure
      }
    }
  
    // Fetch data for the new sceneId
    fetchData();
  }, [sceneId, onSelectDate]);

  // Conditionally render the DatesMenu based on whether dates exist
  if (!datesExist) {
    return null;
  }

  return (
    <div className="menu dates__menu">
      <button className="dates-menu-btn">Dates</button>
      <div className="dates-dropdown-content">
        {loading ? ( // Display loading indicator if data is being fetched
          <p>Loading...</p>
        ) : (
          dateButtons.length > 0 && dateButtons // Only render the date buttons if data is loaded and not empty
        )}
      </div>
    </div>
  );
};

export default DatesMenu;
