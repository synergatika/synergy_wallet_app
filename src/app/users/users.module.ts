import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatTableModule, MatDatepickerModule, MatSortModule, MatProgressSpinnerModule, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationService } from '../core/services/authentication.service';
import { NewMerchantComponent } from './new-merchant/new-merchant.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { UsersComponent } from './users.component';
//import { MAT_DATE_LOCALE } from '@angular/material';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: UsersComponent,
                pathMatch: 'full',
                data: {
                    title: 'MENU.USERS'
                }
            },
            {
                path: 'merchants/create',
                component: NewMerchantComponent,
                data: {
                    title: 'MENU.CONTENT'
                }
            },
            {
                path: 'customers/create',
                component: NewCustomerComponent,
                data: {
                    title: 'MENU.CONTENT'
                }
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
        MatCardModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        NgxMaterialTimepickerModule,

        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
        // InterceptService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: InterceptService,
        //     multi: true
        // },
    ],
    exports: [UsersComponent],
    declarations: [UsersComponent, NewMerchantComponent, NewCustomerComponent, EditUsersComponent],
    entryComponents: [
    ]
})

export class UsersModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: UsersModule,
            providers: [

            ]
        };
    }
}