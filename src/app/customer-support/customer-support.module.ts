import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ArchwizardModule } from 'angular-archwizard';

import { CustomerSupportComponent } from './customer-support.component';
import { SupportMicrocreditComponent } from './support-microcredit/support-microcredit.component'

import { SubAmountFormComponent } from './sub-amount-form/sub-amount-form.component';
import { SubFinalStepComponent } from './sub-final-step/sub-final-step.component';

import { SupportService } from './_support.service';

const routes: Routes = [
    {
        path: '',
        component: CustomerSupportComponent,
        children: [
            {
                path: 'microcredit/:campaign_id',
                component: SupportMicrocreditComponent,
            }
        ]
    }
];


@NgModule({
    imports: [
        ArchwizardModule,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
		MatCardModule,
        TranslateModule.forChild(),
        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
    ],
    providers: [
        SupportService
        // InterceptService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: InterceptService,
        //     multi: true
        // },
    ],
    exports: [CustomerSupportComponent],
    declarations: [
        CustomerSupportComponent,
        SupportMicrocreditComponent,
        SubAmountFormComponent,
        SubFinalStepComponent,
    ],
    entryComponents: [
    ]
})

export class CustomerSupportModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CustomerSupportModule,
            providers: [

            ]
        };
    }
}