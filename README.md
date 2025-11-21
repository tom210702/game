<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Simulation Battle Game

自律行動を?E??だユニットが戦ぁE??ミュレーション対戦ゲームです、Eemini めE??の他?E外部 API には依存してぁE??ぁE??め、Node.js さえあればローカルと GitHub Pages のどちらでも完結します、E

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies: 
pm install
2. Start the dev server: 
pm run dev
3. Build for production: 
pm run build

生?EされぁEdist/ チE??レクトリは任意?E静的ホスチE??ングへそ?EままアチE?Eロードできます、E

## Deploy to GitHub Pages

こ?Eリポジトリには GitHub Actions ワークフロー (.github/workflows/deploy.yml) が含まれており、main ブランチに push されるたびに Vite ビルドを実行し、gh-pages ブランチへ公開物を?E置します、E

1. GitHub リポジトリを作?Eし、このプロジェクトを push します、E
2. リポジトリの **Settings ?EPages** で **Source = GitHub Actions** を選択します、E
3. main ブランチに push すると、?E動で gh-pages ブランチへチE?Eロイされ、https://<ユーザー吁E.github.io/<リポジトリ吁E/ でプレイできます、E

Secrets めEAPI キーの設定?E不要です、E