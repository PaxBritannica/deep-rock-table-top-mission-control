import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RULE_SECTIONS, RuleSection } from '../../core/rules/rules.data';
import { matchSection } from '../../core/rules/rules-search';

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
    return RULE_SECTIONS.map((s) => matchSection(s, q)).filter((s): s is RuleSection => s !== null);
  });

  /**
   * Jumps (no animation, it's a quick lookup) to a section. Scrolls this element
   * when it is its own scroller (drawer), otherwise the page (rules page).
   */
  scrollTo(id: string): void {
    this.query.set('');
    // Wait one frame so a cleared search has re-rendered every section.
    requestAnimationFrame(() => {
      const host = this.host.nativeElement;
      const target = host.querySelector<HTMLElement>(`#rule-${id}`);
      if (!target) return;
      const searchBar = host.querySelector<HTMLElement>('.search')?.offsetHeight ?? 0;
      if (host.scrollHeight > host.clientHeight) {
        const delta = target.getBoundingClientRect().top - host.getBoundingClientRect().top;
        host.scrollTop += delta - searchBar - 4;
      } else {
        window.scrollBy({ top: target.getBoundingClientRect().top - searchBar - 16, behavior: 'instant' });
      }
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
