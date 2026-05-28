export interface Tour {
  id: number;
  userId: number;
  title: string;
  description?: string;
  startLocation: string;
  endLocation: string;
  transportType: string;
  distance: number; // in kilometers
  estimatedTime: number; // in seconds
  mapImagePath?: string;
  routeGeoJson?: any; 
  computedPopularityScore: number;
  computedChildFriendlyScore: number;
  createdAt: string;
  updatedAt: string;
}