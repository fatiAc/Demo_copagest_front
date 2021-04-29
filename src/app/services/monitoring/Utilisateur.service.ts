import {Injectable} from '@angular/core';
import {HttpHelperService} from '../utils/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private HttpMethod: HttpHelperService) {
  }

  getUserByMatricule(matricule) {
    const path = '/api/monitoring-v2/utilisateur/' + matricule;
    return this.HttpMethod.get(path);
  }

  findAllMagasinier(matricule) {
    const path = '/api/monitoring/utilisateur/findUsersByMatricule/' + matricule;
    return this.HttpMethod.get(path);
  }

  findByPk(idpk: number) {
    const path = '/api/monitoring-v2/utilisateur/' + idpk;
    return this.HttpMethod.get(path);
  }

  findOne(query = {}) {
    const path = '/api/monitoring-v2/utilisateur/' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    return this.HttpMethod.get(path);
  }

  create(entity = {}) {
    const path = '/api/monitoring-v2/utilisateur';
    return this.HttpMethod.post(path, entity);
  }

  bulkCreate(entity = []) {
    const path = '/api/monitoring-v2/utilisateur';
    return this.HttpMethod.post(path, entity);
  }

  update(entity = [], query = {}) {
    const path = '/api/monitoring-v2/utilisateur' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    return this.HttpMethod.put(path, entity);
  }

  delete(query = {}) {
    const path = '/api/monitoring-v2/utilisateur' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    return this.HttpMethod.delete(path);
  }

  getGLPIUsers() {
    const path = '/api/monitoring/utilisateur/getglpiusers';
    return this.HttpMethod.get(path);
  }

  findAllUsers() {
    const path = '/api/monitoring/utilisateur/findAllUsers';
    return this.HttpMethod.get(path);
  }

  findAllUsersByUser(idUser) {
    const path = '/api/monitoring/utilisateur/findAllUsersByUser/' + idUser;
    return this.HttpMethod.get(path);
  }

}
