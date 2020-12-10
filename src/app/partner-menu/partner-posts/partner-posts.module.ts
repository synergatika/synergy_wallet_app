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
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PartnerPostsComponent } from './partner-posts/partner-posts.component';

import { WidgetsModule } from '../../core/components/widgets.module';

import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import {
    SngCoreModule,
} from 'sng-core';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PartnerPostsComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'create',
                component: NewPostComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'edit/:_id',
                component: EditPostComponent,
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
        SngCoreModule,
        WidgetsModule],
    providers: [
    ],
    // exports: [AuthComponent],
    declarations: [
        PartnerPostsComponent,
        NewPostComponent,
        EditPostComponent
    ],
    entryComponents: [
        // TermsComponent
    ]
})

export class PartnerPostsModule {
    static forRoot(): ModuleWithProviders<PartnerPostsModule> {
        return {
            ngModule: PartnerPostsModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}
