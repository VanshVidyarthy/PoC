import { Component, Input, Output, EventEmitter, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { EmployeeApi } from '../../services/employee-api';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit, OnChanges, OnDestroy {
  private _employeeApi = inject(EmployeeApi);
  private _activatedRoute = inject(ActivatedRoute);
  private _employeeApiSubscription:Subscription;
  protected title:string="Details of - ";
  @Input() public employeeId:number;
  protected employee:Employee;
  @Input() public subTitle:string;
  @Output() sendConfirmationMessage: EventEmitter<string> = new EventEmitter<string>();

  protected onEmployeeProcessed():void{
    //This will fire an event to send the data to parent component
    this.sendConfirmationMessage.emit(`Employee ${this.employee.employeeName} has been processed and stored in Oracle DB!`);
  }

  ngOnInit(): void {
    // Handle route parameters when component is loaded via routing
    const empId = this._activatedRoute.snapshot.params['empid'];
    if (empId) {
      this.loadEmployeeDetails(parseInt(empId));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle Input property changes when component is used with @Input
    if (this.employeeId) {
      this.loadEmployeeDetails(this.employeeId);
    }
  }

  private loadEmployeeDetails(employeeId: number): void {
    this._employeeApiSubscription=this._employeeApi.getEmployeeDetails(employeeId).subscribe({
      next:data=>{
        this.employee=data;
      },
      error:err=>{
        console.log(err);
      }
    })
  }
  ngOnDestroy(): void {
    if(this._employeeApiSubscription){
    this._employeeApiSubscription.unsubscribe();
  }
  }
}


