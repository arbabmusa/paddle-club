"use client";

import { useState } from "react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "18:00",
    location: "Paddle Court",
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date) {
      setSessions([
        ...sessions,
        {
          id: Date.now(),
          ...formData,
          players: [],
          matches: [],
        },
      ]);
      setFormData({
        date: "",
        time: "18:00",
        location: "Paddle Court",
      });
      setShowForm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-bold mb-4">Sessions</h1>
          <p className="text-gray-400 text-lg">
            {sessions.length} sessions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#84cc16] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#84cc16]/90 transition-colors"
        >
          Create Session
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateSession}
          className="mb-12 bg-black/40 border border-[#84cc16]/30 rounded-lg p-6"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white focus:outline-none focus:border-[#84cc16]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white focus:outline-none focus:border-[#84cc16]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-black border border-[#84cc16]/50 rounded px-4 py-2 text-white focus:outline-none focus:border-[#84cc16]"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#84cc16] text-black px-6 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
            >
              Create
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

      {sessions.length === 0 ? (
        <div className="bg-black/40 border border-[#84cc16]/20 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No sessions yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#84cc16] text-black px-6 py-2 rounded font-bold hover:bg-[#84cc16]/90 transition-colors"
          >
            Create the first session
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session: any) => (
            <div
              key={session.id}
              className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6 hover:border-[#84cc16]/60 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#84cc16]/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">{session.date}</h3>
                  <p className="text-gray-400">{session.time} @ {session.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {session.players.length} players
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
