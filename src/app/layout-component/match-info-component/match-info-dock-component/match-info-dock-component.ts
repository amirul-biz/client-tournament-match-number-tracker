import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-match-info-dock-component',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './match-info-dock-component.html',
  styleUrl: './match-info-dock-component.scss',
  standalone: true,
})
export class MatchInfoDockComponent {

}
