import { Component, inject, Output, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { StaffAuthService } from '../api.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  if (password && confirm && password !== confirm) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  @Output() switchToLogin = new EventEmitter<void>();

  private authService = inject(StaffAuthService);

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  registrationForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    { validators: passwordMatchValidator }
  );

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = response.message ?? 'Account created! Please wait for admin approval.';
            this.registrationForm.reset();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
