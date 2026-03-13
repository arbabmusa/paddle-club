"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-[#84cc16]/20 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#84cc16] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">🎾</span>
          </div>
          <span className="font-bold text-lg text-white">Paddle Club</span>
        </Link>

        <div className="flex gap-8">
          <Link
            href="/"
            className={`transition-colors ${
              isActive("/")
                ? "text-[#84cc16]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/players"
            className={`transition-colors ${
              isActive("/players")
                ? "text-[#84cc16]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Players
          </Link>
          <Link
            href="/sessions"
            className={`transition-colors ${
              isActive("/sessions")
                ? "text-[#84cc16]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sessions
          </Link>
          <Link
            href="/leaderboard"
            className={`transition-colors ${
              isActive("/leaderboard")
                ? "text-[#84cc16]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
