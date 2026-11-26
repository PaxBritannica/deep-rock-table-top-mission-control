import { describe, expect, it } from 'vitest';
import { Miner } from '../models/mission.models';
import { elapsedMs, formatDuration, formatKda, kdaRatio, mvp, swarmMultiplier, teamTotals } from './mission-math';

const miner = (cls: Miner['cls'], kills: number, deaths: number, revives: number, minerals = 0): Miner => ({
  cls,
  player: cls,
  stats: { kills, deaths, revives, minerals },
});

describe('mission-math', () => {
  it('doubles the swarm multiplier per overflow', () => {
    expect([0, 1, 2, 3].map(swarmMultiplier)).toEqual([1, 2, 4, 8]);
  });

  it('computes KDA with deaths floored at 1', () => {
    expect(kdaRatio({ kills: 4, deaths: 0, revives: 1, minerals: 0 })).toBe(5);
    expect(formatKda({ kills: 4, deaths: 3, revives: 1, minerals: 0 })).toBe('1.7');
  });

  it('adds the running segment to the elapsed time', () => {
    expect(elapsedMs({ accumulatedMs: 1000, runningSince: null }, 99_999)).toBe(1000);
    expect(elapsedMs({ accumulatedMs: 1000, runningSince: 5000 }, 8000)).toBe(4000);
  });

  it('formats durations as hh:mm:ss', () => {
    expect(formatDuration(3_725_000)).toBe('01:02:05');
  });

  it('totals and picks an MVP', () => {
    const team = [miner('Scout', 3, 1, 0, 2), miner('Gunner', 6, 1, 1), miner('Driller', 0, 0, 0)];
    expect(teamTotals(team)).toEqual({ kills: 9, deaths: 2, revives: 1, minerals: 2 });
    expect(mvp(team)?.cls).toBe('Gunner');
    expect(mvp([miner('Driller', 0, 2, 0)])).toBeUndefined();
  });
});
