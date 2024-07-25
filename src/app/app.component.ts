import { Component, OnInit } from '@angular/core';
import { EventDataService, EventData } from './event-data.service';
import { RouterOutlet } from '@angular/router';
import { HeatmapComponent } from './heatmap/heatmap.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeatmapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  data: EventData[] = [];

  constructor(private eventDataService: EventDataService) {}

  ngOnInit() {
    this.data = this.generateInitialData();
    this.eventDataService.addEventData(this.data);

    setInterval(() => {
      const newEvent = this.generateRandomEvent();
      this.eventDataService.addEventData([newEvent]);
    }, 5000);
  }

  generateInitialData(): EventData[] {
    const initialData: EventData[] = [];
    const startTime = new Date('2024-07-24T00:00:00').getTime();
    const endTime = new Date('2024-07-25T00:00:00').getTime();

    for (let time = startTime; time < endTime; time += 3600000) {
      initialData.push({ timestamp: new Date(time).toISOString(), intensity: Math.floor(Math.random() * 100) });
    }

    return initialData;
  }

  generateRandomEvent(): EventData {
    const randomTime = new Date(new Date().getTime() - Math.floor(Math.random() * 3600000)).toISOString();
    const randomIntensity = Math.floor(Math.random() * 100);
    return { timestamp: randomTime, intensity: randomIntensity };
  }
}

