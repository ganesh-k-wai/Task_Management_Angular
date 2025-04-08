import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLogin = true;

  login: any = {
    user_name: '',
    user_password: '',
  };
  signup: any = {
    user_name: '',
    user_password: '',
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  save_login() {
    const isLoggedIn = this.apiService.login(
      this.login.user_name,
      this.login.user_password
    );
    if (isLoggedIn) {
      // alert(this.successMsg);
      this.toastr.success(' Login Successfully.'); // Toast notification

      this.router.navigate(['/project-comp']);
    } else {
      this.toastr.error('Invalid credentials!');
    }
    this.login = {};
  }

  save_signUp() {
    this.apiService.signUp(this.signup.user_name, this.signup.user_password);
    this.signup = { user_name: '', user_password: '' };
    this.isLogin = !this.isLogin;
    this.toastr.success(' Sign Up Successfully.'); // Toast notification
  }
}
