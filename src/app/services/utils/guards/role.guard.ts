import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(this.authService.getDecodedToken());
    const roles: any[] = this.authService.getDecodedToken().roles;

    const idmodule = next.data.idmodule;
    const idrubrique = next.data.idrubrique;

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id === idmodule) {
        for (let j = 0; j < roles[i].rubriques.length; j++) {
          if (roles[i].rubriques[j].id === idrubrique) {
            return true;
          }
        }
      }
    }
    this.router.navigate(['401']);
    return false;
  }
}
