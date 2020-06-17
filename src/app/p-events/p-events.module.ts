import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NewEventComponent } from './new-event/new-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { PartnerEventsComponent } from './partner-events/partner-events.component';


import { AuthenticationService } from '../core/services/authentication.service';
import { AuthGuard } from '../core/helpers/auth.guard';
import { CardsModule } from '../views/layout/cards/cards.module';


const routes: Routes = [
    {
        path: '',
        //component: AuthComponent,
        children: [
            {
                path: '',
                component: PartnerEventsComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'create',
                component: NewEventComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'edit/:_id',
                component: EditEventComponent,
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
        CardsModule
    ],
    providers: [
    ],
    // exports: [AuthComponent],
    declarations: [
        PartnerEventsComponent,
        NewEventComponent,
        EditEventComponent,
    ],
    entryComponents: [
        // TermsComponent
    ]
})

export class EventsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EventsModule,
            providers: [
                AuthenticationService,
                AuthGuard
            ]
        };
    }
}