import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { CreateItemsComponent } from './create-items.component';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { NewPostComponent } from './new-post/new-post.component';
import { NewEventComponent } from './new-event/new-event.component';
import { NewMicrocreditCampaignComponent } from './new-microcredit-campaign/new-microcredit-campaign.component';
import { NewMicrofundingCampaignComponent } from './new-microfunding-campaign/new-microfunding-campaign.component';

const routes: Routes = [
    {
        path: '',
        component: CreateItemsComponent,
        children: [
            {
                path: 'offer',
                component: NewOfferComponent,
            },
            {
                path: 'post',
                component: NewPostComponent
            },
            {
                path: 'event',
                component: NewEventComponent,
            },
            {
                path: 'microcredit',
                component: NewMicrocreditCampaignComponent,
            },
            {
                path: 'microfunding',
                component: NewMicrofundingCampaignComponent,
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
        MatDialogModule
        // StoreModule.forFeature('auth', authReducer),
        // EffectsModule.forFeature([AuthEffects]),
    ],
    providers: [
        // InterceptService,
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: InterceptService,
        //     multi: true
        // },
    ],
    exports: [CreateItemsComponent],
    declarations: [
        CreateItemsComponent,
        NewOfferComponent,
        NewPostComponent,
        NewEventComponent,
        NewMicrocreditCampaignComponent,
        NewMicrofundingCampaignComponent,
    ],
    entryComponents: [
    ]
})

export class CreateItemsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CreateItemsModule,
            providers: [

            ]
        };
    }
}