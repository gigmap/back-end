import {Artist, Concert} from "./Models";

export default interface SongkickApi {
    listArtists(username: string): Promise<Artist[] | null>;

    countArtists(username: string): Promise<number | null>;

    listConcerts(artistsId: number, from?: Date, to?: Date): Promise<Array<Concert>>;
}