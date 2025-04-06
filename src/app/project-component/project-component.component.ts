import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { NgxPaginationModule } from 'ngx-pagination'; // Import NgxPaginationModule

@Component({
  selector: 'app-project-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,NgxPaginationModule],
  templateUrl: './project-component.component.html',
  styleUrls: ['./project-component.component.css'],
})
export class ProjectComponentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  projects: any[] = [];
  userName: string | null = '';
  daysRemaining: number = 0;
  intervalId: any;
  filteredProjects: any[] = [];

    // For pagination
    page: number = 1;
    itemsPerPage: number = 3;
    totalItems: number = 0;
  
    // For searching and sorting
    searchQuery: string = '';
    sortColumn: string = '';
    sortDirection: string = 'asc';

  teamMembers: string[] = [
    'Piyush',
    'Ayush',
    'Ganesh',
    'Om',
    'Harsh',
    'Tejas',
    'Kalyan',
    'Rushi',
    'Shubham',
  ];

  project: any = {
    project_Id: '',
    title: '',
    description: '',
    createdBy: this.userName,
    projectManager: '',
    startDate: '',
    endDate: '',
    teamMembers: [],
    dueDate: '',
    status: 'High',
    assignedTo: '',
    estimate: '',
    timeSpent: '',
  };
  


  constructor(
    private router: Router,
    private userService: UserService,
    public apiService: ApiService
  ) {}

  ngOnInit() {
    this.getUserName();
    this.loadProjects();
    this.startLiveDaysRemaining();
    console.log(this.daysRemaining);
    console.log(typeof this.daysRemaining);
  }
  
  // getUserName() {
  //   const currentUser = this.userService.getCurrentUser();
  //   if (currentUser && currentUser.user_name) {
  //     this.userName = currentUser.user_name;
  //   } else {
  //     this.userName = 'User';
  //   }
  // }
  getUserName() {
    const currentUser = this.apiService.getCurrentUser();
    if (currentUser && currentUser.user_name) {
      this.userName = currentUser.user_name;
    } else {
      this.userName = 'User';
    }
  }

  loadProjects() {
    this.projects = this.apiService.getProjects();
    this.applyFilters();

  }

  onSubmit() {
    console.log('Project Created:', this.project);
    this.project.project_Id = this.generateUniqueId();
    this.project.createdBy = this.userName;
    this.apiService.addProject(this.project);
    this.loadProjects();
    this.project = {
      project_Id: '',
      title: '',
      description: '',
      createdBy: this.userName,
      projectManager: '',
      startDate: '',
      endDate: '',
      teamMembers: [],
      dueDate: '',
      status: 'High',
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

  // date

  ngAfterViewInit() {
    this.initializeDateInputs();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  initializeDateInputs(): void {
    const startDateInput = document.getElementById(
      'startDate'
    ) as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;

    

    startDateInput.addEventListener('change', () => {
      const startDate = new Date(startDateInput.value);
      if (startDate) {
        endDateInput.min = startDateInput.value;
        this.calculateDueInDays(startDate, new Date(endDateInput.value));
      }
    });

    endDateInput.addEventListener('change', () => {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      if (endDate) {
        this.calculateDueInDays(startDate, endDate);
        this.updateDaysRemaining();
      }
    });
  }

  calculateDueInDays(startDate: Date, endDate: Date): void {
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays: any = diffInMs / (1000 * 60 * 60 * 24);
    this.project.dueDate = diffInDays;
  }

  updateDaysRemaining(): void {
    if (this.project.endDate) {
      const endDate = new Date(this.project.endDate);
      const today = new Date();
      const diffInMs = endDate.getTime() - today.getTime();
      this.daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }
  }

  startLiveDaysRemaining(): void {
    this.updateDaysRemaining();
    this.intervalId = setInterval(() => {
      this.updateDaysRemaining();
    }, 1000 * 60 * 60 * 24); // Update every day
  }

  onCheckboxChange(event: any) {
    const member = event.target.value;
    if (event.target.checked) {
      this.project.teamMembers.push(member);
    } else {
      const index = this.project.teamMembers.indexOf(member);
      if (index > -1) {
        this.project.teamMembers.splice(index, 1);
      }
    }
  }

  // search, sort,pagination 

  
  // Pagination logic
  onPageChange(page: number) {
    this.page = page;
    this.applyFilters();
  }

  // Searching and sorting logic
  onSearchChange() {
    this.applyFilters();
  }

  onSortChange(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private applyFilters() {
    let filteredProjects = this.projects;

    // Searching
    if (this.searchQuery) {
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.createdBy.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.projectManager.toLowerCase().includes(this.searchQuery.toLowerCase())||
        project.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.teamMembers.some((member: string) =>
          member.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    }

    // Sorting
    if (this.sortColumn) {
      filteredProjects.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }

    // Pagination
    this.totalItems = filteredProjects.length;
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProjects = filteredProjects.slice(startIndex, endIndex);
  }

}
