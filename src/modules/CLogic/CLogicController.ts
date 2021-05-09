import { IProject, Project } from "../Project/Project";

export default class CLogicController {

    async deleteCLogicParallel(projectId: string, userId: string, cLogicId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            project.parallel.c_logics = project.parallel.c_logics.filter(c => c._id != cLogicId)
            await project.save()
            return true;
        }
        return false;
    }

    async deleteCLogicSerial(projectId: string, userId: string, configId : string, cLogicId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            let configIndex = project.serial.configures.findIndex(config => config._id == configId)
            if (configIndex >= 0) {
                project.serial.configures[configIndex].c_logics = project.serial.configures[configIndex].c_logics.filter(c => c._id != cLogicId);
            }
            await project.save()
            return true;
        }
        return false;
    }

}