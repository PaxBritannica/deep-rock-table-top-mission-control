import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenWakeLockService } from '../../core/device/screen-wake-lock.service';
import { ActiveMissionStore } from '../../core/mission/active-mission.store';
import { formatDuration } from '../../core/mission/mission-math';
import { EndMissionData, EndMissionDialog, EndMissionResult } from './end-mission-dialog/end-mission-dialog';
import { MinerCard } from './miner-card/miner-card';
import { RulesDrawer } from './rules-drawer/rules-drawer';

@Component({
  selector: 'app-mission-control',
  imports: [RouterLink, MatButtonModule, MatIconModule, MinerCard, RulesDrawer],
  templateUrl: './mission-control.html',
  styleUrl: './mission-control.scss',
})
export class MissionControl {
  protected readonly store = inject(ActiveMissionStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly wakeLock = inject(ScreenWakeLockService);

  protected readonly rules = viewChild.required(RulesDrawer);

  protected readonly clock = computed(() => formatDuration(this.store.elapsedMs()));
  /** 0..4, drives how loud the swarm panel gets. */
  protected readonly danger = computed(() => Math.min(this.store.overflows(), 4));
  protected readonly timerLabel = computed(() =>
    this.store.running() ? 'Pause' : this.store.started() ? 'Resume' : 'Start',
  );

  constructor() {
    effect(() => void (this.store.running() ? this.wakeLock.enable() : this.wakeLock.disable()));
  }

  protected swarmMaxed(): void {
    this.store.addOverflow();
    navigator.vibrate?.(200);
    this.snackBar.open(`Swarm meter restarted. "+1 swarm" events now count as +${this.store.multiplier()}.`, 'OK', {
      duration: 5000,
    });
  }

  protected stop(): void {
    const m = this.store.mission();
    if (!m) return;
    const wasRunning = this.store.running();
    this.store.pause();

    this.dialog
      .open<EndMissionDialog, EndMissionData, EndMissionResult>(EndMissionDialog, {
        data: { name: m.name, time: this.clock() },
        width: '520px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          if (wasRunning) this.store.start();
          return;
        }
        if (result === 'discard') {
          const discarded = this.store.discard();
          void this.router.navigate(['/']);
          this.snackBar
            .open('Mission discarded', 'Undo', { duration: 8000 })
            .onAction()
            .subscribe(() => {
              if (discarded) {
                this.store.restore(discarded);
                void this.router.navigate(['/mission']);
              }
            });
          return;
        }
        const run = this.store.finish(result);
        if (run) void this.router.navigate(['/runs', run.id]);
      });
  }
}
