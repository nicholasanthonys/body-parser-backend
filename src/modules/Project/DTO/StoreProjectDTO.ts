export default interface IStoreProjectDTO {
    name: string,
    description: string,
    base : IBaseDTO
}

interface IBaseDTO {
    project_max_circular: number,
    circular_response: ICircularResponseDTO
}

interface ICircularResponseDTO {
    status_code: number,
    log_before_modify: string | null,
    log_after_modify: string | null,
    transform: string,
    adds: {
        header : Object,
        body: Object
    },
    modifies: {
        header : Object,
        body: Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
    }
}