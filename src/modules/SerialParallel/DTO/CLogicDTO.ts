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


