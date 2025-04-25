import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

declare var bootstrap: any;

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule, RouterModule, HeaderComponent],
  templateUrl: './task-component.component.html',
  styleUrls: ['./task-component.component.css'],
})
export class TaskComponentComponent implements OnInit {
  projectId!: string;
  project: any;
  tasks: any[] = [];
  userName: string = '';
  isEditing: boolean = false;
  isCreateTask: boolean = false;
  editedProject: any = {};

  filteredTasks: any[] = [];
  isDarkMode: boolean = false;

  // For pagination
  page: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  // For searching and sorting
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';
  // selectedTaskTeamMembers: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_Id') || '';
    this.loadProjectDetails();
    this.loadTasks();
    this.loadCurrentUser();
  }

  loadProjectDetails() {
    this.project = this.apiService.getProjectById(this.projectId);
    this.editedProject = { ...this.project };
    this.selectedTeamMembers = this.project.teamMembers || [];
    this.teamMembers = this.project.teamMembers || [];
  }

  generateUniqueId(): string {
    return uuidv4();
  }

  loadCurrentUser() {
    const currentUser = this.apiService.getCurrentUser();
    this.userName = currentUser.user_name || 'User';
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/']);
  }
  // ................
  confirmDelete() {
    const confirmed = window.confirm('Are you sure ?');
    if (confirmed) {
      this.deleteProject();
    }
  }
  // editProject() {
  //   this.isEditing = true;
  //   this.editedProject = { ...this.project };
  // }
  // cancelEdit() {
  //   this.isEditing = false;
  //   this.editedProject = { ...this.project };
  // }

  deleteProject() {
    this.apiService.deleteProject(this.projectId);
    this.router.navigate(['/project-comp']);
  }
  closeModal() {
    const modalEl = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  saveProject() {
    this.apiService.updateProject(this.projectId, this.editedProject);
    // console.log(this.editProject);

    this.isEditing = false;
    this.closeModal();

    this.loadProjectDetails();
    this.toastr.success('Project updated successfully!');
  }

  // -------------task

  isEditingTask: boolean = false;
  currentTask: any = {};
  daysRemaining: number = 0;
  intervalId: any;
  teamMembers: any[] = [];
  selectedTeamMembers: any[] = []; //total project selected team

  selectedTaskTeamMembers: any[] = []; //empty array for store team members while create task and edit task for selection
  selectedTaskMembers: string[] = []; //edit form member

  infinityValue: number = Infinity;

  selectedMembers: string[] = []; // Unified array for selected team members

  closeTaskModal() {
    this.selectedMembers = [];
    this.currentTask = {};
    const modalEl = document.getElementById('taskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  closeeditTaskModal() {
    const modalEl = document.getElementById('editTaskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  addTask(taskForm: any) {
    const task = {
      task_id: this.generateUniqueId(),
      title: taskForm.value.taskTitle,
      assignedTo: [...this.selectedMembers],
      taskStatus: taskForm.value.taskStatus || 'New',
      taskEstimate: taskForm.value.taskEstimate,
      timeSpent: taskForm.value.timeSpent,
      description: taskForm.value.taskDescription,
    };
    this.apiService.addTask(this.projectId, task);
    this.closeTaskModal();
    this.loadTasks();
    taskForm.reset();
    this.selectedMembers = []; // Reset selected members
    this.toastr.success('Task added successfully!');
  }

  loadTasks() {
    this.tasks = this.apiService.getTasksByProjectId(this.projectId);
    this.applyTaskFilters();
    console.log('this.selectedTeamMembers', this.selectedTeamMembers);
    console.log('this.selectedTaskTeamMembers', this.selectedTaskTeamMembers);
    console.log('this.selectedMembers', this.selectedMembers);
  }

  saveTask(taskForm: any) {
    const updatedTask = {
      task_id: this.currentTask.task_id,
      title: taskForm.value.taskTitle,
      assignedTo: [...this.selectedTaskMembers],
      taskStatus: taskForm.value.taskStatus,
      taskEstimate: taskForm.value.taskEstimate,
      timeSpent: taskForm.value.timeSpent,
      description: taskForm.value.taskDescription,
    };
    this.apiService.updateTask(this.projectId, updatedTask);
    this.isEditingTask = false;
    this.loadTasks();
    this.closeeditTaskModal();
    this.selectedMembers = [];
    this.toastr.success('Task updated successfully!');
  }

  onTaskMemberChange(event: any) {
    const member = event.target.value;
    if (event.target.checked) {
      if (!this.selectedTaskMembers.includes(member)) {
        this.selectedTaskMembers.push(member);
      }
    } else {
      const index = this.selectedTaskMembers.indexOf(member);
      if (index > -1) {
        this.selectedTaskMembers.splice(index, 1);
      }
    }
    this.selectedMembers = [...this.selectedTaskMembers];
    console.log('Updated Selected Task Members:', this.selectedTaskMembers);
  }

  // cancelEditTask() {
  // this.isEditingTask = false;
  // this.currentTask = {};
  // this.selectedTaskTeamMembers = [];
  // }
  editTask(task: any) {
    // this.isEditingTask = true;
    this.currentTask = { ...task };
    this.selectedTaskMembers = [...task.assignedTo];
  }
  deleteTask(taskId: string) {
    const confirmed = window.confirm('Are you sure ?');
    if (confirmed) {
      this.apiService.deleteTask(this.projectId, taskId);
      this.loadTasks();
      this.toastr.success('Task Deleted successfully!');
    }
  }
  // team members
  onCheckboxChange(event: any) {
    const member = event.target.value;
    if (event.target.checked) {
      if (!this.editedProject.teamMembers.includes(member)) {
        this.editedProject.teamMembers.push(member);
      }
    } else {
      const index = this.editedProject.teamMembers.indexOf(member);
      if (index > -1) {
        this.editedProject.teamMembers.splice(index, 1);
      }
    }
  }

  // date

  calculateDueDays() {
    if (this.editedProject.startDate && this.editedProject.endDate) {
      const start = new Date(this.editedProject.startDate);
      const end = new Date(this.editedProject.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.editedProject.dueDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
    }
  }

  onStartDateChange() {
    if (
      this.editedProject.endDate &&
      new Date(this.editedProject.startDate) >
        new Date(this.editedProject.endDate)
    ) {
      alert('Start Date cannot be after End Date');
      this.editedProject.endDate = null;
    }
    this.calculateDueDays();
  }

  onEndDateChange() {
    if (
      new Date(this.editedProject.endDate) <
      new Date(this.editedProject.startDate)
    ) {
      alert('End Date cannot be before Start Date');
      this.editedProject.endDate = null;
    }
    this.calculateDueDays();
  }

  // -------searching sort----------

  onTaskPageChange(page: number) {
    this.page = page;
    this.applyTaskFilters();
  }

  onTaskItemsPerPageChange(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
    this.page = 1;
    this.applyTaskFilters();
  }

  onTaskSearchChange() {
    this.page = 1;
    this.applyTaskFilters();
  }
  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onTaskSortChange(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyTaskFilters();
  }

  private applyTaskFilters() {
    let filteredTasks = [...this.tasks];

    // Searching
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) => {
        const assignedTo = Array.isArray(task.assignedTo)
          ? task.assignedTo.join(', ').toLowerCase()
          : '';
        return (
          task.title.toLowerCase().includes(query) ||
          assignedTo.includes(query) ||
          task.taskStatus.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      });
    }

    // Sorting
    if (this.sortColumn) {
      filteredTasks.sort((a, b) => {
        let valueA = a[this.sortColumn];
        let valueB = b[this.sortColumn];

        if (this.sortColumn === 'taskStatus') {
          const statusOrder = ['New', 'In Progress', 'Completed'];
          valueA = statusOrder.indexOf(valueA);
          valueB = statusOrder.indexOf(valueB);
        } else {
          if (Array.isArray(valueA)) {
            valueA = valueA.join(', ').toLowerCase();
          }
          if (Array.isArray(valueB)) {
            valueB = valueB.join(', ').toLowerCase();
          }

          valueA = valueA || '';
          valueB = valueB || '';
        }

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
    this.totalItems = filteredTasks.length;
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredTasks = filteredTasks.slice(startIndex, endIndex);
  }
}
