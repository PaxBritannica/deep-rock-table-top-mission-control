import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Observable, map } from 'rxjs';

export interface ConfirmData {
  title: string;
  message: string;
  confirm: string;
  cancel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton [mat-dialog-close]="false">{{ data.cancel ?? 'Cancel' }}</button>
      <button matButton="filled" [mat-dialog-close]="true">{{ data.confirm }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmData>(MAT_DIALOG_DATA);
}

export function confirm(dialog: MatDialog, data: ConfirmData): Observable<boolean> {
  return dialog
    .open(ConfirmDialog, { data, width: '420px' })
    .afterClosed()
    .pipe(map((r) => r === true));
}
