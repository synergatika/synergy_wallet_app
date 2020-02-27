import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatInputModule, MatCardModule } from "@angular/material";
// Interceptors
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';

import { QRCodeModule } from 'angularx-qrcode';

import { QrCodeComponent } from './views/pages/qr-code/qr-code.component';
import { InvitationComponent } from './views/pages/invitation/invitation.component';
import { CustomerDashboardComponent } from './views/pages/customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './views/pages/customer-explore/customer-explore.component';
import { CustomerSupportComponent } from './views/pages/customer-support/customer-support.component';
import { CustomerExploreOneComponent } from './views/pages/customer-explore-one/customer-explore-one.component';

import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { TopbarComponent } from './views/layout/header/topbar/topbar.component';
import { MenuComponent } from './views/layout/header/menu/menu.component';
import { UserMenuComponent } from './views/layout/header/user-menu/user-menu.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { CardOfferComponent } from './views/layout/card-offer/card-offer.component';
import { CardCoopComponent } from './views/layout/card-coop/card-coop.component';
import { CardPostComponent } from './views/layout/card-post/card-post.component';
import { CardMicrocreditComponent } from './views/layout/card-microcredit/card-microcredit.component';
import { NotFoundComponent } from './views/pages/not-found/not-found.component';
import { LanguageSwitcherComponent } from './views/layout/header/language-switcher/language-switcher.component';

import { CreateItemsModule } from './create-items/create-items.module';
import { ScannerModule } from './scanner/scanner.module';
import { EditItemsModule } from './edit-items/edit-items.module';
import { MicrocreditModule } from './microcredit/microcredit.module';

import { MenuService } from './core/services/menu.service';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
//for Owl Carousel!
//import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SlickModule } from 'ngx-slick';
import { ShareIconComponent } from './views/widgets/share-icon/share-icon.component';
import { ArchiveCoopsComponent } from './views/pages/archive-coops/archive-coops.component';
import { ArchiveOffersComponent } from './views/pages/archive-offers/archive-offers.component';
import { ArchivePostsComponent } from './views/pages/archive-posts/archive-posts.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MerchantOffersComponent } from './views/pages/merchant-offers/merchant-offers.component';
import { MerchantPostsComponent } from './views/pages/merchant-posts/merchant-posts.component';
import { MerchantEventsComponent } from './views/pages/merchant-events/merchant-events.component';
import { MerchantCampaignsComponent } from './views/pages/merchant-campaigns/merchant-campaigns.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,

    QrCodeComponent,
    InvitationComponent,
    CustomerDashboardComponent,
    CustomerExploreComponent,
    CustomerSupportComponent,
    CustomerExploreOneComponent,
	
	MenuComponent,
    LayoutComponent,
    HeaderComponent,
    TopbarComponent,
	UserMenuComponent,
	FooterComponent,
	CardOfferComponent,
	CardCoopComponent,
	CardPostComponent,
	CardMicrocreditComponent,
	NotFoundComponent,
	ShareIconComponent,
	ArchiveCoopsComponent,
	ArchiveOffersComponent,
	ArchivePostsComponent,
	LanguageSwitcherComponent,
	MerchantOffersComponent,
	MerchantPostsComponent,
	MerchantEventsComponent,
	MerchantCampaignsComponent,
  ],
  imports: [
    QRCodeModule,
	AppRoutingModule,
    BrowserModule,  
    HttpClientModule,
    NoopAnimationsModule,
    MatDialogModule,
    TranslateModule.forRoot(),
	MatButtonModule,
	MatCardModule,
	MatInputModule,
	SwiperModule,
	NgbModalModule,
	NgbDropdownModule,
	//RouterModule, 
	BrowserAnimationsModule,
	CarouselModule,
	//SlickModule.forRoot(),
	InfiniteScrollModule,
	CreateItemsModule,
	ScannerModule,
	EditItemsModule,
	MicrocreditModule,
	
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
	{
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
	MenuService
  ],
  entryComponents: [QrCodeComponent], 
  bootstrap: [AppComponent]
})
export class AppModule { }
