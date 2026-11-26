import { Injectable, computed, effect, signal } from '@angular/core';
import { MISSION_TYPES, SavedRun } from '../models/mission.models';
import { STORAGE_KEYS, readJson, writeJson } from '../storage/local-store';

export interface SavesFile {
  app: 'drg-mission-control';
  version: 1;
  exportedAt: string;
  runs: SavedRun[];
}

function isRun(x: unknown): x is SavedRun {
  const r = x as SavedRun;
  return (
    !!r &&
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.durationMs === 'number' &&
    typeof r.endedAt === 'number' &&
    Array.isArray(r.miners) &&
    MISSION_TYPES.includes(r.type)
  );
}

/** The mission log: every finished run, newest first. */
@Injectable({ providedIn: 'root' })
export class RunsStore {
  private readonly _runs = signal<SavedRun[]>(readJson<SavedRun[]>(STORAGE_KEYS.runs, []).filter(isRun));

  readonly runs = computed(() => [...this._runs()].sort((a, b) => b.endedAt - a.endedAt));

  constructor() {
    effect(() => writeJson(STORAGE_KEYS.runs, this._runs()));
  }

  byId(id: string): SavedRun | undefined {
    return this._runs().find((r) => r.id === id);
  }

  add(run: SavedRun): void {
    this._runs.update((runs) => [...runs.filter((r) => r.id !== run.id), run]);
  }

  remove(id: string): SavedRun | undefined {
    const run = this.byId(id);
    this._runs.update((runs) => runs.filter((r) => r.id !== id));
    return run;
  }

  toFile(): SavesFile {
    return { app: 'drg-mission-control', version: 1, exportedAt: new Date().toISOString(), runs: this._runs() };
  }

  /** Merges runs from an exported file. Returns how many were new. */
  importFile(json: string): number {
    const parsed = JSON.parse(json) as Partial<SavesFile>;
    if (parsed.app !== 'drg-mission-control' || !Array.isArray(parsed.runs)) {
      throw new Error('This file is not a Mission Control save file.');
    }
    const incoming = parsed.runs.filter(isRun);
    const known = new Set(this._runs().map((r) => r.id));
    const fresh = incoming.filter((r) => !known.has(r.id));
    this._runs.update((runs) => [...runs, ...fresh]);
    return fresh.length;
  }
}
