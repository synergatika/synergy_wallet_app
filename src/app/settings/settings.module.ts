import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from "@angular/material";

import { SettingsComponent } from './settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';

import { BasketComponent } from '../history/basket/basket.component';
import { TransactionsComponent } from '../history/transactions/transactions.component';
import { HistoryModule } from "../history/history.module";

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: PersonalInformationComponent,
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            },
            {
                path: 'account-settings',
                component: AccountSettingsComponent,
            },
            {
                path: 'email-settings',
                component: EmailSettingsComponent,
            },
			{
                path: 'history',
                loadChildren: () => import('../history/history.module').then(m => m.HistoryModule)
            },
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
		//HistoryModule
        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
		
    ],
    providers: [
        // InterceptService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: InterceptService,
        //     multi: true
        // },
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