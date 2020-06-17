import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
//import { MemberDashboardComponent } from './views/pages/member-dashboard/member-dashboard.component';
//import { MemberExploreComponent } from './views/pages/member-explore/member-explore.component';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberExploreComponent } from './member-explore/member-explore.component';
import { MemberRedeemComponent } from './member-redeem/member-redeem.component';

import { InvitationComponent } from './views/pages/invitation/invitation.component';
import { ArchivePartnersComponent } from './views/pages/archive-partners/archive-partners.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';
import { LayoutComponent } from './views/layout/layout.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';


// Auth
import { AuthGuard } from './core/helpers/auth.guard';
import { UserGuard } from './core/helpers/user.guard';
import { ConfigGuard } from './core/helpers/config.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
	},
	{

		/**
		 * -- MEMBER --
		 * Wallet - Open if 1 or 2 are true
		 * Support - Open if 2 is true
		 * Discover - Open if 0 or 1 are true 
		 */

		/**
			* -- PARTNER --
			* Offers - Open if 1 is true
			* Campaigns - Open if 2 is true
			* Posts & Events - Open if 0 is true 
			*/
		path: '',
		component: LayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				redirectTo: 'explore',
				pathMatch: 'full',
				canActivate: [UserGuard],
			},
			{
				path: 'wallet',
				component: MemberDashboardComponent,
				canActivate: [UserGuard],
				data: {
					title: 'MENU.WALLET',
					expectedRole: 'member',
				}
			},
			{
				path: 'support',
				loadChildren: () => import('./member-support/member-support.module').then(m => m.MemberSupportModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.SUPPORT',
					expectedRole: 'member',
					accessIndex: 2,
				}
			},
			{
				path: 'explore', component: MemberExploreComponent,
				canActivate: [UserGuard],
				data: {
					title: 'MENU.DISCOVER',
					expectedRole: 'member'
				}
			},
			{
				path: 'offers', component: MemberRedeemComponent,
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.OFFERS',
					expectedRole: 'member',
					accessIndex: 1,
				}
			},


			{
				path: 'partners',
				component: ArchivePartnersComponent,
				// canActivate: [UserGuard],
				data: { title: 'MENU.PARTNERS' }
			},
			// {
			// path: 'offers',
			// canActivate: [ConfigGuard],
			// component: ArchiveOffersComponent,
			// data: { title: 'MENU.OFFERS', accessIndex: 1 }
			// },
			{
				path: 'posts',
				canActivate: [ConfigGuard],
				component: ArchivePostsComponent,
				data: { title: 'MENU.POSTS', accessIndex: 0 }

			},

			{
				path: 'settings',
				loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
				data: { title: 'settings' }
			},
			{
				path: 'history',
				loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
				data: { title: 'history' }
			},
			// {
			// 	path: 'invitation', component: InvitationComponent, data: { title: 'invitation' }
			// },

			/**
			 * PARTNER's Pages
			 */

			{
				path: 'scanner',
				loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule),
				canActivate: [UserGuard],
				data: {
					title: 'HEADER.MESSAGE',
					expectedRole: 'partner'
				}
			},
			{
				path: 'm-posts',
				loadChildren: () => import('./p-posts/p-posts.module').then(m => m.PostsModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.POSTS',
					expectedRole: 'partner',
					accessIndex: 0
				}
			},
			{
				path: 'm-events',
				loadChildren: () => import('./p-events/p-events.module').then(m => m.EventsModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.EVENTS',
					expectedRole: 'partner',
					accessIndex: 0
				}
			},
			{
				path: 'm-offers',
				loadChildren: () => import('./p-loyalty/p-loyalty.module').then(m => m.LoyaltyModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.OFFERS',
					expectedRole: 'partner',
					accessIndex: 1
				}
			},
			{
				path: 'm-campaigns',
				loadChildren: () => import('./p-microcredit/p-microcredit.module').then(m => m.MicrocreditModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.CAMPAIGNS',
					expectedRole: 'partner',
					accessIndex: 2
				}
			},

			// {
			// 	path: 'microcredit',
			// 	loadChildren: () => import('./microcreditDEPR/microcredit.module').then(m => m.MicrocreditModule),
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		expectedRole: 'partner'
			// 	}
			// },
			// {
			// 	path: 'create',
			// 	loadChildren: () => import('./create-itemsDEPR/create-items.module').then(m => m.CreateItemsModule),
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		expectedRole: 'partner'
			// 	}
			// },
			// {
			// 	path: 'm-offers',
			// 	children: [
			// 		{
			// 			path: '', component: PartnerOffersComponent,
			// 		},
			// 		{
			// 			path: 'create', component: NewOfferComponent
			// 		},
			// 		{
			// 			path: 'edit/:_id', component: EditOfferComponent
			// 		},
			// 	],
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		title: 'MENU.OFFERS',
			// 		expectedRole: 'partner'
			// 	}
			// },
			// {
			// 	path: 'm-campaigns',
			// 	children: [
			// 		{
			// 			path: '', component: PartnerCampaignsComponent,
			// 		},
			// 		{
			// 			path: 'create', component: NewMicrocreditCampaignComponent
			// 		},
			// 		{
			// 			path: 'edit/:_id', component: EditMicrocreditCampaignComponent
			// 		},
			// 		{
			// 			path: 'edit-draft/:_id', component: EditMicrocreditCampaignComponentDraft
			// 		},
			// 	],
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		title: 'MENU.CAMPAIGNS',
			// 		expectedRole: 'partner'
			// 	}
			// },
			// {
			// 	path: 'm-posts',
			// 	children: [
			// 		{
			// 			path: '', component: PartnerPostsComponent,
			// 		},
			// 		{
			// 			path: 'create', component: NewPostComponent
			// 		},
			// 		{
			// 			path: 'edit/:_id', component: EditPostComponent
			// 		},
			// 	],
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		title: 'MENU.POSTS',
			// 		expectedRole: 'partner'
			// 	}
			// },
			// {
			// 	path: 'm-events',
			// 	children: [
			// 		{
			// 			path: '', component: PartnerEventsComponent,
			// 		},
			// 		{
			// 			path: 'create', component: NewEventComponent
			// 		},
			// 		{
			// 			path: 'edit/:_id', component: EditEventComponent
			// 		},
			// 	],
			// 	canActivate: [UserGuard],
			// 	data: {
			// 		title: 'MENU.EVENTS',
			// 		expectedRole: 'partner'
			// 	}
			// },
			{
				path: 'a-partners',
				loadChildren: () => import('./a-partners/a-partners.module').then(m => m.PartnersModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CONTENT',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-members',
				loadChildren: () => import('./a-members/a-members.module').then(m => m.MembersModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CONTENT',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-content',
				loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.USERS',
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
