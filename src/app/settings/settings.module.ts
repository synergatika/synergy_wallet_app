import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsComponent } from './settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';

// import { LoyaltyHistoryComponent } from '../history/loyalty/loyalty.component';
// import { MicrocreditHistoryComponent } from '../history/microcredit/microcredit.component';
// import { HistoryModule } from "../history/history.module";

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                redirectTo: 'personal-information',
                pathMatch: 'full',
            },
            {
                path: 'personal-information',
                component: PersonalInformationComponent,
                data: { title: 'SETTINGS.SUBMENU.PERSONAL_INFORMATION' }
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
                data: { title: 'SETTINGS.SUBMENU.CHANGE_PASSWORD' }
            },
            {
                path: 'account-settings',
                component: AccountSettingsComponent,
                data: { title: 'SETTINGS.SUBMENU.ACCOUNT_SETTINGS' }
            },
            // {
            //     path: 'account-settings',
            //     component: AccountSettingsComponent,
            //     data: { title: 'SETTINGS.SUBMENU.ACCOUNT' }
            // },
            // {
            //     path: 'email-settings',
            //     component: EmailSettingsComponent,
            //     data: { title: 'SETTINGS.SUBMENU.EMAIL' }
            // },
            // {
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
        MatCardModule,
        MatSelectModule,
    ],
    providers: [
    ],
    exports: [SettingsComponent],
    declarations: [
        SettingsComponent,
        ChangePasswordComponent,
        PersonalInformationComponent,
        AccountSettingsComponent,
        EmailSettingsComponent
    ],
    entryComponents: [
    ]
})

export class SettingsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SettingsModule,
            providers: [

            ]
        };
    }
}