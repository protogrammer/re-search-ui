import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  type FileInfo,
  type RegexResult,
  regexMenuOpenFile,
  searchRegex,
} from './declarations';

const electronHandler = {
  onFileOpen(callback: (value: FileInfo) => void) {
    const subscription = (_event: IpcRendererEvent, fileInfo: FileInfo) => {
      callback(fileInfo);
    };
    ipcRenderer.on(regexMenuOpenFile, subscription);
    return () => {
      ipcRenderer.removeListener(regexMenuOpenFile, subscription);
    };
  },
  searchRegex(
    regexText: string,
    flags: string,
    filename: string | null,
  ): Promise<RegexResult> {
    return ipcRenderer.invoke(searchRegex, regexText, flags, filename);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
