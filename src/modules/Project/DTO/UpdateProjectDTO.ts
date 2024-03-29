export default interface IUpdateProjectDTO {
    id: string
    name: string,
    description: string,
    base : IbaseDTO

}

interface IbaseDTO {
    project_max_circular: number,
    circular_response: ICircularResponseDTO
}

interface ICircularResponseDTO {
    status_code: number,
    log_before_modify: Object ,
    log_after_modify:Object ,
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