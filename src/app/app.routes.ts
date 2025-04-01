import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectComponentComponent } from './project-component/project-component.component';
import { TaskComponentComponent } from './task-component/task-component.component';
import { TaskListComponentComponent } from './task-list-component/task-list-component.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'project-comp', component: ProjectComponentComponent },
  { path: 'task-comp', component: TaskComponentComponent },
  { path: 'task-list', component: TaskListComponentComponent },
];
