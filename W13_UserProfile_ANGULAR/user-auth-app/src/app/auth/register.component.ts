import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Register</h2>
      <form (ngSubmit)="register()">
        <input [(ngModel)]="user.name" name="name" placeholder="Name" class="form-control mb-2" required>
        <input [(ngModel)]="user.email" name="email" placeholder="Email" class="form-control mb-2" required>
        <input [(ngModel)]="user.password" name="password" type="password" placeholder="Password" class="form-control mb-2" required>
        <button type="submit" class="btn btn-success">Register</button>
      </form>
      <a routerLink="/login" class="d-block mt-3">Already have an account? Login</a>
    </div>
  `
})
export class RegisterComponent {
  user = { name: '', email: '', password: '' };

  constructor(private router: Router) {}

  register() {
    if (this.user.name && this.user.email && this.user.password) {
      // Check if user already exists in localStorage
      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (existingUser.email === this.user.email) {
        alert('User already exists with this email.');
      } else {
        // Save user to LocalStorage
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Registration successful!');
        this.router.navigate(['/login']);
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
}
