import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <input [(ngModel)]="email" name="email" placeholder="Email" class="form-control mb-2" required>
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" class="form-control mb-2" required>
        <button class="btn btn-primary">Login</button>
      </form>
      <!-- Register link -->
      <a routerLink="/register" class="btn btn-secondary mt-3">Don't have an account? Register</a>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === this.email && storedUser.password === this.password) {
      localStorage.setItem('loggedInUser', JSON.stringify(storedUser));
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid credentials!');
    }
  }
}
