import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {ArretMachineService} from '../../../services/arretMachine/ArretMachineService/arret-machine.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MachineService} from '../../../services/arretMachine/MachineService/machine.service';
import {AlertBoxService} from '../../../services/utils/alert-box.service';
import {ShiftService} from '../../../services/arretMachine/ShiftService/shift.service';
import {ShiftMachinePiloteService} from '../../../services/arretMachine/ShiftMachinePiloteService/shift-machine-pilote.service';
import {AuthService} from '../../../services/login/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-tableau-bord',
  templateUrl: './tableau-bord.component.html',
  styleUrls: ['./tableau-bord.component.css']
})
export class TableauBordComponent implements OnInit {

  private subscriptions: Subject<void> = new Subject<void>();

  // lineChart
  public lineChart = {
    lineChartData: [],
    lineChartLabels: [],
    lineChartOptions: {animation: false, responsive: true},
    lineChartColor: [],
    lineChartLegend: true
  };

  isLineChartReady: boolean = false;
  isCircleChartReady: boolean = false;
  public machinesDropDown = {data: null, selected: null, settings: null};
  public shiftsDropDown = {data: null, selected: null, settings: null};
  public pilotesDropDown = {data: null, selected: null, settings: null};
  public arretMachine: any = {ID_MACHINE: null, ID_PILOTE: null, ID_SHIFT: null};
  public month: number = 0; // 0: mois actuel, 1: mois precedent

  public circleChart = {circleChartLabels: [], circleChartData: [], colors: []};
  public nbrHourOfShift: number = null;

  constructor(private arretMachineService: ArretMachineService, private machineService: MachineService,
              private  alertBoxService: AlertBoxService,
              private shiftService: ShiftService, private shiftMachinePiloteService: ShiftMachinePiloteService,
              private authService: AuthService, private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.configmachinesDropDown();
    this.configShiftsDropDown();
    this.configPilotesDropDown();
    this.spinner.hide();
  }

  configmachinesDropDown() {
    if (this.authService.getDecodedToken().ID_PROFIL == 3042) { // is a pilote
      this.machineService.findMachineOfPilote(this.authService.getDecodedToken().ID_UTILISATEUR)
        .pipe(takeUntil(this.subscriptions))
        .subscribe((response) => {
          this.machinesDropDown.data = response['data'];
        }, error => {
          this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
        });
    } else { // respo of pilotes
      this.machineService.findAll()
        .pipe(takeUntil(this.subscriptions))
        .subscribe((response) => {
          this.machinesDropDown.data = response['data'];
        }, error => {
          this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
        });
    }
    this.machinesDropDown.settings = {
      singleSelection: true,
      idField: 'ID_MACHINE',
      textField: 'LIBELLE',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  configShiftsDropDown() {
    this.shiftService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.shiftsDropDown.data = response['data'];
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
    this.shiftsDropDown.settings = {
      singleSelection: true,
      idField: 'ID_SHIFT',
      textField: 'LIBELLE',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  configPilotesDropDown() {
    const connectedUser = this.authService.getDecodedToken();
    if (connectedUser.ID_PROFIL == 3042) { // pilote
      this.shiftMachinePiloteService.findPilotesMutualMachines(connectedUser.ID_UTILISATEUR)
        .pipe(takeUntil(this.subscriptions))
        .subscribe((response) => {
          this.pilotesDropDown.data = response['data'];
        }, error => {
          this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
        });
    } else { // uer is respo
      this.shiftMachinePiloteService.getPilotes()
        .pipe(takeUntil(this.subscriptions))
        .subscribe((response) => {
          this.pilotesDropDown.data = response['data'];
        }, error => {
          this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
        });
    }
    this.pilotesDropDown.settings = {
      singleSelection: true,
      idField: 'ID_PILOTE',
      textField: 'pilote',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  refresh() {
    this.machinesDropDown.selected = null;
    this.shiftsDropDown.selected = null;
    this.pilotesDropDown.selected = null;
    this.arretMachine = {ID_MACHINE: null, ID_PILOTE: null, ID_SHIFT: null};
    this.isLineChartReady = false;
  }

  search() {
    this.isLineChartReady = false;
    this.isCircleChartReady = false;
    this.arretMachineService.findArretMachineByCritaria(this.arretMachine.ID_MACHINE, this.arretMachine.ID_PILOTE, this.arretMachine.ID_SHIFT, this.month)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response => {
        if (response['data'].data != null) {
          this.lineChart.lineChartColor = [];
          this.lineChart.lineChartData = [];
          for (let item of response['data'].data) {
            let durees = [];
            let dates = [];
            for (let arretData of item.dateDuree) {
              durees.push(arretData.DUREE_ARRET_MINUTE);
              dates.push(arretData.DATE_ARRET);
            }
            if (this.month == 0) {
              this.lineChart.lineChartLabels = dates.filter(item => item <= moment(new Date()).format('YYYY-MM-DD'));
            } else if (this.month == 1) {
              this.lineChart.lineChartLabels = dates;
            }
            this.lineChart.lineChartColor.push({ // grey
              backgroundColor: 'rgba(148,159,177,0.2)',
              borderColor: item.couleur,
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            });
            this.lineChart.lineChartData.push({data: durees, label: item.typeArretLibelle});
            this.nbrHourOfShift = response['data'].shift;
          }
          this.isLineChartReady = true;
        }
      }));
  }

  public circlChartClicked(event: any): void {
    if (event.active.length > 0) {
      this.isCircleChartReady = true;
      let data = [];
      this.circleChart.circleChartLabels = [];
      let sum = 0;
      for (let item of this.lineChart.lineChartData) {
        sum += item.data[event.active[0]._index];
        data.push(item.data[event.active[0]._index]);
        this.circleChart.circleChartLabels.push(item.label);
      }
      data.push(this.nbrHourOfShift * 60 - sum);
      this.circleChart.circleChartLabels.push('En travail');
      let circleColor = [];
      for (let color of this.lineChart.lineChartColor) {
        circleColor.push(color.borderColor);
      }
      circleColor.push('#BFCACF');
      this.circleChart.colors = [{backgroundColor: circleColor}];
      this.circleChart.circleChartData = [data];
    } else {
      this.isCircleChartReady = false;
    }
  }

}
