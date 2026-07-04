import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

import { apiImportExportExportPost$Json } from '../api/fn/import-export/api-import-export-export-post-json';
import { apiImportExportImportPost } from '../api/fn/import-export/api-import-export-import-post';
import { TourExport } from '../api/models/tour-export';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  exportTours(tourIds: number[]): Observable<TourExport[]> {
    return apiImportExportExportPost$Json(this.http, this.config.rootUrl, { body: tourIds })
      .pipe(map((response) => response.body as TourExport[]));
  }

  importTours(tours: TourExport[]): Observable<any> {
    return apiImportExportImportPost(this.http, this.config.rootUrl, { body: tours });
  }

  downloadJsonFile(data: TourExport[]) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  }

  parseJsonFile(file: File): Promise<TourExport[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonContent = e.target?.result as string;
          const parsedData = JSON.parse(jsonContent);
          resolve(parsedData);
        } catch (error) {
          reject(new Error('Invalid JSON file format.'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }
}