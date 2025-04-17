import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private signUparray: any[] = [];

  constructor() {
    const localdata = localStorage.getItem('signUp');
    if (localdata !== null) {
      this.signUparray = JSON.parse(localdata);
    }
  }
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
  login(user_name: string, user_password: string): boolean {
    const isExistuser = this.signUparray.find(
      (user: { user_name: string; user_password: string }) =>
        user.user_name === user_name && user.user_password === user_password
    );
    if (isExistuser) {
      localStorage.setItem('loggedInUser', JSON.stringify(isExistuser));
      return true;
    } else {
      return false;
    }
  }

  signUp(user_name: string, user_password: string): void {
    this.signUparray.push({ user_name, user_password });
    localStorage.setItem('signUp', JSON.stringify(this.signUparray));
  }
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }
  logout(): void {
    localStorage.removeItem('loggedInUser');
  }
  // --------------------

  addProject(project: any): void {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.unshift(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  getProjects(): any[] {
    return JSON.parse(localStorage.getItem('projects') || '[]');
  }
  // ...
  getProjectById(projectId: string): any {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    return projects.find(
      (project: { project_Id: string }) => project.project_Id === projectId
    );
  }

  getTasksByProjectId(projectId: string): any[] {
    const project = this.getProjectById(projectId);
    return project ? project.tasks || [] : [];
  }

  addTask(projectId: string, task: any): void {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    const projectIndex = projects.findIndex(
      (project: { project_Id: string }) => project.project_Id === projectId
    );
    if (projectIndex !== -1) {
      projects[projectIndex].tasks = projects[projectIndex].tasks || [];
      projects[projectIndex].tasks.unshift(task);
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }

  updateProject(projectId: string, updatedProject: any): void {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(
      (project: { project_Id: string }) => project.project_Id === projectId
    );
    if (projectIndex !== -1) {
      projects[projectIndex] = { ...projects[projectIndex], ...updatedProject };
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }

  deleteProject(projectId: string): void {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects = projects.filter(
      (project: { project_Id: string }) => project.project_Id !== projectId
    );
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  // ---------task-----------
  updateTask(projectId: string, updatedTask: any): void {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(
      (project: { project_Id: string }) => project.project_Id === projectId
    );
    if (projectIndex !== -1) {
      const taskIndex = projects[projectIndex].tasks.findIndex(
        (task: { task_id: string }) => task.task_id === updatedTask.task_id
      );
      if (taskIndex !== -1) {
        projects[projectIndex].tasks[taskIndex] = updatedTask;
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    }
  }

  deleteTask(projectId: string, taskId: string): void {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(
      (project: { project_Id: string }) => project.project_Id === projectId
    );
    if (projectIndex !== -1) {
      projects[projectIndex].tasks = projects[projectIndex].tasks.filter(
        (task: { task_id: string }) => task.task_id !== taskId
      );
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }
}
