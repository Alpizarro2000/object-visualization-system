import React, { useState, useEffect } from "react";
import ApiTools from './Api';

const DatesMenu = React.memo(({ sceneId, onSelectDate, saveWasTriggered }) => {
  const [dateButtons, setDateButtons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datesExist, setDatesExist] = useState(false); // State to track if dates exist for the scene
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility
  const [buttonHeight, setButtonHeight] = useState(0); // State to store the height of a single button
  const maxButtonsToShow = 5; // Maximum number of buttons to display in the dropdown

  // Define the shared button styles
  const buttonStyles = {
    fontSize: '14px',
    color: 'white',
    backgroundColor: 'rgb(27, 27, 27)',
    padding: '10px 4px',
    margin: '3px',
    display: 'block',
    width: '170px',
    height: '40px',
    transition: 'background-color 0.3s, transform 0.3s', // Add transition for smooth animation
  };

  const hoverStyles = {
     // Add scale effect on hover
  };

  useEffect(() => {
    // Calculate the height of a single button including margin and padding
    const tempButton = document.createElement('button');
    tempButton.style.cssText = `
      ${buttonStyles.padding};
      ${buttonStyles.margin};
      ${buttonStyles.width};
      ${buttonStyles.height};
      position: absolute;
      visibility: hidden;
    `;
    tempButton.innerText = 'Temp';
    document.body.appendChild(tempButton);
    const tempButtonHeight = tempButton.offsetHeight;
    const tempButtonStyle = window.getComputedStyle(tempButton);
    const tempButtonMarginTop = parseInt(tempButtonStyle.marginTop);
    const tempButtonMarginBottom = parseInt(tempButtonStyle.marginBottom);
    const tempButtonPaddingTop = parseInt(tempButtonStyle.paddingTop);
    const tempButtonPaddingBottom = parseInt(tempButtonStyle.paddingBottom);
    const totalButtonHeight = tempButtonHeight + tempButtonMarginTop + tempButtonMarginBottom + tempButtonPaddingTop + tempButtonPaddingBottom;
    document.body.removeChild(tempButton);
    setButtonHeight(totalButtonHeight);
  }, []);

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
            const newDateButtons = data.map((item, index) => (
              <button className="date__buttons" key={item.date_and_time} onClick={() => onSelectDate(item.date_and_time)} style={buttonStyles}>
                {formatDate(item.date_and_time)}
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
  }, [sceneId, onSelectDate, saveWasTriggered]);

  // Function to format the date string into a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as per your requirement
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Calculate the maximum height of the dropdown menu based on the number of buttons to display
  const maxDropdownHeight = buttonHeight * maxButtonsToShow;

  // Conditionally render the DatesMenu based on whether dates exist
  if (!datesExist) {
    return null;
  }

  return (
    <div className="menu dates__menu">
      <button className="dates-main-btn" style={buttonStyles} onClick={toggleDropdown}>
        {formatDate(dateButtons[0].key)} {/* Display the date from the first button */}
      </button>
      <div className="dates-dropdown-content" style={{ opacity: dropdownVisible ? 1 : 0, maxHeight: dropdownVisible ? `${maxDropdownHeight}px` : 0, overflow: 'hidden', transition: 'max-height 0.25s, opacity 0.25s', overflowY: 'auto' }}>
        {loading ? ( // Display loading indicator if data is being fetched
          <p>Loading...</p>
        ) : (
          dateButtons.length > 1 && dateButtons.slice(1) // Render additional date buttons excluding the first one
        )}
      </div>
    </div>
  );
});

export default DatesMenu;
