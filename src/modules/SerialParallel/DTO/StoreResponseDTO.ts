export interface IResponseDTO {
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
