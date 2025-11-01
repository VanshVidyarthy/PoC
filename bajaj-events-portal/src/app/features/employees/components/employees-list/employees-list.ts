import { Component ,inject, OnInit, OnDestroy } from '@angular/core';
import {Employee} from '../../models/employee';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { EmployeeApi } from '../../services/employee-api';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-employees-list',
  imports:[FormsModule,NgxPaginationModule, CommonModule, RouterLink],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.css',
})
export class EmployeesList implements OnInit, OnDestroy {
  private _employeeServiceSubscription: Subscription;
  private employeesApi = inject(EmployeeApi);
  protected title:string="Welcome to Bajaj Finserv Employees List!";
  protected subtitle:string="Published by Bajaj Finserv HR Department";
  protected columns:string[]=["Employee ID", "Employee Name", "Address", "City", "Zipcode", "Phone", "Email", "Skill Sets", "Country", "Joining Date", "Show Details"];
  protected employees:Employee[]= [];
  protected filteredEmployees:Employee[] = [...this.employees];
  protected searchChars:string="";
  protected childSubtitle:string="Employee Details";
  //protected selectedEmployeeId:number;
  protected childMessage:string;
  //protected selectedEmployee:Employee;
  protected pageNumber:number=1;
  protected pageSize:number=2;

    ngOnInit(): void {

    this._employeeServiceSubscription=this.employeesApi.getAllEmployees().subscribe({
      next: (employeesData) => {
        console.log(employeesData);
        this.employees = employeesData;
        this.filteredEmployees = [...this.employees];
    },
      error: err =>{
        console.log(err);
      }
    })

  }

  // protected onEmployeeSelection(id:number):void{
  //   this.selectedEmployeeId=id;
  // }

  protected handleChildMessage(message:string):void{
    this.childMessage=message;
  }
    protected searchEmployees(): void {
    if (!this.searchChars || this.searchChars == '') {
      console.log(this.searchChars);
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(employee => employee.employeeName.toLocaleLowerCase().includes(this.searchChars.toLocaleLowerCase()));
      console.log(this.filteredEmployees);
    }
  }
    ngOnDestroy(): void {
    if(this._employeeServiceSubscription){
      this._employeeServiceSubscription.unsubscribe();
    }
}
}
