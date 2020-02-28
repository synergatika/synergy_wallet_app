import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { EditMicrocreditCampaignComponentDraft } from './edit-microcredit-campaign-draft/edit-microcredit-campaign-draft.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const routes: Routes = [
    {
        path: '',
        children: [
			{
                path: '',
                redirectTo: 'offer',
                pathMatch: 'full'
            },
            {
                path: 'edit/:_id',
                component: EditOfferComponent,
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
		MatCardModule,
       // RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatDialogModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule
    ],
    providers: [
		DatePipe,
		{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
    exports: [EditOfferComponent],
    declarations: [
        EditOfferComponent,
		EditPostComponent,
		EditMicrocreditCampaignComponentDraft
    ],
    entryComponents: [
    ]
})

export class EditItemsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EditItemsModule,
            providers: [

            ]
        };
    }
}