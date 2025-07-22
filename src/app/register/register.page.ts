import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {
  credentials = { email: '', password: '', name: '', role: '', phone: '' };
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }
  async register() {
    try {
      const userCredential = await this.authService.register(this.credentials.email, this.credentials.password);
      const uid = userCredential.user.uid;
      const profileData = {
        name: this.credentials.name,
        role: this.credentials.role,
        phone: this.credentials.phone,
        email: this.credentials.email,
        avatar: `https://i.pravatar.cc/150?u=${uid}`
      };
      await this.dataService.createEmployeeProfile(uid, profileData);
      this.navCtrl.navigateRoot('/tabs/dashboard', { animated: true });
    } catch (error: any) {
      this.showToast(`Registration failed: ${error.message}`);
    }
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'danger' });
    toast.present();
  }
}