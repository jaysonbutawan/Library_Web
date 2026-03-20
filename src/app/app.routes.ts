import { Routes } from '@angular/router';
import { LoginComponent } from '../modules/auth/login.component';
import { LayoutComponent } from '../modules/admin/layout.components.';
import { InventoryComponent } from '../modules/admin/inventory/inventory.component';
import { CirculationComponent } from '../modules/admin/circulations/circulation.component';
import { StudentsComponent } from '../modules/admin/students/student.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'circulation',
        component: CirculationComponent
      },
      {
        path: 'students',
        component: StudentsComponent
      }

    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
