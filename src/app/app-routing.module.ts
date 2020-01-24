import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './qr-code/qr-code.component'
import { BalanceComponent } from './balance/balance.component'
import { InvitationComponent } from './invitation/invitation.component'

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'create', loadChildren: () => import('./create-items/create-items.module').then(m => m.CreateItemsModule) },
  { path: 'scanner', loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
  {
    path: 'qr-code', component: QrCodeComponent
  },
  {
    path: 'balance', component: BalanceComponent
  },
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
