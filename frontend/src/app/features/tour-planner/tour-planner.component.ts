import {
  Component,
  signal,
  effect,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MapFacadeService } from '../../services/map-facade.service';
import { OpenRouteFacadeService } from '../../services/open-route-facade.service';
import { TourService } from '../../services/tour.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { TransportTypeSelectorComponent } from '../../components/transport-type-selector/transport-type-selector.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tour-planner',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    WeatherWidgetComponent,
    TransportTypeSelectorComponent,
    DecimalPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tour-planner.component.html',
})
export class TourPlannerComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mapFacade = inject(MapFacadeService);
  private openRouteFacade = inject(OpenRouteFacadeService);
  private tourService = inject(TourService);

  // Signals
  isEditMode = signal<boolean>(false);
  editTourId = signal<number | null>(null);

  distance = signal<number>(0);
  estimatedTime = signal<number>(0);
  isCalculating = signal<boolean>(false);
  startLocationSignal = signal<string>('');

  // Form
  plannerForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    startLocation: ['', Validators.required],
    endLocation: ['', Validators.required],
    transportType: ['Hiking', Validators.required],
  });

  constructor() {
    effect(() => {
      setTimeout(() => {
        this.mapFacade.initMap('planner-map-container');
      }, 0);
    });
  }

  ngOnInit() {
    // Check if we're in edit mode (URL contains /tour-planner/:id)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.editTourId.set(Number(idParam));
      this.loadTourForEdit(Number(idParam));
    }

    // Watch for changes in start location to trigger route recalculation
    this.plannerForm
      .get('startLocation')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        this.startLocationSignal.set(val || '');
        this.triggerRouteCalculation();
      });

    this.plannerForm
      .get('endLocation')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.triggerRouteCalculation());
    this.plannerForm
      .get('transportType')
      ?.valueChanges.subscribe(() => this.triggerRouteCalculation());
  }

  // Loads existing tour data into the form when in edit mode
  private loadTourForEdit(id: number) {
    this.tourService.getTourById(id).subscribe((tour) => {
      if (tour) {
        this.plannerForm.patchValue({
          title: tour.title,
          description: tour.description,
          startLocation: tour.startLocation,
          endLocation: tour.endLocation,
          transportType: tour.transportType,
        });

        this.distance.set(tour.distance);
        this.estimatedTime.set(tour.estimatedTime);
        this.startLocationSignal.set(tour.startLocation);

        setTimeout(() => this.mapFacade.drawMockRoute(), 500);
      }
    });
  }

  onTransportTypeChange(type: string) {
    this.plannerForm.patchValue({ transportType: type });
  }

  private triggerRouteCalculation() {
    const start = this.plannerForm.get('startLocation')?.value;
    const end = this.plannerForm.get('endLocation')?.value;
    const type = this.plannerForm.get('transportType')?.value;

    if (start && end && type) {
      this.isCalculating.set(true);
      this.openRouteFacade.calculateRoute(start, end, type).subscribe((result) => {
        this.distance.set(result.distance);
        this.estimatedTime.set(result.estimatedTime);
        this.mapFacade.drawMockRoute();
        this.isCalculating.set(false);
      });
    }
  }

  saveTour() {
    if (this.plannerForm.invalid) return;

    this.isCalculating.set(true);
    const formValues = this.plannerForm.value;
    const tourData = {
      title: formValues.title || '',
      description: formValues.description || '',
      startLocation: formValues.startLocation || '',
      endLocation: formValues.endLocation || '',
      transportType: formValues.transportType || 'Hiking',
      distance: this.distance(),
      estimatedTime: this.estimatedTime(),
    };

    if (this.isEditMode() && this.editTourId()) {
      // UPDATE Tour
      this.tourService.updateTour(this.editTourId()!, tourData).subscribe(() => {
        this.isCalculating.set(false);
        this.router.navigate(['/tour', this.editTourId()]);
      });
    } else {
      // CREATE Tour
      this.tourService.createTour(tourData).subscribe((savedTour) => {
        this.isCalculating.set(false);
        this.router.navigate(['/tour', savedTour.id]);
      });
    }
  }

  clearRoute() {
    this.plannerForm.reset({ transportType: 'Hiking' });
    this.distance.set(0);
    this.estimatedTime.set(0);
    this.startLocationSignal.set('');
  }

  ngOnDestroy() {
    this.mapFacade.destroyMap();
  }
}
