import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IMatchDetailForm } from './match-detail-form-config';

@Component({
  selector: 'app-match-detail-form-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './match-detail-form-component.html',
  styleUrl: './match-detail-form-component.scss',
})
export class MatchDetailFormComponent {
 @Input() matchDetailForm!: FormGroup<IMatchDetailForm> 
}
