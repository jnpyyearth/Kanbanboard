import { Injectable } from '@angular/core';

interface User {
  id: number;
  username: string;
  password: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mockusers: User[] = [
    { id: 1, username: 'admin', password: 'password123', token: 'token-admin-123' },
    { id: 2, username: 'user', password: 'userpass', token: 'token-user-456' }
  ];

  constructor() { }
  //ตรวจสอบชื่อผู้ใช้และรหัสผ่าน
  login(username: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // ถ้ายังไม่มีในlocal storage ให้ mockup
    if (users.length === 0) {
      users = this.mockusers;
      localStorage.setItem('users', JSON.stringify(users));
    }

    const user = users.find((user: any) => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  // ดึงข้อมูลผู้ใช้จาก Local Storage
  getUserData(): any {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return { username, token };
  }

  //ลบข้อมูลเมื่อ Logout
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  register(username: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
    if (users.some((user: any) => user.username === username)) {
      return false; // ไม่สามารถสมัครได้ (ซ้ำ)
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }



}
