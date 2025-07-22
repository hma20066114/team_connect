import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  credentials = { email: '', password: '' };
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}
  async login() {
    try {
      await this.authService.signIn(this.credentials.email, this.credentials.password);
      this.navCtrl.navigateRoot('/tabs/dashboard', { animated: true });
    } catch (error: any) {
      this.showToast(`Login failed: ${error.message}`);
    }
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'danger' });
    toast.present();
  }
}