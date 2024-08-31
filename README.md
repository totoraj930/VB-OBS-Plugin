# VirtuButton Plugin Template

VirtuButtonのプラグインテンプレートです。

## 使い方

- node >= 20
- pnpm >= 9

```shell
# クローン
git clone https://github.com/totoraj930/vb-plugin-template.git your-plugin-name

# クローンしたディレクトリに移動
cd your-plugin-name

# 依存関係のインストール
pnpm install
```

### デバッグ

.envファイルの`DEV_DIST`で指定されたディレクトリに出力されます。

詳しくは`build.mjs`を確認してください。

```shell
pnpm dev
```

### ビルド

```shell
pnpm build
```

### @virtu-button/commonの更新

```shell
pnpm update @virtu-button/common
```

## ライセンス

MIT

## 著者

Reona Oshima(totoraj)

X(Twitter): [@totoraj_game](https://x.com/totoraj_game)