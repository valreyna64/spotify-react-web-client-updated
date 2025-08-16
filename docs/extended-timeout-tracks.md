# 延長的 Timeout Tracks API

此文件詳細說明了用於管理具有特定播放時間限制的歌曲的 API。此 API 的 `v2` 版本支援 `GET`、`POST` 和 `DELETE` 方法，並與 Vercel KV 存儲進行互動，以實現數據的持久化。

## API 端點

所有請求都應發送到以下端點：

```
/api/tracks/v2/track_timeout
```

---

## `GET` 方法：獲取 Timeout 歌曲

使用 `GET` 方法可以獲取所有設定了播放時間限制的歌曲列表。

### 回應

- **成功 (200 OK)**: 回傳一個包含歌曲物件的 JSON 陣列。

```json
[
  {
    "id": "track_id_1",
    "name": "三天三夜",
    "start": "0:00",
    "duration": 50
  },
  {
    "id": "track_id_2",
    "name": "製造浪漫",
    "start": "0:30",
    "duration": 60
  }
]
```

### 欄位說明

- `id`: 歌曲的唯一標識符。
- `name`: 歌曲名稱。
- `start`: 播放開始時間，格式為 `mm:ss`。
- `duration`: 從 `start` 時間開始的播放秒數。

---

## `POST` 方法：新增或更新 Timeout 歌曲

使用 `POST` 方法可以新增或更新一首或多首歌曲的播放時間限制。如果提供的 `id` 已存在，則會更新該歌曲的資訊；否則，將新增為一首新歌曲。

### 請求 Body

請求的 Body 必須是一個包含一個或多個歌曲物件的 JSON 陣列。

```json
[
  {
    "id": "track_id_3",
    "name": "味道",
    "start": "0:15",
    "duration": 45
  }
]
```

### 回應

- **成功 (200 OK)**:

```json
{
  "message": "Tracks updated successfully"
}
```

- **失敗 (400 Bad Request)**: 如果請求的 Body 不是有效的 JSON 格式。

```json
{
  "error": "Invalid JSON"
}
```

---

## `DELETE` 方法：刪除 Timeout 歌曲

使用 `DELETE` 方法可以刪除一首或多首歌曲的時間限制。

### 請求 Body

請求的 Body 必須是一個包含一個或多個要刪除的歌曲物件的 JSON 陣列，每個物件至少需要有 `id` 欄位。

```json
[
  {
    "id": "track_id_1"
  }
]
```

### 回應

- **成功 (200 OK)**:

```json
{
  "message": "Tracks deleted successfully"
}
```

- **失敗 (400 Bad Request)**: 如果請求的 Body 不是有效的 JSON 格式。

```json
{
  "error": "Invalid JSON"
}
```

## 前端實作注意事項

- **播放器邏輯**: 當播放器檢測到當前播放的歌曲存在於此列表中時，它將從指定的 `start` 時間開始播放，並在 `duration` 秒後自動跳到下一首歌曲。
- **UI 提示**: 在佇列（Queue）頁面中，這些歌曲的播放時長建議以 `start-end` 的格式顯示（例如 `0:15-1:00`），以提示用戶該曲目有特殊的播放限制。
- **計時器管理**: 如果歌曲被暫停或切換，相關的計時器應被清除，以防止意外的歌曲跳轉。
