import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';

import { CardPartnerComponent } from './card-partner/card-partner.component';
import { CardOfferComponent } from './card-offer/card-offer.component';
import { CardPostComponent } from './card-post/card-post.component';
import { CardMicrocreditComponent } from './card-microcredit/card-microcredit.component';
import { CardSupportComponent } from './card-support/card-support.component';

import { ShareIconComponent } from '../../widgets/share-icon/share-icon.component';

@NgModule({
    imports: [
        ArchwizardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        // RouterModule.forChild(),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
        MatCardModule,
        TranslateModule.forChild(),
        //  
        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
    ],
    providers: [
    ],
    exports: [CardPartnerComponent, CardOfferComponent, CardPostComponent, CardMicrocreditComponent, CardSupportComponent, ShareIconComponent],
    declarations: [
        CardPartnerComponent,
        CardOfferComponent,
        CardPostComponent,
        CardMicrocreditComponent,
        CardSupportComponent,

        ShareIconComponent
    ],
    entryComponents: [

    ]
})

export class CardsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CardsModule,
            providers: [

            ]
        };
    }
}