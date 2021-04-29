import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {GridComponent} from './grid/grid.component';
import {jqxGridModule} from 'jqwidgets-ng/jqxgrid';
import {DemoDataService} from '../../services/demo/demo-data.service';


@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    DemoRoutingModule,
    jqxGridModule
  ],
  providers: [
    DemoDataService
  ]
})
export class DemoModule {
}
