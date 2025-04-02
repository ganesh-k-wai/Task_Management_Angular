import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMsg: string = 'Invalid Credential.!';
  successMsg: string = 'User Login Successful.';
  isLogin = true;

  login: any = {
    user_name: '',
    user_password: '',
  };
  signup: any = {
    user_name: '',
    user_password: '',
  };

  constructor(private router: Router, private apiService: ApiService) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  save_login() {
    const isLoggedIn = this.apiService.login(
      this.login.user_name,
      this.login.user_password
    );
    if (isLoggedIn) {
      alert(this.successMsg);
      this.router.navigate(['/project-comp']);
    } else {
      alert(this.errorMsg);
    }
    this.login = {};
  }

  save_signUp() {
    this.apiService.signUp(this.signup.user_name, this.signup.user_password);
    this.signup = { user_name: '', user_password: '' };
  }
}
