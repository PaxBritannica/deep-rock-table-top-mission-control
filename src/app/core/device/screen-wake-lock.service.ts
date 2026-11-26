import { Injectable } from '@angular/core';

/**
 * Keeps the phone screen on while a mission is running.
 * Browsers drop the lock when the tab is hidden, so it is re-acquired
 * when the page becomes visible again.
 */
@Injectable({ providedIn: 'root' })
export class ScreenWakeLockService {
  private sentinel: WakeLockSentinel | null = null;
  private wanted = false;

  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (this.wanted && document.visibilityState === 'visible') void this.acquire();
    });
  }

  get supported(): boolean {
    return 'wakeLock' in navigator;
  }

  async enable(): Promise<void> {
    this.wanted = true;
    await this.acquire();
  }

  async disable(): Promise<void> {
    this.wanted = false;
    await this.sentinel?.release().catch(() => undefined);
    this.sentinel = null;
  }

  private async acquire(): Promise<void> {
    if (!this.supported || (this.sentinel && !this.sentinel.released)) return;
    try {
      this.sentinel = await navigator.wakeLock.request('screen');
    } catch {
      /* denied (battery saver, unsupported context) – ignore */
    }
  }
}
