import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './views/layout/layout.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';

/**
 * Member Menu Components & Modules
 */
import { MemberDashboardComponent } from './member-menu/member-dashboard/member-dashboard.component';
import { MemberExploreComponent } from './member-menu/member-explore/member-explore.component';
import { MemberRedeemComponent } from './member-menu/member-redeem/member-redeem.component';
import { MemberSupportComponent } from './member-menu/member-support/member-support.component';

/**
 * Patner Menu Components & Modules
 */
import { PartnerDashboardComponent } from './partner-menu/partner-dashboard/partner-dashboard.component';


/**
 * Archive Item Components
 */
import { ArchivePartnersComponent } from './views/pages/archive-partners/archive-partners.component';
import { ArchivePostsEventsComponent } from './views/pages/archive-posts_events/archive-posts_events.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchiveMicrocreditCampaignsComponent } from './views/pages/archive-microcredit_campaigns/archive-microcredit_campaigns.component';


/**
 * CanActivate/CanDeactivate Guards
 */
import { AuthGuard } from './core/guards/auth.guard';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { UserGuard } from './core/guards/user.guard';
import { ConfigGuard } from './core/guards/config.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
		//	canActivate: [UnAuthGuard],
	},
	{
		path: '',
		component: LayoutComponent,
		canActivate: [AuthGuard],
		children: [
			/**
			 * Member Main Routes
			 *
			 * Explore - Activate: Config[0]=true || Config[1]=true
			 * Offers - Activate: Config[1]=true
			 * Support - Activate: Config[2]=true
			 * Wallet - Activate: Config[1]=true || Config[2]=true
			 */
			{
				path: '',
				redirectTo: 'explore',
				pathMatch: 'full',
				canActivate: [UserGuard],
			},
			{
        path: 'explore',
        component: MemberExploreComponent,
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
				path: 'support', component: MemberSupportComponent,
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.SUPPORT',
					expectedRole: 'member',
					accessIndex: 2,
				}
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
			// {
			// 	path: 'invitation', component: InvitationComponent, data: { title: 'invitation' }
			// },

			/**
			 * Partner Main Routes
			 *
			 * Dashboard - Activate: Config[0]=true || Config[1]=true || Config[2]=true
			 * Loyalty Offers - Activate: Config[1]=true
			 * Microcredit Campaigns - Activate: Config[2]=true
			 * Posts - Activate: Config[0]=true
			 * Events - Activate: Config[0]=true
			 */
			{
				path: 'scanner',
				component: PartnerDashboardComponent,
				canActivate: [UserGuard],
				data: {
					title: 'HEADER.MESSAGE',
					expectedRole: 'partner'
				}
			},
			{
				path: 'm-offers',
				loadChildren: () => import('./partner-menu/partner-loyalty/partner-loyalty.module').then(m => m.PartnerLoyaltyModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.OFFERS',
					expectedRole: 'partner',
					accessIndex: 1
				}
			},
			{
				path: 'm-campaigns',
				loadChildren: () => import('./partner-menu/partner-microcredit/partner-microcredit.module').then(m => m.PartnerMicrocreditModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.CAMPAIGNS',
					expectedRole: 'partner',
					accessIndex: 2
				}
			},
			{
				path: 'm-posts',
				loadChildren: () => import('./partner-menu/partner-posts/partner-posts.module').then(m => m.PartnerPostsModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.POSTS',
					expectedRole: 'partner',
					accessIndex: 0
				}
			},
			{
				path: 'm-events',
				loadChildren: () => import('./partner-menu/partner-events/partner-events.module').then(m => m.PartnerEventsModule),
				canActivate: [UserGuard && ConfigGuard],
				data: {
					title: 'MENU.EVENTS',
					expectedRole: 'partner',
					accessIndex: 0
				}
			},

			/**
			 * Admin Main Routes
			 *
			 * Partners
			 * Members
			 * Content
			 */
			{
				path: 'a-partners',
				loadChildren: () => import('./admin-menu/admin-partners/admin-partners.module').then(m => m.AdminPartnersModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CONTENT',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-members',
				loadChildren: () => import('./admin-menu/admin-members/admin-members.module').then(m => m.AdminMembersModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.CONTENT',
					expectedRole: 'admin'
				}
			},
			{
				path: 'a-content',
				loadChildren: () => import('./admin-menu/content/content.module').then(m => m.ContentModule),
				canActivate: [UserGuard],
				data: {
					title: 'MENU.USERS',
					expectedRole: 'admin'
				}
			},

			/**
			 * User Routes
			 *
			 */
			{
				path: 'settings',
				loadChildren: () => import('./user-menu/settings/settings.module').then(m => m.SettingsModule),
				data: { title: 'settings' }
			},
			{
				path: 'history',
				loadChildren: () => import('./user-menu/history/history.module').then(m => m.HistoryModule),
				data: { title: 'history' }
			},

			/**
			 * Archive Routes
			 *
			 * Partners
			 * Posts
			 * Loyalty Offers
			 * Microcredit Campaigns
			 */
			{
				path: 'partners',
				component: ArchivePartnersComponent,
				data: { title: 'MENU.PARTNERS' }
			},
			{
				path: 'posts',
				component: ArchivePostsEventsComponent,
				canActivate: [ConfigGuard],
				data: { title: 'MENU.POSTS', accessIndex: 0 }

			},
			{
				path: 'offers',
				component: ArchiveOffersComponent,
				canActivate: [ConfigGuard],
				data: { title: 'MENU.OFFERS', accessIndex: 1 }

			},
			{
				path: 'microcredit',
				component: ArchiveMicrocreditCampaignsComponent,
				canActivate: [ConfigGuard],
				data: { title: 'MENU.CAMPAIGNS', accessIndex: 2 }
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
