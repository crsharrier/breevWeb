import type {
  BreevSeshRecord,
  BreevSeshRoundRecord,
} from "../views/useBreevSesh";

export function generateMockBreevSeshHistory(
  days: number = 30,
  breathsPerRound: number = 25,
  roundsPerSession: number = 3
): BreevSeshRecord[] {
  const history: BreevSeshRecord[] = [];

  for (let i = 0; i < days; i++) {
    // Simulate that the session happened around the same time each day
    const completedAt = new Date();
    completedAt.setDate(completedAt.getDate() - i);
    completedAt.setHours(8 + Math.floor(Math.random() * 4)); // e.g., between 8am–11am
    completedAt.setMinutes(Math.floor(Math.random() * 60));
    completedAt.setSeconds(Math.floor(Math.random() * 60));

    const rounds: BreevSeshRoundRecord[] = [];

    for (let j = 0; j < roundsPerSession; j++) {
      // Random hold duration between 30s and 2m
      const holdDurationMs = 30_000 + Math.floor(Math.random() * 90_000);
      rounds.push({ holdDurationMs });
    }

    history.push({
      breathsPerRound,
      rounds,
      completedAt: completedAt.toISOString(),
      avgHoldDurationMs:
        rounds.reduce((sum, round) => sum + round.holdDurationMs, 0) /
        rounds.length,
    });
  }

  return history.reverse(); // Oldest first
}
