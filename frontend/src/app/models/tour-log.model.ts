export interface TourLog {
  id: number;
  tourId: number;
  logDateTime: string;
  comment?: string;
  difficulty: number; // 1-5
  totalDistance: number;
  totalTime: number; // in seconds
  rating: number; // 1-5
  weatherCondition?: string;
  temperature?: number;
  createdAt: string;
  updatedAt: string;
}