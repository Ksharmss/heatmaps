
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { EventData, EventDataService } from '../event-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface TimeSlot {
  time: string;
  frequency: number;
}
@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent implements OnInit, OnChanges {
  @Input() data: EventData[] = [];
  processedData: TimeSlot[][] = [];

  constructor(private eventDataService: EventDataService) {}

  ngOnInit() {
    this.processData();
    this.eventDataService.eventData$.subscribe(newData => {
      this.data = [...this.data, ...newData];
      this.processData();
    });
  }

  ngOnChanges() {
    this.processData();
  }

  processData() {
    const timeSlotMap = new Map<string, number>();
    this.data.forEach(event => {
      const timeSlot = this.getTimeSlot(event.timestamp);
      const frequency = timeSlotMap.get(timeSlot) || 0;
      timeSlotMap.set(timeSlot, frequency + event.intensity);
    });

    this.processedData = this.mapToGrid(timeSlotMap);
  }

  getTimeSlot(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 13); // Example: '2024-07-24T12'
  }

  mapToGrid(timeSlotMap: Map<string, number>): TimeSlot[][] {
    const grid: TimeSlot[][] = [];
    const grouped = new Map<string, TimeSlot[]>();

    timeSlotMap.forEach((frequency, time) => {
      const day = time.slice(0, 10); // Extract the date part (e.g., '2024-07-24')
      if (!grouped.has(day)) {
        grouped.set(day, []);
      }
      grouped.get(day)?.push({ time, frequency });
    });

    grouped.forEach((slots, day) => {
      grid.push(slots);
    });

    return grid;
  }

  getColor(frequency: number): string {
    const ratio = frequency / 100; // Assuming 100 is max frequency
    return `rgba(255, 0, 0, ${ratio})`;
  }
}
