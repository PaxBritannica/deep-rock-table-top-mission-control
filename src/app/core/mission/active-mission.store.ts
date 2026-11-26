import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  ActiveMission,
  DWARF_CLASSES,
  DwarfClass,
  MissionOutcome,
  MissionSetup,
  Roster,
  SavedRun,
  StatKey,
  ZERO_STATS,
} from '../models/mission.models';
import { STORAGE_KEYS, readJson, writeJson } from '../storage/local-store';
import { RunsStore } from '../runs/runs.store';
import { elapsedMs, newId, swarmMultiplier, teamTotals } from './mission-math';

const TICK_MS = 250;

/** The one mission currently being played (or null). Persisted on every change. */
@Injectable({ providedIn: 'root' })
export class ActiveMissionStore {
  private readonly runsStore = inject(RunsStore);

  private readonly _mission = signal<ActiveMission | null>(
    readJson<ActiveMission | null>(STORAGE_KEYS.active, null),
  );
  private readonly _roster = signal<Roster>(readJson<Roster>(STORAGE_KEYS.roster, {}));
  private readonly now = signal(Date.now());

  readonly mission = this._mission.asReadonly();
  readonly roster = this._roster.asReadonly();

  readonly running = computed(() => this._mission()?.timer.runningSince != null);
  readonly started = computed(() => {
    const m = this._mission();
    return !!m && (m.timer.accumulatedMs > 0 || m.timer.runningSince !== null);
  });
  readonly elapsedMs = computed(() => {
    const m = this._mission();
    return m ? elapsedMs(m.timer, this.now()) : 0;
  });
  readonly overflows = computed(() => this._mission()?.overflows ?? 0);
  readonly multiplier = computed(() => swarmMultiplier(this.overflows()));
  readonly miners = computed(() => this._mission()?.miners ?? []);
  readonly totals = computed(() => teamTotals(this.miners()));

  constructor() {
    const id = setInterval(() => this.now.set(Date.now()), TICK_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
    effect(() => writeJson(STORAGE_KEYS.active, this._mission()));
    effect(() => writeJson(STORAGE_KEYS.roster, this._roster()));
  }

  // ---- lifecycle ---------------------------------------------------------

  begin(setup: MissionSetup): void {
    const order = (c: DwarfClass) => DWARF_CLASSES.indexOf(c);
    this._mission.set({
      id: newId(),
      name: setup.name.trim() || 'Unnamed mission',
      type: setup.type,
      hazard: setup.hazard,
      createdAt: Date.now(),
      timer: { accumulatedMs: 0, runningSince: null },
      overflows: 0,
      miners: [...setup.miners]
        .sort((a, b) => order(a.cls) - order(b.cls))
        .map((m) => ({ cls: m.cls, player: m.player.trim(), stats: { ...ZERO_STATS } })),
    });
    this._roster.update((r) => ({
      ...r,
      ...Object.fromEntries(setup.miners.filter((m) => m.player.trim()).map((m) => [m.cls, m.player.trim()])),
    }));
  }

  /** Stops the clock, writes the run to the mission log and clears the active mission. */
  finish(outcome: MissionOutcome): SavedRun | null {
    const m = this._mission();
    if (!m) return null;
    const endedAt = Date.now();
    const run: SavedRun = {
      id: m.id,
      name: m.name,
      type: m.type,
      hazard: m.hazard,
      createdAt: m.createdAt,
      endedAt,
      durationMs: elapsedMs(m.timer, endedAt),
      outcome,
      overflows: m.overflows,
      miners: m.miners,
    };
    this.runsStore.add(run);
    this._mission.set(null);
    return run;
  }

  /** Throws the active mission away without logging it. Returns it for undo. */
  discard(): ActiveMission | null {
    const m = this._mission();
    this._mission.set(null);
    return m;
  }

  restore(mission: ActiveMission): void {
    this._mission.set(mission);
  }

  // ---- timer -------------------------------------------------------------

  start(): void {
    const now = Date.now();
    this.now.set(now);
    this.patch((m) => (m.timer.runningSince !== null ? m : { ...m, timer: { ...m.timer, runningSince: now } }));
  }

  pause(): void {
    const now = Date.now();
    this.now.set(now);
    this.patch((m) =>
      m.timer.runningSince === null
        ? m
        : { ...m, timer: { accumulatedMs: elapsedMs(m.timer, now), runningSince: null } },
    );
  }

  toggleTimer(): void {
    this.running() ? this.pause() : this.start();
  }

  // ---- swarm & stats -----------------------------------------------------

  addOverflow(): void {
    this.patch((m) => ({ ...m, overflows: m.overflows + 1 }));
  }

  removeOverflow(): void {
    this.patch((m) => ({ ...m, overflows: Math.max(0, m.overflows - 1) }));
  }

  adjustStat(cls: DwarfClass, key: StatKey, delta: number): void {
    this.patch((m) => ({
      ...m,
      miners: m.miners.map((x) =>
        x.cls === cls ? { ...x, stats: { ...x.stats, [key]: Math.max(0, x.stats[key] + delta) } } : x,
      ),
    }));
  }

  rename(name: string): void {
    const clean = name.trim();
    if (clean) this.patch((m) => ({ ...m, name: clean }));
  }

  private patch(fn: (m: ActiveMission) => ActiveMission): void {
    this._mission.update((m) => (m ? fn(m) : m));
  }
}
