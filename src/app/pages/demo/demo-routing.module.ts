import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GridComponent} from './grid/grid.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Demo'
  },
  children: [
    {
      path: '',
      redirectTo: 'jqxgrid'
    },
    {
      path: 'jqxgrid',
      component: GridComponent,
      data: {
        title: 'JqxGrid'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule {
}
