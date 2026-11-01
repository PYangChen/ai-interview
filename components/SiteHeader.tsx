"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  // 已經在面試頁時，不再顯示「開始面試」按鈕
  const inInterview = usePathname() === "/interview";

  return (
    <header className="border-b-2 border-ink bg-mist">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center bg-cobalt font-serif text-xl font-black text-white"
          >
            問
          </span>
          <span className="text-lg">AI 面試模擬器</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium sm:gap-8">
          <Link href="/#how" className="hidden hover:underline sm:inline">
            怎麼運作
          </Link>
          <Link href="/#feedback" className="hidden hover:underline sm:inline">
            回饋範例
          </Link>
          {!inInterview && (
            <Link
              href="/interview"
              className="border-2 border-ink bg-ink px-4 py-1.5 text-white transition-colors hover:bg-cobalt hover:border-cobalt"
            >
              開始面試
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
