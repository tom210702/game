<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Simulation Battle Game

自律行動を組んだユニットが戦うシミュレーション対戦ゲームです。Gemini やその他の外部 API には依存していないため、Node.js さえあればローカルと GitHub Pages のどちらでも完結します。

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build for production: `npm run build`

生成された `dist/` ディレクトリは任意の静的ホスティングへそのままアップロードできます。

## Deploy to GitHub Pages

このリポジトリには GitHub Actions ワークフロー (`.github/workflows/deploy.yml`) が含まれており、`main` ブランチに push されるたびに Vite ビルドを実行し、`gh-pages` ブランチへ公開物を配置します。

1. GitHub リポジトリを作成し、このプロジェクトを push します。
2. リポジトリの **Settings → Pages** で **Source = GitHub Actions** を選択します。
3. `main` ブランチに push すると、自動で `gh-pages` ブランチへデプロイされ、`https://<ユーザー名>.github.io/<リポジトリ名>/` でプレイできます。

Secrets や API キーの設定は不要です。
