import { Routes } from "@angular/router";
import { EventsList } from "./components/events-list/events-list";
import { authGuard } from "../../core/guards/auth-guard";
import { hrGuard } from "../../core/guards/hr-guard";

export const eventRoutes: Routes = [
    {
        path: "",   //default
        component: EventsList,
        title: "Bajaj Events Portal - Events List",
        canActivate: [authGuard]
    },

    {
        path:"register",     //named
        loadComponent: ()=> import("./components/register-event/register-event").then(re=>re.RegisterEvent),
        title: "Register New Event",
        canActivate: [authGuard, hrGuard]
    },
    {
        path:":evid",    //parameterized
        loadComponent: ()=> import("./components/event-details/event-details").then(evid=>evid.EventDetails),
        title: "Bajaj Events Portal - Event Details",
        data:{companyName: "Bajaj Finserv", role:"Employee"}
    },
];