# Simulation Battle Game

- Live (GitHub Pages): https://tom210702.github.io/game/
- 3機の行動をプログラムして自動バトルを観戦するシンプルなシミュレーションゲームです。

## 遊び方
1. 「設定」画面で各ユニットのタイプと行動を選択
2. バトル開始で結果を観戦（ドラッグで視点移動）
3. 勝敗が付いたら再設定でやり直し

## ローカルで動かす
前提: Node.js 18+

```bash
npm install
npm run dev   # localhost で起動
npm run build # 本番ビルド
```

## デプロイ
main ブランチへの push で GitHub Actions (`.github/workflows/deploy.yml`) が Vite をビルドし、GitHub Pages に自動デプロイします。
