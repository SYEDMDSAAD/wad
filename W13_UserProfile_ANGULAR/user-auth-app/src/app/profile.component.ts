import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4" *ngIf="user">
      <h2>Welcome, {{ user.name }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button (click)="logout()" class="btn btn-danger">Logout</button>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('loggedInUser');
    if (!data) {
      this.router.navigate(['/login']);
    } else {
      this.user = JSON.parse(data);
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
