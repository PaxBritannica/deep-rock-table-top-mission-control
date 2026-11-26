import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActiveMissionStore } from '../../../core/mission/active-mission.store';
import { formatKda } from '../../../core/mission/mission-math';
import { Miner, StatKey } from '../../../core/models/mission.models';

interface StatDef {
  key: StatKey;
  label: string;
  icon: string;
}

export const STAT_DEFS: readonly StatDef[] = [
  { key: 'kills', label: 'Kills', icon: 'pest_control' },
  { key: 'deaths', label: 'Downed', icon: 'skull' },
  { key: 'revives', label: 'Revives', icon: 'healing' },
  { key: 'minerals', label: 'Minerals', icon: 'diamond' },
];

@Component({
  selector: 'app-miner-card',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './miner-card.html',
  styleUrl: './miner-card.scss',
  host: { '[attr.data-class]': 'miner().cls' },
})
export class MinerCard {
  readonly miner = input.required<Miner>();

  protected readonly store = inject(ActiveMissionStore);
  protected readonly stats = STAT_DEFS;
  protected readonly kda = computed(() => formatKda(this.miner().stats));
}
