// Shortcuts.js
import { useEffect } from "react";

const KeyboardShortcut = ({ onUndo, onSave }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        onUndo();
      } else if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onSave]);

  return null;
};

export default KeyboardShortcut;
