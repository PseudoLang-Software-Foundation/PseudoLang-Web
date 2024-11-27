import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import pkgJson from '../package.json';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Split, Maximize2, Minimize2, Info, BookOpen } from "lucide-react";
import SettingsPanel from "./SettingsPanel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { executePseudoLang, initWasm } from "@/services/pseudolang";

const WebIDE = () => {
  const CODE_STORAGE_KEY = "pseudolang-code";
  const SETTINGS_STORAGE_KEY = "pseudolang-settings";
  const APP_VERSION = pkgJson.version;

  // Load settings from localStorage
  const loadSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      debugMode: false,
      darkMode: true,
    };
  };

  const [code, setCode] = useState(() => {
    return localStorage.getItem(CODE_STORAGE_KEY) || 'DISPLAY("Hello, World!")';
  });
  const [output, setOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  
  // Initialize settings from localStorage
  const initialSettings = loadSettings();
  const [debugMode, setDebugMode] = useState(initialSettings.debugMode);
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

  // Save settings when they change
  useEffect(() => {
    const settings = { debugMode, darkMode };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [debugMode, darkMode]);

  useEffect(() => {
    localStorage.setItem(CODE_STORAGE_KEY, code);
  }, [code]);

  // Initialize WASM on component mount
  useEffect(() => {
    initWasm().catch(console.error);
  }, []);

  const AppInfo = () => (
    <div className={darkMode ? "text-gray-100" : "text-gray-900"}>
      <h2 className="text-lg font-bold">PseudoLang Web IDE</h2>
      <p className="mt-2 text-sm">
        Version: <span className="font-bold">{APP_VERSION}</span>
      </p>
    </div>
  );

  const runCode = async () => {
    setOutput("Running code...");
    try {
      const output = await executePseudoLang(code, debugMode);
      setOutput(output);
    } catch (error) {
      setOutput(error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred");
    }
  };

  return (
    <div className={`${
      isFullScreen ? "fixed inset-0 z-50" : "relative"
    } w-full h-full min-h-[600px] ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      <Card className={`h-full flex flex-col ${
        darkMode 
          ? "bg-gray-900 border-gray-800 rounded-none" 
          : "bg-white border-gray-300 shadow-md rounded-none"
      }`}>
        {/* Toolbar */}
        <div className={`flex items-center gap-2 p-2 border-b ${
          darkMode 
            ? "border-gray-800 bg-gray-900" 
            : "border-gray-300 bg-white shadow-sm"
        }`}>
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <SettingsPanel
                debugMode={debugMode}
                darkMode={darkMode}
                onDebugModeChange={setDebugMode}
                onDarkModeChange={setDarkMode}
              />
            </PopoverContent>
          </Popover>

          <a
            href="https://github.com/PseudoLang-Software-Foundation/Pseudolang/blob/main/Pseudolang.md"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-2 right-12"
          >
            <Button
              variant={"outline"}
              className="w-fit p-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4" /> 
              <span className="ml-2">Docs</span>
            </Button>
          </a>

          <Popover>
            <PopoverTrigger asChild>
              <div className="fixed top-2 right-2">
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
            <PopoverContent className={`${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <AppInfo />
            </PopoverContent>
          </Popover>
        </div>

        {/* Editor and Output */}
        <div className={`flex flex-1 ${isVerticalLayout ? "flex-col" : "flex-row"} overflow-hidden ${
          darkMode ? "" : "bg-gray-50"
        }`}>
          {/* Code Editor */}
          <div className={`${isVerticalLayout ? "h-1/2" : "w-1/2"} p-2 ${
            darkMode ? "" : "bg-white border-r border-gray-200"
          }`}>
            <Editor
              height="100%"
              defaultLanguage="cpp"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={darkMode ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
          {/* Output Console */}
          <div className={`${isVerticalLayout ? "h-1/2" : "w-1/2"} p-2 ${
            darkMode ? "bg-gray-900" : "bg-gray-50"
          }`}>
            <div className={`h-full flex flex-col border rounded-md overflow-hidden ${
              darkMode 
                ? "bg-gray-800 text-gray-100 border-gray-700" 
                : "bg-white text-gray-900 border-gray-300 shadow-md"
            }`}>
              {/* Output Title Bar */}
              <div className={`px-4 py-2 font-medium border-b ${
                darkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                Program Output
              </div>
              {/* Output Content */}
              <div className="p-4 font-mono text-sm overflow-auto whitespace-pre flex-1">
                {output || "Output will appear here..."}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebIDE;
