import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RULE_SECTIONS, RuleSection } from '../../core/rules/rules.data';

function matches(section: RuleSection, q: string): RuleSection | null {
  if (!q) return section;
  const hit = (s: string | number) => s.toString().toLowerCase().includes(q);
  if (hit(section.title)) return section;
  const entries = section.entries.filter((e) => hit(e.title) || e.lines.some(hit));
  const tableHit = section.table?.rows.some((r) => r.some(hit)) ?? false;
  if (!entries.length && !tableHit) return null;
  return { ...section, entries, table: tableHit ? section.table : undefined };
}

/** Searchable rules text. Used by the mission drawer and the rules page. */
@Component({
  selector: 'app-rules-content',
  imports: [MatIconModule],
  templateUrl: './rules-content.html',
  styleUrl: './rules-content.scss',
})
export class RulesContent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly query = signal('');
  protected readonly sections = computed(() => {
    const q = this.query().trim().toLowerCase();
    return RULE_SECTIONS.map((s) => matches(s, q)).filter((s): s is RuleSection => s !== null);
  });

  scrollTo(id: string): void {
    this.query.set('');
    // Wait one frame so a cleared search has re-rendered every section.
    requestAnimationFrame(() =>
      this.host.nativeElement.querySelector(`#rule-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
