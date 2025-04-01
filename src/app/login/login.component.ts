import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  signUparray: any[] = [];
  isLogin = true;

  login: any = {
    user_name: '',
    user_password: '',
  };
  signup: any = {
    user_name: '',
    user_password: '',
  };

  constructor(private router: Router) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  save_login() {
    const localdata = localStorage.getItem('signUp');
    if (localdata !== null) {
      this.signUparray = JSON.parse(localdata);
    }
    const isExistuser = this.signUparray.find(
      (user: { user_name: string; user_password: string }) =>
        user.user_name === this.login.user_name &&
        user.user_password === this.login.user_password
    );
    if (isExistuser) {
      alert(this.successMsg);
      this.router.navigate(['/project-comp']);
    } else {
      alert(this.errorMsg);
    }
    this.login = {};
  }

  save_signUp() {
    this.signUparray.push(this.signup);
    localStorage.setItem('signUp', JSON.stringify(this.signUparray));
    this.signup = { user_name: '', user_password: '' };
  }
}
