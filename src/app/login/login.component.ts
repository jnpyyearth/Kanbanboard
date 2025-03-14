import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';

  private mockUser = {
    username: 'admin',
    password: '1234'
  };

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {
    
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify({ username }));
      this.router.navigateByUrl('/board').then(() => {
        window.location.reload(); 
      });
    } else {
      this.loginError = 'Invalid username or password';
    }
  }

}
