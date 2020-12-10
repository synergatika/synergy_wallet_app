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
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Components
 */
import { SettingsComponent } from './settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { InvitationComponent } from './invitation/invitation.component';
import { PartnerPaymentsComponent } from './partner-payments/partner-payments.component';
import { WidgetsModule } from '../../core/components/widgets.module';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-information',
        pathMatch: 'full',
      },
      {
        path: 'personal-information',
        component: PersonalInformationComponent,
        data: { title: 'SETTINGS.SUBMENU.PERSONAL_INFORMATION' }
      },
      {
        path: 'payments',
        component: PartnerPaymentsComponent,
        data: { title: 'SETTINGS.SUBMENU.CHANGE_PASSWORD' }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { title: 'SETTINGS.SUBMENU.CHANGE_PASSWORD' }
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { title: 'SETTINGS.SUBMENU.ACCOUNT_SETTINGS' }
      },
      {
        path: 'invitation',
        component: InvitationComponent,
        data: { title: 'SETTINGS.SUBMENU.INVITATION' }
      }
      // {
      //     path: 'email-settings',
      //     component: EmailSettingsComponent,
      //     data: { title: 'SETTINGS.SUBMENU.EMAIL' }
      // },
      // {
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
    MatSelectModule,
    WidgetsModule
  ],
  providers: [
  ],
  exports: [SettingsComponent],
  declarations: [
    SettingsComponent,

    ChangePasswordComponent,
    PersonalInformationComponent,
    PartnerPaymentsComponent,
    AccountSettingsComponent,
    EmailSettingsComponent,
    InvitationComponent
  ],
  entryComponents: [
  ]
})

export class SettingsModule {
  static forRoot(): ModuleWithProviders<SettingsModule> {
    return {
      ngModule: SettingsModule,
      providers: [

      ]
    };
  }
}
