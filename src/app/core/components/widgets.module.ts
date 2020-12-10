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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ContentImagesComponent } from './content-images/content-images.component';

import { AuthenticationService } from '../services/authentication.service';
import { AuthGuard } from '../guards/auth.guard';
import {
    SngCoreModule,
} from 'sng-core';


// const routes: Routes = [
//     {
//         path: '',
//         children: [
//             {
//                 path: '',
//                 component: PartnerPostsComponent,
//                 data: { returnUrl: window.location.pathname }
//             },
//             {
//                 path: 'create',
//                 component: NewPostComponent,
//                 data: { returnUrl: window.location.pathname }
//             },
//             {
//                 path: 'edit/:_id',
//                 component: EditPostComponent,
//                 data: { returnUrl: window.location.pathname }
//             },
//         ]
//     }
// ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        // RouterModule.forChild(routes),
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
        CKEditorModule,
        SngCoreModule,
    ],
    exports: [
        ImageUploadComponent,
        ContentImagesComponent
    ],
    providers: [
    ],
    // exports: [AuthComponent],
    declarations: [
        ImageUploadComponent,
        ContentImagesComponent
    ],
    entryComponents: [
        // TermsComponent
    ]
})

export class WidgetsModule {
    static forRoot(): ModuleWithProviders<WidgetsModule> {
        return {
            ngModule: WidgetsModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}
