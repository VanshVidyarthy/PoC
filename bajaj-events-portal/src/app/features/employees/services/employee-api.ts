import { Injectable, inject } from '@angular/core';
import  { Employee } from '../models/employee';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeApi {
  private _baseUrl:string='http://192.168.1.11:9090/api/';
  private _httpClient = inject(HttpClient);    
  public getAllEmployees():Observable<Employee[]>{
    return this._httpClient.get<Employee[]>(`${this._baseUrl}employees`);
  }
  public getEmployeeDetails(employeeId: number):Observable<Employee>{
    return this._httpClient.get<Employee>(`${this._baseUrl}employees/${employeeId}`);
  }

  public registerNewEmployee(employee: Employee): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}employees`, employee, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}