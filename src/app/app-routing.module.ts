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

import { AdminCustomersComponent } from './views/pages/admin-customers/admin-customers.component';
import { NewCustomerComponent } from './create-users/new-customer/new-customer.component';

import { AdminMerchantsComponent } from './views/pages/admin-merchants/admin-merchants.component';
import { NewMerchantComponent } from './create-users/new-merchant/new-merchant.component';

// Auth
import { AuthGuard } from './core/helpers/auth.guard';
import { UserGuard } from './core/helpers/user.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: '',
		component: LayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '', redirectTo: 'dashboard', pathMatch: 'full',
				canActivate: [UserGuard],
				data: {
					expectedRole: 'customer'
				}
			},
			{
				path: 'dashboard',
				component: CustomerDashboardComponent,
				canActivate: [UserGuard],
				data: {
					title: 'MENU.HOME',
					expectedRole: 'customer'
				}
			},
			{
				path: 'support',
				loadChildren: () => import('./customer-support/customer-support.module').then(m => m.CustomerSupportModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU_CLIENT.SUPPORT',
					expectedRole: 'customer'
				}
			},
			{
				path: 'explore', component: CustomerExploreComponent,
				canActivate: [UserGuard],
				data: {
					title: 'MENU_CLIENT.DISCOVER',
					expectedRole: 'customer'
				}
			},
			{
				path: 'microcredit',
				loadChildren: () => import('./microcredit/microcredit.module').then(m => m.MicrocreditModule),
				canActivate: [UserGuard],
				data: {
					expectedRole: 'merchant'
				}
			},
			{
				path: 'create',
				loadChildren: () => import('./create-items/create-items.module').then(m => m.CreateItemsModule),
				canActivate: [UserGuard],
				data: {
					expectedRole: 'merchant'
				}
			},
			{
				path: 'scanner',
				loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule),
				canActivate: [UserGuard],
				data: {
					title: 'HEADER.MESSAGE',
					expectedRole: 'merchant'
				}
			},
			{
				path: 'settings',
				loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
				data: { title: 'settings' }
			},
			{
				path: 'coops', component: ArchiveCoopsComponent, data: { title: 'MENU.COMMUNITY' }
			},
			{
				path: 'offers', component: ArchiveOffersComponent, data: { title: 'MENU.OFFERS' }
			},
			{
				path: 'posts', component: ArchivePostsComponent, data: { title: 'MENU.POSTS' }
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
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.OFFERS',
					expectedRole: 'merchant'
				}
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
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CAMPAIGNS',
					expectedRole: 'merchant'
				}
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
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.POSTS',
					expectedRole: 'merchant'
				}
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
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.EVENTS',
					expectedRole: 'merchant'
				}
			},
			{
				path: 'a-customers',
				children: [
					{
						path: '', component: AdminCustomersComponent,
					},
					{
						path: 'create', component: NewCustomerComponent,
					},
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CUSTOMERS',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-merchants',
				children: [
					{
						path: '', component: AdminMerchantsComponent,
					},
					{
						path: 'create', component: NewMerchantComponent,
					},
				],
				canActivate: [UserGuard],
				data: {
					title: 'MENU.MERCHANTS',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-content',
				loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CONTENT',
					expectedRole: 'admin'
				}
			},
		]
	},

	//{ path: '', redirectTo: 'create', pathMatch: 'full' },
	//{ path: '**', redirectTo: 'qr-code', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
