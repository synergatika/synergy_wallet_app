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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';


import { SubScannerComponent } from './sub-scanner/sub-scanner.component';
import { SubIdentifierFormComponent } from './sub-identifier-form/sub-identifier-form.component';
import { SubEmailFormComponent } from './sub-email-form/sub-email-form.component';
import { StepperNoticeComponent } from './stepper-notice/stepper-notice.component';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ArchwizardModule } from 'angular-archwizard';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        //    RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDialogModule,
        MatCardModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        TranslateModule.forChild(),
        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),

        ZXingScannerModule,
        ArchwizardModule,
    ],
    providers: [
    ],
    exports: [SubScannerComponent,
        SubIdentifierFormComponent,
        SubEmailFormComponent,
        StepperNoticeComponent],
    declarations: [
        SubScannerComponent,
        SubIdentifierFormComponent,
        SubEmailFormComponent,
        StepperNoticeComponent
    ],
    entryComponents: [
    ]
})

export class StepperCommonModule {
    static forRoot(): ModuleWithProviders<StepperCommonModule> {
        return {
            ngModule: StepperCommonModule,
            providers: [

            ]
        };
    }
}