import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/login/auth.service';
import {Router} from '@angular/router';
import {take, takeUntil} from 'rxjs/operators';
import {INavData} from '@coreui/angular';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {AlertBoxService} from '../../services/utils/alert-box.service';
import {AuthGuard} from '../../services/login/auth.guard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems: INavData[] = [];

  public userSession: any = null;
  public modalRef: BsModalRef;
  public password = {old: null, new1: null, new2: null, userPassword: null};
  private subscriptions: Subject<void> = new Subject<void>();

  constructor(private router: Router, private authService: AuthService, private modalService: BsModalService, private toastr: ToastrService, private alertBoxService: AlertBoxService,
              private authGard: AuthGuard) {
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(): void {

    this.userSession = this.authService.getDecodedToken();
    console.log(this.userSession);
    console.log(this.userSession.MATRICULE);
    console.log(this.userSession ? '( ' + (this.userSession.MATRICULE + (this.userSession.SITE != null ? (', ' + this.userSession.SITE) : '')) + ' )' : '');
    let roles: any[] = this.userSession.roles;

    for (let i = 0; i < roles.length; i++) {
      let rubriques: any[] = roles[i].rubriques;
      let children: INavData[] = [];

      for (let j = 0; j < rubriques.length; j++) {
        children.push({
          url: '/' + roles[i].id + '/' + rubriques[j].route,
          name: rubriques[j].title
        });
      }

      this.navItems.push({
        children: children,
        name: roles[i].libelle,
        url: '/' + roles[i].id
      });

    }
  }

  public logout(): void {
    this.authService.logout(this.authService.getDecodedToken().ID_UTILISATEUR)
      .pipe(
        take(1)
      )
      .subscribe(
        value => {
          // this.authService.clearStorageSession();
          this.router.navigate(['login']);
        },
        error => {
          // console.log(error);
        }
      );
  }

  async verifyPasswordFields() {
    this.password.userPassword = (await this.getUserByMatricule());
    let isOk = false;
    if (this.password.old == null || this.password.old == '') {
      this.toastr.warning(' Veuillez saisir votre mot de passe actuel ');
    } else if (this.password.new1 == null || this.password.new1 == '') {
      this.toastr.warning(' Veuillez saisir votre nouveau mot de passe ');
    } else if (this.password.new2 == null || this.password.new2 == '') {
      this.toastr.warning(' Veuillez saisir votre nouveau mot de passe ');
    } else if (this.password.old == this.password.new1) {
      this.toastr.warning(' Le mot de passe actuel et le nouveau doivent être différents ');
    } else if (this.password.new1 != this.password.new2) {
      this.toastr.warning(' Les deux nouveaux mots de passe doivent être identiques ');
    } else if (this.password.old != this.password.userPassword) {
      this.toastr.warning(' Le mot de passe actuel est incorrect ');
    } else {
      isOk = true;
    }
    return isOk;
  }

  async getUserByMatricule(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.authService.findByMatricule(this.userSession.MATRICULE).pipe(takeUntil(this.subscriptions)).subscribe(async res => {
        if (res['data'] != null) {
          resolve(res['data'].MPASSE);
        } else {
          resolve(null);
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: error.error.message});
      });
    });

  }

  async openModal(changePasswordModal) {
    if (this.authService.getDecodedToken() === null) {
      this.router.navigate(['login']);
    }
    let datefermeture = null;
    await this.authService.checkSessionByAppSessionId(this.authService.getDecodedToken().ID_SESSION_APPLICATIF)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        value => {
          datefermeture = value.data;
          if (datefermeture === null && !this.authService.isTokenExpired()) {
            this.modalRef = this.modalService.show(changePasswordModal, {class: 'modal-md'});
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
                  });
            }
            this.authService.clearStorageSession();
            this.router.navigate(['login']);
          }

        },
        err => {
          this.alertBoxService.alert({
            icon: 'error',
            title: 'Probléme de logout',
            text: 'Un problème est servenu lors de la fermeture de votre session.' + err.error.message
          });
        });
  }

  async changePassword() {
    if (await this.verifyPasswordFields()) {
      this.alertBoxService.confirm('Confirmation', 'Vous allez être déconnecté après la modification de votre mot de passe . Voulez-vous terminer cette opération ? ').then(confirm => {
        if (confirm) {
          if (this.password.userPassword != null && this.password.userPassword != '' && this.password.userPassword != undefined) {
            this.authService.updateUser({ID_UTILISATEUR: this.userSession.ID_UTILISATEUR}, {MPASSE: this.password.new1}).pipe(takeUntil(this.subscriptions)).subscribe(res => {
              this.alertBoxService.alert({icon: 'success', title: 'Confirmation ', text: ' Vous avez bien modifié votre mot de passe '});
              this.logout();
              this.modalRef.hide();
            }, error => {
              this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: error.error.message});
            });
          }
        }
      });
    }
  }
}
