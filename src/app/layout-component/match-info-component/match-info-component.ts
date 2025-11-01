import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatchInfoDockComponent } from './match-info-dock-component/match-info-dock-component';

@Component({
  selector: 'app-match-info-component',
  imports: [CommonModule, MatchInfoDockComponent],
  templateUrl: './match-info-component.html',
  styleUrl: './match-info-component.scss',
})
export class MatchInfoComponent {

}
