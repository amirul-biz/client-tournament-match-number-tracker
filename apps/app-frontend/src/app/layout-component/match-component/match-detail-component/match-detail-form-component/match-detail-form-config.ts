import { EnumStatusType } from '../../../../libs/enums/enum-status-type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export interface IMatchDetailForm {
  matchNumber: FormControl<string | null>;
  arenaId: FormControl<number | null>;
  statusId: FormControl<EnumStatusType | null>;
  teamInfos: FormArray<FormGroup<ITeamDetailForm>>;
}

export interface ITeamDetailForm {
  teamId: FormControl<string | null>;
  score: FormControl<number | null>;
}

export function getMatchDetailForm(): FormGroup<IMatchDetailForm> {
  return new FormGroup<IMatchDetailForm>({
    matchNumber: new FormControl<string | null>(null, Validators.required),
    arenaId: new FormControl<number | null>(null, Validators.required),
    teamInfos: new FormArray<FormGroup<ITeamDetailForm>>([
      getTeamDetailForm(),
      getTeamDetailForm(),
    ]),
    statusId: new FormControl<EnumStatusType | null>(null, Validators.required),
  });
}

export function getTeamDetailForm(): FormGroup<ITeamDetailForm> {
  return new FormGroup<ITeamDetailForm>({
    teamId: new FormControl<string | null>(null, Validators.required),
    score: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
  });
}
