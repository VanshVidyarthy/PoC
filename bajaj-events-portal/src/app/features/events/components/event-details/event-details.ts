import { Component,  inject, OnInit, OnDestroy } from '@angular/core';
 
import { Event } from './../../models/event';
import { CommonModule } from '@angular/common';
 
import { EventsApi } from '../../services/event-api';
import { Subscription } from "rxjs";
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-event-details',
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit ,OnDestroy{
  
  protected title: string = 'Details of :-';
 
  protected event: Event;
 
  private _eventsApi=inject(EventsApi);
  private _activatedRoute=inject(ActivatedRoute);
  private _eventsApiSubscription:Subscription;
 
  ngOnInit(): void {
    let eventId=this._activatedRoute.snapshot.params['evid'];
    this._eventsApiSubscription=this._eventsApi.getEventDetails(eventId).subscribe({
      next:data=>{
        console.log(data);
        this.event = data; // Assign the fetched data to the event property
      },
      error:err=>{
       console.log(err)
      }
    })
  }
  ngOnDestroy(): void {
    if(this._eventsApiSubscription) this._eventsApiSubscription.unsubscribe();
    
  }
}
 
 