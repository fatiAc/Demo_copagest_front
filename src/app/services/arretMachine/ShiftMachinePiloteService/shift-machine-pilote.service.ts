import {Injectable} from '@angular/core';
import {HttpHelperService} from '../../utils/http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftMachinePiloteService {

  private className = '/api/arretMachine/shift_machine_pilote';

  constructor(private httpMethode: HttpHelperService) {
  }

  findAll() {
    const path = '/findAll';
    return this.httpMethode.get(this.className + path);
  }

  getPilotes() {
    const path = '/getPilotes';
    return this.httpMethode.get(this.className + path);
  }

  findAllShiftMachinePilot() {
    const path = '/findAllShiftMachinePilot';
    return this.httpMethode.get(this.className + path);
  }

  findShiftMachinePilotOfConnectedPilote(connectedPiloteID) {
    const path = '/findShiftMachinePilotOfConnectedPilote/' + connectedPiloteID;
    return this.httpMethode.get(this.className + path);
  }

  findPilotesMutualMachines(machineID) {
    const path = '/findPilotesMutualMachines/' + machineID;
    return this.httpMethode.get(this.className + path);
  }

  findPiloteByMachineAndShift(machineID, shiftID) {
    const path = '/findPiloteByMachineAndShift/' + machineID + '/' + shiftID;
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

  getCurrentshiftAndMachineByPilote(idPilote) {
    const path = '/getCurrentshiftAndMachineByPilote/' + idPilote;
    return this.httpMethode.get(this.className + path);
  }
}
