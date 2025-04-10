import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgForm } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-component',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    HeaderComponent,
  ],
  templateUrl: './project-component.component.html',
  styleUrls: ['./project-component.component.css'],
})
export class ProjectComponentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isModalOpen: boolean = false;

  projects: any[] = [];
  userName: string = '';
  daysRemaining: number = 0;
  intervalId: any;
  filteredProjects: any[] = [];

  isDarkMode: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
  // For pagination
  page: number = 1;
  itemsPerPage: number = 10;
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
    public apiService: ApiService,
    private toastr: ToastrService
  ) {
    const darkModePreference = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePreference === 'true';
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  ngOnInit() {
    this.getUserName();
    this.loadProjects();
    this.startLiveDaysRemaining();
  }

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
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  onSubmit(formRef: NgForm) {
    if (formRef.invalid) {
      Object.keys(formRef.controls).forEach((field) => {
        const control = formRef.controls[field];
        control?.markAsTouched();
      });
      return;
    }
    this.project.project_Id = this.generateUniqueId();
    this.project.createdBy = this.userName;
    this.apiService.addProject(this.project);
    this.loadProjects();
    formRef.resetForm({
      status: 'High',
      createdBy: this.userName,
      teamMembers: [],
    });
    this.toastr.success('Project added successfully!');
    this.closeModal();

    this.router.navigate(['/project-comp']);
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
    }, 1000 * 60 * 60 * 24);
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

  onPageChange(page: number) {
    this.page = page;
    this.applyFilters();
  }

  onSearchChange() {
    this.page = 1;
    this.applyFilters();
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());

    this.page = 1;
    this.applyFilters();
  }
  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
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
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          project.createdBy
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          project.projectManager
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          project.status
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
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

        if (this.sortColumn === 'dueDate') {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (dateA < dateB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (dateA > dateB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }

        if (this.sortColumn === 'status') {
          const priorityOrder: { [key: string]: number } = {
            High: 1,
            Medium: 2,
            Low: 3,
          };
          const priorityA = priorityOrder[a.status];
          const priorityB = priorityOrder[b.status];
          if (priorityA < priorityB) {
            return this.sortDirection === 'asc' ? -1 : 1;
          } else if (priorityA > priorityB) {
            return this.sortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }

        // Default sorting
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
    console.log('Filtered projects: ', this.filteredProjects);
  }
}
