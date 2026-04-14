export type HoverTargetKind = "stdlib" | "builtin";

/**
 * Canonical hover target description shared by server and future clients.
 */
export interface HoverTarget {
  kind: HoverTargetKind;
  name: string;
  summary: string;
  callForm: string;
}

/**
 * Hover target hit with token range relative to a single line.
 */
export interface HoverMatch {
  target: HoverTarget;
  start: number;
  end: number;
}
