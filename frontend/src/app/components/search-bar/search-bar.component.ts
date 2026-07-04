import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';

import { SearchResult } from '../../api/models/search-result';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  private router = inject(Router);
  private searchService = inject(SearchService);

  searchForm = new FormGroup({
    term: new FormControl(''),
    type: new FormControl('global')
  });

  results = signal<SearchResult | null>(null);
  isSearching = signal(false);

  constructor() {
    this.searchForm.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged((prev, curr) => prev.term === curr.term && prev.type === curr.type),
      switchMap(values => {
        const term = values.term || '';
        const type = values.type || 'global';

        if (term.length < 2) {
          this.results.set(null);
          this.isSearching.set(false);
          return of(null); 
        }

        this.isSearching.set(true);
        return this.searchService.search(term, type);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.results.set(data);
        }
        this.isSearching.set(false);
      },
      error: (err) => {
        console.error('Search failed', err);
        this.isSearching.set(false);
      }
    });
  }

  goToTour(tourId: number | undefined) {
    if (tourId) {
      this.router.navigate(['/tour', tourId]);
      this.searchForm.patchValue({ term: '' }); 
    }
  }

  toNumber(value: any): number | undefined {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }
}