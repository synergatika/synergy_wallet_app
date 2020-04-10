import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot_password/forgot_password.component';
import { PasswordVerificationComponent } from './password_verification/password_verification.component';
import { EmailVerificationComponent } from './email_verification/email_verification.component';
import { NeedVerificationComponent } from './need_verification/need_verification.component';
import { PasswordRestorationComponent } from './password_restoration/password_restoration.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { TermsComponent } from './terms/synergy_terms.component';

import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/helpers/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'need-verification',
                component: NeedVerificationComponent,
            },
            {
                path: 'verify-password/:token',
                component: PasswordVerificationComponent,
            },
            {
                path: 'verify-email/:token',
                component: EmailVerificationComponent,
            },
            {
                path: 'reset-password/:token',
                component: PasswordRestorationComponent,
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatDialogModule,
        MatCardModule
    ],
    providers: [
    ],
    exports: [AuthComponent],
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        PasswordVerificationComponent,
        EmailVerificationComponent,
        NeedVerificationComponent,
        PasswordRestorationComponent,
        AuthNoticeComponent,
        TermsComponent
    ],
    entryComponents: [
        TermsComponent
    ]
})

export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}