"use client";

import { useState } from "react";
import Link from "next/link";
import { clearApiKey, setApiKey, useApiKey } from "@/lib/apiKey";

export default function SettingsPage() {
  const savedKey = useApiKey();
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    if (!input.trim()) return;
    setApiKey(input);
    setInput("");
    setSaved(true);
  }

  function remove() {
    clearApiKey();
    setSaved(false);
  }

  // 只顯示最後 4 碼，讓使用者確認存的是哪一把
  const masked = savedKey ? `sk-…${savedKey.slice(-4)}` : "";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">設定</h1>

      <section className="flex flex-col gap-4">
        <h2 className="border-b-2 border-ink pb-2 font-serif text-2xl font-black">
          OpenAI API Key
        </h2>
        <p className="max-w-xl text-ink/75">
          這個服務不提供 API Key，面試問題由你自己的 OpenAI 帳戶產生，費用也算在你的帳戶上。
          你可以到{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-cobalt underline underline-offset-4"
          >
            OpenAI 後台
          </a>{" "}
          建立一把 Key。
        </p>

        <p className="font-bold" aria-live="polite">
          {savedKey === null ? (
            "讀取中…"
          ) : savedKey ? (
            <>
              目前狀態：<span className="text-cobalt">已設定（{masked}）</span>
            </>
          ) : (
            "目前狀態：尚未設定"
          )}
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="key" className="font-bold">
            {savedKey ? "換成新的 Key" : "貼上你的 Key"}
          </label>
          <input
            id="key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSaved(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="sk-..."
            className="border-2 border-ink bg-white p-3 font-mono outline-none focus:border-cobalt"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            disabled={!input.trim()}
            className="bg-cobalt px-7 py-3 font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            儲存 Key
          </button>
          {savedKey && (
            <button
              onClick={remove}
              className="border-2 border-ink px-7 py-2.5 font-bold transition-colors hover:bg-ink hover:text-white"
            >
              移除 Key
            </button>
          )}
          {saved && (
            <p role="status" className="font-bold text-cobalt">
              已儲存。
              <Link href="/interview" className="underline underline-offset-4">
                開始面試
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="border-2 border-ink bg-lilac p-5 text-sm">
        <h2 className="font-bold">Key 存在哪裡？</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/80">
          <li>只存在這個瀏覽器的 localStorage，不會上傳到我們的資料庫。</li>
          <li>每次面試時，Key 會隨請求送到本站的伺服器，轉交給 OpenAI 後立即丟棄，不會被保存或寫入紀錄。</li>
          <li>Key 以明文存在瀏覽器裡。請不要在公用電腦上使用，用完請按「移除 Key」。</li>
          <li>建議在 OpenAI 後台替這把 Key 設定用量上限。</li>
        </ul>
      </section>
    </main>
  );
}
