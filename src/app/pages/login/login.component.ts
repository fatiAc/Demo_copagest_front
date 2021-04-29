import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorMessageService} from '../../services/utils/error-message.service';
import {AuthService} from '../../services/login/auth.service';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {AlertBoxService} from '../../services/utils/alert-box.service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;

  private unsubscribeLogin = new Subject<void>();


  constructor(private formBuilder: FormBuilder, public frErrSrv: ErrorMessageService,
              private authService: AuthService, private router: Router,
              private alertBoxService: AlertBoxService) {
  }

  ngOnInit() {
    if (!this.authService.isTokenExpired()) {
      this.router.navigate(['']);
    }
    this.loginForm = this.formBuilder.group({
      pseudo: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });

  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.autenticate();
  }

  ngOnDestroy(): void {
    this.unsubscribeLogin.next();
    this.unsubscribeLogin.complete();
    this.unsubscribeLogin.unsubscribe();
  }

  private autenticate(): void {
    this.authService.login(this.loginForm.value.pseudo, this.loginForm.value.password)
      .pipe(
        takeUntil(this.unsubscribeLogin)
      )
      .subscribe(
        value => {
          this.authService.setToken(value.data.accessToken);
          this.router.navigate(['']);
        },
        error => {
          this.alertBoxService.subscriptionErrAlert(error);
        }
      );
  }
}
