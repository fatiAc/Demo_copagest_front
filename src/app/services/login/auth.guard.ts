import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {takeUntil} from 'rxjs/operators';
import {AlertBoxService} from '../utils/alert-box.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private subscriptions: Subject<void> = new Subject<void>();

  constructor(private router: Router, private authService: AuthService, private alertBoxService: AlertBoxService) {
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getDecodedToken() === null) {
      this.router.navigate(['login']);
      return false;
    }
    let datefermeture = null;
    await this.authService.checkSessionByAppSessionId(this.authService.getDecodedToken().ID_SESSION_APPLICATIF)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        value => {
          datefermeture = value.data;

          if (datefermeture === null && !this.authService.isTokenExpired()) {
            return true;
          } else {
            if (this.authService.isTokenExpired()) {
              this.authService.closeSessionById(
                this.authService.getDecodedToken().ID_UTILISATEUR,
                this.authService.getDecodedToken().ID_SESSION_APPLICATIF
              )
                .pipe(takeUntil(this.subscriptions))
                .subscribe(
                  value => {
                  },
                  err => {
                    this.alertBoxService.alert({
                      icon: 'error',
                      title: 'Probléme de logout',
                      text: 'Un problème est servenu lors de la fermeture de votre session.' + err.error.message
                    });
                    return false;
                  });
            }
            this.authService.clearStorageSession();
            this.router.navigate(['login']);

            return false;
          }

        },
        err => {
          this.alertBoxService.alert({
            icon: 'error',
            title: 'Probléme de logout',
            text: 'Un problème est servenu lors de la fermeture de votre session.' + err.error.message
          });
          return false;
        });

    return true;
  }

}
