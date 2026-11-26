import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, of, switchMap } from 'rxjs';
import { ActiveMissionStore } from '../../core/mission/active-mission.store';
import { formatDuration, teamTotals } from '../../core/mission/mission-math';
import { MissionSetup, OUTCOME_LABELS } from '../../core/models/mission.models';
import { RunsStore } from '../../core/runs/runs.store';
import { confirm } from '../../core/ui/confirm-dialog';
import { NewMissionDialog } from './new-mission-dialog';

@Component({
  selector: 'app-main-menu',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  protected readonly active = inject(ActiveMissionStore);
  protected readonly runsStore = inject(RunsStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly outcomeLabels = OUTCOME_LABELS;
  protected readonly activeTime = computed(() => formatDuration(this.active.elapsedMs()));
  protected readonly rows = computed(() =>
    this.runsStore.runs().map((run) => ({ run, time: formatDuration(run.durationMs), totals: teamTotals(run.miners) })),
  );

  protected newMission(): void {
    const current = this.active.mission();
    const proceed$ = current
      ? confirm(this.dialog, {
          title: 'Replace the current mission?',
          message: `"${current.name}" is still in progress. Starting a new one throws it away without saving it to the log.`,
          confirm: 'Discard and start new',
        })
      : of(true);

    proceed$
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.dialog
            .open<NewMissionDialog, unknown, MissionSetup>(NewMissionDialog, {
              data: this.active.roster(),
              width: '640px',
            })
            .afterClosed(),
        ),
        filter((setup): setup is MissionSetup => !!setup),
      )
      .subscribe((setup) => {
        this.active.begin(setup);
        void this.router.navigate(['/mission']);
      });
  }

  protected exportSaves(): void {
    const blob = new Blob([JSON.stringify(this.runsStore.toFile(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  protected async importSaves(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const added = this.runsStore.importFile(await file.text());
      this.snackBar.open(added ? `Imported ${added} mission${added === 1 ? '' : 's'}` : 'No new missions in that file', 'OK', {
        duration: 4000,
      });
    } catch (e) {
      this.snackBar.open(e instanceof Error ? e.message : 'That file could not be read.', 'OK', { duration: 6000 });
    }
  }
}
