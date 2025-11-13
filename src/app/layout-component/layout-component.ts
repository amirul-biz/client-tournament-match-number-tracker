import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DockComponent } from './dock-component/dock-component';

@Component({
  selector: 'app-layout-component',
  imports: [CommonModule, RouterModule, DockComponent],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss',
})
export class LayoutComponent {

}
