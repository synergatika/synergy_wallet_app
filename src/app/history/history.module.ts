import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, MatCardModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { HistoryComponent } from './history.component';
import { LoyaltyHistoryComponent } from './loyalty/loyalty.component';
import { MicrocreditHistoryComponent } from './microcredit/microcredit.component';
import { ConfigGuard } from '../core/helpers/config.guard';

const routes: Routes = [
    {
        path: '',
        component: HistoryComponent,
        children: [
            {
                path: '',
                redirectTo: 'loyalty',
                pathMatch: 'full',
            },
            {
                path: 'loyalty',
                component: LoyaltyHistoryComponent,
                data: {
                    title: 'HISTORY.SUBMENU.LOYALTY',
                    accessIndex: 1,
                    redirectURL: '/history/microcredit'
                },
                canActivate: [ConfigGuard]
            },
            {
                path: 'microcredit',
                component: MicrocreditHistoryComponent,
                data: {
                    title: 'HISTORY.SUBMENU.MICROCREDIT',
                    accessIndex: 2,
                    redirectURL: '/history/loyalty'
                },
                canActivate: [ConfigGuard]
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
        MatSelectModule,
        MatCardModule,
        NgxPaginationModule
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
    exports: [HistoryComponent],
    declarations: [
        HistoryComponent,
        LoyaltyHistoryComponent,
        MicrocreditHistoryComponent
    ],
    entryComponents: [
    ]
})

export class HistoryModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HistoryModule,
            providers: [

            ]
        };
    }
}