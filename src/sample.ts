import {
  COLORS,
  ControlButton,
  ControlButtonInstance,
  PluginAction,
  SelectField,
  TextField,
} from '@virtu-button/common/Plugin';
import { pluginInitProps } from '.';

// ボタンの設定項目を定義
type FieldMap = {
  _01_mode: SelectField<'click' | 'down' | 'up'>;
  _02_text: TextField;
};

// 設定項目の実態
const fields: FieldMap = {
  _01_mode: {
    type: 'select',
    name: '表示タイミング(SelectField)',
    default: 'click',
    options: [
      { type: 'group', name: 'グループ1' },
      { key: 'click', name: 'クリックしたとき' },

      { type: 'group', name: 'グループ2' },
      { key: 'down', name: 'ダウン' },
      { key: 'up', name: 'アップ' },
    ],
  },
  _02_text: {
    type: 'text',
    name: 'メッセージ',
    default: '',
    placeholder: 'アラートに表示するメッセージ',
  },
};

// このボタンのinstanceを保持する配列
const instanceMap: Map<string, ControlButtonInstance<FieldMap>> = new Map();

// サンプルボタン
export const sampleButton: ControlButton<FieldMap> = {
  id: 'alert-button',
  name: 'サンプルボタン(アラート)',
  description: 'アラートを表示するサンプルです',
  fields,
  // ボタンがページに登録されたときに呼ばれます
  // 設定が変更された場合同じinstanceに対して複数回呼ばれる可能性があります
  async onMount(instance) {
    // instaneのMapに追加
    instanceMap.set(instance.id, instance);

    // instanceのviewPropsを変える
    pluginInitProps?.updateItemViewProps(instance.id, {
      temp: { title: 'onMount' },
    });
  },
  // ボタンがページから削除されたときに呼ばれます
  async onDestroy(instance) {
    // instanceのMapから対象を削除
    instanceMap.delete(instance.id);
  },
  // ボタンがクリックされたときに呼ばれます
  async onClick(instance) {
    const values = instance.fieldValues;
    if (values._01_mode !== 'click') return;

    // Electronはサンドボックスのglobalに公開されています
    // 取り扱いには注意してください
    await Electron.dialog.showMessageBox({
      message: 'onClick -> ' + values._02_text,
    });
  },
  // ボタンを押し込んだ時に呼ばれます
  async onDown(instance) {
    const values = instance.fieldValues;

    // instanceのスタイルを変える
    pluginInitProps?.updateStyleIndex(instance.id, 1);

    // instanceのviewPropsを変える
    pluginInitProps?.updateItemViewProps(instance.id, {
      temp: { title: 'onDown' },
    });

    if (values._01_mode !== 'down') return;
    await Electron.dialog.showMessageBox({
      message: 'onDown -> ' + values._02_text,
    });
  },
  // ボタンを離したときに呼ばれます
  async onUp(instance) {
    const values = instance.fieldValues;

    // instanceのスタイルを変える
    pluginInitProps?.updateStyleIndex(instance.id, 0);

    // instanceのviewPropsを変える
    pluginInitProps?.updateItemViewProps(instance.id, {
      temp: { title: 'onUp' },
    });

    if (values._01_mode !== 'up') return;
    await Electron.dialog.showMessageBox({
      message: 'onUp -> ' + values._02_text,
    });
  },
  // ボタンの初期スタイル
  // 複数定義することができます
  styles: [
    {
      bgOpacity: 1,
      textSize: 150,
      color: {
        // hexカラーコードならOK
        // #000000 のように必ず省略せずに！
        background: COLORS.gray[900],
        text: COLORS.gray[0],
      },
      text: '',
      // Material Symbolsをスネークケースで
      icon: 'lab_panel',
    },
    {
      bgOpacity: 1,
      textSize: 150,
      color: {
        background: COLORS.gray[900],
        text: COLORS.cyan[400],
      },
      text: '',
      // Material Symbolsをスネークケースで
      icon: 'lab_panel',
    },
  ],
};

// サンプルアクション
export const sampleAction: PluginAction<FieldMap> = {
  id: 'alert-action',
  name: 'サンプルアクション(アラート)',
  description: 'アラートを表示するアクションです',
  // 設定項目は動的に生成することもできます
  fields: (values) => {
    const temp = structuredClone(fields);
    temp._02_text.name = `メッセージ(${new Date().toLocaleTimeString()})`;
    return temp;
  },
  // 実行されたときに呼ばれます
  async run(values, payload) {
    // valuesに設定項目の値
    // payloadにはアクションの実行に関する情報が含まれています
    await Electron.dialog.showMessageBox({
      message: JSON.stringify(
        {
          values,
          prev: payload.prevResult,
        },
        null,
        '  '
      ),
    });
  },
};
