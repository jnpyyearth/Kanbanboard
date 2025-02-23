import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false, 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerError: string = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerError = 'Please fill in all fields correctly';
      return;
    }

    const { username, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.registerError = 'Passwords do not match!';
      return;
    }

    // ดึงข้อมูลผู้ใช้ที่มีอยู่จาก localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    if (users.some((user: any) => user.username === username)) {
      this.registerError = 'Username already exists!';
      return;
    }

    // เพิ่มผู้ใช้ใหม่เข้าไปในอาร์เรย์
    users.push({ username, password });

    // บันทึกอาร์เรย์กลับไปที่ localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful!');
    this.router.navigate(['/login']);
  }
}
