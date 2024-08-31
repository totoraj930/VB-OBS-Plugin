import dotenv from 'dotenv';
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import pkg from './package.json' assert { type: 'json' };

// .envの読み込み
dotenv.config();

// 引数に"--dev"があれば開発モードにする
const isDev = process.argv.includes('--dev');

// --devがない場合の出力先
let DIST_PATH = './release/';

// 出力するディレクトリ名
const DIR_NAME = `${pkg.name}-${pkg.version}`;

// 開発モードなら出力先を.envのDEV_DISTにする
if (isDev) {
  DIST_PATH = process.env.DEV_DIST ?? DIST_PATH;
}

// 最終的な出力ファイルのパス
const outfile = path.join(DIST_PATH, DIR_NAME, 'index.cjs');

// 出力先をクリア
fs.rmSync(path.join(DIST_PATH, DIR_NAME), { force: true, recursive: true });

const ctx = await esbuild.context({
  entryPoints: ['./src/index.ts'],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node20',
  loader: {
    //Node Addonsはそのままコピーする
    '.node': 'copy',
  },
});

if (isDev) {
  // 開発モードならwatch
  console.log('👀 Watching files for changes ->', outfile);
  await ctx.watch();
} else {
  // リリースならそのまま出力
  await ctx.rebuild();
  await ctx.dispose();
  console.log('✅ Build finished ->', outfile);
}
