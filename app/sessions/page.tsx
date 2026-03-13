"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Session } from "@/lib/supabase";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    start_time: "18:00",
    location: "Paddle Court",
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: false });

    if (data) setSessions(data);
    setLoading(false);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date) {
      const { error } = await supabase.from("sessions").insert({
        date: formData.date,
        start_time: formData.start_time,
        location: formData.location,
        status: "upcoming",
      });

      if (!error) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          start_time: "18:00",
          location: "Paddle Court",
        });
        setShowForm(false);
        fetchSessions();
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-32 mb-12"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
          <h1 className="text-5xl font-bold mb-4">Sessions</h1>
          <p className="text-gray-400 text-lg">{sessions.length} sessions</p>
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
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
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
          {sessions.map((session) => (
            <Link href={`/sessions/${session.id}`} key={session.id}>
              <div className="bg-gradient-to-br from-[#84cc16]/10 to-[#84cc16]/5 border border-[#84cc16]/30 rounded-lg p-6 hover:border-[#84cc16]/60 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#84cc16]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-gray-400">
                      {session.start_time?.slice(0, 5)} @ {session.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
