import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface UserProfile {
  id: string;
  googleId: string;
  name: string;
  email: string;
  picture?: string;
  teamId?: string;
  teamName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Use environment variable for API URL
  private readonly AUTH_API_URL = environment.authApiUrl;
  private readonly CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

  // Signals for reactive state
  protected readonly isAuthenticated = signal<boolean>(false);
  protected readonly userProfile = signal<UserProfile | null>(null);

  // Private state for caching
  private lastAuthCheck: number | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Check if user is authenticated
   * Uses cached value if checked within the last 10 minutes
   * Otherwise makes API call to verify authentication
   */
  checkAuth(): Observable<boolean> {
    const now = Date.now();

    // If we have a recent check (within 10 minutes), return cached value
    if (
      this.lastAuthCheck !== null &&
      now - this.lastAuthCheck < this.CACHE_DURATION_MS
    ) {
      return of(this.isAuthenticated());
    }

    // Make API call to verify authentication
    return this.http
      .get<UserProfile>(`${this.AUTH_API_URL}/profile`, {
        withCredentials: true, // Send cookies
      })
      .pipe(
        tap((profile) => {
          // Update state on success
          this.userProfile.set(profile);
          this.isAuthenticated.set(true);
          this.lastAuthCheck = now;
        }),
        map(() => true),
        catchError((error) => {
          // Handle 401 or any other error
          this.clearAuth();
          return of(false);
        })
      );
  }

  /**
   * Initiate Google OAuth login
   * Redirects to backend OAuth endpoint
   */
  login(): void {
    window.location.href = `${this.AUTH_API_URL}/google`;
  }

  /**
   * Clear authentication state
   * Used when user logs out or auth fails
   */
  clearAuth(): void {
    this.isAuthenticated.set(false);
    this.userProfile.set(null);
    this.lastAuthCheck = null;
  }

  /**
   * Get current user profile
   */
  getUserProfile(): UserProfile | null {
    return this.userProfile();
  }

  /**
   * Get authentication status
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}
