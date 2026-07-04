import { Component, inject, signal, computed } from '@angular/core';
import { TourStateService } from '../../services/tour-state.service';
import { ImportExportService } from '../../services/import-export.service';

@Component({
  selector: 'app-import-export',
  standalone: true,
  templateUrl: './import-export.component.html'
})
export class ImportExportComponent {
  tourState = inject(TourStateService);
  private importExportFacade = inject(ImportExportService);

  tours = this.tourState.tours; 
  
  selectedTourIds = signal<Set<number>>(new Set());
  isExporting = signal(false);
  isImporting = signal(false);

  hasSelection = computed(() => this.selectedTourIds().size > 0);

  toggleTourSelection(tourId: number) {
    const currentSet = new Set(this.selectedTourIds());
    if (currentSet.has(tourId)) {
      currentSet.delete(tourId);
    } else {
      currentSet.add(tourId);
    }
    this.selectedTourIds.set(currentSet);
  }

  exportSelectedTours() {
    if (!this.hasSelection()) return;
    
    this.isExporting.set(true);
    const idsToExport = Array.from(this.selectedTourIds());

    this.importExportFacade.exportTours(idsToExport).subscribe({
      next: (exportData) => {
        this.importExportFacade.downloadJsonFile(exportData);
        this.isExporting.set(false);
      },
      error: (err) => {
        console.error('Export failed', err);
        this.isExporting.set(false);
      }
    });
  }

  triggerFileInput() {
    document.getElementById('fileUpload')?.click();
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isImporting.set(true);

    try {
      const importedData = await this.importExportFacade.parseJsonFile(file);

      this.importExportFacade.importTours(importedData).subscribe({
        next: () => {
          alert('Import successful!');
          this.tourState.loadTours();
          this.isImporting.set(false);
        },
        error: (err) => {
          console.error('Import failed', err);
          alert('Failed to import tours to database.');
          this.isImporting.set(false);
        }
      });
    } catch (error: any) {
      alert(error.message);
      this.isImporting.set(false);
    }
    
    event.target.value = '';
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }
}