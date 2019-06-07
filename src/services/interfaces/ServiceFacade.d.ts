import SongkickApi from "../../api/songkick/interface/SongkickApi";

export interface IServiceFacade {
    getSongkickApi(): SongkickApi;
}