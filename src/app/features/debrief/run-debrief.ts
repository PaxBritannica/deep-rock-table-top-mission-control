import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';
import { formatDuration, formatKda, mvp, swarmMultiplier, teamTotals } from '../../core/mission/mission-math';
import { OUTCOME_LABELS } from '../../core/models/mission.models';
import { RunsStore } from '../../core/runs/runs.store';
import { confirm } from '../../core/ui/confirm-dialog';

@Component({
  selector: 'app-run-debrief',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './run-debrief.html',
  styleUrl: './run-debrief.scss',
})
export class RunDebrief {
  /** Route param, bound via withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly runs = inject(RunsStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly labels = OUTCOME_LABELS;
  protected readonly run = computed(() => this.runs.byId(this.id()));
  protected readonly view = computed(() => {
    const run = this.run();
    if (!run) return null;
    const best = mvp(run.miners);
    return {
      run,
      time: formatDuration(run.durationMs),
      multiplier: swarmMultiplier(run.overflows),
      totals: teamTotals(run.miners),
      rows: run.miners.map((m) => ({ ...m, kda: formatKda(m.stats), mvp: m === best })),
    };
  });

  protected remove(): void {
    const run = this.run();
    if (!run) return;
    confirm(this.dialog, {
      title: 'Delete this mission?',
      message: `"${run.name}" and its stats will be removed from the mission log.`,
      confirm: 'Delete',
    })
      .pipe(filter(Boolean))
      .subscribe(() => {
        const removed = this.runs.remove(run.id);
        void this.router.navigate(['/']);
        this.snackBar
          .open('Mission deleted', 'Undo', { duration: 8000 })
          .onAction()
          .subscribe(() => removed && this.runs.add(removed));
      });
  }
}
