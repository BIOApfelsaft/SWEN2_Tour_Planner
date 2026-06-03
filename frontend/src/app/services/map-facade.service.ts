import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapFacadeService {
  private map: L.Map | null = null;
  private routeLayer: L.GeoJSON | null = null;

  // Mockdata
  initMap(containerId: string): void {
    this.destroyMap();

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Map container '${containerId}' not found in DOM.`);
      return; 
    }

    this.map = L.map(containerId, {
      zoomControl: false 
    }).setView([46.0207, 7.7491], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);
  }

  drawMockRoute(): void {
    if (!this.map) return;

    this.clearRoute();

    const mockGeoJson: any = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [7.7491, 46.0207], 
          [7.7700, 46.0000],
          [7.8000, 45.9800],
          [7.8500, 45.9500]
        ]
      }
    };

    try {
      this.routeLayer = L.geoJSON(mockGeoJson, {
        style: { color: '#ba1a1a', weight: 5, opacity: 0.8 }
      }).addTo(this.map);

      this.map.fitBounds(this.routeLayer.getBounds(), { 
        padding: [50, 50],
      });
    } catch (e) {
      console.warn('Error drawing route on map', e);
    }
  }

  clearRoute(): void {
    if (this.routeLayer && this.map) {
      try {
        this.routeLayer.remove();
      } catch (e) {
      }
      this.routeLayer = null;
    }
  }

  destroyMap(): void {
    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
      } catch (e) {
        console.info('Leaflet map safely disposed after DOM removal.');
      } finally {
        this.map = null;
        this.routeLayer = null;
      }
    }
  }
}