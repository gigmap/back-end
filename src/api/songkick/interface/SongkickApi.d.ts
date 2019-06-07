import {Artist, Concert} from "./Models";

export default interface SongkickApi {
    listArtists(username: string): Promise<Array<Artist> | null>;

    countArtists(username: string): Promise<number>;

    listConcerts(artistsId: number, from?: Date, to?: Date): Promise<Array<Concert>>;
}