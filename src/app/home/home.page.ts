import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { DataService, Employee } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomePage implements OnInit {
  currentUser?: Employee;
  authUser?: User | null;
  greeting = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.setGreeting();
    this.authUser = await this.authService.getAuthState();
    if (this.authUser) {
      this.currentUser = await this.dataService.getEmployeeById(this.authUser.uid) ?? undefined;
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  async logout() {
    await this.authService.signOut();
    this.navCtrl.navigateRoot('/login');
  }

  // NEW: Method to navigate to the current user's profile
  viewMyProfile() {
    if (this.currentUser) {
      this.navCtrl.navigateForward(`/tabs/profile/${this.currentUser.uid}`);
    }
  }
}