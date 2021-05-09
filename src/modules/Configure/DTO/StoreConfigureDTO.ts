export default interface IStoreConfigureDTO {
    project_id: string,
    config: {
        description: string,
        request: IConfigureRequest,
        response: IConfigureResponse
    }
}


interface IConfigureRequest {
    loop : string | null,
    destination_url: string,
    destination_path: string | null
    method: string,
    transform: string,
    log_before_modify: Object,
    log_after_modify: Object,
    adds: {
        header: Object,
        body: Object
        query: Object,
    },
    modifies: {
        header: Object,
        body: Object
        query: Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
        query: Array<string>
    }

}

interface IConfigureResponse {
    status_code: number,
    transform: string,
    log_before_modify: Object,
    log_after_modify: Object,
    adds: {
        header: Object,
        body: Object
        query: Object,
    },
    modifies: {
        header: Object,
        body: Object
        query: Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
        query: Array<string>
    }

}