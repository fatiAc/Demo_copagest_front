import {Component, OnInit, ViewChild} from '@angular/core';
import {ShiftMachinePiloteService} from '../../../services/arretMachine/ShiftMachinePiloteService/shift-machine-pilote.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AlertBoxService} from '../../../services/utils/alert-box.service';
import {TypeArretService} from '../../../services/arretMachine/TypeArretService/type-arret.service';
import {EvenementFabricationService} from '../../../services/arretMachine/EvenementFabricationService/evenement-fabrication.service';
import {ArretMachineService} from '../../../services/arretMachine/ArretMachineService/arret-machine.service';
import {AuthService} from '../../../services/login/auth.service';
import * as moment from 'moment';
import {EvenementMachineService} from '../../../services/arretMachine/EvenementMachineService/evenement-machine.service';
import {jqxDropDownListComponent} from 'jqwidgets-ng/jqxdropdownlist';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import {JqxgridFrService} from '../../../services/utils/jqxgrid-fr.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-arret-machine',
  templateUrl: './arret-machine.component.html',
  styleUrls: ['./arret-machine.component.css']
})
export class ArretMachineComponent implements OnInit {

  @ViewChild('typeArretDropDownList', {static: false}) typeArretDropDownList: jqxDropDownListComponent;
  @ViewChild('arretMachineGrid') arretMachineGrid: jqxGridComponent;

  private subscriptions: Subject<void> = new Subject<void>();
  public shiftMachinePiloteDropDown = {selected: [], data: null, settings: null};
  public typesArret: any[] = [];
  public eventsFabrication: any[] = [];
  public datePickerSettings = {min: null, max: null};
  public arretMachine = {
    ID_TYPE_ARRET: null,
    DATE_ARRET: null,
    ID_SHIFT_MACHINE_PILOTE: null,
    ID_EVENEMENT_FABRICATION: null,
    ID_OPERATEUR: null, DUREE_ARRET_MINUTE: null
  };
  public machinesEventFabric: any = null;
  public arretMachineTable = {dataSource: null, dataAdapter: null, columns: []};
  public localization: any = null;

  constructor(private shiftMachinePiloteService: ShiftMachinePiloteService, private alertBoxService: AlertBoxService,
              private typeArretService: TypeArretService, private spinner: NgxSpinnerService,
              private eventFabricationService: EvenementFabricationService, private arretMachineService: ArretMachineService,
              public authService: AuthService,
              private eventMachineService: EvenementMachineService, private jqxgridFrService: JqxgridFrService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    if (this.authService.getDecodedToken().ID_PROFIL === 3042) { // is a pilote
      this.configShiftMachinPilotDropDown();
      this.configTypeArretDropDown();
      this.configDatePicker();
      this.getMachinesEventFabric();
      this.arretMachine.ID_OPERATEUR = this.authService.getDecodedToken().ID_UTILISATEUR;
    }
    this.localization = this.jqxgridFrService.getLocalization('fr');
    this.initArretMachinesTable();
    this.spinner.hide();
  }

