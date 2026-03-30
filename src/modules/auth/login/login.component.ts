import { Component, inject, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffAuthService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @Output() switchToRegister = new EventEmitter<void>();

  private router = inject(Router);
  private authService = inject(StaffAuthService);

  errorMessage: string | null = null;
  isLoading = false;
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/admin/inventory']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Invalid credentials or server error.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
