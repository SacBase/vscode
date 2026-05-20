# Language Server Protocol (LSP) Server
This directory contains a simplified implementation of a Language Server Protocol (LSP) server providing a subset of "methods" specified by the 
LSP spec. The server is designed to be used in conjunction with a client (e.g., an editor extension) that communicates with it using the LSP protocol.

## Supported LSP Methods (aka ["capabilities"](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#capabilities))
The server currently aims to support the following LSP methods:
- `initialize`: Initializes the server and establishes communication with the client.
- `textDocument/didOpen`: Notifies the server when a text document is opened in the client.
- `textDocument/didChange`: Notifies the server when a text document is changed in the client.
- `textDocument/didClose`: Notifies the server when a text document is closed in the client.
- `textDocument/hover`: Provides hover information for a given position in a text document.
- `textDocument/definition`: Provides the definition location for a symbol at a given position in a text document.
- `textDocument/references`: Provides references for a symbol at a given position in a text document.

## Sac2c's "Symbols" flag
the sac2c compiler has a `-symbols` flag that outputs to stdout specific data that can be used to power some LSP features as it outputs symbols, their locations, their "parsed type" (e.g. fundef, id, etc) and when applicable a location of their definition (e.g. for function calls it outputs the location of the corresponding function definition). This is a very useful flag for powering LSP features without having to implement a full parser or AST analysis in the LSP server, and the `sac2c` module in this codebase provides helpers to invoke the compiler with this flag and parse its output.
As we need custom logic to interpret its output we have a separate module for it in `src/sac2c` and the LSP should only have 1 server.ts and these folders:
- `methods/`: contains folders for each LSP namespace
- `methods/textDocument`: contains folders for each textDocument method (e.g. `hover/`, `definition/`, etc) and the actual implementation of the method handlers.
- `methods/workspace/`: contains folders for each workspace method (e.g. `didChangeConfiguration/`, etc) and the actual implementation of the method handlers.
- `methods/window/`: contains folders for each window method (e.g. `showMessage/`, etc) and the actual implementation of the method handlers.
- etc...

## Relevant Documentation
- [Language Server - How To](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#implementing-a-language-server): A guide on how to implement a language server using the LSP protocol.
- [Language Server Protocol Specification](https://microsoft.github.io/language-server-protocol/specification): The official specification for the Language Server Protocol, detailing the methods, parameters, and expected responses