import {Artist, Concert} from "./Models";

export default interface SongkickApi {
    listArtists(username: string): Promise<Artist[] | null>;

    countArtists(username: string): Promise<number | null>;

    listConcerts(artistsId: number, from?: string, to?: string): Promise<Array<Concert>>;

    findArtist(name: string): Promise<Artist | null>
}