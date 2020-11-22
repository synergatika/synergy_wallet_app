import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ArchwizardModule } from 'angular-archwizard';

import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/guards/auth.guard';

/**
 * Manage Microcredit Components & Local Services
 */
import { StepperPartnerMicrocreditSupportComponent } from './stepper-partner-microcredit_support.component';

import { SubScannerComponent } from '../stepper-common/sub-scanner/sub-scanner.component';
import { SubIdentifierFormComponent } from '../stepper-common/sub-identifier-form/sub-identifier-form.component';
import { SubEmailFormComponent } from '../stepper-common/sub-email-form/sub-email-form.component';
import { StepperNoticeComponent } from '../stepper-common/stepper-notice/stepper-notice.component';

import { SubAmountFormComponent } from './sub-amount-form/sub-amount-form.component';
import { SubFinalStepComponent } from './sub-final-step/sub-final-step.component';

import { LocalMicrocreditService } from './_microcredit.service';
import { StepperCommonModule } from '../stepper-common/stepper-common.module';

// import { ViewsModule } from '../views/layout/views.module';

const routes: Routes = [
  {
    path: '',
    component: StepperPartnerMicrocreditSupportComponent,
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
    MatPaginatorModule,
    NgxMaterialTimepickerModule,
    NgbDropdownModule,

    StepperCommonModule
  ],
  providers: [
    LocalMicrocreditService
  ],
  exports: [StepperPartnerMicrocreditSupportComponent],
  declarations: [
    StepperPartnerMicrocreditSupportComponent,

    SubAmountFormComponent,
    SubFinalStepComponent,
  ],
  entryComponents: [
    StepperPartnerMicrocreditSupportComponent
  ]
})

export class StepperPartnerMicrocreditSupportModule {
  static forRoot(): ModuleWithProviders<StepperPartnerMicrocreditSupportModule> {
    return {
      ngModule: StepperPartnerMicrocreditSupportModule,
      providers: [
        AuthenticationService,
        AuthGuard
      ]
    };
  }
}