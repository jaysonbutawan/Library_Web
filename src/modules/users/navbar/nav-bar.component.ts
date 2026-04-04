import { Component } from '@angular/core';
import {RouterLink,RouterLinkActive } from '@angular/router';



interface NavItem {
  link: string;
  label: string;
  svg: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
})
export class NavbarComponent {
  navItems: NavItem[] = [
    {
      link: '/users/catalog',
      label: 'Home',
      svg: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    },
    {
      link: '/users/borrowed',
      label: 'Borrowed',
      svg: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6',
    },
    {
      link: '/users/history',
      label: 'History',
      svg: 'M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    },
  ];
}
