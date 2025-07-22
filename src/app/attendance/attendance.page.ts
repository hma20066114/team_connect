import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, ToastController, AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { AttendanceService, AttendanceRecord } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-attendance',
  templateUrl: 'attendance.page.html',
  styleUrls: ['attendance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [DatePipe]
})
export class AttendancePage implements OnInit, OnDestroy {
  authUser?: User | null;
  attendanceRecord?: AttendanceRecord;
  private attendanceSub?: Subscription;

  constructor(
    private dataService: DataService,
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.authUser = await this.authService.getAuthState();
    this.attendanceSub = this.attendanceService.attendanceStatus$.subscribe(record => {
      this.attendanceRecord = record;
    });
  }

  ngOnDestroy() {
    this.attendanceSub?.unsubscribe();
  }

  async handleAttendanceAction() {
    if (this.attendanceRecord?.status === 'Clocked Out') {
      await this.clockIn();
    } else {
      await this.clockOut();
    }
  }

  private async clockIn() {
    const loading = await this.alertCtrl.create({ header: 'Clocking In...', message: 'Getting your location...', backdropDismiss: false });
    await loading.present();
    try {
      await this.attendanceService.clockIn();
      if (this.authUser && this.attendanceRecord) {
        await this.dataService.logAttendance(this.authUser.uid, this.attendanceRecord);
      }
      loading.dismiss();
      this.showToast('You have been successfully clocked in.', 'success');
    } catch (error: any) {
      loading.dismiss();
      this.showToast(`Error: ${error.message || 'Could not get location.'}`, 'danger');
    }
  }

  private async clockOut() {
    await this.attendanceService.clockOut();
    if (this.authUser && this.attendanceRecord) {
        await this.dataService.logAttendance(this.authUser.uid, this.attendanceRecord);
    }
    this.showToast('You have been successfully clocked out.', 'success');
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 3000, position: 'top', color });
    toast.present();
  }
}