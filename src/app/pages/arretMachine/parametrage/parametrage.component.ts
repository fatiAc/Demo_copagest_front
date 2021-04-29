import {Component, OnInit, ViewChild} from '@angular/core';
import {jqxColorPickerComponent} from 'jqwidgets-ng/jqxcolorpicker';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import {JqxgridFrService} from '../../../services/utils/jqxgrid-fr.service';
import {TypeArretService} from '../../../services/arretMachine/TypeArretService/type-arret.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AlertBoxService} from '../../../services/utils/alert-box.service';
import {AuthService} from '../../../services/login/auth.service';
import {EvenementFabricationService} from '../../../services/arretMachine/EvenementFabricationService/evenement-fabrication.service';
import {ShiftService} from '../../../services/arretMachine/ShiftService/shift.service';
import {ShiftMachinePiloteService} from '../../../services/arretMachine/ShiftMachinePiloteService/shift-machine-pilote.service';
import {MachineService} from '../../../services/arretMachine/MachineService/machine.service';
import {EvenementMachineService} from '../../../services/arretMachine/EvenementMachineService/evenement-machine.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.css']
})
export class ParametrageComponent implements OnInit {

  @ViewChild('typeArretColorPicker', {static: false}) typeArretColorPicker: jqxColorPickerComponent;
  @ViewChild('eventFabricationColorPicker', {static: false}) eventFabricationColorPicker: jqxColorPickerComponent;
  @ViewChild('typeArretGrid') typeArretGrid: jqxGridComponent;
  @ViewChild('eventFabricGrid') eventFabricGrid: jqxGridComponent;
  @ViewChild('shiftGrid') shiftGrid: jqxGridComponent;
  @ViewChild('shiftMachinePilotGrid') shiftMachinePilotGrid: jqxGridComponent;
  @ViewChild('machineFabricationGrid') machineFabricationGrid: jqxGridComponent;

  //Buttons create :
  @ViewChild('createShiftMachinePiloteBtn') createShiftMachinePiloteBtn;
  @ViewChild('createTypeArretBtn') createTypeArretBtn;
  @ViewChild('createEventFabricBtn') createEventFabricBtn;
  @ViewChild('createMachnineStepFabricBtn') createMachnineStepFabricBtn;
  @ViewChild('createShiftBtn') createShiftBtn;

  //Buttons edit :
  @ViewChild('editShiftMachinePiloteBtn') editShiftMachinePiloteBtn;
  @ViewChild('editTypeArretBtn') editTypeArretBtn;
  @ViewChild('editEventFabricBtn') editEventFabricBtn;
  @ViewChild('editMachnineStepFabricBtn') editMachnineStepFabricBtn;
  @ViewChild('editShiftBtn') editShiftBtn;

  private subscriptions: Subject<void> = new Subject<void>();
  public localization: any = null;
  public typeArret = {LIBELLE: null, CODE_COLEUR: null, ID_OPERATEUR: null, selectedID: null};
  public eventFabrication = {LIBELLE: null, CODE_COULEUR: null, ID_OPERATEUR: null, selectedID: null};
  public shift = {LIBELLE: null, HEURE_DEBUT: null, HEURE_FIN: null, NBR_HEURE: null, ID_OPERATEUR: null, selectedID: null};
  public shiftMachinePilote = {ID_PILOTE: null, ID_MACHINE: null, ID_SHIFT: null, selectedID: null};
  public typeArretTable = {dataSource: null, dataAdapter: null, columns: []};
  public eventFabricTable = {dataSource: null, dataAdapter: null, columns: []};
  public machineFabricationTable = {dataSource: null, dataAdapter: null, columns: []};
  public shiftMachinePiloteTable = {dataSource: null, dataAdapter: null, columns: []};
  public shiftTable = {dataSource: null, dataAdapter: null, columns: []};
  public toEditTypeArret: boolean = false;
  public toEditEventFabric: boolean = false;
  public toEditShiftMachinPilot: boolean = false;
  public toEditShift: boolean = false;
  public toEditMachineSteps: boolean = false;
  public pilotesDropDown = {data: null, selected: null, settings: null};
  public machinesDropDown = {data: null, selected: null, settings: null};
  public machinesCombDropDown = {data: null, selected: null, settings: null};
  public shiftDropDown = {data: null, selected: null, settings: null};
  public stepFabricDropDown = {data: null, selected: null, settings: null};
  public isMachineConfigured: boolean = false;

