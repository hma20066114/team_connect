import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Employee {
  uid: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.firestore;
  }

  async getAllEmployees(): Promise<Employee[]> {
    const employeesCol = collection(this.firestore, 'employees');
    const employeeSnapshot = await getDocs(employeesCol);
    return employeeSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Employee));
  }

  async getEmployeeById(uid: string): Promise<Employee | null> {
    const docRef = doc(this.firestore, 'employees', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as Employee;
    } else {
      return null;
    }
  }
  
  createEmployeeProfile(uid: string, data: any) {
    const docRef = doc(this.firestore, 'employees', uid);
    return setDoc(docRef, data);
  }

  async logAttendance(userId: string, record: any) {
    const attendanceCol = collection(this.firestore, `employees/${userId}/attendance`);
    const docId = new Date().getTime().toString();
    await setDoc(doc(attendanceCol, docId), record);
  }
}