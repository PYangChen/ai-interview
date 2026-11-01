"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type ChatMessage = { role: "assistant" | "user"; content: string };

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function callApi(history: ChatMessage[]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, messages: history, totalQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");
      setMessages([...history, { role: "assistant", content: data.reply }]);
      setDone(data.done);
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  function start() {
    if (!jobDescription.trim()) return;
    setStarted(true);
    callApi([]);
  }

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    callApi([...messages, { role: "user", content: text }]);
  }

  function restart() {
    setStarted(false);
    setMessages([]);
    setDone(false);
    setError("");
  }

  // 已回答題數（用於顯示進度）
  const answered = messages.filter((m) => m.role === "user").length;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-10 sm:px-8">
      {!started ? (
        <div className="flex flex-col gap-6">
          <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
            貼上職缺，開始面試。
          </h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="jd" className="font-bold">
              職缺描述
            </label>
            <textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              placeholder="例如：前端工程師，需熟悉 React、TypeScript，有效能優化經驗……"
              className="border-2 border-ink bg-white p-4 outline-none focus:border-cobalt"
            />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="count" className="font-bold">
                題數（1 到 10 題）
              </label>
              <input
                id="count"
                type="number"
                min={1}
                max={10}
                value={totalQuestions}
                onChange={(e) =>
                  setTotalQuestions(
                    Math.min(10, Math.max(1, Math.floor(Number(e.target.value)) || 1)),
                  )
                }
                className="w-24 border-2 border-ink bg-white p-2.5 outline-none focus:border-cobalt"
              />
            </div>
            <button
              onClick={start}
              disabled={!jobDescription.trim()}
              className="bg-cobalt px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              開始面試
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="border-b-2 border-ink pb-3 font-bold">
            {done ? "面試結束" : `第 ${Math.min(answered + 1, totalQuestions)} 題，共 ${totalQuestions} 題`}
          </p>

          <div className="flex flex-1 flex-col gap-5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="max-w-[85%] self-end">
                  <p className="mb-1 text-right text-sm font-bold text-ink/60">你</p>
                  <p className="whitespace-pre-wrap bg-cobalt px-4 py-3 text-white">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div
                  key={i}
                  className={`self-start ${done && i === messages.length - 1 ? "w-full" : "max-w-[90%]"}`}
                >
                  <p className="mb-1 text-sm font-bold text-cobalt">
                    {done && i === messages.length - 1 ? "最終評估" : "面試官"}
                  </p>
                  <div
                    className={`border-2 border-ink bg-white px-5 py-4 ${
                      done && i === messages.length - 1 ? "shadow-[8px_8px_0_0_var(--ink)]" : ""
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        h2: (props) => (
                          <h2
                            className="mb-2 mt-6 border-t-2 border-ink pt-4 font-serif text-2xl font-black first:mt-0 first:border-t-0 first:pt-0"
                            {...props}
                          />
                        ),
                        p: (props) => <p className="my-2" {...props} />,
                        ul: (props) => <ul className="my-2 list-disc pl-6" {...props} />,
                        ol: (props) => <ol className="my-2 list-decimal pl-6" {...props} />,
                        strong: (props) => <strong className="font-bold text-cobalt" {...props} />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ),
            )}
            {loading && <p className="text-sm text-ink/60">面試官思考中…</p>}
            {error && (
              <p role="alert" className="border-2 border-red-700 bg-red-50 px-4 py-3 text-red-800">
                {error}
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {done ? (
            <button
              onClick={restart}
              className="self-start bg-ink px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-cobalt"
            >
              再練一場
            </button>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={3}
                disabled={loading || messages.length === 0}
                aria-label="你的回答"
                placeholder="輸入你的回答（Enter 送出，Shift+Enter 換行）"
                className="flex-1 border-2 border-ink bg-white p-3 outline-none focus:border-cobalt disabled:opacity-60"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-cobalt px-6 font-bold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                送出
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
