import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../main-layout/layout.components.';
import { InventoryComponent } from '../inventory/components/inventory.component';
import { CirculationComponent } from '../circulations/circulation.component';
import { StudentsComponent } from '../students/student.component';
import { StudentDetailComponent } from '../students/student-details/student-detail.component';
import { ReadyQueueComponent } from '../circulations/pick-up/ready-queue.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'inventory', component: InventoryComponent },
      { path: 'circulation', component: CirculationComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'students/:id', component: StudentDetailComponent },
      { path: 'ready-queue', component: ReadyQueueComponent },
      { path: '', redirectTo: 'inventory', pathMatch: 'full' }
    ]
  }
];
