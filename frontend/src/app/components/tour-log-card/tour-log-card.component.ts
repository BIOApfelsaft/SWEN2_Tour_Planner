import { Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TourLog } from '../../models/tour-log.model';
import { RatingDisplayComponent } from '../rating-display/rating-display.component';
import { DifficultyIndicatorComponent } from '../difficulty-display/difficulty-display.component';

@Component({
  selector: 'app-tour-log-card',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RatingDisplayComponent, DifficultyIndicatorComponent],
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