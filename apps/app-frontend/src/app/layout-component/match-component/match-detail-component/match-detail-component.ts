import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatchDetailFormComponent } from './match-detail-form-component/match-detail-form-component';
import {
  getMatchDetailForm,
  ITeamDetailForm,
} from './match-detail-form-component/match-detail-form-config';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-match-detail-component',
  imports: [CommonModule, MatchDetailFormComponent],
  templateUrl: './match-detail-component.html',
  styleUrl: './match-detail-component.scss',
})
export class MatchDetailComponent implements OnInit {
  matchDetailForm = getMatchDetailForm();
  ngOnInit(): void {}
}
