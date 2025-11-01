import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";
import { EmployeesList } from "./components/employees-list/employees-list";
import { hrGuard } from "../../core/guards/hr-guard";

export const employeeRoutes: Routes = [
    {
            path: "",
            component: EmployeesList,
            title: "Bajaj Events Portal - Employees List",
            canActivate: [authGuard]
        },
        {
            path:"register",     //named
            loadComponent: ()=> import("./components/register-employee/register-employee").then(re=>re.RegisterEmployee),
            title: "Register New Employee",
            canActivate: [authGuard, hrGuard]
            
        },
        {
            path:":empid",
            loadComponent: ()=> import("./components/employee-details/employee-details").then(empid=>empid.EmployeeDetails),
            title: "Bajaj Events Portal - Employee Details",
            
        }
]