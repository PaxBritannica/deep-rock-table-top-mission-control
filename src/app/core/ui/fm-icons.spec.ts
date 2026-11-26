import { describe, expect, it } from 'vitest';
import { RULE_SECTIONS } from '../rules/rules.data';
import { FM_ICONS } from './fm-icons.data';
import { fmIconExists, isFmIcon } from './fm-icons';

describe('fm icons', () => {
  it('are standalone SVGs with a 48x48 viewBox', () => {
    for (const svg of Object.values(FM_ICONS)) {
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('viewBox="0 0 48 48"');
    }
  });

  it('cover every fm: icon the rules reference uses', () => {
    const used = RULE_SECTIONS.flatMap((s) => [
      ...s.entries.map((e) => e.icon),
      ...(s.tables ?? []).flatMap((t) => [...(t.rowIcons ?? []), ...(t.columnIcons ?? [])]),
    ]).filter(isFmIcon);
    expect(used.length).toBeGreaterThan(20);
    for (const icon of used) expect(fmIconExists(icon), icon).toBe(true);
  });

  it('keep icon arrays in step with their tables', () => {
    for (const s of RULE_SECTIONS)
      for (const t of s.tables ?? []) {
        if (t.rowIcons) expect(t.rowIcons.length).toBe(t.rows.length);
        if (t.columnIcons) expect(t.columnIcons.length).toBe(t.columns.length);
      }
  });
});
