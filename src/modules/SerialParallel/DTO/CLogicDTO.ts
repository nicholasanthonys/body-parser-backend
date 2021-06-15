import { IResponseDTO } from "./StoreResponseDTO";

export interface IStoreSingleCLogicItemDTO {
    rule: Object,
    data: Object,
    next_success: string | null,
    response:IResponseDTO ,
    next_failure: string | null,
    failure_response:IResponseDTO 
}

export interface IUpdateSingleCLogicItemDTO {
    id : string ,
    rule: Object,
    data: Object,
    next_success: string | null,
    response:IResponseDTO ,
    next_failure: string | null,
    failure_response:IResponseDTO 
}


export interface IStoreRequestSingleCLogicItemDTO {
    project_id : string
    c_logic : IStoreSingleCLogicItemDTO
}

export interface IUpdateConfigureSingleCLogicItemDTO {
    project_id : string
    c_logic : IUpdateSingleCLogicItemDTO
}

export interface IDeleteConfigureSingleCLogicItemDTO {
    project_id : string
    id : string
}
