import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatTableModule, MatSortModule, MatProgressSpinnerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ArchwizardModule } from 'angular-archwizard';

import { MicrocreditComponent } from './microcredit.component';
import { EditMicrocreditCampaignComponent } from './edit-microcredit-campaign/edit-microcredit-campaign.component';
import { AddSupportComponent } from './add-support/add-support.component';

import { SubScannerComponent } from './sub-scanner/sub-scanner.component';
import { SubIdentifierFormComponent } from './sub-identifier-form/sub-identifier-form.component';
import { SubEmailFormComponent } from './sub-email-form/sub-email-form.component';
import { SubFinalStepComponent } from './sub-final-step/sub-final-step.component';
import { SubAmountFormComponent } from './sub-amount-form/sub-amount-form.component';

import { SupportNoticeComponent } from './support-notice/support-notice.component';

import { SupportService } from './_support.service';

const routes: Routes = [
    {
        path: '',
        component: MicrocreditComponent,
        children: [
            {
                path: 'edit/:_id',
                component: EditMicrocreditCampaignComponent,
            },
            {
                path: 'add',
                component: AddSupportComponent
            },
        ]
    }
];


@NgModule({
    imports: [
        ZXingScannerModule,
        ArchwizardModule,
        BrowserAnimationsModule,
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
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,

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
    exports: [MicrocreditComponent],
    declarations: [
        MicrocreditComponent,
        EditMicrocreditCampaignComponent,
        AddSupportComponent,

        SubScannerComponent,
        SubIdentifierFormComponent,
        SubEmailFormComponent,
        SubAmountFormComponent,
        SubFinalStepComponent,

        SupportNoticeComponent
    ],
    entryComponents: [
    ]
})

export class MicrocreditModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MicrocreditModule,
            providers: [

            ]
        };
    }
}