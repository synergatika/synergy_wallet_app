import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
import { CustomerDashboardComponent } from './views/pages/customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './views/pages/customer-explore/customer-explore.component';
import { CustomerExploreOneComponent } from './views/pages/customer-explore-one/customer-explore-one.component';
import { InvitationComponent } from './views/pages/invitation/invitation.component';
import { ArchiveCoopsComponent } from './views/pages/archive-coops/archive-coops.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';
import { LayoutComponent } from './views/layout/layout.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';

const routes: Routes = [
  // Customer Zone
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '', redirectTo: 'dashboard', pathMatch: 'full'
			},
			/*{
			path: 'qr-code', component: QrCodeComponent
			},*/
			{
				path: 'dashboard', component: CustomerDashboardComponent
			},
			{
				path: 'explore', component: CustomerExploreComponent
			},
			{
				path: 'explore-one/:_id', component: CustomerExploreOneComponent
			},

			{ path: 'microcredit', loadChildren: () => import('./microcredit/microcredit.module').then(m => m.MicrocreditModule) },
			{ path: 'support', loadChildren: () => import('./customer-support/customer-support.module').then(m => m.CustomerSupportModule) },

			{ path: 'create', loadChildren: () => import('./create-items/create-items.module').then(m => m.CreateItemsModule) },
			{ path: 'scanner', loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule) },
			{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
			//{ path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
			//{ path: 'settings', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
			{
				path: 'coops', component: ArchiveCoopsComponent
			},
			{
				path: 'offers', component: ArchiveOffersComponent
			},
			{
				path: 'posts', component: ArchivePostsComponent
			},
			{
				path: 'invitation', component: InvitationComponent
			},
			/*{
				path: '**', component: NotFoundComponent
			},*/
		]
	},
	{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
	{ path: '', redirectTo: 'create', pathMatch: 'full' },
	//{ path: '**', redirectTo: 'qr-code', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
