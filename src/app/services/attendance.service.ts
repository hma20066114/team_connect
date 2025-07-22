import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';

export interface AttendanceRecord {
  status: 'Clocked In' | 'Clocked Out';
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceStatus = new BehaviorSubject<AttendanceRecord>({
    status: 'Clocked Out',
    timestamp: new Date()
  });

  public attendanceStatus$ = this.attendanceStatus.asObservable();

  constructor() { }

  async clockIn(): Promise<void> {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    const newRecord: AttendanceRecord = {
      status: 'Clocked In',
      timestamp: new Date(),
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    };
    this.attendanceStatus.next(newRecord);
  }

  async clockOut(): Promise<void> {
    const newRecord: AttendanceRecord = {
      status: 'Clocked Out',
      timestamp: new Date()
    };
    this.attendanceStatus.next(newRecord);
  }
}