  constructor(private jqxgridFrService: JqxgridFrService, private typeArretService: TypeArretService, private alertBoxService: AlertBoxService,
              public authService: AuthService, private eventFabricService: EvenementFabricationService, private shiftService: ShiftService,
              private shiftMachinePiloteService: ShiftMachinePiloteService, private machineService: MachineService,
              private evenementMachineService: EvenementMachineService, private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.localization = this.jqxgridFrService.getLocalization('fr');
    this.initTypeArretTable();
    this.initEventFabricTable();
    this.initShiftTable();
    this.initShiftMachinePiloteable();
    this.initMachineFabricTable();
    this.pilotesDropDownSettings();
    this.machinesDropDownSettings();
    this.shiftsDropDownSettings();
    this.stepFabricDropDownSettings();
    this.machinesCombDropDownSettings();
    this.getAllMachinesSteps();
    this.typeArret.ID_OPERATEUR = this.authService.getDecodedToken().ID_UTILISATEUR;
    this.eventFabrication.ID_OPERATEUR = this.authService.getDecodedToken().ID_UTILISATEUR;
    this.shift.ID_OPERATEUR = this.authService.getDecodedToken().ID_UTILISATEUR;
    this.spinner.hide();
  }

  initTypeArretTable() {
    this.typeArretTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'LIBELLE', type: 'string'},
        {name: 'CODE_COLEUR', type: 'string'}],
      localdata: []
    };
    this.typeArretTable.dataAdapter = new jqx.dataAdapter(this.typeArretTable.dataSource);
    this.typeArretTable.columns =
      [
        {text: 'Libelle', datafield: 'LIBELLE', width: '45%', columntype: 'textbox', filtertype: 'textbox'},
        {
          text: 'Couleur',
          datafield: 'CODE_COLEUR',
          columntype: 'button',
          cellsrenderer: this.cellsrendererTypeArret,
          width: '45%',
          filtertype: 'textbox'
        },
        {
          text: 'Supprimer', datafield: 'delete', columntype: 'button', width: '10%',
          cellsrenderer: (): string => {
            return 'X';
          },
          buttonclick: (row: number): void => {
            this.deleteTypeArret();
          }
        }
      ];
    this.getAllTypeArret();
  }

  initMachineFabricTable() {
    this.machineFabricationTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'LIBELLE', type: 'string'}],
      localdata: []
    };
    this.machineFabricationTable.dataAdapter = new jqx.dataAdapter(this.machineFabricationTable.dataSource);
    this.machineFabricationTable.columns =
      [
        {text: 'Machine', datafield: 'LIBELLE', width: '60%', columntype: 'textbox', filtertype: 'textbox'},
        {
          text: 'Supprimer', datafield: 'delete', columntype: 'button', width: '40%',
          cellsrenderer: (): string => {
            return 'X';
          },
          buttonclick: (row: number): void => {
            this.deleteMachineFabric(row);
          }
        }
      ];
    this.getAllMachinesSteps();
  }

  initEventFabricTable() {
    this.eventFabricTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'LIBELLE', type: 'string'},
        {name: 'CODE_COULEUR', type: 'string'}],
      localdata: []
    };
    this.eventFabricTable.dataAdapter = new jqx.dataAdapter(this.eventFabricTable.dataSource);
    this.eventFabricTable.columns =
      [
        {text: 'Libelle', datafield: 'LIBELLE', width: '40%', columntype: 'textbox', filtertype: 'textbox'},
        {
          text: 'Couleur',
          datafield: 'CODE_COULEUR',
          columntype: 'button',
          cellsrenderer: this.cellsrendererEventFabric,
          width: '40%',
          filtertype: 'textbox'
        },
        {
          text: 'Supprimer', datafield: 'delete', columntype: 'button', width: '20%',
          cellsrenderer: (): string => {
            return 'X';
          },
          buttonclick: (row: number): void => {
            this.deleteEventFabric();
          }
        }
      ];
    this.getAllEventFabric();
  }

  initShiftTable() {
    this.shiftTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'LIBELLE', type: 'string'},
        {name: 'NBR_HEURE', type: 'string'},
        {name: 'HEURE_DEBUT', type: 'string'},
        {name: 'HEURE_FIN', type: 'string'}],
      localdata: []
    };
    this.shiftTable.dataAdapter = new jqx.dataAdapter(this.shiftTable.dataSource);
    this.shiftTable.columns =
      [
        {text: 'Libelle', datafield: 'LIBELLE', width: '45%', columntype: 'textbox', filtertype: 'list'},
        {text: 'H.début', datafield: 'HEURE_DEBUT', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {text: 'H.fin', datafield: 'HEURE_FIN', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Nbr.heures', datafield: 'NBR_HEURE', width: '10%', columntype: 'textbox', filtertype: 'list'},
        {
          text: 'Supprimer', datafield: 'delete', columntype: 'button', width: '25%',
          cellsrenderer: (): string => {
            return 'X';
          },
          buttonclick: (row: number): void => {
            this.deleteShift();
          }
        }
      ];
    this.jqxgridFrService.configCellWidthInSmallDevice(this.shiftTable.columns, 15);
    this.getAllShift();
  }

  initShiftMachinePiloteable() {
    this.shiftMachinePiloteTable.dataSource = {
      dataType: 'array',
      datafields: [{name: 'pilote', type: 'string'},
        {name: 'machine', type: 'string'},
        {name: 'shiftt', type: 'string'}],
      localdata: []
    };
    this.shiftMachinePiloteTable.dataAdapter = new jqx.dataAdapter(this.shiftMachinePiloteTable.dataSource);
    this.shiftMachinePiloteTable.columns =
      [
        {text: 'Pilote', datafield: 'pilote', width: '30%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Shift', datafield: 'shiftt', width: '30%', columntype: 'textbox', filtertype: 'list'},
        {text: 'Machine', datafield: 'machine', width: '30%', columntype: 'textbox', filtertype: 'list'},
        {
          text: 'Supprimer', datafield: 'delete', columntype: 'button', width: '10%',
          cellsrenderer: (): string => {
            return 'X';
          },
          buttonclick: (row: number): void => {
            this.deleteShiftMachinePilote();
          }
        }
      ];
    this.jqxgridFrService.configCellWidthInSmallDevice(this.shiftMachinePiloteTable.columns, null);
    this.getAllShiftMachinePilote();
  }

  pilotesDropDownSettings() {
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

  machinesDropDownSettings() {
    this.machineService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.machinesDropDown.data = response['data'];
        this.machinesCombDropDown.data = response['data'];
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

  machinesCombDropDownSettings() {
    this.machinesCombDropDown.settings = {
      singleSelection: true,
      idField: 'ID_MACHINE',
      textField: 'LIBELLE',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  stepFabricDropDownSettings() {
    this.stepFabricDropDown.settings = {
      singleSelection: false,
      idField: 'ID_EVENEMENT',
      textField: 'LIBELLE',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  shiftsDropDownSettings() {
    this.shiftDropDown.settings = {
      singleSelection: true,
      idField: 'ID_SHIFT',
      textField: 'LIBELLE',
      selectAllText: 'Tous',
      unSelectAllText: 'Unselect',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  deleteTypeArret() {
    this.typeArretService.delete({ID_TYPE_ARRET: this.typeArret.selectedID})
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        if (response['data'] === 1) {
          this.getAllTypeArret();
          this.alertBoxService.alertDelete();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Vous ne pouvez pas supprimer cet element'});
      });
    this.refreshTypeArretForm();
  }

  deleteEventFabric() {
    this.eventFabricService.delete({ID_EVENEMENT: this.eventFabrication.selectedID})
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        if (response['data'] === 1) {
          this.getAllEventFabric();
          this.alertBoxService.alertDelete();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Vous ne pouvez pas supprimer cet element'});
      });
    this.refreshEventFabricForm();
  }

  deleteShift() {
    this.shiftService.delete({ID_SHIFT: this.shift.selectedID})
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        if (response['data'] === 1) {
          this.alertBoxService.alertDelete();
          this.getAllShift();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Vous ne pouvez pas supprimer cet element'});
      });
    this.refreshShiftForm();
  }

  deleteMachineFabric(row) {
    const idMachine = this.machineFabricationTable.dataSource.localdata[row].ID_MACHINE;
    this.evenementMachineService.delete({ID_MACHINE: idMachine})
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        if (response['data'] === 1) {
          this.alertBoxService.alertDelete();
          this.getAllMachinesSteps();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Vous ne pouvez pas supprimer cet element'});
      });
    this.refreshMachineStepsForm();
  }


  getAllTypeArret() {
    this.typeArretService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.typeArretTable.dataSource.localdata = response['data'];
        if (this.typeArretGrid !== undefined) {
          this.typeArretGrid.updatebounddata();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  getAllShiftMachinePilote() {
    this.shiftMachinePiloteService.findAllShiftMachinePilot()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.shiftMachinePiloteTable.dataSource.localdata = response['data'];
        this.shiftMachinePilotGrid.updatebounddata();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  deleteShiftMachinePilote() {
    this.shiftMachinePiloteService.delete({ID: this.shiftMachinePilote.selectedID})
      .pipe(takeUntil(this.subscriptions))
      .subscribe(response => {
        if (response['data'] == 1) {
          this.alertBoxService.alertDelete();
          this.getAllShiftMachinePilote();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Vous ne pouvez pas supprimer cet element'});
      });
    this.refreshShiftMachinPilotForm();
  }

  getAllShift() {
    this.shiftService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.shiftDropDown.data = response['data'];
        this.shiftTable.dataSource.localdata = response['data'];
        if (this.shiftGrid !== undefined) {
          this.shiftGrid.updatebounddata();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  onSelectMachineToConfigure() {
    this.isMachineConfigured = false;
    if (this.machineFabricationTable.dataSource.localdata.find(element => element.ID_MACHINE == this.machinesCombDropDown.selected[0].ID_MACHINE)) {
      this.isMachineConfigured = true;
    }
  }

  getAllMachinesSteps() {
    this.evenementMachineService.findAllMachineFabricationSteps()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.machineFabricationTable.dataSource.localdata = response['data'];
        if (this.machineFabricationGrid !== undefined) {
          this.machineFabricationGrid.updatebounddata();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  getAllEventFabric() {
    this.eventFabricService.findAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.eventFabricTable.dataSource.localdata = response['data'];
        this.stepFabricDropDown.data = response['data'];
        if (this.eventFabricGrid !== undefined) {
          this.eventFabricGrid.updatebounddata();
        }
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  createTypeArret() {
    this.createTypeArretBtn.nativeElement.disabled = true;
    this.typeArretService.create(this.typeArret)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.typeArretTable.dataSource.localdata = response['data'];
        this.getAllTypeArret();
        this.refreshTypeArretForm();
        this.alertBoxService.alertCreate();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  createMachineSteps() {
    this.createMachnineStepFabricBtn.nativeElement.disabled = true;
    this.evenementMachineService.bulkCreate(this.prepareMachineStepFabricObj())
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllMachinesSteps();
        this.refreshMachineStepsForm();
        this.alertBoxService.alertCreate();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  createShift() {
    this.createShiftBtn.nativeElement.disabled = true;
    this.shiftService.create(this.shift)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.shiftTable.dataSource.localdata = response['data'];
        this.getAllShift();
        this.refreshShiftForm();
        this.alertBoxService.alertCreate();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  createEventFabric() {
    this.createEventFabricBtn.nativeElement.disabled = true;
    this.eventFabricService.create(this.eventFabrication)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.eventFabricTable.dataSource.localdata = response['data'];
        this.getAllEventFabric();
        this.refreshEventFabricForm();
        this.alertBoxService.alertCreate();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  createShiftMachinePilot() {
    this.createShiftMachinePiloteBtn.nativeElement.disabled = true;
    this.shiftMachinePiloteService.create(this.shiftMachinePilote)
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.eventFabricTable.dataSource.localdata = response['data'];
        this.getAllShiftMachinePilote();
        this.refreshShiftMachinPilotForm();
        this.alertBoxService.alertCreate();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  updateTypeArret() {
    this.editTypeArretBtn.nativeElement.disabled = true;
    this.typeArretService.update(Object.assign({ID_TYPE_ARRET: this.typeArret.selectedID}, this.typeArret))
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllTypeArret();
        this.refreshTypeArretForm();
        this.alertBoxService.alertEdit();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  updateMachineSteps() {
    this.editMachnineStepFabricBtn.nativeElement.disabled = true;
    this.evenementMachineService.update(this.prepareMachineStepFabricObj())
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllMachinesSteps();
        this.refreshMachineStepsForm();
        this.alertBoxService.alertEdit();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  updateShift() {
    this.editShiftBtn.nativeElement.disabled = true;
    this.shiftService.update(Object.assign({ID_SHIFT: this.shift.selectedID}, this.shift))
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllShift();
        this.refreshShiftForm();
        this.alertBoxService.alertEdit();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  updateShiftMachinPilot() {
    this.editShiftMachinePiloteBtn.nativeElement.disabled = true;
    this.shiftMachinePiloteService.update(Object.assign({ID: this.shiftMachinePilote.selectedID}, this.shiftMachinePilote))
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllShiftMachinePilote();
        this.refreshShiftMachinPilotForm();
        this.alertBoxService.alertEdit();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  updateEventFabric() {
    this.editEventFabricBtn.nativeElement.disabled = true;
    this.eventFabricService.update(Object.assign({ID_EVENEMENT: this.eventFabrication.selectedID}, this.eventFabrication))
      .pipe(takeUntil(this.subscriptions))
      .subscribe((response) => {
        this.getAllEventFabric();
        this.refreshEventFabricForm();
        this.alertBoxService.alertEdit();
      }, error => {
        this.alertBoxService.alert({icon: 'error', title: 'Erreur', text: 'Une erreur est survenue sur le serveur'});
      });
  }

  importSelectedTypeArret(event) {
    const row = event.args.row.bounddata;
    this.typeArret.CODE_COLEUR = row.CODE_COLEUR;
    this.typeArret.LIBELLE = row.LIBELLE;
    this.typeArret.selectedID = this.typeArretTable.dataSource.localdata[row.boundindex].ID_TYPE_ARRET;
    this.typeArretColorPicker.widgetObject.setColor(row.CODE_COLEUR);
    this.toEditTypeArret = true;
  }

  importSelectedEventFabric(event) {
    const row = event.args.row.bounddata;
    this.eventFabrication.CODE_COULEUR = row.CODE_COULEUR;
    this.eventFabrication.LIBELLE = row.LIBELLE;
    this.eventFabrication.selectedID = this.eventFabricTable.dataSource.localdata[row.boundindex].ID_EVENEMENT;
    this.eventFabricationColorPicker.widgetObject.setColor(row.CODE_COULEUR);
    this.toEditEventFabric = true;
  }

  importSelectedShift(event) {
    const row = event.args.row.bounddata;
    this.shift.HEURE_DEBUT = row.HEURE_DEBUT;
    this.shift.HEURE_FIN = row.HEURE_FIN;
    this.shift.LIBELLE = row.LIBELLE;
    this.shift.NBR_HEURE = row.NBR_HEURE;
    this.shift.selectedID = this.shiftTable.dataSource.localdata[row.boundindex].ID_SHIFT;
    this.toEditShift = true;
  }

  importSelectedShiftMachinPilot(event) {
    const row = event.args.row.bounddata;
    const data = this.shiftMachinePiloteTable.dataSource.localdata[row.boundindex];
    this.pilotesDropDown.selected = [this.pilotesDropDown.data.find(element => element.ID_PILOTE == data.ID_PILOTE)];
    this.machinesDropDown.selected = [this.machinesDropDown.data.find(element => element.ID_MACHINE == data.ID_MACHINE)];
    this.shiftDropDown.selected = [this.shiftDropDown.data.find(element => element.ID_SHIFT == data.ID_SHIFT)];
    this.shiftMachinePilote = {
      ID_PILOTE: this.pilotesDropDown.selected[0].ID_PILOTE,
      ID_MACHINE: this.machinesDropDown.selected[0].ID_MACHINE,
      ID_SHIFT: this.shiftDropDown.selected[0].ID_SHIFT,
      selectedID: Number(data.ID)
    };
    this.toEditShiftMachinPilot = true;
  }

  importSelectedMachineSteps(event) {
    const row = event.args.row.bounddata;
    const data = this.machineFabricationTable.dataSource.localdata[row.boundindex];
    this.machinesCombDropDown.selected = [this.machinesCombDropDown.data.find(element => element.ID_MACHINE == data.ID_MACHINE)];
    this.stepFabricDropDown.selected = data.events;
    this.prepareMachineStepFabricObj();
    this.toEditMachineSteps = true;
  }

  disableCreateTypeArrtBtn() {
    if (this.toEditTypeArret) {
      return true;
    } else if (this.typeArret.LIBELLE == null || this.typeArret.CODE_COLEUR == null || this.typeArret.LIBELLE == '') {
      return true;
    } else {
      return false;
    }
  }

  disableCreateShiftMachinPilotBtn() {
    if (this.toEditShiftMachinPilot) {
      return true;
    } else if (this.shiftMachinePilote.ID_PILOTE == null || this.shiftMachinePilote.ID_MACHINE == null || this.shiftMachinePilote.ID_SHIFT == null) {
      return true;
    } else {
      return false;
    }
  }

  isExistMachinPilotShift() {
    if (this.toEditShiftMachinPilot == false) {
      if (this.shiftMachinePiloteTable.dataSource.localdata.find(element => element.ID_SHIFT == this.shiftMachinePilote.ID_SHIFT &&
        element.ID_PILOTE == this.shiftMachinePilote.ID_PILOTE &&
        element.ID_MACHINE == this.shiftMachinePilote.ID_MACHINE) == undefined) {
        return false; // n'existe pas
      } else {
        this.createShiftMachinePiloteBtn.nativeElement.disabled = true;
        return true; // existe deja
      }
    } else {
      return false;
    }
  }

  disableCreateEventFabricBtn() {
    if (this.toEditEventFabric) {
      return true;
    } else if (this.eventFabrication.LIBELLE == null || this.eventFabrication.CODE_COULEUR == null || this.eventFabrication.LIBELLE == '') {
      return true;
    } else {
      return false;
    }
  }

  disableEditTypeArrtBtn() {
    if (this.toEditTypeArret) {
      if (this.typeArret.LIBELLE == null || this.typeArret.CODE_COLEUR == null || this.typeArret.LIBELLE == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  disableEditMachineStepsBtn() {
    if (this.toEditMachineSteps) {
      if (this.stepFabricDropDown.selected[0] == undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  disableEditEventFabricBtn() {
    if (this.toEditEventFabric) {
      if (this.eventFabrication.LIBELLE == null || this.eventFabrication.CODE_COULEUR == null || this.eventFabrication.LIBELLE == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  refreshTypeArretForm() {
    this.typeArret.CODE_COLEUR = null;
    this.typeArret.LIBELLE = null;
    this.toEditTypeArret = false;
    this.typeArretGrid.clearselection();
  }

  refreshMachineStepsForm() {
    this.machinesCombDropDown.selected = null;
    this.stepFabricDropDown.selected = null;
    this.toEditMachineSteps = false;
    this.isMachineConfigured = false;
    this.machineFabricationGrid.clearselection();
  }

  refreshEventFabricForm() {
    this.eventFabrication.CODE_COULEUR = null;
    this.eventFabrication.LIBELLE = null;
    this.toEditEventFabric = false;
    this.eventFabricGrid.clearselection();
  }

  refreshShiftForm() {
    this.shift.NBR_HEURE = null;
    this.shift.HEURE_FIN = null;
    this.shift.HEURE_DEBUT = null;
    this.shift.LIBELLE = null;
    this.toEditShift = false;
    this.shiftGrid.clearselection();
  }

  refreshShiftMachinPilotForm() {
    this.shiftMachinePilote.ID_SHIFT = null;
    this.shiftMachinePilote.ID_MACHINE = null;
    this.shiftMachinePilote.ID_PILOTE = null;
    this.pilotesDropDown.selected = null;
    this.machinesDropDown.selected = null;
    this.shiftDropDown.selected = null;
    this.shiftMachinePilotGrid.clearselection();
    this.toEditShiftMachinPilot = false;
  }

  disableCreateShiftBtn() {
    if (this.toEditShift) {
      return true;
    } else if (this.shift.LIBELLE == null || this.shift.HEURE_DEBUT == null || this.shift.HEURE_FIN == null
      || this.shift.LIBELLE == '' || this.shift.HEURE_FIN == '' || this.shift.HEURE_DEBUT == '') {
      return true;
    } else {
      return false;
    }
  }

  disableEditShifBtn() {
    if (this.toEditShift) {
      if (this.shift.LIBELLE == null || this.shift.HEURE_DEBUT == null || this.shift.HEURE_FIN == null
        || this.shift.LIBELLE == '' || this.shift.HEURE_FIN == '' || this.shift.HEURE_DEBUT == '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  disableEditShifMachinPilotBtn() {
    if (this.toEditShiftMachinPilot) {
      if (this.shiftMachinePilote.ID_PILOTE == null || this.shiftMachinePilote.ID_MACHINE == null || this.shiftMachinePilote.ID_SHIFT == null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  disableCreateMachineStepsBtn() {
    if (this.toEditMachineSteps) {
      return true;
    } else if (this.machinesCombDropDown.selected == null || this.stepFabricDropDown.selected == null || this.isMachineConfigured) {
      return true;
    } else {
      return false;
    }
  }

  prepareMachineStepFabricObj() {
    let obj = [];
    for (let item of this.stepFabricDropDown.selected) {
      obj.push({ID_EVENEMENT_FABRICATION: item.ID_EVENEMENT, ID_MACHINE: this.machinesCombDropDown.selected[0].ID_MACHINE});
    }
    return obj;
  }

  calculNbrHeur() {
    if (this.shift.HEURE_FIN != null && this.shift.HEURE_DEBUT != null && this.shift.HEURE_DEBUT != '' && this.shift.HEURE_FIN != '') {
      if (this.shift.HEURE_FIN > this.shift.HEURE_DEBUT) {
        this.shift.NBR_HEURE = this.shift.HEURE_FIN - this.shift.HEURE_DEBUT;
      } else {
        this.shift.NBR_HEURE = 24 - this.shift.HEURE_DEBUT + this.shift.HEURE_FIN;
      }
    } else {
      this.shift.NBR_HEURE = null;
    }
  }

  getSelectedData(item) {
    if (item == 1) { // select pilot
      this.shiftMachinePilote.ID_PILOTE = this.pilotesDropDown.selected[0].ID_PILOTE;
    } else if (item == 2) { //select macjine
      this.shiftMachinePilote.ID_MACHINE = this.machinesDropDown.selected[0].ID_MACHINE;
    } else if (item == 3) { //select shift
      this.shiftMachinePilote.ID_SHIFT = this.shiftDropDown.selected[0].ID_SHIFT;
    }
  }

  onDeselectData(item) {
    if (item == 1) { // select pilot
      this.shiftMachinePilote.ID_PILOTE = null;
    } else if (item == 2) { //select macjine
      this.shiftMachinePilote.ID_MACHINE = null;
    } else if (item == 3) { //select shift
      this.shiftMachinePilote.ID_SHIFT = null;
    }
  }

  colorChanged(event: any, item): void {
    if (item == 1) {
      this.typeArret.CODE_COLEUR = event.args.color.hex;
    } else if (item == 2) {
      this.eventFabrication.CODE_COULEUR = event.args.color.hex;
    }
  }

  hueModeChanged(event: any, colorPicker): void {
    if (event.args.checked) {
      colorPicker.colorMode('hue');
    } else {
      colorPicker.colorMode('saturation');
    }
  }

  cellsrendererTypeArret = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    const cellColor = '#' + rowdata.CODE_COLEUR;
    return '<div style="margin-left: -100px;margin-right:15px;height: 500px; width: 300px; background-color: ' + cellColor + '"></div>';
  };

  cellsrendererEventFabric = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    const cellColor = '#' + rowdata.CODE_COULEUR;
    return '<div style="margin-left: -100px;margin-right:15px;height: 500px; width: 300px; background-color: ' + cellColor + '"></div>';
  };

  configJqxColorPickerDimension() {
    if (window.innerWidth < 768) {
      return {width: 280, height: 180};
    } else {
      return {width: 250, height: 250};
    }
  }
}
