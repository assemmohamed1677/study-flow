import { Routes } from '@angular/router';
import { StartPage } from './start-page/start-page';
import path from 'path';
import { DashBoard } from './dash-board/dash-board';
import { Courses } from './courses/courses';
import { Tasks } from './tasks/tasks';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((mod) => mod.Signup),
  },
  { path: 'login', loadComponent: () => import('./login/login').then((mod) => mod.Login) },
  { path: '', component: StartPage },
  {
    path: 'dashboard',
    component: DashBoard,
  },
  {
    path: 'courses',
    component: Courses,
  },
  {
    path: 'tasks',
    component: Tasks,
  },
];
