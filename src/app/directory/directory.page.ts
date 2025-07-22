import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Employee, EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DirectoryPage implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  async loadEmployees() {
    this.allEmployees = await this.employeeService.getAllEmployees();
    this.filteredEmployees = [...this.allEmployees];
  }

  // Navigates to the selected employee's profile page
  viewProfile(employeeId: number) {
    this.navCtrl.navigateForward(`/tabs/profile/${employeeId}`);
  }

  // Handles the search bar input
  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredEmployees = this.allEmployees.filter(employee => 
      employee.name.toLowerCase().includes(query)
    );
  }
}