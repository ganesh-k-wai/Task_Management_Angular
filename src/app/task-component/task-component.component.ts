import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-component',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './task-component.component.html',
  styleUrls: ['./task-component.component.css'],
})
export class TaskComponentComponent implements OnInit {
  projectId!: string;
  project: any;
  tasks: any[] = [];
  userName: string = '';
  isEditing: boolean = false;
  editedProject: any = {};
  // ...
  isEditingTask: boolean = false;
  currentTask: any = {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('project_Id') || '';
    console.log(this.projectId);
    this.loadProjectDetails();
    this.loadTasks();
    this.loadCurrentUser();
  }

  loadProjectDetails() {
    this.project = this.apiService.getProjectById(this.projectId);

    console.log('pro details:', this.project);
  }

  addTask(taskForm: any) {
    const task = {
      task_id: this.generateUniqueId(),
      title: taskForm.value.taskTitle,
      assignedTo: taskForm.value.assignedTo,
      taskStatus: taskForm.value.taskStatus,
      taskEstimate: taskForm.value.taskEstimate,
      timeSpent: taskForm.value.timeSpent,
      description: taskForm.value.taskDescription,
    };
    this.apiService.addTask(this.projectId, task);
    console.log(task);
    console.log(this.projectId);

    this.loadTasks();
    taskForm.reset();
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
    this.currentTask = { ...task };
    this.isEditingTask = true;
  }
  deleteTask(taskId: string) {
    const confirmed = window.confirm('Are you sure ?');
    if (confirmed) {
      this.apiService.deleteTask(this.projectId, taskId);
      this.loadTasks();
    }
  }
}
