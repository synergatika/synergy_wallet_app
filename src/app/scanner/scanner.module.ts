import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ScannerComponent } from './scanner.component';
import { ScanOffersComponent } from './scan-offers/scan-offers.component';
import { ScanLoyaltyComponent } from './scan-loyalty/scan-loyalty.component';
import { ScanMicrocreditComponent } from './scan-microcredit/scan-microcredit.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

const routes: Routes = [
    {
        path: '',
        component: ScannerComponent,
        children: [
            {
                path: '',
                redirectTo: 'loyalty',
                pathMatch: 'full'
            },
            {
                path: 'offer',
                component: ScanOffersComponent,
            },
            {
                path: 'loyalty',
                component: ScanLoyaltyComponent
            },
            {
                path: 'microcredit',
                component: ScanMicrocreditComponent,
            }
        ]
    }
];


@NgModule({
    imports: [
        ZXingScannerModule,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatDialogModule
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
    exports: [ScannerComponent],
    declarations: [
        ScannerComponent,
        ScanOffersComponent,
        ScanLoyaltyComponent,
        ScanMicrocreditComponent
    ],
    entryComponents: [
    ]
})

export class ScannerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ScannerModule,
            providers: [

            ]
        };
    }
}