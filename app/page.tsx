"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Paddle Club</h1>
        <p className="text-gray-400 text-lg">
          Manage sessions, track matches, and dominate the leaderboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/sessions" className="group">
          <div className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6 hover:border-[#84cc16]/60 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-[#84cc16]/20">
            <div className="text-4xl mb-3">🎾</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-[#84cc16] transition-colors">
              Start Session
            </h2>
            <p className="text-gray-400">
              Create a new session and invite players
            </p>
          </div>
        </Link>

        <Link href="/leaderboard" className="group">
          <div className="bg-gradient-to-br from-[#f97316]/10 to-[#f97316]/5 border border-[#f97316]/30 rounded-lg p-6 hover:border-[#f97316]/60 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-[#f97316]/20">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-[#f97316] transition-colors">
              Leaderboard
            </h2>
            <p className="text-gray-400">
              Check your stats and rankings
            </p>
          </div>
        </Link>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-6">
          <p className="text-gray-400">No sessions yet. Start one to get going!</p>
        </div>
      </div>
    </div>
  );
}
