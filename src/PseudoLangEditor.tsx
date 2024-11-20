import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Split, Maximize2, Minimize2, Info } from "lucide-react";
import SettingsPanel from "./SettingsPanel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WebIDE = () => {
  const APP_VERSION = "0.2.1";
  const [code, setCode] = useState('DISPLAY("Hello World!")');
  const [output, setOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [runServerUrl, setRunServerUrl] = useState(
    "https://run.pseudo-lang.org"
  );
  const [showSettings, setShowSettings] = useState(false);

  const AppInfo = () => (
    <div>
      <h2 className="text-lg font-bold">PseudoLang Web IDE</h2>
      <p className="mt-2 text-sm">
        Version: <span className="font-bold">{APP_VERSION}</span>
        <br />
        Run Server: <span className="font-bold">{runServerUrl}</span>
      </p>
    </div>
  );

  const runCode = async () => {
    setOutput("Running code...");
    try {
      // Create a new function from the code string
      const code_arg = encodeURIComponent(code);
      const url =
        runServerUrl + "/execute?code=" + code_arg + "&debug=" + debugMode;
      let outputBuffer = "";

      const response = await fetch(url);
      const json = await response.json();
      outputBuffer = json.output;

      setOutput(outputBuffer || "Code executed successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ` + error.message);
      } else {
        setOutput("An unknown error occurred.");
      }
    }
  };

  return (
    <div
      className={`${
        isFullScreen ? "fixed inset-0 z-50 bg-white" : "relative"
      } w-full h-full min-h-[600px]`}
    >
      <Card className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b">
          <Button variant="outline" size="sm" onClick={runCode}>
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVerticalLayout(!isVerticalLayout)}
          >
            <Split
              className={`w-4 h-4 ${isVerticalLayout ? "rotate-90" : ""}`}
            />
          </Button>

          <Button onClick={() => setShowSettings(!showSettings)}>
            Settings
          </Button>
          {showSettings && (
            <SettingsPanel
              debugMode={debugMode}
              darkMode={darkMode}
              runServerUrl={runServerUrl}
              onDebugModeChange={setDebugMode}
              onDarkModeChange={setDarkMode}
              onRunServerUrlChange={setRunServerUrl}
            />
          )}

          <Popover>
            <PopoverTrigger asChild>
              <div className="fixed top-2 right-2 text-gray-200">
                <Button
                  variant={"outline"}
                  className="w-fit p-2 shadow-lg"
                  onMouseEnter={(e) => {
                    e.currentTarget.click();
                  }}
                >
                  <Info />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <AppInfo />
            </PopoverContent>
          </Popover>
        </div>

        {/* Editor and Output */}
        <div
          className={`flex flex-1 ${
            isVerticalLayout ? "flex-col" : "flex-row"
          } overflow-hidden`}
        >
          {/* Code Editor */}
          <div className={`${isVerticalLayout ? "h-1/2" : "w-1/2"} p-2`}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-full p-4 font-mono text-sm border ${
                darkMode ? "text-white bg-black" : "text-black bg-white"
              } rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
              spellCheck="false"
            />
          </div>
          {/* Output Console */}
          <div
            className={`${
              isVerticalLayout ? "h-1/2" : "w-1/2"
            } bg-gray-100 p-2`}
          >
            <div className="h-full p-4 font-mono text-sm bg-white border rounded overflow-auto">
              {output || "Output will appear here..."}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebIDE;
