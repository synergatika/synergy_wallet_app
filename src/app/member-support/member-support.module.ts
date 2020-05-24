import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';

//Support Page
import { MemberSupportComponent } from './member-support.component';
//Campaign Card
import { CardMicrocreditComponent } from './card-microcredit/card-microcredit.component';
//Campaign Single
import { SingleMicrocreditComponent } from './single-microcredit/single-microcredit.component';

//Pledge Form
import { SupportMicrocreditComponent } from './support-microcredit/support-microcredit.component'
import { SubAmountFormComponent } from './sub-amount-form/sub-amount-form.component';
import { SubFinalStepComponent } from './sub-final-step/sub-final-step.component';
import { SupportService } from './_support.service';

import { SupportNoticeComponent } from './support-notice/support-notice.component';

const routes: Routes = [
    {
        path: '',
        component: MemberSupportComponent,
        /*children: [
            {
                path: 'microcredit/:campaign_id',
                component: SupportMicrocreditComponent,
            }
        ]*/
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
        TranslateModule.forChild()
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
    exports: [MemberSupportComponent, CardMicrocreditComponent, SingleMicrocreditComponent],
    declarations: [
        MemberSupportComponent,
        CardMicrocreditComponent,
        SingleMicrocreditComponent,
        //Pledge Form
        SupportMicrocreditComponent,
        SubAmountFormComponent,
        SubFinalStepComponent,

        SupportNoticeComponent
    ],
    entryComponents: [
        SupportMicrocreditComponent
    ]
})

export class MemberSupportModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MemberSupportModule,
            providers: [

            ]
        };
    }
}