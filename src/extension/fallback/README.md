# src/extension/fallback
The code inside this folder is "oppurtunistic" / simple code to perform most basic LSP IDE features without invoking a compiler or actual Language Server. The goal of this code is to provide a basic level of functionality even when the compiler is not working, and to provide a fallback for features that are not yet implemented in the LSP server. This is meant to be a temporary solution until the LSP server is fully implemented, and should not be relied upon for long-term use.

## Features
- Formatter: Biased simple formatter based on bracket and indentation counting.
- Hover information: This feature provides hover information for symbols in the code, such as their type and documentation. It is implemented by parsing the source code and extracting relevant information about the symbols. 
- Navigation: This feature allows the user to navigate to the definition of a symbol by clicking on it or using a keyboard shortcut.
- Outline: This feature provides an outline view of the symbols in the current file, allowing the user to quickly navigate to different parts of the code.