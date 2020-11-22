// General Assets
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
// import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPaginationModule } from 'ngx-pagination';
// Materialize
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
// Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

//Application Components

//0. General
/**
 * General Components
 */
import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';

import { NotFoundComponent } from './views/pages/not-found/not-found.component';
//import { LanguageSwitcherComponent } from './views/layout/header/language-switcher/language-switcher.component';

import { MenuService } from './core/helpers/menu.service';


/**
 * Item Cards Components
 */
// import { CardOfferComponent } from './views/layout/card-offer/card-offer.component';
// import { CardPartnerComponent } from './views/layout/card-partner/card-partner.component';
// import { CardPostComponent } from './views/layout/card-post/card-post.component';
// import { CardMicrocreditComponent } from './views/layout/cards/card-microcredit/card-microcredit.component';
// import { CardSupportComponent } from './views/layout/card-supports/card-supports.component';

/**
 * Item Pages Components
 */
// import { SinglePartnerComponent } from './views/layout/single-items/single-partner/single-partner.component';
// import { SinglePostComponent } from './views/layout/single-post/single-post.component';

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
 * Admin Menu Components & Modules
 */
import { AdminPartnersModule } from './admin-menu/admin-partners/admin-partners.module';
import { AdminMembersModule } from './admin-menu/admin-members/admin-members.module';


//Archives
import { ArchivePartnersComponent } from './views/pages/archive-partners/archive-partners.component';
import { ArchivePostsEventsComponent } from './views/pages/archive-posts_events/archive-posts_events.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchiveMicrocreditCampaignsComponent } from './views/pages/archive-microcredit_campaigns/archive-microcredit_campaigns.component';

//2. Partner

//Basic Functionality
// import { CreateItemsModule } from './create-itemsDEPR/create-items.module';
// import { EditItemsModule } from './edit-itemsDEPR/edit-items.module';
// import { MicrocreditModule } from './microcreditDEPR/microcredit.module';

//Pages
// import { PartnerOffersComponent } from './views/pages/DEPRpartner-offersDEPR/partner-offers.component';
// import { PartnerPostsComponent } from './views/pages/DEPRpartner-postsDEPR/partner-posts.component';
// import { PartnerEventsComponent } from './views/pages/DEPRpartner-eventsDEPR/partner-events.component';
// import { PartnerCampaignsComponent } from './views/pages/DEPRpartner-campaignsDEPR/partner-campaigns.component';

// 3. Admin
//import { NewMemberComponent } from './create-users/new-member/new-member.component';
//import { NewPartnerComponent } from './create-users/new-partner/new-partner.component';

// import { MemberMicrocreditSupportModule } from './member-microcredit-support/member-microcredit-support.module';
// import { PartnerMicrocreditSupportModule } from './partner-microcredit-support/partner-microcredit-support.module';
// import { StepperPartnerLoyaltyPointsModule } from './stepper-partner-loyalty_points/stepper-partner-loyalty_points.module';
// import { SingleMicrocreditComponent } from './views/layout/single-microcredit/single-microcredit.component';
//import { SupportMicrocreditComponent } from './member-support/support-microcredit/support-microcredit.component';

import { StepperMemberMicrocreditSupportModule } from './stepper-member-microcredit_support/stepper-member-microcredit_support.module';
import { StepperPartnerMicrocreditSupportModule } from './stepper-partner-microcredit_support/stepper-partner-microcredit_support.module';
import { StepperPartnerLoyaltyPointsModule } from './stepper-partner-loyalty_points/stepper-partner-loyalty_points.module';
import { StepperPartnerLoyaltyOfferModule } from './stepper-partner-loyalty_offer/stepper-partner-loyalty_offer.module';
import { StepperPartnerMicrocreditCampaignModule } from './stepper-partner-microcredit_campaign/stepper-partner-microcredit_campaign.module';


import {
  SngCoreModule,
  ITranslationService,
  IAuthenticationService,
  IStaticDataService,
  IMenuService,
  IPartnersService,
  IItemsService,
  ILoyaltyService,
  IMicrocreditService,
  IContentService,
  IEnvironmentService,
  IStepperService,
} from 'sng-core';

import { StaticDataService } from './core/helpers/static-data.service';
import { TranslationService } from './core/helpers/translation.service';
import { AuthenticationService } from './core/services/authentication.service';
import { PartnersService } from './core/services/partners.service';
import { ItemsService } from './core/services/items.service';
import { environment } from '../environments/environment';
import { ContentService } from './core/services/content.service';
import { LoyaltyService } from './core/services/loyalty.service';
import { MicrocreditService } from './core/services/microcredit.service';
import { StepperService } from './core/services/stepper.service';

@NgModule({
	declarations: [

		//Our App
		AppComponent,

		//0. General
		LayoutComponent,
		HeaderComponent,
		NotFoundComponent,

		/**
		 * Member Menu Pages
		 */
		MemberDashboardComponent,
		MemberExploreComponent,
		MemberRedeemComponent,
		MemberSupportComponent,

		/**
		 * Partner Menu Pages
		 */
		PartnerDashboardComponent,

		/**
		 * Archive Pages
		 */
		ArchivePartnersComponent,
		ArchiveOffersComponent,
		ArchivePostsEventsComponent,
		ArchiveMicrocreditCampaignsComponent,

	],
	imports: [
		QRCodeModule,
		AppRoutingModule,
		HttpClientModule,
		NoopAnimationsModule,
		TranslateModule.forRoot(),
		NgbModalModule,
		NgbDropdownModule,
		BrowserModule,
		BrowserAnimationsModule,
		CarouselModule,
		InfiniteScrollModule,

		// Materialize Modules
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		NgxPaginationModule,
		// Member Modules
		// Partner Modules

		StepperMemberMicrocreditSupportModule,
		StepperPartnerMicrocreditSupportModule,
		StepperPartnerLoyaltyPointsModule,
		StepperPartnerLoyaltyOfferModule,
		StepperPartnerMicrocreditCampaignModule,

		// Admin Modules
		AdminPartnersModule,
    AdminMembersModule,

    AgmCoreModule.forRoot({
      apiKey: `${environment.mapApiKey}`
    }),

    SngCoreModule,
	],
	exports: [CarouselModule],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: IMenuService, useClass: MenuService },
    { provide: IStaticDataService, useClass: StaticDataService },
    { provide: ITranslationService, useClass: TranslationService },
    { provide: IAuthenticationService, useClass: AuthenticationService },
    { provide: IPartnersService, useClass: PartnersService },
    { provide: IItemsService, useClass: ItemsService },
    { provide: IContentService, useClass: ContentService },
    { provide: ILoyaltyService, useClass: LoyaltyService },
    { provide: IMicrocreditService, useClass: MicrocreditService },
    { provide: IStepperService, useClass: StepperService },
    { provide: IEnvironmentService, useValue: environment},
		/*{
		  provide: SWIPER_CONFIG,
		  useValue: DEFAULT_SWIPER_CONFIG
		},*/
		MenuService
	],
	entryComponents: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
