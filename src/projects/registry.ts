import { type ProjectModule } from "./types";
import { kintoProject } from "./kinto";
import { rariRefundProject } from "./rari-refund";
import { babylonProject } from "./babylon";
import { saiProject } from "./sai";
import { csaiProject } from "./csai";
import { placeholderProject } from "./placeholder";

/**
 * Central registry of all recovery projects.
 * To add a new project:
 *   1. Create a folder under src/projects/<name>/
 *   2. Export a ProjectModule from its index.ts
 *   3. Import and add it to this array
 */
export const projects: ProjectModule[] = [
  kintoProject,
  rariRefundProject,
  babylonProject,
  saiProject,
  csaiProject,
  placeholderProject,
];
