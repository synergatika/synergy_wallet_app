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
import { BalanceComponent } from './balance/balance.component';
import { InvitationComponent } from './invitation/invitation.component';

@NgModule({
  declarations: [
    AppComponent,

    QrCodeComponent,
    BalanceComponent,
    InvitationComponent,

  ],
  imports: [
    QRCodeModule,

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
