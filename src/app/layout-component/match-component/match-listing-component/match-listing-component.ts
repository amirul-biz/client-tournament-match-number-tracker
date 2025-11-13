import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EnumPageType } from '@enums/enum-page-type';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-match-listing-component',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './match-listing-component.html',
  styleUrl: './match-listing-component.scss',
})
export class MatchListingComponent {
  enumPageType = EnumPageType;
}
