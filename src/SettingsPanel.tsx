import React, { useState } from "react";

interface SettingsPanelProps {
  debugMode: boolean;
  darkMode: boolean;
  runServerUrl: string;
  onDebugModeChange: (value: boolean) => void;
  onDarkModeChange: (value: boolean) => void;
  onRunServerUrlChange: (value: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  debugMode,
  darkMode,
  runServerUrl,
  onDebugModeChange,
  onDarkModeChange,
  onRunServerUrlChange,
}) => {
  return (
    <div className="settings-panel">
      <label>
        Debug Mode:&nbsp;
        <input
          type="checkbox"
          checked={debugMode}
          onChange={(e) => onDebugModeChange(e.target.checked)}
        />
      </label>

      <label>
        &nbsp;|&nbsp;Dark Mode:&nbsp;
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => onDarkModeChange(e.target.checked)}
        />
      </label>

      <label>
        &nbsp;|&nbsp;Run Server URL:&nbsp;
        <input
          style={{
            color: darkMode ? "white" : "black",
            background: darkMode ? "black" : "white",
            border: "1px solid",
            borderColor: darkMode ? "white" : "black",
            padding: "0.25rem",
          }}
          type="text"
          value={runServerUrl}
          onChange={(e) => onRunServerUrlChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default SettingsPanel;
