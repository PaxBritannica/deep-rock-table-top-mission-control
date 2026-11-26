import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MissionOutcome, OUTCOME_LABELS } from '../../../core/models/mission.models';

export interface EndMissionData {
  name: string;
  time: string;
}

export type EndMissionResult = MissionOutcome | 'discard' | undefined;

@Component({
  selector: 'app-end-mission-dialog',
  imports: [MatButtonModule, MatDialogModule, MatRadioModule],
  template: `
    <h2 mat-dialog-title>Stop the mission</h2>
    <mat-dialog-content>
      <p class="lead">
        <strong>{{ data.name }}</strong> stops at <strong>{{ data.time }}</strong>. How did it go?
      </p>
      <mat-radio-group class="outcomes" [value]="outcome()" (change)="outcome.set($event.value)" aria-label="Outcome">
        @for (o of options; track o.value) {
          <mat-radio-button [value]="o.value">
            <span class="opt">
              <strong>{{ labels[o.value] }}</strong>
              <span>{{ o.hint }}</span>
            </span>
          </mat-radio-button>
        }
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton class="discard" [mat-dialog-close]="'discard'">Discard mission</button>
      <span class="spacer"></span>
      <button matButton [mat-dialog-close]="undefined">Keep playing</button>
      <button matButton="filled" [mat-dialog-close]="outcome()">Save to log</button>
    </mat-dialog-actions>
  `,
  styles: `
    .lead { margin-top: 0; font-size: 1.1rem; }
    .outcomes { display: flex; flex-direction: column; gap: 4px; }
    .opt { display: flex; flex-direction: column; line-height: 1.25; span { color: var(--ink-soft); } }
    .spacer { flex: 1; }
    .discard { --mat-button-text-label-text-color: var(--hazard); }
  `,
})
export class EndMissionDialog {
  protected readonly data = inject<EndMissionData>(MAT_DIALOG_DATA);
  protected readonly labels = OUTCOME_LABELS;
  protected readonly outcome = signal<MissionOutcome>('success');
  protected readonly options: { value: MissionOutcome; hint: string }[] = [
    { value: 'success', hint: 'Objectives done, everyone aboard the drop pod.' },
    { value: 'modest', hint: 'The swarm ran out, but someone made it aboard.' },
    { value: 'failure', hint: 'Everyone went down, or nobody reached the pod.' },
  ];
}
