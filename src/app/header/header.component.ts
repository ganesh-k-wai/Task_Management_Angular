import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  @Input() userName: string = '';
  isDarkMode: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
    this.toastr.success(' Logout Successfully.');
  }
}
