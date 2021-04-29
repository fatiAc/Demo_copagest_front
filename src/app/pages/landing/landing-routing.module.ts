import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingComponent} from './landing.component';
import {RoleGuard} from '../../services/utils/guards/role.guard';
import {AuthGuard} from '../../services/login/auth.guard';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Coopérative Bladna'
  },
  children: [
    {
      path: '',
      redirectTo: 'copag'
    },
    {
      path: 'copag',
      component: LandingComponent,
      canActivate: [AuthGuard],
      data: {
        title: 'Acceuil'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
