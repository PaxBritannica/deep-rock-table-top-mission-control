export type DwarfClass = 'Scout' | 'Driller' | 'Engineer' | 'Gunner';
export const DWARF_CLASSES: readonly DwarfClass[] = ['Scout', 'Driller', 'Engineer', 'Gunner'];

export type MissionType = 'Mining Expedition' | 'Egg Hunt' | 'Drone Retrieval' | 'Elimination' | 'Other';
export const MISSION_TYPES: readonly MissionType[] = [
  'Mining Expedition',
  'Egg Hunt',
  'Drone Retrieval',
  'Elimination',
  'Other',
];

export type HazardLevel = 1 | 2 | 3 | 4 | 5;
export const HAZARD_LEVELS: readonly HazardLevel[] = [1, 2, 3, 4, 5];

/** success = all aboard; modest = swarm ran out with at least one dwarf aboard. */
export type MissionOutcome = 'success' | 'modest' | 'failure' | 'abandoned';
export const OUTCOME_LABELS: Record<MissionOutcome, string> = {
  success: 'Mission complete',
  modest: 'Modest success',
  failure: 'Mission failed',
  abandoned: 'Abandoned',
};

/** K/D/A + minerals. "revives" are the assists in KDA. */
export type StatKey = 'kills' | 'deaths' | 'revives' | 'minerals';
export type MinerStats = Record<StatKey, number>;
export const ZERO_STATS: Readonly<MinerStats> = { kills: 0, deaths: 0, revives: 0, minerals: 0 };

export interface Miner {
  cls: DwarfClass;
  player: string;
  stats: MinerStats;
}

/** Timer stored as timestamps so it survives reloads, sleep and screen lock. */
export interface TimerState {
  /** Time accumulated in finished running segments (ms). */
  accumulatedMs: number;
  /** Epoch ms when the current running segment started; null = not running. */
  runningSince: number | null;
}

export interface MissionSetup {
  name: string;
  type: MissionType;
  hazard: HazardLevel;
  miners: { cls: DwarfClass; player: string }[];
}

export interface ActiveMission {
  id: string;
  name: string;
  type: MissionType;
  hazard: HazardLevel;
  createdAt: number;
  timer: TimerState;
  /** Times the swarm meter maxed out and was restarted (house rule). */
  overflows: number;
  miners: Miner[];
}

export interface SavedRun {
  id: string;
  name: string;
  type: MissionType;
  hazard: HazardLevel;
  createdAt: number;
  endedAt: number;
  durationMs: number;
  outcome: MissionOutcome;
  overflows: number;
  miners: Miner[];
}

/** Last used player names, pre-filled in the new-mission form. */
export type Roster = Partial<Record<DwarfClass, string>>;
