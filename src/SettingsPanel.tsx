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
        ? "bg-zinc-800 text-zinc-100 border-zinc-700" 
        : "bg-white text-slate-900 border-slate-200"
    }`}>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <span className={darkMode ? "text-zinc-100" : "text-slate-700"}>Debug Mode</span>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => onDebugModeChange(e.target.checked)}
            className={`ml-2 ${darkMode ? "accent-blue-500" : "accent-blue-600"}`}
          />
        </label>

        <label className="flex items-center space-x-2">
          <span className={darkMode ? "text-zinc-100" : "text-slate-700"}>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => onDarkModeChange(e.target.checked)}
            className={`ml-2 ${darkMode ? "accent-blue-500" : "accent-blue-600"}`}
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;
