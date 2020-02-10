import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './customer-explore/customer-explore.component';
import { CustomerExploreOneComponent } from './customer-explore-one/customer-explore-one.component';

import { InvitationComponent } from './invitation/invitation.component';

const routes: Routes = [
  // Customer Zone
  {
    path: 'qr-code', component: QrCodeComponent
  },
  {
    path: 'dashboard', component: CustomerDashboardComponent
  },
  {
    path: 'explore', component: CustomerExploreComponent
  },
  {
    path: 'explore-one/:_id', component: CustomerExploreOneComponent
  },

  { path: 'support', loadChildren: () => import('./customer-support/customer-support.module').then(m => m.CustomerSupportModule) },

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'create', loadChildren: () => import('./create-items/create-items.module').then(m => m.CreateItemsModule) },
  { path: 'scanner', loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },


  {
    path: 'invitation', component: InvitationComponent
  },
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: '**', redirectTo: 'qr-code', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
