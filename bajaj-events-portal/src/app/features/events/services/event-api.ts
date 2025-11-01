import { Injectable, inject } from '@angular/core';
import { Event } from '../models/event';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CudResponse } from '../../../shared/models/cud-response';
@Injectable({
  providedIn: 'root'
})
export class EventsApi {
  private _baseUrl:string='http://192.168.1.11:9090/api';
  private _httpClient = inject(HttpClient);    
  public getAllEvents():Observable<Event[]>{
    return this._httpClient.get<Event[]>(`${this._baseUrl}/events`);
  }
  public getEventDetails(eventId: number):Observable<Event>{
    return this._httpClient.get<Event>(`${this._baseUrl}/events/${eventId}`);
  }
  public scheduleNewEvent(event: Event): Observable<CudResponse> {
    return this._httpClient.post<CudResponse>(`${this._baseUrl}/events`, event);
  }
}
