# Event Discovery App — Documentation

AI で周辺イベントを検索する Web アプリのドキュメントです。

## 目次

- [概要](#概要)
- [アーキテクチャ](#アーキテクチャ)
- [画面構成](#画面構成)
- [API](#api)
- [データ・拡張](#データ拡張)
- [開発・ビルド](#開発ビルド)

---

## 概要

- **目的**: 自社イベントと提携サイトのイベントを一覧し、AI 検索・レコメンドで探せるようにする。
- **技術**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript。
- **言語**: UI は英語。

---

## アーキテクチャ

```
src/
├── app/
│   ├── api/           # API ルート
│   │   ├── chat/      # AI チャット
│   │   ├── events/    # イベント一覧
│   │   └── recommend/ # AI レコメンド
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/        # UI コンポーネント
├── data/             # モックデータ（自社・外部）
├── lib/               # 検索・距離計算など
└── types/             # 型定義
```

- **ページ**: `app/page.tsx` が `EventSearchApp` を表示。
- **状態**: 検索クエリ・ロケーション・タブ・チャット開閉は `EventSearchApp` 内の state で管理。
- **データ**: イベントは `src/data/` のモック + API 経由で取得。本番では DB や外部 API に差し替え。

---

## 画面構成

| 領域 | 説明 |
|------|------|
| **ヘッダー** | 左: ロケーション（Vancouver / New York / Tokyo）ドロップダウン。右: フィルターアイコン。 |
| **検索バー** | 「AI Search」入力。クリックで AI チャットパネルを開く。Enter で検索（キーワードのみ、位置フィルターは検索時のみ）。 |
| **タグ** | Music, Tech, Sports など。クリックでそのキーワードで一覧を絞り込み。 |
| **区切り線** | タグとコンテンツの間にグレーの水平線。 |
| **タブ** | All / Your events / Partner events でソース切り替え。 |
| **カード一覧** | 2 列グリッド、縦スクロール。カードは画像エリア + タイトルバー。 |
| **AI チャット** | 検索バーをクリックで全画面表示。メッセージ形式でイベントを質問できる。 |

---

## API

### GET `/api/events`

イベント一覧を返す。

| クエリ | 型 | 説明 |
|--------|-----|------|
| `q` | string | キーワード（省略可） |
| `lat` | number | 緯度（省略可） |
| `lng` | number | 経度（省略可） |
| `radiusKm` | number | 半径 km（省略時 50） |
| `source` | `all` \| `own` \| `external` | ソース（省略時 `all`） |
| `limit` | number | 最大件数（省略時 50） |

- `lat` / `lng` を渡すと、その地点から `radiusKm` 以内で絞り込み。
- レスポンス: `{ events: Event[] }`。

### POST `/api/recommend`

AI 風レコメンド（スコア付けで上位を返す）。

| body | 型 | 説明 |
|------|-----|------|
| `query` | string | キーワード |
| `lat` | number | 緯度（任意） |
| `lng` | number | 経度（任意） |
| `limit` | number | 件数（省略時 6、最大 20） |

- レスポンス: `{ events: Event[] }`。

### POST `/api/chat`

AI チャット用。メッセージに応じてイベント提案や短文を返す（モック）。

| body | 型 | 説明 |
|------|-----|------|
| `message` | string | ユーザー入力 |
| `location` | string | ロケーション名（Vancouver / New York / Tokyo） |

- レスポンス: `{ reply: string }`。
- 本番では OpenAI / Claude 等に差し替え可能。

---

## データ・拡張

### イベント型 (`src/types/event.ts`)

- `id`, `title`, `description`, `startAt`, `endAt`, `venue`, `imageUrl`, `url`, `source` (`own` | `external`), `category[]`, `price` など。

### 自社イベント

- **モック**: `src/data/events-own.ts`
- **本番**: `src/lib/events.ts` の `ownEvents` を、DB（Prisma / Drizzle 等）の取得結果に差し替え。

### 外部イベント

- **モック**: `src/data/events-external.ts`
- **本番**: Ticketmaster / Eventbrite / 地域イベント API 等のレスポンスを上記型に正規化し、`externalEvents` 相当として組み込む。

### ロケーション

- **現在**: Vancouver, New York, Tokyo の緯度経度を `EventSearchApp` の `LOCATIONS` で保持。
- **拡張**: Geocoding API で住所・地名から緯度経度を取得し、`fetchEvents` に渡す。

---

## 開発・ビルド

```bash
# 依存関係
npm install

# 開発サーバー（http://localhost:3000）
npm run dev

# 本番ビルド
npm run build
npm start

# リント
npm run lint
```

- **環境変数**: 本番で OpenAI 等を使う場合は `OPENAI_API_KEY` などを設定。
- **lightningcss**: ネイティブバイナリエラー時は `node_modules` と `.next` を削除してから `npm install` し直す。

---

## 関連ファイル一覧

| 役割 | パス |
|------|------|
| 型定義 | `src/types/event.ts` |
| 自社データ | `src/data/events-own.ts` |
| 外部データ | `src/data/events-external.ts` |
| 検索ロジック | `src/lib/events.ts` |
| 距離計算 | `src/lib/geo.ts` |
| メイン UI | `src/components/EventSearchApp.tsx` |
| 検索バー | `src/components/SearchForm.tsx` |
| タグ行 | `src/components/TagRow.tsx` |
| カード | `src/components/EventCard.tsx` |
| 一覧 | `src/components/EventList.tsx` |
| AI チャット | `src/components/AIChatPanel.tsx` |
