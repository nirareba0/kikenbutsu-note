# <プロジェクト名>（Claude Code用）

<このプロジェクトを一文で>

## まずここを読む

| 知りたいこと | ファイル |
|---|---|
| 何を作るか・受け入れ基準 | `REQUIREMENTS.md` |
| 工程・データ境界 | `DESIGN.md` |
| いま何をやるか | `TASKS.md`（Now / Next / Blocked だけ） |
| なぜそう決めたか | `knowledge/decisions/ADR-*.md` |
| 実装規約（Agy用） | `AGENTS.md` — Claude Codeは自動で読まない |

## 運用ルール

- 上流工程（要件・設計・タスク分解・ADR）はClaude Codeがここで完結させる
- 実装フェーズに入ったらコードベースを自分で探索・生成しない。`agy -p` に委譲する
- 進捗確認は `TASKS.md` のチェック状況だけで行う
- **`TASKS.md` を作業日誌にしない。** 完了の詳細は `CHANGELOG.md`、過去ログは `archive/tasks/`
- 決定を変えるときは既存ADRを書き換えず、新しいADRを足して旧ADRを `置き換えられた` にする
- 数値を変えるときは `specs/design_parameters.yaml` の `status` を見る。
  `hypothesis` は実測を `evaluation/results/` に添えれば改訂してよい。実測なしの変更は禁止

## この案件の勘所

-
