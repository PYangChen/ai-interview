import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1fr_auto] sm:px-8">
        <div className="max-w-md">
          <p className="font-serif text-xl font-black">AI 面試模擬器</p>
          <p className="mt-2 text-sm text-white/70">
            你需要自備 OpenAI API Key，它只存在你的瀏覽器。職缺描述與回答會送到 OpenAI 產生回饋，本站不會保存。
          </p>
        </div>
        <ul className="flex gap-8 text-sm sm:flex-col sm:gap-2">
          <li>
            <Link href="/interview" className="hover:underline">
              開始面試
            </Link>
          </li>
          <li>
            <Link href="/settings" className="hover:underline">
              設定
            </Link>
          </li>
          <li>
            <Link href="/#how" className="hover:underline">
              怎麼運作
            </Link>
          </li>
          <li>
            <Link href="/#feedback" className="hover:underline">
              回饋範例
            </Link>
          </li>
        </ul>
      </div>
      <p className="border-t border-white/15 px-5 py-4 text-center text-xs text-white/50">
        © 2026 AI 面試模擬器
      </p>
    </footer>
  );
}
