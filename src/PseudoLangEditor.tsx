import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import pkgJson from '../package.json';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Split, Info, BookOpen } from "lucide-react";
import SettingsPanel from "./SettingsPanel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { executePseudoLang, initWasm, getPseudoLangVersion } from "@/services/pseudolang";

const WebIDE = () => {
  const CODE_STORAGE_KEY = "pseudolang-code";
  const SETTINGS_STORAGE_KEY = "pseudolang-settings";
  const APP_VERSION = pkgJson.version;

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
  const [isFullScreen] = useState(true);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  
  const initialSettings = loadSettings();
  const [debugMode, setDebugMode] = useState(initialSettings.debugMode);
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
  const [plVersion, setPlVersion] = useState<string>("");

  useEffect(() => {
    const settings = { debugMode, darkMode };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [debugMode, darkMode]);

  useEffect(() => {
    localStorage.setItem(CODE_STORAGE_KEY, code);
  }, [code]);

  useEffect(() => {
    initWasm()
      .then(() => getPseudoLangVersion())
      .then(version => setPlVersion(version))
      .catch(console.error);
  }, []);

  const AppInfo = () => (
    <div className={darkMode ? "text-gray-100" : "text-gray-900"}>
      <h2 className="text-lg font-bold">PseudoLang Web IDE</h2>
      <p className="mt-2 text-sm space-y-1">
        <div>Web Version: <span className="font-bold">{APP_VERSION}</span></div>
        <div>PseudoLang Version: <span className="font-bold">{plVersion}</span></div>
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
    } w-full h-full min-h-[600px] ${darkMode ? "dark bg-zinc-900" : "bg-slate-50"}`}>
      <Card className={`h-full flex flex-col ${
        darkMode 
          ? "bg-zinc-900 border-zinc-800 rounded-none" 
          : "bg-white border-slate-200 shadow-md rounded-none"
      }`}>
        <div className={`flex items-center gap-2 p-2 border-b ${
          darkMode 
            ? "border-zinc-800 bg-zinc-900" 
            : "border-slate-200 bg-white"
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

        <div className={`flex flex-1 ${isVerticalLayout ? "flex-col" : "flex-row"} overflow-hidden ${
          darkMode ? "" : "bg-slate-50"
        }`}>
          <div className={`${isVerticalLayout ? "h-1/2" : "w-1/2"} p-2 ${
            darkMode ? "" : "bg-white border-r border-slate-200"
          }`}>
            <Editor
              height="100%"
              defaultLanguage="cpp"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={darkMode ? "vs-dark" : "vs"}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
          <div className={`${isVerticalLayout ? "h-1/2" : "w-1/2"} p-2 ${
            darkMode ? "bg-zinc-900" : "bg-slate-50"
          }`}>
            <div className={`h-full flex flex-col border rounded-md overflow-hidden ${
              darkMode 
                ? "bg-zinc-800 text-zinc-100 border-zinc-700" 
                : "bg-white text-slate-900 border-slate-200 shadow-sm"
            }`}>
              <div className={`px-4 py-2 font-medium border-b ${
                darkMode 
                  ? "bg-zinc-700 border-zinc-600 text-zinc-100" 
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}>
                Program Output
              </div>
              <div className={`p-4 font-mono text-sm overflow-auto whitespace-pre flex-1 ${
                darkMode ? "text-zinc-200" : "text-slate-800"
              }`}>
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
