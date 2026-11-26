import { Miner, MinerStats, TimerState, ZERO_STATS } from '../models/mission.models';

/**
 * House rule: each time the swarm meter maxes out it restarts, and
 * "+1 swarm" events become worth more. Doubling: +1, +2, +4, +8 ...
 * For linear growth (+1, +2, +3 ...) return `overflows + 1` instead.
 */
export function swarmMultiplier(overflows: number): number {
  return 2 ** Math.max(0, overflows);
}

/** (kills + revives) / downed, with downed floored at 1 like most KDA formulas. */
export function kdaRatio(stats: MinerStats): number {
  return (stats.kills + stats.revives) / Math.max(1, stats.deaths);
}

export function formatKda(stats: MinerStats): string {
  const r = kdaRatio(stats);
  return Number.isInteger(r) ? r.toString() : r.toFixed(1);
}

export function elapsedMs(timer: TimerState, now: number): number {
  const running = timer.runningSince !== null ? Math.max(0, now - timer.runningSince) : 0;
  return timer.accumulatedMs + running;
}

export function formatDuration(ms: number): string {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function teamTotals(miners: readonly Miner[]): MinerStats {
  return miners.reduce<MinerStats>(
    (t, m) => ({
      kills: t.kills + m.stats.kills,
      deaths: t.deaths + m.stats.deaths,
      revives: t.revives + m.stats.revives,
      minerals: t.minerals + m.stats.minerals,
    }),
    { ...ZERO_STATS },
  );
}

/** Highest KDA, ties broken by kills then minerals. Undefined if nobody did anything. */
export function mvp(miners: readonly Miner[]): Miner | undefined {
  const scored = miners.filter((m) => m.stats.kills + m.stats.revives + m.stats.minerals > 0);
  return [...scored].sort(
    (a, b) =>
      kdaRatio(b.stats) - kdaRatio(a.stats) ||
      b.stats.kills - a.stats.kills ||
      b.stats.minerals - a.stats.minerals,
  )[0];
}

export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
