import { Routes } from "@angular/router";
import { Login } from "./components/login/login";

export const SecurityRoutes: Routes = [
    {   
        path:"login",
        component: Login,
        title: "Login"
    }

];