import { IProject, Project } from "../Project/Project";

export default class ConfigureFileController{

    async deleteConfigureFileParallel(projectId : string, userId : string ,configureFileId : string) : Promise<boolean> {
        const project = await Project.findOne({_id : projectId, userId}) as IProject;
        if(project){
            project.parallel.configures= project.parallel.configures.filter(c => c._id != configureFileId)
            await project.save()
            return true;
        }
        return false;
    }

}