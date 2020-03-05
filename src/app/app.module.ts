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
//Materialize
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatInputModule, MatCardModule } from "@angular/material";
// Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';

//Application Components

//0. General
import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { TopbarComponent } from './views/layout/header/topbar/topbar.component';
import { MenuComponent } from './views/layout/header/menu/menu.component';
import { UserMenuComponent } from './views/layout/header/user-menu/user-menu.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';
import { LanguageSwitcherComponent } from './views/layout/header/language-switcher/language-switcher.component';
import { MenuService } from './core/services/menu.service';

//Cards
import { CardOfferComponent } from './views/layout/card-offer/card-offer.component';
import { CardCoopComponent } from './views/layout/card-coop/card-coop.component';
import { CardPostComponent } from './views/layout/card-post/card-post.component';
import { CardSupportsComponent } from './views/layout/card-supports/card-supports.component';

//Singles
import { SingleCoopComponent } from './views/layout/single-coop/single-coop.component';
import { SinglePostComponent } from './views/layout/single-post/single-post.component';

//1. Customer
import { ShareIconComponent } from './views/widgets/share-icon/share-icon.component';

//Basic Papes
import { CustomerDashboardComponent } from './views/pages/customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './views/pages/customer-explore/customer-explore.component';
import { CustomerSupportModule } from './customer-support/customer-support.module'; //This has it's own module due to functionality

//User Centered Components
import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
import { InvitationComponent } from './views/pages/invitation/invitation.component';

//Archives
import { ArchiveCoopsComponent } from './views/pages/archive-coops/archive-coops.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';

//2. Merchant

//Basic Functionality
import { ScannerModule } from './scanner/scanner.module';
import { CreateItemsModule } from './create-items/create-items.module';
import { EditItemsModule } from './edit-items/edit-items.module';
import { MicrocreditModule } from './microcredit/microcredit.module';

//Pages
import { MerchantOffersComponent } from './views/pages/merchant-offers/merchant-offers.component';
import { MerchantPostsComponent } from './views/pages/merchant-posts/merchant-posts.component';
import { MerchantEventsComponent } from './views/pages/merchant-events/merchant-events.component';
import { MerchantCampaignsComponent } from './views/pages/merchant-campaigns/merchant-campaigns.component';


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
		CardOfferComponent,
		CardCoopComponent,
		CardPostComponent,
		CardSupportsComponent,

		//Singles
		SingleCoopComponent,
		SinglePostComponent,

		//1. Customer
		ShareIconComponent,

		//User Centered Components
		QrCodeComponent,
		InvitationComponent,

		//Basic Papes
		CustomerDashboardComponent,
		CustomerExploreComponent,
	
		//Archives
		ArchiveCoopsComponent,
		ArchiveOffersComponent,
		ArchivePostsComponent,
	
		//2. Merchant		
		MerchantOffersComponent,
		MerchantPostsComponent,
		MerchantEventsComponent,
		MerchantCampaignsComponent,

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
		
		//Materialize
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,

		//Client
		CustomerSupportModule,

		//Merchant
		CreateItemsModule,
		ScannerModule,
		EditItemsModule,
		MicrocreditModule

	],
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
