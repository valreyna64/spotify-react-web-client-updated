// api/hello.ts
import type { IncomingMessage, ServerResponse } from 'http';

function handler(req: IncomingMessage, res: ServerResponse) {

  const tracks = [
    "Summertime",
    "製造浪漫",
    "三天三夜",
    "Cheek To Cheek",
    "味道",
    "天空",
    "廣島之戀",
    "玫瑰香",
    "沒時間",
    "怪獸",
    "我可以抱你嗎",
    "I've Got A Crush On You",
    "妙妙妙",
    "你快樂所以我快樂",
    "春光",
    "頭髮亂了",
    "Let's Fall in Love",
    "春光乍洩",
    "他不愛我"
  ];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ tracks }));
}

// 關鍵：用 CommonJS 匯出
module.exports  = handler;
// 或： (req: IncomingMessage, res: ServerResponse) => {...}; 然後 module.exports = handler;
