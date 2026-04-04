import { Routes } from '@angular/router';
import { UserLayoutComponent } from '../layouts/main-layout.component';
import { CatalogComponent } from '../cataglog/catalog.component';
import { BorrowedBooksComponent } from '../borrowed/borrowed-books.component';


export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'catalog', component: CatalogComponent },
      { path: 'borrowed', component: BorrowedBooksComponent },
      { path: '', redirectTo: 'catalog', pathMatch: 'full' }
    ]
  }
];
