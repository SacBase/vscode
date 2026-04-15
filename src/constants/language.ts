export const SAC_LANGUAGE_ID = "sac";
export const SAC_URI_FILE_SCHEME = "file";
export const SAC_FILE_EXTENSION = ".sac";
export const SAC_FILE_GLOB = "**/*.sac";

export const SAC_CONFIG_SECTION = "sac";
export const SAC_FORMAT_CONFIG_SECTION = "sac.format";
export const SAC_FORMAT_FILENAME = ".sac-format";

export const SAC_KEYWORD_RETURN = "return";
export const SAC_CONTROL_FLOW_KEYWORDS = ["if", "for", "while", "switch"] as const;
export const SAC_NON_FUNCTION_HEADER_KEYWORDS = [SAC_KEYWORD_RETURN, ...SAC_CONTROL_FLOW_KEYWORDS] as const;
