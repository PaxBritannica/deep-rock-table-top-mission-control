import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  DWARF_CLASSES,
  DwarfClass,
  HAZARD_LEVELS,
  HazardLevel,
  MISSION_TYPES,
  MissionSetup,
  MissionType,
  Roster,
} from '../../core/models/mission.models';

type MinerGroup = FormGroup<{
  cls: FormControl<DwarfClass>;
  playing: FormControl<boolean>;
  player: FormControl<string>;
}>;

const atLeastOnePlaying = (arr: AbstractControl): ValidationErrors | null =>
  (arr as FormArray<MinerGroup>).controls.some((g) => g.controls.playing.value) ? null : { noMiners: true };

@Component({
  selector: 'app-new-mission-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './new-mission-dialog.html',
  styleUrl: './new-mission-dialog.scss',
})
export class NewMissionDialog {
  private readonly ref = inject(MatDialogRef<NewMissionDialog, MissionSetup>);
  private readonly roster = inject<Roster>(MAT_DIALOG_DATA) ?? {};

  protected readonly types = MISSION_TYPES;
  protected readonly hazards = HAZARD_LEVELS;

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    type: new FormControl<MissionType>('Mining Expedition', { nonNullable: true }),
    hazard: new FormControl<HazardLevel>(2, { nonNullable: true }),
    miners: new FormArray<MinerGroup>(
      DWARF_CLASSES.map(
        (cls) =>
          new FormGroup({
            cls: new FormControl(cls, { nonNullable: true }),
            playing: new FormControl(true, { nonNullable: true }),
            player: new FormControl(this.roster[cls] ?? '', {
              nonNullable: true,
              validators: [Validators.maxLength(24)],
            }),
          }),
      ),
      { validators: atLeastOnePlaying },
    ),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name,
      type: v.type,
      hazard: v.hazard,
      miners: v.miners.filter((m) => m.playing).map(({ cls, player }) => ({ cls, player })),
    });
  }
}
