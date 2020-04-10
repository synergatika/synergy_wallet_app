import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { CreateUsersComponent } from './create-users.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { NewMerchantComponent } from './new-merchant/new-merchant.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const routes: Routes = [
    {
        path: '',
        component: CreateUsersComponent,
        children: [
            {
                path: 'customer',
                component: NewCustomerComponent,
            },
            {
                path: 'merchant',
                component: NewMerchantComponent
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
    exports: [CreateUsersComponent],
    declarations: [
        CreateUsersComponent,
        NewCustomerComponent,
        NewMerchantComponent,
    ],
    entryComponents: [
    ]
})

export class CreateUsersModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CreateUsersModule,
            providers: [

            ]
        };
    }
}