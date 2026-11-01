import Link from "next/link";

const steps = [
  {
    title: "貼上職缺描述",
    body: "把徵才頁面的內容整段貼進來，再選你想練習幾題（1 到 10 題）。",
  },
  {
    title: "像真的面試一樣回答",
    body: "面試官一次問一題，會根據你的回答追問，或換到職缺要求的其他能力。",
  },
  {
    title: "拿到分數與建議回答",
    body: "全部答完後，你會看到總分、每題的優缺點，以及更好的回答方式。",
  },
];

const features = [
  ["依職缺出題", "題目根據你貼上的職缺內容產生，不是通用的「請自我介紹」題庫。"],
  ["會追問", "回答太模糊時，面試官會針對你說的細節繼續問，跟真的面試一樣。"],
  ["題數自己決定", "只想暖身就問 1 題，想完整演練就問 10 題。"],
  ["每題附建議回答", "不只告訴你哪裡不好，還示範這題可以怎麼回答。"],
];

export default function Home() {
  return (
    <main>
      {/* Hero：整頁最大膽的地方——鈷藍滿版、超大標題、一張蓋著分數章的面試單 */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <h1 className="font-serif text-5xl font-black leading-[1.12] sm:text-7xl">
              面試前，
              <br />
              先被問倒一次。
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/85">
              貼上你想應徵的職缺，AI
              面試官會依內容出題、追問。結束後，你會拿到分數，和每一題更好的回答方式。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/interview"
                className="bg-signal px-7 py-3.5 text-lg font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                開始模擬面試
              </Link>
              <Link href="#how" className="px-2 py-3 font-medium underline underline-offset-4">
                看看怎麼運作
              </Link>
            </div>
          </div>

          {/* 面試單：展示一段真實的問答，右下角蓋章 */}
          <div className="relative -rotate-2 border-2 border-ink bg-mist p-6 pb-16 text-ink shadow-[10px_10px_0_0_var(--ink)] sm:p-8 sm:pb-16">
            <p className="text-sm font-bold text-cobalt">面試官</p>
            <p className="mt-1 font-serif text-xl font-bold leading-snug">
              網站突然變慢時，你會怎麼找出原因？
            </p>
            <p className="mt-6 text-sm font-bold text-ink/60">你</p>
            <p className="mt-1 border-l-4 border-cobalt pl-4">
              我會先看監控，確認是哪支 API 的回應時間變長。
            </p>
            <p className="mt-6 text-sm font-bold text-cobalt">面試官</p>
            <p className="mt-1 font-serif text-xl font-bold leading-snug">
              你怎麼判斷問題是出在資料庫，還是前端？
            </p>
            <div
              aria-label="範例分數 78 分"
              className="stamp absolute -bottom-8 -right-4 grid h-28 w-28 place-items-center rounded-full border-4 border-ink bg-signal text-center font-serif leading-none text-ink sm:-right-8 sm:h-32 sm:w-32"
            >
              <span>
                <span className="block text-4xl font-black sm:text-5xl">78</span>
                <span className="mt-1 block text-xs font-bold">/ 100</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 怎麼運作：這裡真的是先後順序，所以用編號 */}
      <section id="how" className="scroll-mt-4 mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
            三個步驟，
            <br />
            一場完整的面試。
          </h2>
          <ol className="border-t-2 border-ink">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[4rem_1fr] gap-4 border-b-2 border-ink py-7">
                <span className="font-serif text-5xl font-black leading-none text-cobalt">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-1 max-w-md text-ink/75">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 回饋範例：產品真正的價值——同一題，你的回答 vs 建議回答 */}
      <section id="feedback" className="scroll-mt-4 bg-ink text-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <h2 className="max-w-2xl font-serif text-4xl font-black leading-tight sm:text-5xl">
            不只告訴你哪裡不好，
            <br />
            還示範怎麼說更好。
          </h2>
          <p className="mt-4 text-white/70">
            題目：請分享一次你改善網站效能的經驗。（以下為範例）
          </p>

          <div className="mt-12 grid gap-px bg-white/25 lg:grid-cols-2">
            <div className="bg-ink p-7 sm:p-9">
              <p className="font-bold text-white/60">你的回答</p>
              <p className="mt-4 text-lg text-white/85">
                我之前有把網站變快，用了一些優化的方法，後來速度有變好。
              </p>
              <p className="mt-6 text-sm text-white/60">
                評析：沒有說明問題有多嚴重、做了什麼，也沒有結果數字，面試官無法判斷你的貢獻。
              </p>
            </div>
            <div className="bg-cobalt p-7 sm:p-9">
              <p className="font-bold text-signal">建議回答</p>
              <p className="mt-4 text-lg">
                首頁載入要 4.8 秒。我用 Lighthouse 找到最大的圖片沒有壓縮，改成 WebP
                並延遲載入，載入時間降到 1.9 秒。
              </p>
              <p className="mt-6 text-sm text-white/80">
                重點：先說情境，再說你做的事，最後用數字收尾。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 功能：用粗線分隔的清單，而不是一排卡片 */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
          練習時最需要的四件事。
        </h2>
        <dl className="mt-12 border-t-2 border-ink">
          {features.map(([term, desc]) => (
            <div
              key={term}
              className="grid gap-2 border-b-2 border-ink py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-10"
            >
              <dt className="font-serif text-2xl font-bold">{term}</dt>
              <dd className="max-w-lg text-ink/75">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 結尾行動呼籲 */}
      <section className="bg-signal">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center sm:px-8">
          <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
            下一場面試，
            <br />
            先在這裡練。
          </h2>
          <Link
            href="/interview"
            className="bg-ink px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-cobalt"
          >
            開始模擬面試
          </Link>
        </div>
      </section>
    </main>
  );
}
