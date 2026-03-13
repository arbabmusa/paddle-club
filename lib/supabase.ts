import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface Session {
  id: string;
  date: string;
  start_time: string;
  location: string;
  status: "upcoming" | "active" | "completed";
  court_fee: number | null;
  created_at: string;
}

export interface SessionPlayer {
  id: string;
  session_id: string;
  player_id: string;
  paid: boolean;
  created_at: string;
  player?: Player;
}

export interface Match {
  id: string;
  session_id: string;
  court_number: number;
  round_number: number;
  team1_player1: string;
  team1_player2: string;
  team2_player1: string;
  team2_player2: string;
  team1_score: number;
  team2_score: number;
  status: "pending" | "in_progress" | "completed";
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}
