import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../modules/auth/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent },

  {
    path: 'admin',
    loadChildren: () =>
      import('../modules/admin/routes/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  {
    path: 'users',
    loadChildren: () =>
      import('../modules/users/routes/user.routes').then(m => m.USER_ROUTES)
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