  configShiftMachinPilotDropDown() {
    this.shiftMachinePiloteService.findShiftMachinePilotOfConnectedPilote(this.authService.getDecodedToken().ID_UTILISATEUR)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.shiftMachinePiloteDropDown.data = response['data'];
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
    this.shiftMachinePiloteDropDown.settings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'combinaison',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  configTypeArretDropDown() {
    this.typeArretService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        let date = [];
        date.push({
          html: '<div style="height: 20px;width: 20px; float: left;"></div>' +
            '<div disabled="true"><span style="float: left; font-size: 13px; margin-left: 20px"></span></div>',
          title: null
        });
        for (let item of response['data']) {
          const color = '#' + item.CODE_COLEUR;
          date.push({
            html: '<div style="height: 20px;width: 20px; float: left;background-color:' + color + '"></div>' +
              '<div><span style="float: left; font-size: 13px; margin-left: 3px">' + ' - ' + item.LIBELLE + '</span></div>',
            title: item.ID_TYPE_ARRET
          });
        }
        this.typesArret = date;
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  configEventsFabricationDropDown() {
    this.arretMachine.ID_SHIFT_MACHINE_PILOTE = this.shiftMachinePiloteDropDown.selected[0].ID;
    const machineID = this.shiftMachinePiloteDropDown.data.find(element => element.ID == this.shiftMachinePiloteDropDown.selected[0].ID).ID_MACHINE;
    const data = this.machinesEventFabric.find(element => element.ID_MACHINE == machineID);
    this.eventsFabrication = null;
    if (data != undefined) {
      let items = [];
      items.push({
        html: '<div style="height: 20px;width: 20px; float: left;"></div>' +
          '<div disabled="true"><span style="float: left; font-size: 13px; margin-left: 20px"></span></div>',
        title: null
      });
      for (let item of data.events) {
        items.push({
          html: '<div style="height: 20px;width: 20px; float: left;background-color:' + item.CODE_COULEUR + '"></div>' +
            '<div><span style="float: left; font-size: 13px; margin-left: 3px">' + ' - ' + item.LIBELLE + '</span></div>',
          title: item.ID_EVENEMENT
        });
      }
      this.eventsFabrication = items;
    }
  }

  configDatePicker() {
    let twoDaysBefor = new Date();
    twoDaysBefor.setDate(twoDaysBefor.getDate() - 2);
    this.datePickerSettings.max = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getUTCDate());
    this.datePickerSettings.min = new Date(new Date().getFullYear(), twoDaysBefor.getMonth(), twoDaysBefor.getUTCDate());
  }

  getMachinesEventFabric() {
    this.eventMachineService.findAllMachineFabricationSteps()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.machinesEventFabric = response['data'];
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  create() {
    this.arretMachine.DATE_ARRET = moment(this.arretMachine.DATE_ARRET).format('YYYY-MM-DD HH:mm');
    this.arretMachineService.create(this.arretMachine)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getArretMachineByConnectedPilote();
        this.alertBoxService.alertCreate();
        this.refresh();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  refresh() {
    this.eventsFabrication = null;
    this.typesArret = null;
    this.configTypeArretDropDown();
    this.shiftMachinePiloteDropDown.selected = null;
    this.arretMachine = {
      ID_TYPE_ARRET: null,
      DATE_ARRET: null,
      ID_SHIFT_MACHINE_PILOTE: null,
      ID_EVENEMENT_FABRICATION: null,
      ID_OPERATEUR: this.authService.getDecodedToken().ID_UTILISATEUR,
      DUREE_ARRET_MINUTE: null
    };

  }

  getSelectedDate() {
    let twoDaysBefor = new Date();
    twoDaysBefor.setDate(twoDaysBefor.getDate() - 2);
    if (moment(this.arretMachine.DATE_ARRET.toISOString()).format('YYYY-MM-DD HH:mm') < moment(this.arretMachine.DATE_ARRET.toISOString()).format('YYYY-MM-DD')) {
      this.arretMachine.DATE_ARRET = null;
    }
  }

  onDeselectShiftMachinePilot() {
    this.arretMachine.ID_SHIFT_MACHINE_PILOTE = null;
    this.eventsFabrication = null;
  }

  disableSearchBtn() {
    if (this.arretMachine.ID_SHIFT_MACHINE_PILOTE == '' || this.arretMachine.ID_SHIFT_MACHINE_PILOTE == null || this.arretMachine.ID_TYPE_ARRET == null || this.arretMachine.ID_EVENEMENT_FABRICATION == null
      || this.arretMachine.DATE_ARRET == null || this.arretMachine.DATE_ARRET == '' || this.arretMachine.DUREE_ARRET_MINUTE == '' || this.arretMachine.DUREE_ARRET_MINUTE == null || this.arretMachine.DUREE_ARRET_MINUTE <= 0) {
      return true;
    } else {
      return false;
    }
  }

  initArretMachinesTable() {
    this.arretMachineTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'dateArret', type: 'string'},
        {name: 'dateSaisie', type: 'string'},
        {name: 'pilote', type: 'string'},
        {name: 'shiftt', type: 'string'},
        {name: 'DUREE_ARRET_MINUTE', type: 'number'},
        {name: 'typeArret', type: 'string'},
        {name: 'eventFabric', type: 'string'},
        {name: 'machine', type: 'string'},],
      localdata: []
    };
    this.arretMachineTable.dataAdapter = new jqx.dataAdapter(this.arretMachineTable.dataSource);
    this.arretMachineTable.columns =
      [
        {text: 'Machine', datafield: 'machine', width: '20%', smallWidth: '35%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Type d\'arret', datafield: 'typeArret', width: '15%', smallWidth: '35%', columntype: 'textbox', filtertype: 'list'},
        {
          text: 'Evenement de fabrication',
          datafield: 'eventFabric',
          smallWidth: '35%',
          width: '15%',
          columntype: 'textbox',
          filtertype: 'list'
        },
        {text: 'Pilote', datafield: 'pilote', width: '30%', smallWidth: '35%', columntype: 'textbox', filtertype: 'list'},
        {
          text: 'Durée en min',
          datafield: 'DUREE_ARRET_MINUTE',
          smallWidth: '35%',
          width: '10%',
          columntype: 'textbox',
          filtertype: 'textbox'
        },
        {text: 'Shift', datafield: 'shiftt', width: '10%', smallWidth: '35%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Date de saisie', datafield: 'dateSaisie', smallWidth: '35%', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Date d\'arret', datafield: 'dateArret', width: '10%', smallWidth: '35%', columntype: 'textbox', filtertype: 'list'},
      ];
    this.jqxgridFrService.configCellWidthInSmallDevice(this.arretMachineTable.columns, null);
    this.getArretMachineByConnectedPilote();
  }

  getArretMachineByConnectedPilote() {
    let connectedUserID = null;
    if (this.authService.getDecodedToken().ID_PROFIL == 3040) { // Respo pilote
      connectedUserID = null;
    } else if (this.authService.getDecodedToken().ID_PROFIL == 3042) { // pilote
      connectedUserID = this.authService.getDecodedToken().ID_UTILISATEUR;
    }
    this.arretMachineService.findArretMachineOfConnectedPilote(connectedUserID)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.arretMachineTable.dataSource.localdata = response['data'];
        this.arretMachineGrid.updatebounddata();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

}
