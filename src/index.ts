import type {
  PluginInitProps,
  VirtuButtonPlugin,
} from '@virtu-button/common/Plugin';
import { name as pkgName, version as pkgVersion } from '../package.json';
import { sampleAction, sampleButton } from './sample';

/**
 * プラグインの初期化時に渡されるprops
 */
export let pluginInitProps: PluginInitProps | undefined;

export const plugin: VirtuButtonPlugin = {
  schemaVersion: 1,
  id: pkgName,
  name: 'サンプルプラグイン',
  version: pkgVersion,
  description: 'サンプルプラグインです',
  // カスタムボタンに登録できるイベント
  events: [],
  // カスタムボタンに登録できるアクション
  actions: [sampleAction],
  // Pluginから提供するボタン
  controlButtons: [sampleButton],
  async init(initProps) {
    pluginInitProps = initProps;
  },
};
