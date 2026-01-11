# 技術構成とアーキテクチャ (Architecture)

本アプリは、モダンなWeb技術スタックを用いて、高い開発効率とユーザー体験の両立を目指して構築されています。

## 技術スタック (Technology Stack)

- **Frontend**: Next.js (App Router)
- **Styling**: Tailwind CSS / shadcn/ui
- **Backend / Database**: Supabase (PostgreSQL / Row Level Security)
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Testing**: Vitest (Unit) / Playwright (E2E)
- **CI/CD**: GitHub Actions

## コードアーキテクチャ (Code Architecture)

アプリケーションは以下のレイヤーで構成されています。

### 1. プレゼンテーションレイヤー (Components)
- `src/components/`: 再利用可能なUIコンポーネント。
  - 例: `StarRating.tsx` (星評価表示), `Header.tsx`
- `src/app/`: ページ（Next.js App Router）とレイアウト。
  - クライアントコンポーネント (`"use client"`) とサーバーコンポーネントを適切に分けることで、初期表示の高速化とインタラクティブな動作を両立しています。

### 2. データアクセスレイヤー (Actions / Supabase)
- `src/app/campsites/actions.ts`: **Next.js Server Actions** を利用してデータベース操作を行います。
  - APIエンドポイントを意識することなく、型安全にサーバー側の処理（投稿・更新・削除）を呼び出せます。
- `src/utils/supabase/`: Supabaseクライアントの設定。環境（ブラウザ/サーバー）に応じたクライアント生成を行います。

### 3. ユーティリティ・セキュリティ (Utils / RLS)
- `src/lib/utils.ts`: フォーマット処理などの共通関数。
- **Supabase Row Level Security (RLS)**: データベースレベルで「自分のデータは自分しか見られない」という制約をかけることで、フロントエンドの不具合によらず強固なセキュリティを確保しています。

## 開発のディレクトリ構造
```text
src/
├── app/              # ルーティング、ページ、Server Actions
├── components/       # 再利用可能なReactコンポーネント
├── lib/               # 共通ユーティリティ、型定義
└── utils/            # Supabaseクライアント設定
tests/                # E2Eテスト (Playwright)
docs/                 # 技術ドキュメント (本資料)
```
