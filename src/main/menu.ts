import { Menu, BrowserWindow, dialog } from 'electron';
import { readFile } from 'fs';

import { regexMenuOpenFile, type FileInfo } from './declarations';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  async openFile() {
    const {
      canceled,
      filePaths: [filepath],
    } = await dialog.showOpenDialog({
      properties: ['openFile'],
    });

    if (canceled) return;

    readFile(filepath, 'utf8', (err, text) => {
      const message: FileInfo =
        err == null
          ? { state: 'opened', text, filepath }
          : { state: 'error', filepath, message: err.message };
      this.mainWindow.webContents.send(regexMenuOpenFile, message);
    });
  }

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
            click: () => this.openFile(),
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              const message: FileInfo = { state: 'closed' };
              this.mainWindow.webContents.send(regexMenuOpenFile, message);
            },
          },
          {
            label: '&Quit',
            accelerator: 'Ctrl+Q',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
    ];

    return templateDefault;
  }
}
