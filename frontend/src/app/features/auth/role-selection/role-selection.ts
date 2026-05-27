import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './role-selection.html',
  styleUrl: './role-selection.scss'
})
export class RoleSelection {

  constructor(private router: Router) {}

  goToAdmin() {
    this.router.navigate(['/admin-login']);
  }

  goToUser() {
    this.router.navigate(['/user-login']);
  }
}