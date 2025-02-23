import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  loggedInUser: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const user = localStorage.getItem('loggedInUser'); // ใช้ key 'loggedInUser'
    if (user) {
      this.isLoggedIn = true;
      this.loggedInUser = JSON.parse(user).username;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('loggedInUser'); // ลบ key 'loggedInUser'
    this.isLoggedIn = false;
    this.loggedInUser = '';
    this.router.navigate(['/login']);
  }
}
