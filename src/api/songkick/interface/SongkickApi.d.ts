export default interface SongkickApi {
    listArtists(username: string): Promise<Array<object>>;

    countArtists(username: string): Promise<number>;

    listConcerts(artistsId: number, from: Date, to: Date): Promise<Array<object>>;
}