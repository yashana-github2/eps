import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule
  ],

  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})

export class AdminDashboard implements OnInit {

  user: any;

  users: any[] = [];

  records: any[] = [];

  filteredRecords: any[] = [];

  searchTerm = '';

  selectedStatus = 'All';

  displayedColumns: string[] = [
    'username',
    'role',
    'actions'
  ];

  recordColumns: string[] = [
    'username',
    'resource',
    'accessLevel',
    'status',
    'recordActions'
  ];

  newUser = {
    username: '',
    password: '',
    role: 'General User',
    name: ''
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

  this.loadUsers();

  this.loadRecords();

  window.addEventListener(
    'recordUpdated',
    () => {

      this.loadRecords();
    }
  );
}
  
  loadUsers() {

    this.authService.getUsers()
      .subscribe({

        next: (data: any) => {

          this.users = data;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

  loadRecords() {

    this.authService.getAllRecords()
      .subscribe({

        next: (data: any) => {

          this.records = data;


          this.filteredRecords = [...this.records];

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(error);
        }
      });
  }

filterRecords() {

  this.filteredRecords = this.records.filter(
    (record: any) => {

      const matchesSearch = record.username
        .toLowerCase()
        .includes(
          this.searchTerm.toLowerCase()
        );

      const matchesStatus =
        this.selectedStatus === 'All'
        || record.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    }
  );

  this.cdr.detectChanges();
}

  updateStatus(record: any, status: string) {

  this.authService.updateRecord(
    record._id,
    {
      ...record,
      status
    }
  )
  .subscribe((updatedRecord: any) => {

    const index = this.records.findIndex(
      r => r._id === updatedRecord._id
    );

    if (index !== -1) {

  this.records[index] = updatedRecord;

  this.records = [...this.records];

  this.filterRecords();
}

this.cdr.detectChanges();
  });
}

  addUser() {

  if (
    !this.newUser.username ||
    !this.newUser.password
  ) {
    return;
  }

  this.authService.addUser(this.newUser)
    .subscribe({

      next: () => {

        this.newUser = {
          username: '',
          password: '',
          role: 'General User',
          name: ''
        };

        this.loadUsers();
        this.snackBar.open(
  'User added successfully',
  'Close',
  {
    duration: 3000
  }
);

        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },

      error: (error) => {

        console.log(error);
      }
    });
    }

  deleteUser(id: string) {

    this.authService.deleteUser(id as any)
      .subscribe(() => {

        this.loadUsers();
      });
  }

  logout() {

    localStorage.clear();

    window.location.href = '/';
  }
}
