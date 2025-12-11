import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-auth-component',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);

  protected handleGoogleLogin(): void {
    this.authService.login();
  }
}
