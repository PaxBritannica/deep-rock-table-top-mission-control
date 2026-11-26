import { Component, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RULE_SECTIONS } from '../../core/rules/rules.data';
import { RulesContent } from './rules-content';

@Component({
  selector: 'app-rules-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, RulesContent],
  template: `
    <header class="top">
      <a matButton class="top__back" routerLink="/"><mat-icon>arrow_back</mat-icon>Menu</a>
      <h1>Rules reference</h1>
    </header>
    <div class="layout">
      <article class="fm-page page">
        <div class="fm-stripes"></div>
        <app-rules-content class="page__content" />
      </article>
      <nav class="tabs" aria-label="Rule sections">
        @for (s of sections; track s.id) {
          <button type="button" class="tab" (click)="content().scrollTo(s.id)">{{ s.tab }}</button>
        }
      </nav>
    </div>
    <p class="note">
      Short paraphrases for quick lookups at the table. Your rulebook is the final word.
    </p>
  `,
  styles: `
    :host {
      display: block;
      padding: calc(16px + var(--safe-top)) 16px calc(24px + var(--safe-bottom));
      max-width: 900px;
      margin: 0 auto;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: var(--on-rock);
      h1 {
        margin: 0;
        font-family: var(--font-display);
        font-weight: 400;
        font-size: 2rem;
      }
      &__back {
        --mat-button-text-label-text-color: var(--amber);
      }
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: start;
    }
    .page {
      overflow: clip; /* not hidden: that would break the sticky search bar */
      &__content {
        padding: 0 16px 16px;
      }
    }
    .tabs {
      position: sticky;
      top: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 24px;
    }
    .tab {
      min-height: 48px;
      padding: 0 12px 0 10px;
      border: none;
      border-radius: 0 6px 6px 0;
      background: var(--paper-shade);
      color: var(--ink);
      font: 600 1rem var(--font-body);
      text-align: left;
      box-shadow: 0 2px 0 rgb(0 0 0 / 30%);
      cursor: pointer;
      &:nth-child(odd) {
        background: var(--amber);
      }
    }
    .note {
      color: var(--on-rock-soft);
      text-align: center;
    }
  `,
})
export class RulesPage {
  protected readonly sections = RULE_SECTIONS;
  protected readonly content = viewChild.required(RulesContent);
}
