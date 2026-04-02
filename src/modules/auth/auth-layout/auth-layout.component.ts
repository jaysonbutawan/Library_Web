import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
  showLogin = true;

  switchView(toLogin: boolean) {
    this.showLogin = toLogin;
  }
}
