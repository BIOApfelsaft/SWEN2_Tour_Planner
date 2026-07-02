import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapFacadeService {
  private maps = new Map<string, L.Map>();
  private routeLayers = new Map<string, L.GeoJSON>();

  initMap(containerId: string): void {
    this.destroyMap(containerId);

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Map container '${containerId}' not found in DOM.`);
      return; 
    }

    const map = L.map(containerId, {
      zoomControl: false 
    }).setView([47.5162, 14.5501], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    this.maps.set(containerId, map);
  }

  drawRoute(mapId: string, geoJsonString: string | null | undefined) {
    if (!geoJsonString) return;
    
    const map = this.maps.get(mapId);
    if (!map) {
      console.warn(`Cannot draw route: Map with ID '${mapId}' not found.`);
      return;
    }

    try {
      this.clearRoute(mapId);

      const geoJsonData = JSON.parse(geoJsonString);

      const routeLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#0a58ca',
          weight: 5,
          opacity: 0.8
        }
      }).addTo(map);

      this.routeLayers.set(mapId, routeLayer);

      map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });
      
    } catch (error) {
      console.error('Could not parse GeoJSON', error);
    }
  }

  clearRoute(mapId: string): void {
    const routeLayer = this.routeLayers.get(mapId);
    const map = this.maps.get(mapId);

    if (routeLayer && map) {
      try {
        routeLayer.remove();
      } catch (e) {
        console.error(`Error removing route layer for map '${mapId}'`, e);
      }
      this.routeLayers.delete(mapId);
    }
  }

  destroyMap(mapId: string): void {
    this.clearRoute(mapId);

    const map = this.maps.get(mapId);
    if (map) {
      try {
        map.off();
        map.remove();
      } catch (e) {
        console.info(`Leaflet map '${mapId}' safely disposed after DOM removal.`);
      } finally {
        this.maps.delete(mapId);
      }
    }
  }
}