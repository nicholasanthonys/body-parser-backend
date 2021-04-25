import { IStoreSingleCLogicItemDTO } from "./CLogicDTO";

export interface IStoreSerialDTO {
    configures: Array<ISerialConfigDTO>
}


export interface ISerialConfigDTO {
    configure_id: string,
    alias: string,
    next_failure: IResponseDTO,
    c_logics : Array<IStoreSingleCLogicItemDTO>
}


export interface IStoreSingleSerialConfigDTO {
    configure_id: string,
    alias: string,
    next_failure: IResponseDTO,
}
export interface IUpdateSingleConfigureFileSerialDTO {
    id : string,
    configure_id: string,
    alias: string,
    next_failure: IResponseDTO,
}



interface IResponseDTO {
    status_code: number,
    transform: string,
    adds: {
        header: Object,
        body: Object
    },
    modifies: {
        header: Object,
        body: Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
    }
}
