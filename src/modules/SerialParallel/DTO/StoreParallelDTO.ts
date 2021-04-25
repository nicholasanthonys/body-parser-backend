import { IStoreSingleCLogicItemDTO } from "./CLogicDTO";
import { IResponseDTO } from "./StoreResponseDTO";

export interface IStoreParallelDTO {
    configures: Array<configureFileParallelDTO>
    next_failure: IResponseDTO,
    c_logics: Array<IStoreSingleCLogicItemDTO>
}

export interface IStoreSingleConfigParallelDTO {
    configure_id : string,
    alias : string
}


interface configureFileParallelDTO {
    configure_id: string,
    alias: string,
}


