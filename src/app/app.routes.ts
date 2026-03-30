import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../modules/auth/auth-layout/auth-layout.component';
import { LayoutComponent } from '../modules/admin/layout.components.';
import { InventoryComponent } from '../modules/admin/inventory/inventory.component';
import { CirculationComponent } from '../modules/admin/circulations/circulation.component';
import { StudentsComponent } from '../modules/admin/students/student.component';
import { StudentDetailComponent } from '../modules/admin/students/student-detail.component';

export const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent },
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
      },
      {
        path: 'students/:id',
        component: StudentDetailComponent
      }

    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
