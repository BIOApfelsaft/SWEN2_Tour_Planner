import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapFacadeService {
  private map: L.Map | null = null;
  private routeLayer: L.GeoJSON | null = null;

  initMap(containerId: string): void {
    if (this.map) {
      this.map.remove();
    }

    // Init map with a default view (Zermatt, Switzerland)
    this.map = L.map(containerId, {
      zoomControl: false,
    }).setView([46.0207, 7.7491], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);
  }

  drawMockRoute(): void {
    if (!this.map) return;

    // Mock GeoJSON data representing a route (LineString) from Zermatt to some nearby points
    const mockGeoJson: any = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [7.7491, 46.0207], // Zermatt
          [7.7700, 46.0000],
          [7.8000, 45.9800],
          [7.8500, 45.9500]
        ]
      }
    };

    if (this.routeLayer) {
      this.routeLayer.remove();
    }

    this.routeLayer = L.geoJSON(mockGeoJson, {
      style: {
        color: '#ba1a1a',
        weight: 5,
        opacity: 0.8
      }
    }).addTo(this.map);

    // Zoom map to fit the route
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
  }

  destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  clearRoute(): void {
    if (this.routeLayer) {
      this.routeLayer.remove();
      this.routeLayer = null;
    }
  }
}