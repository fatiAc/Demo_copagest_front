import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {RoleGuard} from '../../services/utils/guards/role.guard';
import {ParametrageComponent} from './parametrage/parametrage.component';
import {ArretMachineComponent} from './arret-machine/arret-machine.component';
import {SearchArretMachineComponent} from './search-arret-machine/search-arret-machine.component';
import {TableauBordComponent} from './tableau-bord/tableau-bord.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Arret machine'
    },
    children: [
      {
        path: '',
        redirectTo: 'parametrage'
      },
      {
        path: 'parametrage',
        component: ParametrageComponent,
        canActivate: [RoleGuard],
        data: {title: 'Paramétrage', idmodule: 2009, idrubrique: 2110}
      },
      {
        path: 'nouveau-arret-machine',
        component: ArretMachineComponent,
        canActivate: [RoleGuard],
        data: {title: 'Nouveau arrêt machine', idmodule: 2009, idrubrique: 2111}
      },
      {
        path: 'trouver-arret-machine',
        component: SearchArretMachineComponent,
        canActivate: [RoleGuard],
        data: {title: 'Trouver un arret de machine', idmodule: 2009, idrubrique: 2112}
      },
      {
        path: 'tableau-bord',
        component: TableauBordComponent,
        canActivate: [RoleGuard],
        data: {title: 'Tableau de bord', idmodule: 2009, idrubrique: 2113}
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArretMachineRouting {
}
