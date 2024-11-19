# PseudoLang Web Editor
Companion frontend to [PseudoLang-RunServer](https://github.com/PseudoLang-Software-Foundation/PseudoLang-RunServer)

## Hosting
*To run programs within the Web Editor, you must have access to a [PseudoLang-RunServer](https://github.com/PseudoLang-Software-Foundation/PseudoLang-RunServer).*

**1. Add RunServer url to ``src/PseudoLang.tsx``**
- Set up [PseudoLang-RunServer](https://github.com/PseudoLang-Software-Foundation/PseudoLang-RunServer) or aquire the URL of a running server
- Replace LANGSERVER_URL with the URL to your RunServer
  
**2. Run React App**
- For development purposes you can run with ``npm i && npm run dev``
- To build use ``npm i && npm run build``
