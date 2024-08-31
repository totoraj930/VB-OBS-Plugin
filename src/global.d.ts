import Electron from 'electron';

declare global {
  namespace NodeJS {
    interface Global {
      Electron: typeof Electron;
    }
  }
}
