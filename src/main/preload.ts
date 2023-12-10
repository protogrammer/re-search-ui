// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type RegexResult =
  | { state: 'ok'; matches: [number, number][] | null }
  | { state: 'err'; message: string };
export type OpenFileCbArg = [{ ok: string | null } | { err: string }, string];
const chanRegexMenuOpenFile = 'regex-menu-open-file';

const electronHandler = {
  onFileOpen(callback: (value: OpenFileCbArg) => void) {
    const subscription = (
      _event: IpcRendererEvent,
      [value, path]: OpenFileCbArg,
    ) => {
      callback([value, path]);
    };
    ipcRenderer.on(chanRegexMenuOpenFile, subscription);
    return () => {
      ipcRenderer.removeListener(chanRegexMenuOpenFile, subscription);
    };
  },
  searchRegex(
    regexText: string,
    flags: string,
    filename: string | null,
  ): Promise<RegexResult> {
    return ipcRenderer.invoke('search-regex', [regexText, flags, filename]);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
