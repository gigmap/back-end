import {
    ConcertLocation
} from "../../../../api/songkick/interface/Models";

export interface MappedLocation extends ConcertLocation {
    country: string;
}

export interface MappedConcert {
    id: number;
    displayName: string;
    uri: string;
    start: string;
    location: MappedLocation;
    members: MappedArtist[];
    interested?: boolean;
    going?: boolean;
    postponed?: boolean;
    isFestival?: boolean;
}

export interface MappedArtist {
    id: string;
    displayName: string;
}