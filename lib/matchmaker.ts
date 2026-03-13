// Round-robin doubles matchmaker
// Generates balanced matchups where players rotate partners and opponents

export interface MatchSetup {
  team1: [string, string];
  team2: [string, string];
  round: number;
  court: number;
}

export function generateMatches(
  playerIds: string[],
  numRounds: number,
  numCourts: number = 1
): MatchSetup[] {
  const players = [...playerIds];
  const matches: MatchSetup[] = [];
  
  if (players.length < 4) {
    return [];
  }

  // Track partnerships and matchups to ensure variety
  const partnerships: Map<string, Set<string>> = new Map();
  const matchups: Set<string> = new Set();

  players.forEach(p => partnerships.set(p, new Set()));

  // Helper to get partnership key
  const partnerKey = (a: string, b: string) => [a, b].sort().join('-');
  const matchupKey = (t1: [string, string], t2: [string, string]) => {
    const sorted1 = [...t1].sort().join('-');
    const sorted2 = [...t2].sort().join('-');
    return [sorted1, sorted2].sort().join('vs');
  };

  // Score a potential match - lower is better (more variety)
  const scoreMatch = (t1: [string, string], t2: [string, string]): number => {
    let score = 0;
    
    // Penalize repeated partnerships
    if (partnerships.get(t1[0])?.has(t1[1])) score += 10;
    if (partnerships.get(t2[0])?.has(t2[1])) score += 10;
    
    // Heavily penalize repeated exact matchups
    if (matchups.has(matchupKey(t1, t2))) score += 100;
    
    return score;
  };

  // Generate all possible team combinations
  const getAllTeams = (): [string, string][] => {
    const teams: [string, string][] = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        teams.push([players[i], players[j]]);
      }
    }
    return teams;
  };

  // Generate matches for each round
  for (let round = 1; round <= numRounds; round++) {
    const roundMatches: MatchSetup[] = [];
    const usedInRound = new Set<string>();
    const allTeams = getAllTeams();
    
    // For each court in this round
    for (let court = 1; court <= numCourts; court++) {
      // Find best match for this court
      let bestMatch: { t1: [string, string]; t2: [string, string]; score: number } | null = null;
      
      for (const t1 of allTeams) {
        if (usedInRound.has(t1[0]) || usedInRound.has(t1[1])) continue;
        
        for (const t2 of allTeams) {
          // Skip if any player overlap or already used
          if (t1[0] === t2[0] || t1[0] === t2[1] || t1[1] === t2[0] || t1[1] === t2[1]) continue;
          if (usedInRound.has(t2[0]) || usedInRound.has(t2[1])) continue;
          
          const score = scoreMatch(t1, t2);
          if (!bestMatch || score < bestMatch.score) {
            bestMatch = { t1, t2, score };
          }
        }
      }
      
      if (bestMatch) {
        // Record this match
        roundMatches.push({
          team1: bestMatch.t1,
          team2: bestMatch.t2,
          round,
          court,
        });
        
        // Mark players as used in this round
        bestMatch.t1.forEach(p => usedInRound.add(p));
        bestMatch.t2.forEach(p => usedInRound.add(p));
        
        // Record partnerships
        partnerships.get(bestMatch.t1[0])?.add(bestMatch.t1[1]);
        partnerships.get(bestMatch.t1[1])?.add(bestMatch.t1[0]);
        partnerships.get(bestMatch.t2[0])?.add(bestMatch.t2[1]);
        partnerships.get(bestMatch.t2[1])?.add(bestMatch.t2[0]);
        
        // Record matchup
        matchups.add(matchupKey(bestMatch.t1, bestMatch.t2));
      }
    }
    
    matches.push(...roundMatches);
  }

  return matches;
}

// Calculate how many rounds are possible with N players
export function maxRoundsForPlayers(numPlayers: number): number {
  // Each round uses 4 players per court
  // With rotation, max meaningful rounds depends on combinations
  // For 8 players: C(8,2) = 28 possible teams, many round combinations
  // Practical limit: everyone plays with everyone once = ~7 rounds for 8 players
  return Math.min(Math.floor(numPlayers * 1.5), 20);
}
