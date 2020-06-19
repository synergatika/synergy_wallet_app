import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, MatSortModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ArchwizardModule } from 'angular-archwizard';

import { NewMicrocreditCampaignComponent } from './new-microcredit-campaign/new-microcredit-campaign.component';
import { EditMicrocreditCampaignComponent } from './edit-microcredit-campaign/edit-microcredit-campaign.component';
import { PartnerCampaignsComponent } from './partner-campaigns/partner-campaigns.component';
import { ManageMicrocreditCampaignComponent } from './manage-microcredit-campaign/manage-microcredit-campaign.component';


import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/helpers/auth.guard';

/**
 * Manage Microcredit Components & Local Services
 */
import { AddSupportComponent } from './manage-microcredit-campaign/add-support/add-support.component';
import { SubScannerComponent } from './manage-microcredit-campaign/sub-scanner/sub-scanner.component';
import { SubIdentifierFormComponent } from './manage-microcredit-campaign/sub-identifier-form/sub-identifier-form.component';
import { SubEmailFormComponent } from './manage-microcredit-campaign/sub-email-form/sub-email-form.component';
import { SubAmountFormComponent } from './manage-microcredit-campaign/sub-amount-form/sub-amount-form.component';
import { SubFinalStepComponent } from './manage-microcredit-campaign/sub-final-step/sub-final-step.component';

import { SupportNoticeComponent } from './manage-microcredit-campaign/support-notice/support-notice.component';
import { SupportService } from './manage-microcredit-campaign/_support.service';
import { CardsModule } from '../views/layout/cards/cards.module';

const routes: Routes = [
    {
        path: '',
        //component: AuthComponent,
        children: [
            {
                path: '',
                component: PartnerCampaignsComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'create',
                component: NewMicrocreditCampaignComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'edit/:_id',
                component: EditMicrocreditCampaignComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'manage/:_id',
                component: ManageMicrocreditCampaignComponent,
                data: { returnUrl: window.location.pathname }
            },
        ]
    }
];

@NgModule({
    imports: [
        ZXingScannerModule,
        ArchwizardModule,

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
        NgbModalModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        NgxMaterialTimepickerModule,
        NgbDropdownModule,

        CardsModule
    ],
    providers: [
        SupportService
    ],
    // exports: [AuthComponent],
    declarations: [
        PartnerCampaignsComponent,
        NewMicrocreditCampaignComponent,
        EditMicrocreditCampaignComponent,
        ManageMicrocreditCampaignComponent,

        AddSupportComponent,

        SubScannerComponent,
        SubIdentifierFormComponent,
        SubEmailFormComponent,
        SubAmountFormComponent,
        SubFinalStepComponent,

        SupportNoticeComponent
    ],
    entryComponents: [
        AddSupportComponent
    ]
})

export class MicrocreditModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MicrocreditModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}