import {Injectable} from '@angular/core';
import {HttpHelperService} from '../utils/http-helper.service';
import {Observable} from 'rxjs';
import {Constants} from '../../constants';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpHelperService) {
  }

  /**
   * @description check if is logged in
   * @return boolean
   */
  public get loggedIn(): boolean {
    return (localStorage.getItem(Constants.TOKEN_KEY) !== null);
  }

  /**
   *
   * @param pseudo
   * @returns Observable
   */
  checkLastSession(pseudo: any): Observable<any> {
    return this.http.get(`/api/auth/checkOpenedSessions/${pseudo}`);
  }

  checkSessionByAppSessionId(idSessionApplicatif): Observable<any> {
    return this.http.get(`/api/auth/checkSessionByAppSessionId/${idSessionApplicatif}`);
  }

  checkservertoken(): Observable<any> {
    return this.http.get(`/api/auth/userconnected`);
  }

  /**
   *
   * @param pseudo
   * @param password
   * @returns Observable
   */
  login(pseudo: any, password: any): Observable<any> {
    return this.http.post('/api/auth/jwt', {pseudo, password});
  }

  /**
   * @description remove token from storage to logout
   */
  clearStorageSession(): void {
    localStorage.removeItem(Constants.TOKEN_KEY);
  }

  /**
   * @description close session applicatif in server
   * @returns Observable
   */
  logout(idUser): Observable<any> {
    return this.http.get('/api/auth/logout/' + idUser);
  }

  /**
   * @description close session applicatif in server by idUser
   * @param idUser
   * @returns Observable
   */
  closeSessionById(idUser: number, idSessionApplicatif): Observable<any> {
    return this.http.get('/api/auth/logoutByIdSession/' + idUser + '/' + idSessionApplicatif);
  }

  closeSession(idUser: number): Observable<any> {
    return this.http.put('/api/auth/logoutOnClose', {idUser: idUser});
  }

  /**
   * @description get access token from local storage
   * @returns string
   */

  getToken(): string {
    return localStorage.getItem(Constants.TOKEN_KEY);
  }

  /**
   * @description get decoded token payload
   * @param token
   * @returns Object
   */
  getDecodedToken(token?: string): any {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return null;
    }

    return jwt_decode(token);
  }

  /**
   * @description save access token in local storage
   * @param token
   */
  setToken(token: string): void {
    localStorage.setItem(Constants.TOKEN_KEY, token);
  }

  /**
   * @description get token expiration date
   * @param token
   * @returns Date
   */
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  /**
   * @description check if token is expired
   * @param token
   * @returns boolean
   */
  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  /**
   *
   * @param idmodule
   * @param idrubrique
   * @param abrvChamp
   */
  hasAccess(idmodule: any, idrubrique: any, abrvChamp: any): boolean {

    let roles: any[] = this.getDecodedToken().roles;
    for (let i = 0; i < roles.length; i++) {

      if (roles[i]['id'] == idmodule) {
        let rubriques: any[] = roles[i]['rubriques'];
        for (let j = 0; j < rubriques.length; j++) {
          if (rubriques[j].id == idrubrique) {
            let champs: any[] = rubriques[j]['champs'];
            for (let k = 0; k < champs.length; k++) {
              if (abrvChamp == champs[k]) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  findByMatricule(matricule) {
    const path = '/api/monitoring/utilisateur/findUsersByMatricule/' + matricule;
    return this.http.get(path);
  }

  updateUser(oldEntity, newEntity) {
    const path = '/api/monitoring/utilisateur/update';
    return this.http.put(path, {oldEntity: oldEntity, newEntity: newEntity});
  }

}
