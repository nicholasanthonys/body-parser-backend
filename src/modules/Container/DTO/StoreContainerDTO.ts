export interface IStoreContainerDTO {
    name : string,
    description : string,
    project_ids : Array<string>,
    routers : Array<IRouterDTO>
}

interface IRouterDTO {
    path : string,
    type : string,
    method : string,
    project_id : string
}
