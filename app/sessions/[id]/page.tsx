"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, Session, Player, Match } from "@/lib/supabase";
import { generateMatches, maxRoundsForPlayers } from "@/lib/matchmaker";

interface SessionPlayerWithDetails {
  id: string;
  player_id: string;
  paid: boolean;
  player: Player;
}

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [sessionPlayers, setSessionPlayers] = useState<SessionPlayerWithDetails[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showAutoMatch, setShowAutoMatch] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [numRounds, setNumRounds] = useState(8);
  const [numCourts, setNumCourts] = useState(1);

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    // Fetch session
    const { data: sessionData } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    setSession(sessionData);

    // Fetch session players with player details
    const { data: spData } = await supabase
      .from("session_players")
      .select("*, player:players(*)")
      .eq("session_id", sessionId);
    setSessionPlayers(spData || []);

    // Fetch all players for adding
    const { data: playersData } = await supabase
      .from("players")
      .select("*")
      .order("name");
    setAllPlayers(playersData || []);

    // Fetch matches
    const { data: matchesData } = await supabase
      .from("matches")
      .select("*")
      .eq("session_id", sessionId)
      .order("round_number");
    setMatches(matchesData || []);

    setLoading(false);
  };

  const addPlayerToSession = async (playerId: string) => {
    await supabase.from("session_players").insert({
      session_id: sessionId,
      player_id: playerId,
    });
    fetchData();
  };

  const togglePaid = async (spId: string, currentPaid: boolean) => {
    await supabase
      .from("session_players")
      .update({ paid: !currentPaid })
      .eq("id", spId);
    fetchData();
  };

  const createMatch = async () => {
    if (selectedPlayers.length !== 4) return;

    const nextRound = matches.length > 0 
      ? Math.max(...matches.map(m => m.round_number)) + 1 
      : 1;

    await supabase.from("matches").insert({
      session_id: sessionId,
      round_number: nextRound,
      court_number: 1,
      team1_player1: selectedPlayers[0],
      team1_player2: selectedPlayers[1],
      team2_player1: selectedPlayers[2],
      team2_player2: selectedPlayers[3],
      status: "pending",
    });

    setSelectedPlayers([]);
    setShowCreateMatch(false);
    fetchData();
  };

  const generateAutoMatches = async () => {
    const playerIds = sessionPlayers.map((sp) => sp.player_id);
    const generatedMatches = generateMatches(playerIds, numRounds, numCourts);

    // Insert all matches
    for (const match of generatedMatches) {
      await supabase.from("matches").insert({
        session_id: sessionId,
        round_number: match.round,
        court_number: match.court,
        team1_player1: match.team1[0],
        team1_player2: match.team1[1],
        team2_player1: match.team2[0],
        team2_player2: match.team2[1],
        status: "pending",
      });
    }

    setShowAutoMatch(false);
    fetchData();
  };

  const clearAllMatches = async () => {
    if (!confirm("Delete all matches in this session?")) return;
    await supabase.from("matches").delete().eq("session_id", sessionId);
    fetchData();
  };

  const updateScore = async (matchId: string, team: 1 | 2, delta: number) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const field = team === 1 ? "team1_score" : "team2_score";
    const currentScore = team === 1 ? match.team1_score : match.team2_score;
    const newScore = Math.max(0, currentScore + delta);

    await supabase.from("matches").update({ [field]: newScore }).eq("id", matchId);
    fetchData();
  };

  const getPlayerName = (playerId: string) => {
    const player = allPlayers.find((p) => p.id === playerId);
    return player?.name || "Unknown";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-48 mb-12"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold">Session not found</h1>
      </div>
    );
  }

  const availablePlayers = allPlayers.filter(
    (p) => !sessionPlayers.find((sp) => sp.player_id === p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          {new Date(session.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <p className="text-gray-400 text-lg">
          {session.start_time?.slice(0, 5)} @ {session.location}
        </p>
      </div>

      {/* Players Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Players ({sessionPlayers.length})</h2>
          <button
            onClick={() => setShowAddPlayer(!showAddPlayer)}
            className="bg-[#84cc16] text-black px-4 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
          >
            Add Player
          </button>
        </div>

        {showAddPlayer && availablePlayers.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {availablePlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => addPlayerToSession(player.id)}
                className="bg-black border border-[#84cc16]/50 text-white px-4 py-2 rounded hover:border-[#84cc16] transition-colors"
              >
                + {player.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sessionPlayers.map((sp) => (
            <div
              key={sp.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                sp.paid
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-black/40 border-[#84cc16]/30"
              }`}
              onClick={() => togglePaid(sp.id, sp.paid)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#84cc16] rounded-full flex items-center justify-center text-black font-bold">
                  {sp.player.name[0]}
                </div>
                <div>
                  <p className="font-bold">{sp.player.name}</p>
                  <p className={`text-sm ${sp.paid ? "text-green-400" : "text-gray-400"}`}>
                    {sp.paid ? "✓ Paid" : "Unpaid"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Matches ({matches.length})</h2>
          {sessionPlayers.length >= 4 && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAutoMatch(!showAutoMatch);
                  setShowCreateMatch(false);
                }}
                className="bg-[#84cc16] text-black px-4 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
              >
                ⚡ Auto Match
              </button>
              <button
                onClick={() => {
                  setShowCreateMatch(!showCreateMatch);
                  setShowAutoMatch(false);
                }}
                className="bg-[#f97316] text-white px-4 py-2 rounded font-bold hover:bg-[#f97316]/90 transition-colors"
              >
                + Manual
              </button>
              {matches.length > 0 && (
                <button
                  onClick={clearAllMatches}
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded font-bold hover:bg-red-500/30 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {showAutoMatch && (
          <div className="mb-6 bg-black/40 border border-[#84cc16]/30 rounded-lg p-6">
            <h3 className="font-bold mb-4">Auto-Generate Matches</h3>
            <p className="text-sm text-gray-400 mb-4">
              Automatically create balanced matchups where players rotate partners and opponents.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2">Number of Rounds</label>
                <input
                  type="number"
                  min="1"
                  max={maxRoundsForPlayers(sessionPlayers.length)}
                  value={numRounds}
                  onChange={(e) => setNumRounds(parseInt(e.target.value) || 1)}
                  className="w-full bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white focus:outline-none focus:border-[#84cc16]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max recommended: {maxRoundsForPlayers(sessionPlayers.length)} rounds for {sessionPlayers.length} players
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Courts</label>
                <select
                  value={numCourts}
                  onChange={(e) => setNumCourts(parseInt(e.target.value))}
                  className="w-full bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white focus:outline-none focus:border-[#84cc16]"
                >
                  <option value={1}>1 Court</option>
                  <option value={2}>2 Courts</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {numCourts} court = {numCourts * 4} players per round
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={generateAutoMatches}
                className="bg-[#84cc16] text-black px-6 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
              >
                Generate {numRounds * numCourts} Matches
              </button>
              <button
                onClick={() => setShowAutoMatch(false)}
                className="bg-gray-700 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showCreateMatch && (
          <div className="mb-6 bg-black/40 border border-[#f97316]/30 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-4">
              Select 4 players (first 2 = Team 1, last 2 = Team 2)
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {sessionPlayers.map((sp) => (
                <button
                  key={sp.player_id}
                  onClick={() => {
                    if (selectedPlayers.includes(sp.player_id)) {
                      setSelectedPlayers(selectedPlayers.filter((p) => p !== sp.player_id));
                    } else if (selectedPlayers.length < 4) {
                      setSelectedPlayers([...selectedPlayers, sp.player_id]);
                    }
                  }}
                  className={`px-4 py-2 rounded font-bold transition-all ${
                    selectedPlayers.includes(sp.player_id)
                      ? "bg-[#f97316] text-white"
                      : "bg-black border border-gray-600 text-white hover:border-[#f97316]"
                  }`}
                >
                  {selectedPlayers.indexOf(sp.player_id) + 1 > 0 && (
                    <span className="mr-2">{selectedPlayers.indexOf(sp.player_id) + 1}.</span>
                  )}
                  {sp.player.name}
                </button>
              ))}
            </div>
            {selectedPlayers.length === 4 && (
              <button
                onClick={createMatch}
                className="bg-[#f97316] text-white px-6 py-2 rounded font-bold"
              >
                Create Match
              </button>
            )}
          </div>
        )}

        {matches.length === 0 ? (
          <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-8 text-center">
            <p className="text-gray-400">No matches yet. Create one to start playing!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">Round {match.round_number}</span>
                  <span className="text-sm text-gray-400">Court {match.court_number}</span>
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                  <div className="col-span-2 text-right">
                    <p className="font-bold">{getPlayerName(match.team1_player1)}</p>
                    <p className="font-bold">{getPlayerName(match.team1_player2)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => updateScore(match.id, 1, -1)}
                      className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold text-[#84cc16]">
                      {match.team1_score}
                    </span>
                    <span className="text-xl text-gray-500">-</span>
                    <span className="text-3xl font-bold text-[#f97316]">
                      {match.team2_score}
                    </span>
                    <button
                      onClick={() => updateScore(match.id, 2, 1)}
                      className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold">{getPlayerName(match.team2_player1)}</p>
                    <p className="font-bold">{getPlayerName(match.team2_player2)}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => updateScore(match.id, 1, 1)}
                    className="px-4 py-1 bg-[#84cc16]/20 text-[#84cc16] rounded text-sm hover:bg-[#84cc16]/30"
                  >
                    Team 1 +1
                  </button>
                  <button
                    onClick={() => updateScore(match.id, 2, 1)}
                    className="px-4 py-1 bg-[#f97316]/20 text-[#f97316] rounded text-sm hover:bg-[#f97316]/30"
                  >
                    Team 2 +1
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
