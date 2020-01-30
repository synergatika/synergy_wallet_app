import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';

// Interceptors
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';

import { QRCodeModule } from 'angularx-qrcode';

import { QrCodeComponent } from './qr-code/qr-code.component';
import { InvitationComponent } from './invitation/invitation.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './customer-explore/customer-explore.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { CustomerExploreOneComponent } from './customer-explore-one/customer-explore-one.component';

import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { TopbarComponent } from './views/layout/header/topbar/topbar.component';
import { MenuComponent } from './views/layout/header/menu/menu.component';
import { UserMenuComponent } from './views/layout/header/user-menu/user-menu.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { MatInputModule, MatCardModule } from "@angular/material";

import { MenuService } from './core/services/menu.service';

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
	FooterComponent
  ],
  imports: [
    QRCodeModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatDialogModule,
    TranslateModule.forRoot(),
	MatCardModule,
	MatInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
	MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
