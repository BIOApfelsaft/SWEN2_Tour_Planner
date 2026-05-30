import { Component, signal, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MapFacadeService } from '../../services/map-facade.service';
import { OpenRouteFacadeService } from '../../services/open-route-facade.service';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { TransportTypeSelectorComponent } from '../../components/transport-type-selector/transport-type-selector';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tour-planner',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, WeatherWidgetComponent, TransportTypeSelectorComponent, DecimalPipe],
  templateUrl: './tour-planner.component.html'
})
export class TourPlannerComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private mapFacade = inject(MapFacadeService);
  private openRouteFacade = inject(OpenRouteFacadeService);

  plannerForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    startLocation: ['', Validators.required],
    endLocation: ['', Validators.required],
    transportType: ['Hiking', Validators.required]
  });

  distance = signal<number>(0);
  estimatedTime = signal<number>(0); // in seconds
  isCalculating = signal<boolean>(false);

  startLocationSignal = signal<string>('');

  constructor() {
    effect(() => {
      setTimeout(() => {
        this.mapFacade.initMap('planner-map-container');
      }, 0);
    });
  }

  ngOnInit() {
    this.plannerForm.get('startLocation')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.startLocationSignal.set(value || '');
      this.triggerRouteCalculation();
    });

    this.plannerForm.get('endLocation')?.valueChanges.pipe(debounceTime(500)).subscribe(() => this.triggerRouteCalculation());
    this.plannerForm.get('transportType')?.valueChanges.subscribe(() => this.triggerRouteCalculation());
  }

  onTransportTypeChange(type: string) {
    this.plannerForm.patchValue({ transportType: type });
  }

  private triggerRouteCalculation() {
    const start = this.plannerForm.get('startLocation')?.value;
    const end = this.plannerForm.get('endLocation')?.value;
    const transportType = this.plannerForm.get('transportType')?.value;

    if (start && end && transportType) {
      this.isCalculating.set(true);
      
      this.openRouteFacade.calculateRoute(start, end, transportType).subscribe({
        next: (result) => {
          this.distance.set(result.distance);
          this.estimatedTime.set(result.estimatedTime);
          this.mapFacade.drawMockRoute(); 
          this.isCalculating.set(false);
        }
      });
    }
  }

  clearRoute() {
    this.plannerForm.reset({ transportType: 'Hiking' });
    this.distance.set(0);
    this.estimatedTime.set(0);
    this.startLocationSignal.set('');
    this.mapFacade.clearRoute();
  }

  saveTour() {
    if (this.plannerForm.valid) {
      const formValues = this.plannerForm.value;
      const newTourData = {
        ...formValues,
        distance: this.distance(),
        estimatedTime: this.estimatedTime()
      };
      console.log('Saving Tour...', newTourData);
    } else {
      this.plannerForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.mapFacade.destroyMap();
  }
}