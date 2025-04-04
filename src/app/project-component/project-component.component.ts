import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import flatpickr from 'flatpickr';
import { Options } from 'flatpickr/dist/types/options';

@Component({
  selector: 'app-project-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './project-component.component.html',
  styleUrls: ['./project-component.component.css'],
})
export class ProjectComponentComponent implements OnInit {
  project = {
    project_Id: '',
    title: '',
    description: '',
    createdBy: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    teamMembers: '',
    dueDate: '',
    status: '',
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
    this.project.project_Id = this.generateUniqueId();

    this.apiService.addProject(this.project);
    this.loadProjects();
    this.project = {
      project_Id: '',
      title: '',
      description: '',
      createdBy: '',
      projectManager: '',
      startDate: '',
      endDate: '',
      teamMembers: '',
      dueDate: '',
      status: '',
      assignedTo: '',
      estimate: '',
      timeSpent: '',
    };
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
  generateUniqueId(): string {
    return uuidv4();
  }

  navigateToTaskComponent(project: any) {
    this.router.navigate(['/task-comp', project.project_Id]);
  }

  ngAfterViewInit() {
    this.initializeDatePickers();
  }

  initializeDatePickers(): void {
    const startDateInput = document.getElementById(
      'startDate'
    ) as HTMLInputElement;
    const dueDateInput = document.getElementById('dueDate') as HTMLInputElement;
    const reminderDateInput = document.getElementById(
      'reminderDate'
    ) as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];

    const startDatePicker = flatpickr(startDateInput, {
      dateFormat: 'd-M-Y',
      minDate: today,
      onChange: (selectedDates) => {
        const startDate = selectedDates[0];
        if (startDate) {
          dueDatePicker.set('minDate', startDate);
          reminderDatePicker.set('minDate', startDate);
        }
      },
    });

    const dueDatePicker = flatpickr(dueDateInput, {
      dateFormat: 'd-M-Y',
      minDate: today,
      onChange: (selectedDates) => {
        const dueDate = selectedDates[0];
        if (dueDate) {
          reminderDatePicker.set('maxDate', dueDate);
        }
      },
    });

    const reminderDatePicker = flatpickr(reminderDateInput, {
      dateFormat: 'd-M-Y H:i',
      enableTime: true,
      noCalendar: false,
      time_24hr: true,
      minuteIncrement: 1,
    });
  }
}
