import { Injectable } from '@angular/core';
import {HttpHelperService} from '../../utils/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class EvenementTypeArretService {

  private className = '/api/arretMachine/evenement_type_arret';

  constructor(private httpMethode: HttpHelperService) { }

  findAll() {
    const path = '/findAll';
    return this.httpMethode.get(this.className + path);
  }

  create(entityObj) {
    const path = '/create';
    return this.httpMethode.post(this.className + path, entityObj);
  }

  delete(entityObj) {
    const path = '/delete';
    return this.httpMethode.post(this.className + path, entityObj);
  }

  update(entityObj) {
    const path = '/update';
    return this.httpMethode.put(this.className + path, entityObj);
  }
}
