export interface DashboardStatistic {
    icon: string;
    label: string;
    value: string | number;
}

export interface TourOverview {
    id: string;
    title: string;
    imageUrl: string;
    location: string;
    type: string;
    comment: string;
    distance: string;
    date: string;
    dificulty: string;
    time: string;
    rating: number;
}