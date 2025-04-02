import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: any = null;

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      this.currentUser = JSON.parse(loggedInUser);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.currentUser = null;
  }
}
