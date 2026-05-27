import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-home',
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIcon
],

  templateUrl: './home.html',
  styleUrl: './home.scss'
})

export class Home implements OnInit {

  user: any;

  records: any[] = [];

  displayedColumns: string[] = [
    'resource',
    'accessLevel',
    'status'
  ];

  newRequest = {
    resource: '',
    accessLevel: 'Read Only'
  };

  constructor(
  private authService: AuthService,
  private cdr: ChangeDetectorRef,
  private snackBar: MatSnackBar
) {}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {

      window.location.href = '/';

      return;
    }

    this.user = JSON.parse(storedUser);

    this.loadRecords();
  }

  loadRecords() {

    this.authService.getUserRecords(
      this.user.username
    )
    .subscribe({

      next: (data: any) => {

        this.records = data;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.log(error);
      }
    });
  }

  requestAccess() {

    if (!this.newRequest.resource) {
      return;
    }

    const requestData = {

      username: this.user.username,

      resource: this.newRequest.resource,

      accessLevel: this.newRequest.accessLevel,

      status: 'Pending'
    };

    this.authService.createRecord(requestData)
  .subscribe(() => {

    this.newRequest = {
      resource: '',
      accessLevel: 'Read Only'
    };

    this.loadRecords();
    this.snackBar.open(
  'Access request submitted successfully',
  'Close',
  {
    duration: 3000
  }
);

    window.dispatchEvent(
      new Event('recordUpdated')
    );
  });
  }

  logout() {

    localStorage.clear();

    window.location.href = '/';
  }
}