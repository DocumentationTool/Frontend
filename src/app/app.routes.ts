import {Routes} from '@angular/router';
import {MainComponent} from './main/main.component';
import {AdminComponent} from './main/admin/admin.component';
import {EditorComponent} from './main/editor/editor.component';
import {ViewComponent} from './main/view/view.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AuthGuard} from './AuthGuard/authGuad';

export const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'view',
        component: ViewComponent,
      },
      {
        path: 'editor',
        component: EditorComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
