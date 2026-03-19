import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../admin/sidebar/sidebar.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.components.html',
})
export class LayoutComponent {
    
}
