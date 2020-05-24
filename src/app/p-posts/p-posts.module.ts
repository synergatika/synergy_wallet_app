import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PartnerPostsComponent } from './partner-posts/partner-posts.component';


import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/helpers/auth.guard';


const routes: Routes = [
    {
        path: '',
        //component: AuthComponent,
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
        NgbDropdownModule
    ],
    providers: [
    ],
    // exports: [AuthComponent],
    declarations: [
        PartnerPostsComponent,
        NewPostComponent,
        EditPostComponent,
    ],
    entryComponents: [
        // TermsComponent
    ]
})

export class PostsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PostsModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}