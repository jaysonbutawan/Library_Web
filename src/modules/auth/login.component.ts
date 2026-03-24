import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { StaffAuthService } from './api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(StaffAuthService); // 4. Inject the service

  // 5. Local state for UI feedback
  errorMessage: string | null = null;
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // 6. Call the backend via your Service
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/admin/inventory']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          // Handles the 401/403 errors from your Laravel StaffAuthService
          this.errorMessage = err.error?.message || 'Invalid credentials or server error.';
          console.error('Login Error:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}