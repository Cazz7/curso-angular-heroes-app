import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    canActivate:[ PublicGuard ],
    canMatch: [ PublicGuard ]
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    canActivate:[ AuthGuard ],
    canMatch: [ AuthGuard ]
  },
  {
    path: 'error',
    component: Error404PageComponent, // No lazyload
    //canActivate:[ AuthGuard ],
    //canMatch: [ AuthGuard ]
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full' // porque aunque nosotros no lo veamos hay string vacio en cada nombre de path
  },
  {
    path:'**', // cualquier otro path me va a llevar a error
    redirectTo: 'error',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
