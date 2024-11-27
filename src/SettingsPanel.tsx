import React, { useState } from "react";

interface SettingsPanelProps {
  debugMode: boolean;
  darkMode: boolean;
  onDebugModeChange: (value: boolean) => void;
  onDarkModeChange: (value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  debugMode,
  darkMode,
  onDebugModeChange,
  onDarkModeChange,
}) => {
  return (
    <div className={`p-4 space-y-4 rounded border ${
      darkMode 
        ? "bg-gray-800 text-gray-100 border-gray-700" 
        : "bg-white text-gray-900 border-gray-300"
    }`}>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <span className={darkMode ? "text-gray-100" : "text-gray-900"}>Debug Mode</span>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => onDebugModeChange(e.target.checked)}
            className={`ml-2 ${darkMode ? "accent-blue-500" : ""}`}
          />
        </label>

        <label className="flex items-center space-x-2">
          <span className={darkMode ? "text-gray-100" : "text-gray-900"}>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => onDarkModeChange(e.target.checked)}
            className={`ml-2 ${darkMode ? "accent-blue-500" : ""}`}
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;
