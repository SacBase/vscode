// Shared regexes used by navigation/hover parsing logic.
//! I use a lot of regexes because either the compiler cannot provide the info in a nice format, 
//! or I did not know another way to do it quickly and eaisly

export const IDENTIFIER_CHARS = "[A-Za-z_][A-Za-z0-9_]*";

export const IDENTIFIER_PATTERN = new RegExp(IDENTIFIER_CHARS);

export const FUNCTION_DEFINITION_HEADER_PATTERN = /^(\s*)(?:inline\s+)?(?:[A-Za-z0-9_\[\].,:<>\*\s]+)?\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/;

export const FUNCTION_CALL_PATTERN = /\b([A-Za-z_][A-Za-z0-9_]*)\b(?=\s*\()/g;
export const BUILTIN_FUNCTION_CALL_PATTERN = /(^|[^A-Za-z0-9_])(_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*_)(?=\s*\()/g;

export const IDENTIFIER_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
export const BUILTIN_SYMBOL_NAME_PATTERN = /^_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*_$/;

export const SAFE_DOC_NAME_PATTERN = /^[A-Za-z0-9_]+$/;

export const TOP_LEVEL_HEADING_PATTERN = /^#\s+/;
export const DOC_SECTION_HEADING_PATTERN = /^##+\s+(.+)$/;
export const SIGNATURE_CODE_BLOCK_PATTERN = /```(?:sac)?\s*\n([\s\S]*?)```/gi;

export const FUNCTION_DEFINITION_CAPTURE_PATTERN = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\([^;{}]*\)\s*\{/g;
export const MODULE_DECLARATION_CAPTURE_PATTERN = /^\s*module\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/m;

export const SYMBOL_CHAR_PATTERN = /[A-Za-z0-9_]/;
export const SYMBOL_START_CHAR_PATTERN = /[A-Za-z_]/;

export const NOISY_COMPILATION_FAILED_PATTERN = /^compilation failed\b/i;
export const NOISY_ABORT_PATTERN = /^abort\b/i;
export const PATH_BACKSLASH_PATTERN = /\\\\/g;
export const FALLBACK_DIAGNOSTIC_PATTERN = /^(.*?):(\d+)(?::(\d+)(?:-(\d+))?)?(?::\s*(warning|error|fatal|note|info))?\s*:?\s*(.*)$/i;

export const TOKEN_FOUND_WITH_COMMA_PATTERN = /,\s*`([^`]+)`\s+token\s+found/i;
export const TOKEN_FOUND_PATTERN = /token\s+`([^`]+)`\s+found/i;
export const TOKEN_CANNOT_START_PATTERN = /^token\s+([^\s]+)\s+cannot\s+start/i;
export const ALL_INSTANCES_SYMBOL_PATTERN = /all\s+instances\s+of\s+"([A-Za-z_][A-Za-z0-9_]*)"/i;
export const IN_FUNCTION_SYMBOL_PATTERN = /^--\s+in\s+[A-Za-z_][A-Za-z0-9_]*::([A-Za-z_][A-Za-z0-9_]*)\s*\(/i;
export const NON_WHITESPACE_PATTERN = /\S/;

export const ASSIGNMENT_PATTERN = /\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);\s*$/;

export const DOC_TAG_PARAM_PATTERN = /^@param\s+([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/;

export const DOC_TAG_RETURN_PATTERN = /^@return\s*(.*)$/;

export const DOC_TAG_EXAMPLE_PATTERN = /^@example\s*(.*)$/;

export const RETURN_KEYWORD_PATTERN = /\breturn\b/;

export const CONTROL_FLOW_KEYWORD_PATTERN = /\b(if|for|while|switch)\b/;

export const SINGLE_LINE_COMMENT_PATTERN = /^\s*\/\//;

export const INLINE_WITH_LOOP_PATTERN = /^return\s+with\s*\{\s*(\([^:]+\))\s*:\s*(.+?)\s*;\s*\}\s*:\s*genarray\s*\((.+)\)\s*;\s*$/;

export const INLINE_TENSOR_COMPREHENSION_PATTERN = /^return\s*\{\s*(\[[^\]]+\])\s*->\s*(.+?)\s*\|\s*(.+)\s*\}\s*;\s*$/;

export const TENSOR_RETURN_BLOCK_START_PATTERN = /^return\s*\{$/;

export const TENSOR_RETURN_BLOCK_END_PATTERN = /^\};$/;

export const TENSOR_ARROW_PATTERN = /->/;

