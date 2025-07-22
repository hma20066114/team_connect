import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Employee, EmployeeService } from '../services/employee.service';
import { Share } from '@capacitor/share'; // ** IMPORT THE SHARE PLUGIN **

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfilePage implements OnInit {
  employee?: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadEmployee();
  }

  async loadEmployee() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employee = await this.employeeService.getEmployeeById(+employeeId);
    }
  }

  // ** SHARE PLUGIN IMPLEMENTATION (FIXED) **
  async shareContact() {
    if (!this.employee) return;

    // Construct a vCard string. This is a standard format for contact cards.
    const vCard = 
`BEGIN:VCARD
VERSION:3.0
N:${this.employee.name.split(' ').slice(1).join(' ')};${this.employee.name.split(' ')[0]}
FN:${this.employee.name}
TEL;TYPE=CELL:${this.employee.phone}
EMAIL;TYPE=WORK:${this.employee.email}
END:VCARD`;

    try {
      // Check if the device can share
      const canShare = await Share.canShare();
      if (canShare.value) {
        await Share.share({
          title: `Contact Card for ${this.employee.name}`,
          text: vCard,
          dialogTitle: 'Share Contact Info'
        });
      } else {
        this.showToast('Sharing is not available on this device.', 'danger');
      }
    } catch (error) {
      this.showToast('Failed to share contact.', 'danger');
    }
  }
  
  // Helper to show brief messages
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    toast.present();
  }
}