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

  addProject(project: any): void {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  getProjects(): any[] {
    return JSON.parse(localStorage.getItem('projects') || '[]');
  }
}
