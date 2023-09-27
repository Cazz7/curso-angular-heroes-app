import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{

  constructor( private authService: AuthService,
              private router: Router ) { }

  // In this case we can centralize can match and can activate
  private checkAuthStatus(): Observable<boolean>{
    // Si no esta autenticado se redirecciona
    return this.authService.checkAuth()
      .pipe(
        tap( isAuthenticated => {
          if(!isAuthenticated) this.router.navigate(['./auth/login'])
        } )
      )

  }

  canMatch(route: Route, segments: UrlSegment[]): boolean|Observable<boolean> {
    // console.log('Can Match')
    // console.log({route, segments})
    return this.checkAuthStatus();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean|Observable<boolean>{
    // console.log('Can Activate')
    // console.log({route, state})
    return this.checkAuthStatus();
  }

}
