export interface IStoreSerialorParallelDTO {
    configures: Array<configureFileDTO>
    next_failure: IResponseDTO,
    c_logics: Array<CLogicItemDTO>
}


interface configureFileDTO {
    file_name: string,
    alias: string,
}

interface CLogicItemDTO {
    rule: Object,
    data: Object,
    next_success: string | null,
    response: IResponseDTO
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
