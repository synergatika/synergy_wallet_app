// General Assets
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
//import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPaginationModule } from 'ngx-pagination';
//Materialize
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatInputModule, MatCardModule, MatProgressSpinnerModule } from "@angular/material";
// Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';

//Application Components

//0. General
/**
 * General Components
 */
import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { TopbarComponent } from './views/layout/header/topbar/topbar.component';
import { MenuComponent } from './views/layout/header/menu/menu.component';
import { UserMenuComponent } from './views/layout/header/user-menu/user-menu.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';
import { LanguageSwitcherComponent } from './views/layout/header/language-switcher/language-switcher.component';

import { MenuService } from './core/services/menu.service';


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
 * Member Basic Pages Components
 */
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberExploreComponent } from './member-explore/member-explore.component';
import { MemberSupportModule } from './member-support/member-support.module';
//This has it's own module due to functionality

//User Centered Components
import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
import { InvitationComponent } from './views/pages/invitation/invitation.component';

//Archives
import { ArchivePartnersComponent } from './views/pages/archive-partners/archive-partners.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';

//2. Partner

//Basic Functionality
import { ScannerModule } from './scanner/scanner.module';
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

import { PartnersModule } from './a-partners/a-partners.module';
import { MembersModule } from './a-members/a-members.module';
// import { SingleMicrocreditComponent } from './views/layout/single-microcredit/single-microcredit.component';
import { SupportMicrocreditComponent } from './member-support/support-microcredit/support-microcredit.component';
import { CardsModule } from './views/layout/cards/cards.module';
import { SingleItemsModule } from './views/layout/single-items/single-items.module';

@NgModule({
	declarations: [

		//Our App
		AppComponent,

		//0. General
		MenuComponent,
		LayoutComponent,
		HeaderComponent,
		TopbarComponent,
		UserMenuComponent,
		FooterComponent,
		NotFoundComponent,
		LanguageSwitcherComponent,

		//Cards
		// CardOfferComponent,
		// CardPartnerComponent,
		// CardPostComponent,
		// CardMicrocreditComponent,
		// CardSupportComponent,

		//Singles
		// SinglePartnerComponent,
		// SinglePostComponent,
		// SingleMicrocreditComponent,

		//1. Member
		//	ShareIconComponent,

		//User Centered Components
		QrCodeComponent,
		InvitationComponent,

		//Basic Papes
		MemberDashboardComponent,
		MemberExploreComponent,

		//Archives
		ArchivePartnersComponent,
		ArchiveOffersComponent,
		ArchivePostsComponent,

		//2. Partner		
		// PartnerOffersComponent,
		// PartnerPostsComponent,
		// PartnerEventsComponent,
		// PartnerCampaignsComponent,
	],
	imports: [

		//Assets
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
		NgxPaginationModule,
		// Member Modules
		MemberSupportModule,

		// Partner Modules
		ScannerModule,

		// Admin Modules
		PartnersModule,
		MembersModule,
		CardsModule,
		SingleItemsModule
	],
	exports: [],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		/*{
		  provide: SWIPER_CONFIG,
		  useValue: DEFAULT_SWIPER_CONFIG
		},*/
		MenuService
	],
	entryComponents: [QrCodeComponent],
	bootstrap: [AppComponent]
})
export class AppModule { }
