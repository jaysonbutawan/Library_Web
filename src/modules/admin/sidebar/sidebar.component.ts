import { Component } from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule,RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

}