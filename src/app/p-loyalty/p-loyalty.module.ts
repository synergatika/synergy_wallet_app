import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NewOfferComponent } from './new-offer/new-offer.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { PartnerOffersComponent } from './partner-offers/partner-offers.component';


import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/helpers/auth.guard';


const routes: Routes = [
    {
        path: '',
        //component: AuthComponent,
        children: [
            {
                path: '',
                component: PartnerOffersComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'create',
                component: NewOfferComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'edit/:_id',
                component: EditOfferComponent,
                data: { returnUrl: window.location.pathname }
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
        NgxMaterialTimepickerModule,
        NgbDropdownModule,
    ],
    providers: [
    ],
    // exports: [AuthComponent],
    declarations: [
        PartnerOffersComponent,
        NewOfferComponent,
        EditOfferComponent,
    ],
    entryComponents: [
        // TermsComponent
    ]
})

export class LoyaltyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LoyaltyModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}