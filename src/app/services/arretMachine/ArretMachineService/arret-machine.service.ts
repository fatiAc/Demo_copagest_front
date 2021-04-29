import {Injectable} from '@angular/core';
import {HttpHelperService} from '../../utils/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ArretMachineService {

  private className = '/api/arretMachine/arret_machine';

  constructor(private httpMethode: HttpHelperService) {
  }

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

  findArretMachineByCritaria(machineID, piloteID, shiftID, month) {
    const path = '/findArretMachineByCritaria/' + machineID + '/' + piloteID + '/' + shiftID + '/' + month;
    return this.httpMethode.get(this.className + path);
  }

  findArretMachineOfConnectedPilote(connectedPiloteID) {
    const path = '/findArretMachineOfConnectedPilote/' + connectedPiloteID;
    return this.httpMethode.get(this.className + path);
  }
}
