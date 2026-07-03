import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { apiSearchGet$Json } from '../api/fn/search/api-search-get-json';
import { ApiConfiguration } from '../api/api-configuration';
import { SearchResult } from '../api/models/search-result';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  search(term: string, type: string): Observable<SearchResult> {
    const completeResponse = apiSearchGet$Json(this.http, this.config.rootUrl, { term, type });
    const response: Observable<SearchResult> = completeResponse.pipe(
      map((res) => res.body as SearchResult)
    );
    return response;
  }
}