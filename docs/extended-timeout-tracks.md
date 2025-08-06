# REACT_APP_EXTENDED_TIMEOUT_TRACKS_URL 機制

`REACT_APP_EXTENDED_TIMEOUT_TRACKS_URL` 是一個指向 JSON 檔案的環境變數。該檔案必須回傳一個包含歌曲名稱字串的陣列，例如：

```json
["Track Name 1", "Track Name 2"]
```

應用程式啟動時會擷取此 URL 並建立一組需要延伸超時的歌曲清單。當播放器偵測到目前播放的歌曲名稱存在於此清單中時，會在 50 秒後自動跳到下一首歌曲。

若歌曲暫停或更換，計時器會被清除，以避免無意的跳轉。未設定 `REACT_APP_EXTENDED_TIMEOUT_TRACKS_URL` 時，不會有任何自動跳轉行為。

