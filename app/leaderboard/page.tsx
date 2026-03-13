"use client";

export default function LeaderboardPage() {
  const players = [
    { name: "Shabab", matches: 24, wins: 18, losses: 6, streak: 5 },
    { name: "Ashfaque", matches: 22, wins: 16, losses: 6, streak: 3 },
    { name: "Junaid", matches: 20, wins: 14, losses: 6, streak: 2 },
    { name: "Mahin", matches: 19, wins: 12, losses: 7, streak: 1 },
    { name: "Muzakker", matches: 18, wins: 10, losses: 8, streak: 0 },
    { name: "Saad", matches: 16, wins: 8, losses: 8, streak: 0 },
    { name: "Zain", matches: 14, wins: 6, losses: 8, streak: -2 },
    { name: "Mahir Bhai", matches: 12, wins: 4, losses: 8, streak: -3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Leaderboard</h1>
        <p className="text-gray-400 text-lg">Current rankings</p>
      </div>

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
              <th className="text-center px-6 py-4 font-bold text-[#84cc16]">
                Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const winPercent = (
                (player.wins / player.matches) *
                100
              ).toFixed(0);
              const streakColor =
                player.streak > 0
                  ? "text-green-400"
                  : player.streak < 0
                  ? "text-red-400"
                  : "text-gray-400";

              return (
                <tr
                  key={idx}
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
                    {winPercent}%
                  </td>
                  <td className={`text-center px-6 py-4 font-bold ${streakColor}`}>
                    {player.streak > 0 ? "+" : ""}
                    {player.streak}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
