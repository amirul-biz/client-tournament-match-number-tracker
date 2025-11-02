import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchInfoDockComponent } from './match-info-dock-component/match-info-dock-component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-match-info-component',
  imports: [CommonModule, MatchInfoDockComponent, MatCardModule, MatIconModule],
  templateUrl: './match-info-component.html',
  styleUrl: './match-info-component.scss',
})
export class MatchInfoComponent {

}
