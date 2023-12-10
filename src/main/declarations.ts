export type RegexResult =
  | { state: 'ok'; matches: [number, number][] | null }
  | { state: 'error'; message: string };
export type FileInfo =
  | { state: 'opened'; text: string; filepath: string }
  | { state: 'closed' }
  | { state: 'error'; filepath: string; message: string };
export const regexMenuOpenFile = 'regex-menu-open-file';
export const searchRegex = 'search-regex';
