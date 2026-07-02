import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TourLogResponse } from '../../api/models/tour-log-response';
import { RatingDisplayComponent } from '../rating-display/rating-display.component';
import { DifficultyIndicatorComponent } from '../difficulty-display/difficulty-display.component';

@Component({
  selector: 'app-tour-log-card',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RatingDisplayComponent, DifficultyIndicatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tour-log-card.component.html',
})
export class TourLogCardComponent {
  log = input.required<TourLogResponse>();

  edit = output<TourLogResponse>();
  delete = output<TourLogResponse>();

  onEdit() {
    this.edit.emit(this.log());
  }

  onDelete() {
    this.delete.emit(this.log());
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }
}
