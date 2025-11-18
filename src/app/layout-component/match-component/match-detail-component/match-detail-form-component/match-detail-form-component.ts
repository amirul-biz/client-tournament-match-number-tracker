import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { LibsComponentDropdownInput } from 'libs/component/libs-component-dropdown-input/libs-component-dropdown-input';
import { LibsComponentTextInput } from 'libs/component/libs-component-text-input/libs-component-text-input';
import { IMatchDetailForm } from './match-detail-form-config';
import { MatButtonModule } from '@angular/material/button';
import json from '@json/styles.json'

@Component({
  selector: 'app-match-detail-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    LibsComponentTextInput,
    LibsComponentDropdownInput,
    MatButtonModule
  ],
  templateUrl: './match-detail-form-component.html',
  styleUrl: './match-detail-form-component.scss',
})
export class MatchDetailFormComponent {
  @Input() matchDetailForm!: FormGroup<IMatchDetailForm>;
  style = json

   matchStatuslist: { [key: string]: any }[] = [
    { id: 1, name: 'Scheduled' },
    { id: 2, name: 'Ongoing' },
    { id: 3, name: 'Completed' },
    { id: 4, name: 'Deleted' },
  ];

  teamList: { [key: string]: any }[] = [
    { id: 1, name: 'Red Raptors', city: 'New York', membersCount: 12 },
    { id: 2, name: 'Blue Bulls', city: 'Chicago', membersCount: 15 },
    { id: 3, name: 'Green Giants', city: 'San Francisco', membersCount: 11 },
    { id: 4, name: 'Golden Eagles', city: 'Los Angeles', membersCount: 14 },
    { id: 5, name: 'Silver Sharks', city: 'Miami', membersCount: 13 },
  ];

 
}
