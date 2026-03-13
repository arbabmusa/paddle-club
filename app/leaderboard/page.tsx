"use client";

import { useEffect, useState } from "react";
import { supabase, Player, Match } from "@/lib/supabase";

interface PlayerStats {
  id: string;
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winPercent: number;
}

export default function LeaderboardPage() {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch all players
    const { data: players } = await supabase.from("players").select("*");
    
    // Fetch all completed matches
    const { data: matches } = await supabase.from("matches").select("*");

    if (!players) {
      setLoading(false);
      return;
    }

    // Calculate stats for each player
    const playerStats: PlayerStats[] = players.map((player) => {
      let wins = 0;
      let losses = 0;

      (matches || []).forEach((match) => {
        const isTeam1 =
          match.team1_player1 === player.id || match.team1_player2 === player.id;
        const isTeam2 =
          match.team2_player1 === player.id || match.team2_player2 === player.id;

        if (!isTeam1 && !isTeam2) return;

        // Only count if there's a score difference (match was played)
        if (match.team1_score === 0 && match.team2_score === 0) return;

        if (isTeam1) {
          if (match.team1_score > match.team2_score) wins++;
          else if (match.team1_score < match.team2_score) losses++;
        } else if (isTeam2) {
          if (match.team2_score > match.team1_score) wins++;
          else if (match.team2_score < match.team1_score) losses++;
        }
      });

      const totalMatches = wins + losses;
      const winPercent = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      return {
        id: player.id,
        name: player.name,
        matches: totalMatches,
        wins,
        losses,
        winPercent,
      };
    });

    // Sort by wins, then win percentage
    playerStats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winPercent - a.winPercent;
    });

    setStats(playerStats);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-48 mb-12"></div>
          <div className="h-96 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Leaderboard</h1>
        <p className="text-gray-400 text-lg">Current rankings</p>
      </div>

      {stats.every((s) => s.matches === 0) ? (
        <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-2">No matches played yet</p>
          <p className="text-sm text-gray-500">
            Create a session and play some matches to see rankings!
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#84cc16]/30 bg-black/40">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#84cc16]/30 bg-black/60">
                <th className="text-left px-6 py-4 font-bold text-[#84cc16]">
                  Rank
                </th>
                <th className="text-left px-6 py-4 font-bold text-[#84cc16]">
                  Player
                </th>
                <th className="text-center px-6 py-4 font-bold text-[#84cc16]">
                  Matches
                </th>
                <th className="text-center px-6 py-4 font-bold text-[#84cc16]">
                  Wins
                </th>
                <th className="text-center px-6 py-4 font-bold text-[#84cc16]">
                  Losses
                </th>
                <th className="text-center px-6 py-4 font-bold text-[#84cc16]">
                  Win %
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((player, idx) => (
                <tr
                  key={player.id}
                  className="border-b border-[#84cc16]/10 hover:bg-[#84cc16]/5 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-lg text-[#84cc16]">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#84cc16] rounded-full flex items-center justify-center text-black font-bold">
                        {player.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold">{player.name}</span>
                    </div>
                  </td>
                  <td className="text-center px-6 py-4 text-gray-300">
                    {player.matches}
                  </td>
                  <td className="text-center px-6 py-4 text-green-400 font-bold">
                    {player.wins}
                  </td>
                  <td className="text-center px-6 py-4 text-red-400 font-bold">
                    {player.losses}
                  </td>
                  <td className="text-center px-6 py-4 font-bold">
                    {player.matches > 0 ? `${player.winPercent.toFixed(0)}%` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
