import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { DirectoryComponent } from './components/directory/directory';
import { RegisterComponent } from './components/register/register';
import { AdminComponent } from './components/admin/admin';
import { WorkerLoginComponent } from './components/worker-login/worker-login';
import { WorkerDashboardComponent } from './components/worker-dashboard/worker-dashboard';
import { workerAuthGuard } from './guards/worker-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'LocalConnect - namma ஊர் சேவைகள்' },
  { path: 'services', component: DirectoryComponent, title: 'Village Service Directory - LocalConnect' },
  { path: 'register', component: RegisterComponent, title: 'Join as Provider - LocalConnect' },
  { path: 'worker-login', component: WorkerLoginComponent, title: 'Worker Login - LocalConnect' },
  { path: 'worker-dashboard', component: WorkerDashboardComponent, canActivate: [workerAuthGuard], title: 'Worker Dashboard - LocalConnect' },
  { path: 'admin', component: AdminComponent, title: 'Admin Verification Portal - LocalConnect' },
  { path: '**', redirectTo: '' }
];

