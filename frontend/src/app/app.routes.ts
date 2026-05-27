import { Routes } from '@angular/router';

import { RoleSelection } from './features/auth/role-selection/role-selection';
import { Login } from './features/auth/login/login';

import { Home } from './features/dashboard/home/home';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: RoleSelection
  },

  {
    path: 'admin-login',
    component: Login
  },

  {
    path: 'user-login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Home
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard
  }
];