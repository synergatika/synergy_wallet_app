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
import { ArchwizardModule } from 'angular-archwizard';

import { QrCodeComponent } from './qr-code/qr-code.component';
import { InvitationComponent } from './invitation/invitation.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerExploreComponent } from './customer-explore/customer-explore.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { CustomerExploreOneComponent } from './customer-explore-one/customer-explore-one.component';
import { SupportMicrocreditComponent } from './customer-support/support-microcredit/support-microcredit.component';

@NgModule({
  declarations: [
    AppComponent,

    QrCodeComponent,
    InvitationComponent,
    CustomerDashboardComponent,
    CustomerExploreComponent,
    CustomerExploreOneComponent,

  ],
  imports: [
    QRCodeModule,
    ArchwizardModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatDialogModule,
    TranslateModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
