import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
import { CustomerDashboardComponent } from './views/pages/customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './views/pages/customer-explore/customer-explore.component';
import { InvitationComponent } from './views/pages/invitation/invitation.component';
import { ArchiveCoopsComponent } from './views/pages/archive-coops/archive-coops.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';
import { LayoutComponent } from './views/layout/layout.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';
import { MerchantOffersComponent } from './views/pages/merchant-offers/merchant-offers.component';
import { NewOfferComponent } from './create-items/new-offer/new-offer.component';
import { EditOfferComponent } from './edit-items/edit-offer/edit-offer.component';
import { MerchantPostsComponent } from './views/pages/merchant-posts/merchant-posts.component';
import { NewPostComponent } from './create-items/new-post/new-post.component';
import { EditPostComponent } from './edit-items/edit-post/edit-post.component';
import { MerchantEventsComponent } from './views/pages/merchant-events/merchant-events.component';
import { NewEventComponent } from './create-items/new-event/new-event.component';
import { EditEventComponent } from './edit-items/edit-event/edit-event.component';
import { MerchantCampaignsComponent } from './views/pages/merchant-campaigns/merchant-campaigns.component';
import { NewMicrocreditCampaignComponent } from './create-items/new-microcredit-campaign/new-microcredit-campaign.component';
import { EditMicrocreditCampaignComponent } from './microcredit/edit-microcredit-campaign/edit-microcredit-campaign.component';
import { EditMicrocreditCampaignComponentDraft } from './edit-items/edit-microcredit-campaign-draft/edit-microcredit-campaign-draft.component';

// Auth
import { AuthGuard } from './core/helpers/auth.guard';
import { UserGuard } from './core/helpers/user.guard';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

	{
		path: '',
		component: LayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '', redirectTo: 'dashboard', pathMatch: 'full'
			},
			/*{
			path: 'qr-code', component: QrCodeComponent
			},*/
			{
				path: 'dashboard', component: CustomerDashboardComponent,
				canActivate: [UserGuard], data: { title: 'HEADER.MESSAGE' }
			},
			{
				path: 'explore', component: CustomerExploreComponent, data: { title: 'Discover' }
			},
			{ path: 'microcredit', loadChildren: () => import('./microcredit/microcredit.module').then(m => m.MicrocreditModule) },
			{ path: 'support', loadChildren: () => import('./customer-support/customer-support.module').then(m => m.CustomerSupportModule) },
			{ path: 'create', loadChildren: () => import('./create-items/create-items.module').then(m => m.CreateItemsModule) },
			{ path: 'scanner', loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule), data: { title: 'HEADER.MESSAGE' } },
			{ path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), data: { title: 'settings' } },
			//{ path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
			//{ path: 'settings', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
			{
				path: 'coops', component: ArchiveCoopsComponent, data: { title: 'coops' }
			},
			{
				path: 'offers', component: ArchiveOffersComponent, data: { title: 'offers' }
			},
			{
				path: 'posts', component: ArchivePostsComponent, data: { title: 'posts' }
			},
			{
				path: 'invitation', component: InvitationComponent, data: { title: 'invitation' }
			},
			{
				path: 'm-offers',
				children: [
					{
						path: '', component: MerchantOffersComponent,
					},
					{
						path: 'create', component: NewOfferComponent
					},
					{
						path: 'edit/:_id', component: EditOfferComponent
					},
				], data: { title: 'Offers' }
			},
			{
				path: 'm-campaigns',
				children: [
					{
						path: '', component: MerchantCampaignsComponent,
					},
					{
						path: 'create', component: NewMicrocreditCampaignComponent
					},
					{
						path: 'edit/:_id', component: EditMicrocreditCampaignComponent
					},
					{
						path: 'edit-draft/:_id', component: EditMicrocreditCampaignComponentDraft
					},
				], data: { title: 'Campaigns' }
			},
			{
				path: 'm-posts',
				children: [
					{
						path: '', component: MerchantPostsComponent,
					},
					{
						path: 'create', component: NewPostComponent
					},
					{
						path: 'edit/:_id', component: EditPostComponent
					},
				], data: { title: 'Posts' }
			},
			{
				path: 'm-events',
				children: [
					{
						path: '', component: MerchantEventsComponent,
					},
					{
						path: 'create', component: NewEventComponent
					},
					{
						path: 'edit/:_id', component: EditEventComponent
					},
				], data: { title: 'Events' }
			},
			/*{
				path: '**', component: NotFoundComponent
			},*/
		]
	},
	
	{ path: '', redirectTo: 'create', pathMatch: 'full' },
	//{ path: '**', redirectTo: 'qr-code', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
