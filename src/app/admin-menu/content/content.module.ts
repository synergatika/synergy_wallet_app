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
import { TranslateModule } from '@ngx-translate/core';

/**
 * Services
 */
import { ContentService } from '../../core/services/content.service';

/**
 * Components
 */
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
  static forRoot(): ModuleWithProviders<ContentModule> {
    return {
      ngModule: ContentModule,
      providers: [
        ContentService
      ]
    };
  }
}