# 実装規約（Agy用）

Agyはこのファイルと `TASKS.md` を読んで実装を進める。Claude Codeは自動でこのファイルを
読み込まないので、実装の詳細はここに書いてよい。

## 技術スタック
（DESIGN.mdの決定に従って記入）

## コーディング規約
-

## テスト・ビルドコマンド
-

## ディレクトリ構成方針
-

## やってはいけないこと
-

## 仕様の参照先
| 何を知りたいか | 読むファイル |
|---|---|
| 作るもの・受け入れ基準 | `REQUIREMENTS.md` |
| 工程・データ境界 | `DESIGN.md` |
| 数値とその改訂可否 | `specs/design_parameters.yaml` |
| なぜこの設計なのか | `knowledge/decisions/ADR-*.md` |

## 数値を変えたくなったら
`specs/design_parameters.yaml` の `status` を見る。
`confirmed` は変更禁止。`hypothesis` は**実測結果を `evaluation/results/` に置いた上でなら**
改訂してよい（`sample_size` と `revise_when` も更新する）。実測なしの変更は禁止。

## 実行記録
外部API（LLM等）を呼ぶ処理は、モデル名・プロンプト版・入力ハッシュを記録に残す。
これが無いと「何を変えたら何が良くなったか」を後から追えない。

## 完了時の報告方法
- `TASKS.md` の対応するチェックボックスに `[x]` を付ける
- 完了の詳細は `TASKS.md` ではなく `CHANGELOG.md` に1〜2行で書く（TASKS.mdを日誌にしない）

## 2026-09-12 実装する構成
- `site/`: 生成済みSites/Vinext/React/TypeScript。再初期化しない。
- `site/app/`, `site/lib/`: アプリと教材、採点・保存ロジック。`site/tests/`: Node標準テスト。
- UIの対応するプリミティブは `site/components/ui/` をimportして利用し、vendoredファイルは編集しない。
- `cd site && npm run build` / `npm test` / `npx tsc --noEmit`。
- `.openai/hosting.json`、認証情報、公開、git commit/pushはCodexが担当。Agyは触らない。
- 親・兄弟プロジェクトは探索も編集もしない。
