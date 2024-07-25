import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface EventData {
  timestamp: string;
  intensity: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  private eventDataSubject = new Subject<EventData[]>();
  eventData$ = this.eventDataSubject.asObservable();

  addEventData(newData: EventData[]) {
    this.eventDataSubject.next(newData);
  }

  generateInitialData() {
    const data: EventData[] = [];
    const startDate = new Date('2024-07-20T00:00:00');
    for (let i = 0; i < 500; i++) {
      const date = new Date(startDate);
      date.setMinutes(date.getMinutes() + i * 10);
      data.push({
        timestamp: date.toISOString(),
        intensity: Math.floor(Math.random() * 10)
      });
    }
    this.addEventData(data);
  }
}
