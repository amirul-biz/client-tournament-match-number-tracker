import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
