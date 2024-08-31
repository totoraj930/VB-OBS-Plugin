import {
  PluginInitProps,
  VirtuButtonPlugin,
} from '@virtu-button/common/Plugin';
import fs from 'node:fs';
import path from 'node:path';
import OBSWebScoket from 'obs-websocket-js';
import { z } from 'zod';
import { name as pkgName, version as pkgVersion } from '../package.json';
import {
  onSceneChange,
  reMountAllSceneCBs,
  sceneAction,
  sceneCB,
  sceneEvent,
  updateAllSceneCBs,
} from './scene';
import {
  itemAction,
  itemCB,
  onSeceneItemVisibleChange,
  reMountAllItemCBs,
  updateAllItemCBs,
} from './sceneItem';

const zSettings = z.object({
  url: z.string().catch('http://localhost'),
  port: z.string().catch('4455'),
  pass: z.string().catch(''),
});

export type Settings = z.infer<typeof zSettings>;

export let settings: Settings | undefined;

export const obs = new OBSWebScoket();
export let isActive = false;
obs.on('ConnectionClosed', (error) => {
  isActive = false;
  updateAllItemCBs('Not connected', 1);
  updateAllSceneCBs('Not connected', 1);
  // console.log('ConnectionClosed', error.code, codeToStatusText(error.code));
});
obs.on('ConnectionOpened', async () => {
  console.log('ConnectionOpened');
  isActive = true;
  setTimeout(async () => {
    try {
      const { sceneUuid } = await obs.call('GetCurrentProgramScene');
      onSceneChange(sceneUuid);
      reMountAllSceneCBs();
      reMountAllItemCBs();
    } catch {}
  }, 10);
});
obs.on('ConnectionError', (error) => {
  // console.log('ConnectionError', error, codeToStatusText(error.code));
});

obs.on('CurrentProgramSceneChanged', ({ sceneUuid }) => {
  onSceneChange(sceneUuid);
});

obs.on(
  'SceneItemEnableStateChanged',
  ({ sceneUuid, sceneItemId, sceneItemEnabled }) => {
    onSeceneItemVisibleChange(sceneUuid, sceneItemId, sceneItemEnabled);
  }
);

export let pluginInitProps: PluginInitProps | undefined;

export const plugin: VirtuButtonPlugin = {
  schemaVersion: 1,
  id: pkgName,
  version: pkgVersion,
  name: 'OBSプラグイン',
  description: 'OBSを操作するプラグインです。',
  actions: [sceneAction, itemAction],
  events: [sceneEvent],
  controlButtons: [sceneCB, itemCB],
  init: async (initProps) => {
    pluginInitProps = initProps;
    settings = loadSettings(path.join(initProps.pluginPath, 'settings.json'));

    const obsUrl = `${settings.url}:${settings.port}`;
    const obsPass = `${settings.pass}`;
    try {
      await obs.connect(obsUrl, obsPass);
      const { sceneUuid } = await obs.call('GetCurrentProgramScene');
      onSceneChange(sceneUuid);
    } catch {}
    setInterval(async () => {
      if (isActive) return;
      try {
        await obs.connect(obsUrl, obsPass);
      } catch (e) {
        console.error(e);
      }
    }, 5000);
  },
};

function loadSettings(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const rawJson = JSON.parse(raw);
    const settings = zSettings.parse(rawJson);
    return settings;
  } catch {
    return zSettings.parse({});
  }
}
