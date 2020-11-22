import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxPayPalModule } from 'ngx-paypal';

//Support Page
// import { MemberSupportComponent } from '../member-support/member-support.component';
//Campaign Single
// import { SingleMicrocreditComponent } from './single-microcredit/single-microcredit.component';

//Pledge Form
import { StepperMemberMicrocreditSupportComponent } from './stepper-member-microcredit_support.component'
import { SubAmountFormComponent } from './sub-amount-form/sub-amount-form.component';
import { SubFinalStepComponent } from './sub-final-step/sub-final-step.component';
import { LocalMicrocreditService } from './_microcredit.service';

import { StepperNoticeComponent } from '../stepper-common/stepper-notice/stepper-notice.component';
//import { CardMicrocreditComponent } from '../views/layout/cards/card-microcredit/card-microcredit.component';

import {
  SngCoreModule
} from 'sng-core';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StepperCommonModule } from '../stepper-common/stepper-common.module';

const routes: Routes = [
    {
        path: '',
        component: StepperMemberMicrocreditSupportComponent,
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
        MatCardModule,
        MatListModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),

        ArchwizardModule,
        NgxPayPalModule,

        SngCoreModule,

        StepperCommonModule,
    ],
    providers: [LocalMicrocreditService],
    exports: [StepperMemberMicrocreditSupportComponent],
    declarations: [
        StepperMemberMicrocreditSupportComponent,
        SubAmountFormComponent,
        SubFinalStepComponent,
    ],
    entryComponents: [StepperMemberMicrocreditSupportComponent]
})

export class StepperMemberMicrocreditSupportModule {
    static forRoot(): ModuleWithProviders<StepperMemberMicrocreditSupportModule> {
        return {
            ngModule: StepperMemberMicrocreditSupportModule,
            providers: [

            ]
        };
    }
}
