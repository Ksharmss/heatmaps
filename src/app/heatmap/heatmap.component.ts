
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
  processedData: { month: string, days: TimeSlot[] }[] = [];

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
    return timestamp.slice(0, 10); // Extract 'YYYY-MM-DD' for day-based grouping
  }

  mapToGrid(timeSlotMap: Map<string, number>): { month: string, days: TimeSlot[] }[] {
    const groupedByMonth = new Map<string, TimeSlot[]>();

    timeSlotMap.forEach((frequency, time) => {
      const month = time.slice(0, 7); // Extract 'YYYY-MM' for month grouping
      const day = time.slice(8, 10); // Extract 'DD' for day part

      if (!groupedByMonth.has(month)) {
        groupedByMonth.set(month, []);
      }

      groupedByMonth.get(month)?.push({ time, frequency });
    });

    // Convert map to an array
    const result = Array.from(groupedByMonth.entries()).map(([month, days]) => ({
      month,
      days: days.sort((a, b) => a.time.localeCompare(b.time)) // Sort days within each month
    }));

    return result;
  }

  getColor(frequency: number): string {
    const maxFrequency = 100; // Assuming a maximum frequency for scale
    const ratio = frequency / maxFrequency;
    return `rgba(255, 0, 0, ${ratio})`;
  }
}
