import { IProject, Project } from "../Project/Project";

export default class CLogicController{

    async deleteCLogicParallel(projectId : string, userId : string ,cLogicId : string) : Promise<boolean> {
        console.log("cLogicId is")
    console.log(cLogicId)
        const project = await Project.findOne({_id : projectId, userId}) as IProject;
        if(project){
            project.parallel.c_logics = project.parallel.c_logics.filter(c => c._id != cLogicId)
            await project.save()
            return true;
        }
        return false;
    }

}