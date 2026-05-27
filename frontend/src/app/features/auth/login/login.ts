import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { RouterModule } from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { AuthService } from '../../../core/services/auth';

import { MatCardModule } from '@angular/material/card';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.scss'
})

export class Login {

  loading = false;

  errorMessage = '';

  selectedRole = '';

  hidePassword = true;

  roleMismatchMessage = '';

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,

    private authService: AuthService,

    private router: Router,

    private route: ActivatedRoute,

    private snackBar: MatSnackBar
  ) {

    this.selectedRole = this.router.url.includes('admin')
      ? 'Admin'
      : 'General User';

    this.loginForm = this.fb.group({

      username: ['', Validators.required],

      password: ['', Validators.required]
    });
  }

validateRole() {

  const username =
    this.loginForm.get('username')?.value;

  if (!username) {

    this.roleMismatchMessage = '';

    return;
  }

  this.authService.checkUserRole(username)
    .subscribe((existingUser: any) => {

      if (!existingUser) {

        this.roleMismatchMessage =
          'No account found with this username';

        return;
      }

      if (
        existingUser.role !== this.selectedRole
      ) {

        this.roleMismatchMessage =
          `This account belongs to ${existingUser.role}`;

      } else {

        this.roleMismatchMessage = '';
      }
    });
}

  onLogin() {

    if (
      this.loginForm.invalid ||
      this.roleMismatchMessage
    ) {
      return;
    }

    this.loading = true;

    this.errorMessage = '';

    const loginData = {

      ...this.loginForm.value,

      role: this.selectedRole
    };

    this.authService.login(loginData)
      .subscribe({

        next: (response: any) => {

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

          this.loading = false;

          this.snackBar.open(
            'Login successful',
            'Close',
            {
              duration: 3000
            }
          );

          if (response.user.role === 'Admin') {

            this.router.navigate([
              '/admin-dashboard'
            ]);

          } else {

            this.router.navigate([
              '/dashboard'
            ]);
          }
        },

        error: (error: any) => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Login failed';
        }
      });
  }
}