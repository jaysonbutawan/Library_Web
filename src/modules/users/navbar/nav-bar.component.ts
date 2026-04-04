import { Component ,OnInit} from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule,RouterLink],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  currentRoute = '';

  ngOnInit() {
    // Track current route for active tab highlighting
  }

  isTabActive(tab: string): boolean {
    // Simple check - you can make this more robust with Angular Router
    return window.location.pathname.includes(tab);
  }
}
