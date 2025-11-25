import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-match-dock-component',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dock-component.html',
  styleUrl: './dock-component.scss',
  standalone: true,
})
export class DockComponent {}
