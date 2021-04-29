import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {jqxGridModule} from 'jqwidgets-ng/jqxgrid';
import {ArretMachineRouting} from './arretMachine-routing.module';
import {ParametrageComponent} from './parametrage/parametrage.component';
import {SearchArretMachineComponent} from './search-arret-machine/search-arret-machine.component';
import {ArretMachineComponent} from './arret-machine/arret-machine.component';
import {TableauBordComponent} from './tableau-bord/tableau-bord.component';
import {jqxRadioButtonModule} from 'jqwidgets-ng/jqxradiobutton';
import {jqxColorPickerModule} from 'jqwidgets-ng/jqxcolorpicker';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {jqxDropDownListModule} from 'jqwidgets-ng/jqxdropdownlist';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {ChartsModule} from 'ng2-charts';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  imports: [
    ArretMachineRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    jqxGridModule,
    jqxColorPickerModule, jqxRadioButtonModule,
    NgMultiSelectDropDownModule.forRoot(), jqxDropDownListModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ChartsModule,
    NgxSpinnerModule
  ], declarations: [
    ParametrageComponent,
    SearchArretMachineComponent,
    ArretMachineComponent,
    TableauBordComponent
  ]
})
export class ArretMachineModule {
}
