import {Component, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {MachineService} from '../../../services/arretMachine/MachineService/machine.service';
import {AlertBoxService} from '../../../services/utils/alert-box.service';
import {Subject} from 'rxjs';
import {TypeArretService} from '../../../services/arretMachine/TypeArretService/type-arret.service';
import {ShiftMachinePiloteService} from '../../../services/arretMachine/ShiftMachinePiloteService/shift-machine-pilote.service';
import {ArretMachineService} from '../../../services/arretMachine/ArretMachineService/arret-machine.service';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import {JqxgridFrService} from '../../../services/utils/jqxgrid-fr.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-search-arret-machine',
  templateUrl: './search-arret-machine.component.html',
  styleUrls: ['./search-arret-machine.component.css']
})
export class SearchArretMachineComponent implements OnInit {

  @ViewChild('arretMachineGrid') arretMachineGrid: jqxGridComponent;

  public subscriptions: Subject<void> = new Subject<void>();
  public machinesDropDown = {data: null, selected: null, settings: null};
  public pilotesDropDown = {data: null, selected: null, settings: null};
  public typesArret: any[] = [];
  public arretMachineObj = {machineID: null, piloteID: null, typeArretID: null};
  public arretMachineTable = {dataSource: null, dataAdapter: null, columns: []};
  public localization: any = null;

  constructor(private machineService: MachineService, private alertBoxService: AlertBoxService, private  typeArretService: TypeArretService,
              private  shiftMachinePiloteService: ShiftMachinePiloteService, private spinner: NgxSpinnerService,
              private arretMachineService: ArretMachineService, private jqxgridFrService: JqxgridFrService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.localization = this.jqxgridFrService.getLocalization('fr');
    this.configmachinesDropDown();
    this.configpilotesDropDown();
    this.configTypeArretDropDown();
    this.initArretMachinesTable();
    this.spinner.hide();
  }

  configmachinesDropDown() {
    this.machineService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.machinesDropDown.data = response['data'];
        this.machinesDropDown.data = response['data'];
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
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

  configpilotesDropDown() {
    this.shiftMachinePiloteService.getPilotes()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.pilotesDropDown.data = response['data'];
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
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
        {text: 'Machine', datafield: 'machine', width: '30%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Type d\'arret', datafield: 'typeArret', width: '20%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Evenement de fabrication', datafield: 'eventFabric', width: '20%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Pilote', datafield: 'pilote', width: '35%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Durée en min', datafield: 'DUREE_ARRET_MINUTE', width: '10%', columntype: 'textbox', filtertype: 'textbox'},
        {text: 'Shift', datafield: 'shiftt', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Date de saisie', datafield: 'dateSaisie', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Date d\'arret', datafield: 'dateArret', width: '10%', columntype: 'textbox', filtertype: 'list'},
      ];
    this.search();
  }


  search() {
/*    this.arretMachineService.findArretMachineByCritaria(this.arretMachineObj.machineID, this.arretMachineObj.piloteID, this.arretMachineObj.typeArretID)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.arretMachineTable.dataSource.localdata = response['data'];
        this.arretMachineGrid.updatebounddata();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });*/
  }

  refresh() {
    this.typesArret = null;
    this.configTypeArretDropDown();
    this.machinesDropDown.selected = null;
    this.pilotesDropDown.selected = null;
    this.arretMachineObj = {machineID: null, piloteID: null, typeArretID: null};
    this.search();

  }
}
