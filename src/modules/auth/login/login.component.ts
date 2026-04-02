import { Component, inject, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StaffAuthService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() switchToRegister = new EventEmitter<void>();

  private router      = inject(Router);
  private authService = inject(StaffAuthService);

  errorMessage: string | null = null;
  isLoading     = false;
  showPassword  = false;
  isUnavailable = false; // ← was missing

  loginForm = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });

  onStudentLogin() {
    this.submit('student');
  }

  onAdminLogin() {
    this.submit('staff');
  }

  private submit(type: 'student' | 'staff') {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading     = true;
    this.errorMessage  = null;
    this.isUnavailable = false;

    const payload = {
      type,
      email:    this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          const destination = type === 'staff' ? '/admin/inventory' : '/student/dashboard';
          this.router.navigate([destination]);
          return;
        }

        this.isUnavailable = response.data?.unavailable ?? false;
        this.errorMessage  = response.message ?? 'Login failed.';
      },
      error: (err) => {
        this.isLoading     = false;
        this.isUnavailable = err.error?.data?.unavailable ?? false;
        this.errorMessage  = err.error?.message || 'Invalid credentials or server error.';
      }
    });
  }
}
