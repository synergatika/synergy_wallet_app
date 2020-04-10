import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { ContentService } from '../core/services/content.service';
import { ContentComponent } from './content.component';
import { CreateContentComponent } from './create-content/create-content.component';
import { EditContentComponent } from './edit-content/edit-content.component';

const routes: Routes = [
  {
    path: '',
    //component: ContentComponent,
    children: [
      {
        path: '',
        component: ContentComponent,
        pathMatch: 'full',
        data: {
          title: 'MENU.CONTENT'
        }
      },
      {
        path: 'create',
        component: CreateContentComponent,
        data: {
          title: 'MENU.CONTENT'
        }
      },
      {
        path: 'edit/:content_id',
        component: EditContentComponent,
        data: {
          title: 'MENU.CONTENT'
        }
      },
    ]
  }
];

@NgModule({
  declarations: [ContentComponent, CreateContentComponent, EditContentComponent],
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
    MatCardModule
  ],
  providers: [
  ],
  exports: [ContentComponent],
})
export class ContentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ContentModule,
      providers: [
        ContentService
      ]
    };
  }
}