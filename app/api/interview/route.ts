// 引入 OpenAI 官方 SDK，用來呼叫 Chat Completions API
import OpenAI from "openai";

// ===== 設定常數 =====

// 使用者沒指定題數（或格式不對）時的預設題數
const DEFAULT_QUESTIONS = 3;
// 題數的下限與上限，避免使用者要求 0 題或 9999 題（會燒掉大量 token）
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 10;
// 使用的模型；可在 .env.local 設定 OPENAI_MODEL 覆蓋，沒設就用 gpt-4o-mini
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// 對話中的一則訊息：assistant = 面試官，user = 應徵者
type ChatMessage = { role: "assistant" | "user"; content: string };

// OpenAI client 不能在模組層級建立：沒有 API Key 時 SDK 會立刻丟錯，
// 導致 build（Vercel 會載入這支檔案收集設定）失敗。改成請求進來、確認有 Key 後才建立
let client: OpenAI | undefined;
function getClient(apiKey: string) {
  client ??= new OpenAI({ apiKey });
  return client;
}

/**
 * 依照「面試進行到哪裡」產生給 AI 的 system prompt（面試官的角色與指令）。
 * @param jobDescription 使用者貼上的職缺描述
 * @param answered       應徵者目前已回答的題數
 * @param total          這場面試總共要問幾題
 */
function buildSystemPrompt(
  jobDescription: string,
  answered: number,
  total: number,
) {
  // 每個階段都共用的開頭：設定面試官人設、語言，並附上職缺描述
  const base = `你是一位專業、友善但嚴謹的面試官，正在面試應徵以下職缺的候選人。請使用繁體中文。

【職缺描述】
${jobDescription}
`;

  // 階段三：所有題目都答完 -> 要求 AI 產出最終評估，並指定輸出格式
  // （包含總分、每題的評析與建議回答、優缺點與整體建議）
  if (answered >= total) {
    return `${base}
面試已經問完 ${total} 題。請根據候選人先前所有的回答，給出最終評估，格式如下：
## 總分
X / 100
## 各題回饋與建議回答
針對每一題分別列出：
- **題目**：（簡述題目）
- **你的回答評析**：（優缺點）
- **建議的回答方式**：（示範一個更好的回答，或說明回答的結構與重點）
## 優勢
## 待改進
## 具體建議
不要再提出新問題。`;
  }

  // 階段一：還沒回答任何題目 -> 打招呼並出第 1 題
  if (answered === 0) {
    return `${base}
請先簡短打招呼，然後提出第 1 題（共 ${total} 題）。題目要貼近職缺所需的能力。一次只問一個問題。`;
  }

  // 階段二：面試進行中 -> 簡短回應上一題，再出下一題（可追問或換主題）
  // 刻意要求「不要給分數」，分數留到最後統一評
  return `${base}
候選人剛回答了第 ${answered} 題。請用一兩句話簡短回應（不要給分數），然後提出第 ${answered + 1} 題（共 ${total} 題）。
你可以針對候選人的回答深入追問，或換一個與職缺相關的新主題。一次只問一個問題。`;
}

/**
 * POST /api/interview
 *
 * 請求 body（JSON）：
 *   - jobDescription: string      職缺描述（必填）
 *   - messages: ChatMessage[]     到目前為止的完整對話（第一次呼叫傳空陣列）
 *   - totalQuestions?: number     總題數（選填，1~10，預設 3）
 *
 * 回應（JSON）：
 *   - 成功：{ reply: string, done: boolean }  done 為 true 代表這是最終評估
 *   - 失敗：{ error: string }，並帶對應的 HTTP 狀態碼
 *
 * 伺服器本身「不保存」任何狀態，面試進度完全由前端傳來的 messages 推算。
 */
export async function POST(request: Request) {
  // 沒有 API Key 就直接回 500，避免白白送出一個一定失敗的請求
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "伺服器尚未設定 OPENAI_API_KEY" }, { status: 500 });
  }

  // 解析 request body。欄位型別先標成 unknown，因為前端傳什麼都不可信，後面逐一驗證
  let body: {
    jobDescription?: unknown;
    messages?: unknown;
    totalQuestions?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    // body 不是合法 JSON -> 400
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  // 驗證職缺描述：必須是非空字串（去掉前後空白後）
  const jobDescription =
    typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
  if (!jobDescription) {
    return Response.json({ error: "請輸入職缺描述" }, { status: 400 });
  }

  // 驗證對話紀錄：不是陣列就當作空對話；是陣列的話，只保留格式正確的訊息
  // （role 必須是 assistant 或 user，content 必須是字串），
  // 這同時避免使用者偷塞 role: "system" 的訊息來竄改面試官的指令
  const messages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages.filter(
        (m): m is ChatMessage =>
          m &&
          (m.role === "assistant" || m.role === "user") &&
          typeof m.content === "string",
      )
    : [];

  // 決定總題數：轉成數字，是整數就夾在 [MIN, MAX] 之間，否則用預設值
  const requested = Number(body.totalQuestions);
  const total = Number.isInteger(requested)
    ? Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, requested))
    : DEFAULT_QUESTIONS;

  // 計算面試進度：應徵者（user）講了幾次話，就代表答了幾題
  const answered = messages.filter((m) => m.role === "user").length;
  // 答的題數超過總題數 = 面試早就結束了，還繼續送就是不正常請求
  if (answered > total) {
    return Response.json({ error: "面試已結束" }, { status: 400 });
  }

  try {
    // 呼叫 OpenAI。訊息順序：system 指令 -> 歷史對話 -> (開場時的觸發訊息)
    const completion = await getClient(process.env.OPENAI_API_KEY).chat.completions.create({
      model: MODEL,
      messages: [
        // system prompt 每次依進度重新產生，所以 AI 永遠知道現在該做什麼
        { role: "system", content: buildSystemPrompt(jobDescription, answered, total) },
        // 前端傳來的完整歷史對話，讓 AI 看得到前面問過什麼、答了什麼
        ...messages,
        // OpenAI 要求至少一則非 system 訊息，開場時用它觸發面試官發話
        ...(messages.length === 0
          ? [{ role: "user" as const, content: "我準備好了，請開始面試。" }]
          : []),
      ],
    });

    return Response.json({
      // 取出 AI 的回覆文字；萬一沒有內容就回空字串
      reply: completion.choices[0]?.message?.content ?? "",
      // 告訴前端這次是否為最終評估（前端據此隱藏輸入框、顯示「重新開始」）
      done: answered >= total,
    });
  } catch (err) {
    // OpenAI 呼叫失敗（網路、額度、金鑰錯誤等）：詳細錯誤只寫到伺服器 log，
    // 回給前端的訊息保持簡短，不洩漏內部細節；502 表示上游服務出問題
    console.error("OpenAI error:", err);
    return Response.json({ error: "呼叫 OpenAI 失敗，請稍後再試" }, { status: 502 });
  }
}
