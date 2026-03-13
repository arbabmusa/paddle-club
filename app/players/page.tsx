"use client";

import { useEffect, useState } from "react";
import { supabase, Player } from "@/lib/supabase";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("name");
    
    if (data) setPlayers(data);
    setLoading(false);
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      const { error } = await supabase
        .from("players")
        .insert({ name: newPlayerName.trim() });
      
      if (!error) {
        setNewPlayerName("");
        setShowForm(false);
        fetchPlayers();
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-32 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-bold mb-4">Players</h1>
          <p className="text-gray-400 text-lg">
            {players.length} players in the club
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#84cc16] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#84cc16]/90 transition-colors"
        >
          Add Player
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPlayer} className="mb-12 bg-black/40 border border-[#84cc16]/30 rounded-lg p-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="flex-1 bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#84cc16]"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#84cc16] text-black px-6 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-700 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6 hover:border-[#84cc16]/60 transition-all hover:shadow-lg hover:shadow-[#84cc16]/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#84cc16] rounded-full flex items-center justify-center text-black font-bold">
                {player.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{player.name}</h3>
                <p className="text-gray-400 text-sm">0 matches • 0W-0L</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
