import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }


 /* @HostListener('window:beforeunload', ['$event'])
  BeforeWindowClose(event: any): void {


    let userSession = this.authService.getDecodedToken();
    let tabsCount: any = localStorage.getItem('navigator_tab_opened');
    tabsCount = parseInt(tabsCount) - 1;
    localStorage.setItem('navigator_tab_opened', tabsCount.toString());


    if (userSession) {

      if (tabsCount == 0) {//

        localStorage.removeItem('navigator_tab_opened');
        this.authService.clearStorageSession();
        navigator.sendBeacon(`http://${Constants.HOST_DOMAINE}/api/auth/logoutOnClose/${userSession.ID_UTILISATEUR}`);
      }
    }

  }

  @HostListener('window:load', ['$event'])
  CountTabs(): void {
    let tabsCount: any = localStorage.getItem('navigator_tab_opened');
    tabsCount = (isNaN(tabsCount)) ? 1 : parseInt(tabsCount) + 1;

    localStorage.setItem('navigator_tab_opened', tabsCount.toString());
  }*/

}
