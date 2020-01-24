import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { HistoryComponent } from './history.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BasketComponent } from './basket/basket.component';

const routes: Routes = [
    {
        path: '',
        component: HistoryComponent,
        children: [
            {
                path: '',
                redirectTo: 'basket',
                pathMatch: 'full'
            },
            {
                path: 'transactions',
                component: TransactionsComponent,
            },
            {
                path: 'basket',
                component: BasketComponent
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
    exports: [HistoryComponent],
    declarations: [
        HistoryComponent,
        TransactionsComponent,
        BasketComponent
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