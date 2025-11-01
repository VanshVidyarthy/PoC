import { Component, OnInit } from '@angular/core';
import {Event} from '../../models/event';
import { CommonModule } from '@angular/common';
import { DateGlobalizationPipe } from '../../../../shared/pipes/date-globalization-pipe';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { inject } from '@angular/core';
import { EventsApi } from '../../services/event-api';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events-list',
  imports:[CommonModule, DateGlobalizationPipe, FormsModule, NgxPaginationModule, RouterLink],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit{
  private _eventServiceSubscription: Subscription;
  private eventsApi = inject(EventsApi);
  protected title:string="Welcome to Bajaj Finserv Events List!";
  protected subtitle:string="Published by Bajaj Finserv HR Department";
  protected columns:string[]=["Event Code", "Event Name", "Description", "Start Date", "End Date", "Fees","Show Details","Cancel Event"];
  protected events:Event[]= [];
  protected filteredEvents:Event[];
  protected searchChars:string="";
  protected childSubTitle:string="Details of selected event.";
  //protected selectedEvent:Event;
  protected selectedEventId: number;
  protected childMessage:string;
  protected pageNumber:number=1;
  protected pageSize:number=2;
  private storedPageNumber: number = 1;
  protected isSearching: boolean = false;
  protected role:string|null;

  ngOnInit(): void {
    this.role=localStorage.getItem("role");
    if(this.role==='Employee'){
      this.columns= this.columns.filter(col=>col!=='Cancel Event');
    }
    this._eventServiceSubscription=this.eventsApi.getAllEvents().subscribe({
      next: (eventsData) => {
        console.log(eventsData);
        this.events = eventsData;
        this.filteredEvents = [...this.events];
    },
      error: err =>{
        console.log(err);
      }
    })

  }

  protected handleChildMessage(message:string):void{
    this.childMessage=message;
  }
  protected onEventSelection(id:number):void{
    this.selectedEventId=id;
  }
  
  get currentPage(): number { return this.pageNumber; }

  protected onPageChange(page: number) {
    this.pageNumber = page;
    if (!this.isSearching) {
      this.storedPageNumber = page;
    }
  }
  
  protected searchEvents(): void {
    this.searchChars = this.searchChars.trim();
    const hasSearch = !!this.searchChars;
    this.isSearching = hasSearch;

    if (hasSearch) {
      this.pageNumber = 1;
      this.filteredEvents = this.events.filter(event => event.eventName.toLocaleLowerCase().includes(this.searchChars.toLocaleLowerCase()));
    } else {
      this.filteredEvents = this.events;
      this.pageNumber = this.storedPageNumber; 
    }
  }
  ngOnDestroy(): void {
    if(this._eventServiceSubscription){
      this._eventServiceSubscription.unsubscribe();
    }
  }
}
