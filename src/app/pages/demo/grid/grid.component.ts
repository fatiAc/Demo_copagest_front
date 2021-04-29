import {Component, OnInit, ViewChild} from '@angular/core';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import {JqxgridFrService} from '../../../services/utils/jqxgrid-fr.service';
import {DemoDataService} from '../../../services/demo/demo-data.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AlertBoxService} from '../../../services/utils/alert-box.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {


  @ViewChild('demoGrid') demoGrid: jqxGridComponent;

  public dataAdapter: any;
  public columns: any[];
  public localization: any = null;
  private dataSource: any;

  private subscriptions: Subject<void> = new Subject<void>();

  constructor(private jqxgridFrService: JqxgridFrService, private demoDataService: DemoDataService
    , private alertBoxService: AlertBoxService) {
  }

  ngOnInit(): void {

    this.initDemoGrid();
    this.fillDemoGrid();
  }

  ngOnDestroy(): void {

    this.subscriptions.next();
    this.subscriptions.complete();
  }

  public demoGridPageChange(event: any): void {

    let paginginfo: any = this.demoGrid.getpaginginformation();


    if (parseInt(paginginfo.pagenum) == paginginfo.pagescount - 1) {

      this.fillDemoGrid(paginginfo.pagescount);
    }
  }

  private initDemoGrid(): void {

    this.localization = this.jqxgridFrService.getLocalization('fr');

    this.dataSource =
      {
        datatype: 'array',
        datafields: [
          {name: 'ID_UTILISATEUR', type: 'int'},
          {name: 'NOM', type: 'string'},
          {name: 'MATRICULE', type: 'int'},
          {name: 'SITE', type: 'string'}
        ],
        localdata: []
      };
    this.dataAdapter = new jqx.dataAdapter(this.dataSource);
    this.columns =
      [
        {text: 'Code', datafield: 'ID_UTILISATEUR', width: '10%', filtertype: 'number'},
        {text: 'Nom', datafield: 'NOM', width: '40%', filtertype: 'list'},
        {text: 'Matricule', datafield: 'MATRICULE', width: '20%', columntype: 'textbox', filtertype: 'number'},
        {text: 'Site', datafield: 'SITE', width: '30%', filtertype: 'checkedlist'}
      ];

    // filters : https://www.jqwidgets.com/angular/angular-grid/#https://www.jqwidgets.com/angular/angular-grid/angular-grid-filterrow.htm
  }

  private fillDemoGrid(startIndex: number = 0): void {
    let pagesize: number = 20;
    if (this.demoGrid) {
      pagesize = this.demoGrid.getpaginginformation().pagesize;
    }

    this.demoDataService.getUsers(startIndex, pagesize)
      .pipe(
        takeUntil(this.subscriptions)
      )
      .subscribe(
        value => {

          if (this.dataSource.localdata.length < value.data.count) {
            this.dataSource.localdata = value.data.rows;
            this.demoGrid.updatebounddata()
            /*  this.dataSource.localdata.push(...value.data.rows);
              this.demoGrid.updatebounddata('data');*/
          }

        },
        error => {
          this.alertBoxService.alert({icon: 'error', title: error.statusText, text: error.error.message});
        }
      );
  }

}
