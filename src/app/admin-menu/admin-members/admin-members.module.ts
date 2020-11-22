import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
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
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { TranslateModule } from '@ngx-translate/core';

/**
 * Components
 */
import { NewMemberComponent } from './new-member/new-member.component';
import { AdminMembersComponent } from './admin-members/admin-members.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AdminMembersComponent,
                pathMatch: 'full',
                data: {
                    title: 'MENU.MEMBERS'
                }
            },
            {
                path: 'create',
                component: NewMemberComponent,
                data: {
                    title: 'MENU.MEMBERS'
                }
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
        RouterModule.forChild(routes),
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        TranslateModule.forChild(),
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatPaginatorModule,
        NgxMaterialTimepickerModule,

        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
        // InterceptService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: InterceptService,
        //     multi: true
        // },
    ],
    exports: [AdminMembersComponent],
    declarations: [AdminMembersComponent, NewMemberComponent],
    entryComponents: [
    ]
})

export class AdminMembersModule {
    static forRoot(): ModuleWithProviders<AdminMembersModule> {
        return {
            ngModule: AdminMembersModule,
            providers: [

            ]
        };
    }
}