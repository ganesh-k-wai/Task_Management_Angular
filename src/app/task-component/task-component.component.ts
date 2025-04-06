import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './task-component.component.html',
  styleUrls: ['./task-component.component.css'],
})
export class TaskComponentComponent implements OnInit   {
  projectId!: string;
  project: any;
  tasks: any[] = [];
  userName: string = '';
  isEditing: boolean = false;
  editedProject: any = {};
  // ...
  isEditingTask: boolean = false;
  currentTask: any = {};
  daysRemaining: number = 0;
  intervalId: any;
  teamMembers: any[] = [];
  selectedTeamMembers: any[] = [];


  projectList: any[] = [];  // All Projects List
projectTeamMembers: any[] = []; // Team Members of selected project
selectedTaskMembers: any[] = []; // Team Members selected for task
selectedProjectId: any; // Selected Project ID in Create/Edit Task

  constructor(
    private route: ActivatedRoute,
    public apiService: ApiService,
    private router: Router,
    // private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_Id') || '';
    this.loadProjectDetails();
    this.loadTasks();
    this.loadCurrentUser();

  }

  loadProjectDetails() {
    this.project = this.apiService.getProjectById(this.projectId);
    this.editedProject = { ...this.project }; //optionally
    this.selectedTeamMembers = this.project.teamMembers || [];

    // console.log('pro details:', this.project);
  }

  addTask(taskForm: any) {
    const task = {
      task_id: this.generateUniqueId(),
      title: taskForm.value.taskTitle,
      assignedTo: taskForm.value.assignedTo,
      taskStatus: taskForm.value.taskStatus || 'New',
      taskEstimate: taskForm.value.taskEstimate,
      timeSpent: taskForm.value.timeSpent,
      description: taskForm.value.taskDescription,
    };
    this.apiService.addTask(this.projectId, task);
    console.log(task);
    console.log(this.projectId);

    this.loadTasks();
    taskForm.reset();
    this.selectedTaskMembers = [];
  this.projectTeamMembers = [];
  }

  loadTasks() {
    this.tasks = this.apiService.getTasksByProjectId(this.projectId);
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
  editProject() {
    this.isEditing = true;
    this.editedProject = { ...this.project };
  }
  cancelEdit() {
    this.isEditing = false;
    this.editedProject = { ...this.project };

  }

  deleteProject() {
    this.apiService.deleteProject(this.projectId);
    this.router.navigate(['/project-comp']);
  }

  saveProject() {
    
    this.apiService.updateProject(this.projectId, this.editedProject);
    console.log(this.editProject);
    
    this.isEditing = false;
    this.loadProjectDetails();
  }

  // -------------task

  saveTask(taskForm: any) {
    const updatedTask = {
      task_id: this.currentTask.task_id,
      title: taskForm.value.taskTitle,
      assignedTo: taskForm.value.assignedTo,
      taskStatus: taskForm.value.taskStatus,
      taskEstimate: taskForm.value.taskEstimate,
      timeSpent: taskForm.value.timeSpent,
      description: taskForm.value.taskDescription,
    };
    this.apiService.updateTask(this.projectId, updatedTask);
    this.isEditingTask = false;
    this.loadTasks();
  }

  cancelEditTask() {
    this.isEditingTask = false;
    this.currentTask = {};
  }
  editTask(task: any) {
    this.isEditingTask = true;
  this.selectedProjectId = task.projectId;

  const project = this.projectList.find(p => p.id === task.projectId);
  this.projectTeamMembers = project?.teamMembers || [];

  this.selectedTaskMembers = [...task.assignedMembers];

  }
  deleteTask(taskId: string) {
    const confirmed = window.confirm('Are you sure ?');
    if (confirmed) {
      this.apiService.deleteTask(this.projectId, taskId);
      this.loadTasks();
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

  // When project is selected in task form
  onProjectChange(projectId: any) {
    this.selectedProjectId = projectId;
    const project = this.projectList.find(p => p.id === projectId);
    this.projectTeamMembers = project?.teamMembers || [];
    this.selectedTaskMembers = [];  // Reset on project change
  }

  // Add/Remove team member in checkbox
  onMemberSelect(member: any, event: any) {
    if (event.target.checked) {
      this.selectedTaskMembers.push(member);
    } else {
      this.selectedTaskMembers = this.selectedTaskMembers.filter(m => m !== member);
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
      if (this.editedProject.endDate && new Date(this.editedProject.startDate) > new Date(this.editedProject.endDate)) {
        alert('Start Date cannot be after End Date');
        this.editedProject.endDate = null;
      }
      this.calculateDueDays(); // optional for auto calculate
    }
    
    onEndDateChange() {
      if (new Date(this.editedProject.endDate) < new Date(this.editedProject.startDate)) {
        alert('End Date cannot be before Start Date');
        this.editedProject.endDate = null;
      }
      this.calculateDueDays(); // optional for auto calculate
    }
    

    
}
