import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-project-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './project-component.component.html',
  styleUrls: ['./project-component.component.css'],
})
export class ProjectComponentComponent implements OnInit {
  project = {
    title: '',
    description: '',
    createdBy: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    dueDate: '',
    status: 'Pending',
    assignedTo: '',
    estimate: '',
    timeSpent: '',
  };

  projects: any[] = [];

  userName: string | null = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getUserName();
    this.loadProjects();
  }

  getUserName() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser && currentUser.user_name) {
      this.userName = currentUser.user_name;
    } else {
      this.userName = 'User';
    }
  }

  loadProjects() {
    this.projects = this.apiService.getProjects();
  }

  onSubmit() {
    console.log('Project Created:', this.project);
    // Store project using ApiService
    this.apiService.addProject(this.project);
    // Reload projects
    this.loadProjects();
    // Reset the form
    this.project = {
      title: '',
      description: '',
      createdBy: '',
      projectManager: '',
      startDate: '',
      endDate: '',
      teamMembers: '',
      dueDate: '',
      status: 'Pending',
      assignedTo: '',
      estimate: '',
      timeSpent: '',
    };
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
