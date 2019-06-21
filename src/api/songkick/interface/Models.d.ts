export interface Artist {
    id: number;
    displayName: string;
}

export interface ConcertTime {
    date: string;
    time: string;
    datetime: string;
}

export interface ConcertLocation {
    lat: number;
    lng: number;
    city: string;
}

export interface ConcertPerformance {
    artist: Artist;
}

export interface ConcertVenue {
    metroArea: {
        displayName: string,
        country: {
            displayName: string
        }
    },
    lat: number,
    lng: number
}

export interface Concert {
    id: number;
    displayName: string;
    uri: string;
    start: ConcertTime;
    location: ConcertLocation;
    performance: ConcertPerformance[];
    venue: ConcertVenue;
}