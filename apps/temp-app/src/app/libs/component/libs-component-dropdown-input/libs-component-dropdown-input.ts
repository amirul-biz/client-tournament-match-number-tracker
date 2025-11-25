import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-libs-component-dropdown-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './libs-component-dropdown-input.html',
  styleUrl: './libs-component-dropdown-input.scss',
  standalone: true
})
export class LibsComponentDropdownInput {
  @Input()
  inputField: FormControl = new FormControl();
  @Input() dataList: { [key: string]: any }[] = [];
  @Input() targetValueKey!: string;
  @Input() targetDisplayKey!: string;
  @Input()
  labelText?: string;
  @Input()
  placeholder?: string;
  @Input()
  hint?: string;
  @Input()
  patternMessage?: string;
  @Input() showInfoIcon: boolean = false;
  @Input() tooltipText: string = '';
  @Input() isMandatory: boolean = true;
}
