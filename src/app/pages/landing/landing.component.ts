import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/login/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  usersession: any = null;
  private subscriptions = new Subject<void>();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.usersession = this.authService.getDecodedToken();
  }

  ngOnDestroy(): void {
    this.subscriptions.next();
    this.subscriptions.complete();
    this.subscriptions.unsubscribe();
  }

}
