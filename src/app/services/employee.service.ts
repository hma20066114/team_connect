import { Injectable } from '@angular/core';

// Defines the structure for an Employee object
export interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Mock data for a list of employees
  private employees: Employee[] = [
    { id: 1, name: 'Ciara Murphy', role: 'Project Manager', email: 'c.murphy@example.com', phone: '0871234567', avatar: 'https://i.pravatar.cc/150?u=ciara' },
    { id: 2, name: 'Liam O\'Connell', role: 'Lead Developer', email: 'l.oconnell@example.com', phone: '0867654321', avatar: 'https://i.pravatar.cc/150?u=liam' },
    { id: 3, name: 'Siobhan Doyle', role: 'UX/UI Designer', email: 's.doyle@example.com', phone: '0851122334', avatar: 'https://i.pravatar.cc/150?u=siobhan' },
    { id: 4, name: 'Eoin Walsh', role: 'QA Engineer', email: 'e.walsh@example.com', phone: '0834455667', avatar: 'https://i.pravatar.cc/150?u=eoin' }
  ];

  // In a real app, you'd have a login system. For this project, we'll
  // assume the logged-in user is always the first one in the list.
  private currentUserId = 1; 

  constructor() { }

  // Gets the profile of the currently logged-in user
  getCurrentUser(): Promise<Employee | undefined> {
    const user = this.employees.find(e => e.id === this.currentUserId);
    return Promise.resolve(user);
  }

  // Gets the full list of all employees for the directory
  getAllEmployees(): Promise<Employee[]> {
    return Promise.resolve(this.employees);
  }

  getEmployeeById(id: number): Promise<Employee | undefined> {
    const employee = this.employees.find(e => e.id === id);
    return Promise.resolve(employee);
  }

}