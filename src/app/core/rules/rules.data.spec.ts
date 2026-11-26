import { describe, expect, it } from 'vitest';
import { RULE_SECTIONS } from './rules.data';
import { matchSection } from './rules-search';

describe('rules data', () => {
  it('has unique ids and short tab labels', () => {
    const ids = RULE_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of RULE_SECTIONS) expect(s.tab.length).toBeLessThanOrEqual(8);
  });

  it('keeps every table row as wide as its header', () => {
    for (const s of RULE_SECTIONS)
      for (const t of s.tables ?? []) for (const row of t.rows) expect(row.length).toBe(t.columns.length);
  });

  it('opens with the status effects quick check', () => {
    expect(RULE_SECTIONS[0].id).toBe('status');
  });
});

describe('matchSection', () => {
  const status = RULE_SECTIONS.find((s) => s.id === 'status')!;

  it('returns the whole section for an empty query or a title hit', () => {
    expect(matchSection(status, '')).toBe(status);
    expect(matchSection(status, 'status')).toBe(status);
  });

  it('narrows entries and tables to matches', () => {
    const r = matchSection(status, 'frozen')!;
    expect(r.entries.map((e) => e.title)).toContain('Frozen');
    expect(r.entries.length).toBeLessThan(status.entries.length);
  });

  it('finds table rows', () => {
    expect(matchSection(status, 'swarm marker')?.tables?.length).toBe(1);
  });

  it('returns null when nothing matches', () => {
    expect(matchSection(status, 'zzzz')).toBeNull();
  });
});
