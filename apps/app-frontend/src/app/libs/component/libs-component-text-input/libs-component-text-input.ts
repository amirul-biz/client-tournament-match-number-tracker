import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-libs-component-text-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],

  templateUrl: './libs-component-text-input.html',
  styleUrl: './libs-component-text-input.scss',
  standalone: true,
})
export class LibsComponentTextInput {
  @Input()
  inputField: FormControl = new FormControl();
  @Input()
  inputType = 'text';
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
