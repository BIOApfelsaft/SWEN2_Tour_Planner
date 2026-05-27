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
    comment?: string;
    distance: string;
    date: string;
    difficulty: string;
    childfriendly: boolean;
    time: string;
    rating: number;
    popularity: number;
}