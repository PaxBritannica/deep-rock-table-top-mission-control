import { RuleSection } from './rules.data';

/** Filters a section down to what matches the (lower-case) query; null when nothing does. */
export function matchSection(section: RuleSection, q: string): RuleSection | null {
  if (!q) return section;
  const hit = (s: string | number | undefined) => s !== undefined && s.toString().toLowerCase().includes(q);
  if (hit(section.title) || hit(section.tab)) return section;
  const entries = section.entries.filter((e) => hit(e.title) || hit(e.summary) || e.lines.some(hit));
  const tables = (section.tables ?? []).filter((t) => hit(t.caption) || t.rows.some((r) => r.some(hit)));
  if (!entries.length && !tables.length) return null;
  return { ...section, entries, tables };
}
