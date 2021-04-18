interface IRouterDTO {
    path : string,
    type : string,
    method : string,
    project_id : string
}

export interface IUpdateContainerDTO {
    id : string,
    name : string,
    description : string,
    project_ids : Array<string>,
    routers : Array<IRouterDTO>
}