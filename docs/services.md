# インフラ・サービス構成 (Services)

本プロジェクトでは、デプロイからデータベース、認証、ストレージまで、全て無料枠の範囲内でサービスを組み合わせて構築しています。

## サービス構成図 (Service Correlation)

各サービスがどのように連携しているかを以下の図に示します。

```mermaid
graph TD
    User((ユーザー)) -->|ブラウザ| Vercel[Vercel<br/>フロントエンド・ホスティング]
    
    subgraph "開発フロー"
        GitHub[GitHub<br/>ソース管理] -->|自動デプロイ| Vercel
        GitHub -->|CI/CD| GHA[GitHub Actions<br/>自動テスト]
    end
    
    subgraph "バックエンド (BaaS)"
        Vercel -->|ページ・API| SupabaseDB[(Supabase DB<br/>PostgreSQL)]
        Vercel -->|認証依頼| SupabaseAuth[Supabase Auth<br/>Google OAuth]
        Vercel -->|画像保存| SupabaseStorage[Supabase Storage]
    end
    
    GHA -->|環境変数を利用| SupabaseDB
```

## 各サービスの役割と無料枠の制限事項

| サービス | 役割 | 主な無料枠の制限事項 (2024年現在) |
| :--- | :--- | :--- |
| **GitHub** | ソースコード管理・CI/CD | ・Publicリポジトリは無制限<br/>・GitHub Actionsは月 2,000分まで無料 |
| **Vercel** | Webサイトの公開 (ホスティング) | ・Hobbyプラン: 非営利・個人利用に限定<br/>・帯域幅(Bandwidth) 100GB/月まで |
| **Supabase** | データベース・認証・ストレージ | ・DB容量 500MB / ストレージ 1GBまで<br/>・1週間以上アクセスがないとポーズ(停止)される |

## 技術的なポイント
- **環境変数の管理**: Supabaseの接続キーなどは Vercel と GitHub Actions 両方に個別に設定することで、漏洩を防ぎつつ安全に連携させています。
- **デプロイの自動化**: GitHubにコードを `push` するだけで、自動的にVercelへの反映と GitHub Actions によるテストが走る仕組みになっています。
