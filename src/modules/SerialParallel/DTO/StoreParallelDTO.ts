import { IStoreSingleCLogicItemDTO } from "./CLogicDTO";
import { IResponseDTO } from "./StoreResponseDTO";

export interface IStoreParallelDTO {
    configures: Array<configureFileParallelDTO>
    failure_response: IResponseDTO,
    c_logics: Array<IStoreSingleCLogicItemDTO>
}

export interface IStoreSingleConfigParallelDTO {
    configure_id : string,
    alias : string,
    loop : string | null,
}


interface configureFileParallelDTO {
    configure_id: string,
    alias: string,
    loop : string | null
}


