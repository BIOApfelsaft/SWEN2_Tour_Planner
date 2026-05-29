import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TourLog } from '../../models/tour-log.model';

@Component({
  selector: 'app-tour-log-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tour-log-card.component.html',
})
export class TourLogCardComponent {
  log = input.required<TourLog>();
  
  edit = output<TourLog>();
  delete = output<TourLog>();

  onEdit() {
    this.edit.emit(this.log());
  }

  onDelete() {
    this.delete.emit(this.log());
  }
}