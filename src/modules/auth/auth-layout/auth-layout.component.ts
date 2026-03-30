import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, RegistrationComponent],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
  showLogin = true;

  switchView(toLogin: boolean) {
    this.showLogin = toLogin;
  }
}
