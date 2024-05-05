import { useState, useEffect } from "react";

const KeyboardShortcut = ({ onUndo, onSave }) => {
  const [shortcutActive, setShortcutActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        onUndo();
      } else if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        console.log("Ctrl + S detected");
        onSave();
    };
  }
    

    const handleKeyUp = () => {
      setShortcutActive(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onUndo, onSave, shortcutActive]);

  
  return null;
};

export default KeyboardShortcut;
