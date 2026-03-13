"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Session } from "@/lib/supabase";

export default function Home() {
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: false })
      .limit(3);

    setRecentSessions(data || []);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Paddle Club 🎾</h1>
        <p className="text-gray-400 text-lg">
          Manage sessions, track matches, and dominate the leaderboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/sessions" className="group">
          <div className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6 hover:border-[#84cc16]/60 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-[#84cc16]/20">
            <div className="text-4xl mb-3">🎾</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-[#84cc16] transition-colors">
              Sessions
            </h2>
            <p className="text-gray-400">
              Create a new session and invite players
            </p>
          </div>
        </Link>

        <Link href="/leaderboard" className="group">
          <div className="bg-gradient-to-br from-[#f97316]/10 to-[#f97316]/5 border border-[#f97316]/30 rounded-lg p-6 hover:border-[#f97316]/60 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-[#f97316]/20">
            <div className="text-4xl mb-3">🏆</div>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Recent Sessions</h3>
          <Link href="/sessions" className="text-[#84cc16] hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-6">
            <p className="text-gray-400">
              No sessions yet. Start one to get going!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <Link href={`/sessions/${session.id}`} key={session.id}>
                <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-4 hover:border-[#84cc16]/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-400">
                        {session.start_time?.slice(0, 5)} @ {session.location}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        session.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : session.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
