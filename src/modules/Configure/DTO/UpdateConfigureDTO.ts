
export default interface IUpdateConfigureDTO {
    project_id : string,
    description : string,
    config : {
        id : string,
        request : IConfigureRequest,
        response : IConfigureResponse
    }
}


interface IConfigureRequest {
    destination_url: string,
    destination_path: string | null
    method: string,
    transform: string,
    log_before_modify:string | null ,
    log_after_modify:  string | null,
    adds: {
        header : Object,
        body: Object
        query : Object,
    },
    modifies: {
        header : Object,
        body: Object
        query : Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
        query: Array<string>
    }

}

interface IConfigureResponse {
    status_code : number,
    transform: string,
    log_before_modify:string | null ,
    log_after_modify:  string | null,
    adds: {
        header : Object,
        body: Object
        query : Object,
    },
    modifies: {
        header : Object,
        body: Object
        query : Object
    },
    deletes: {
        header: Array<string>,
        body: Array<string>,
        query: Array<string>
    }

}