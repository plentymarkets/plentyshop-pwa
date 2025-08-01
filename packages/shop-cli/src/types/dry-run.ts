/**
 * Type definitions for dry-run functionality
 */

export interface Operation {
  type: string;
  path: string;
  relativePath: string;
  content: string;
  exists: boolean;
  timestamp: Date;
}
