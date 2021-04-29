import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Import Containers
import {DefaultLayoutComponent} from './containers';

import {P404Component} from './views/error/404.component';
import {P401Component} from './views/error/401.component';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from './services/login/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '401',
    component: P401Component,
    data: {
      title: 'Page 401'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Copagest'
    },
    children: [
      {
        path: 'landing',
        loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
      },
      {
        path: '2009',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/arretMachine/arretMachine.module').then(m => m.ArretMachineModule)
      },
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
