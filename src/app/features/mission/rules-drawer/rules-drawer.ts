import { Component, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RULE_SECTIONS } from '../../../core/rules/rules.data';
import { RulesContent } from '../../rules/rules-content';

/**
 * Rules slide in from the right edge like a guidebook.
 * The thumb-index tabs stay visible on the screen edge when the drawer is closed.
 */
@Component({
  selector: 'app-rules-drawer',
  imports: [MatButtonModule, MatIconModule, RulesContent],
  templateUrl: './rules-drawer.html',
  styleUrl: './rules-drawer.scss',
  host: {
    '[class.open]': 'open()',
    '(document:keydown.escape)': 'open.set(false)',
  },
})
export class RulesDrawer {
  protected readonly sections = RULE_SECTIONS;
  protected readonly open = signal(false);
  protected readonly active = signal<string | null>(null);
  private readonly content = viewChild.required(RulesContent);

  protected openAt(id: string): void {
    if (this.open() && this.active() === id) {
      this.open.set(false);
      return;
    }
    this.active.set(id);
    this.open.set(true);
    this.content().scrollTo(id);
  }

  toggle(): void {
    this.open.update((o) => !o);
  }
}
