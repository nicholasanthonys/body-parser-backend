import { IProject, Project } from "src/modules/Project/Project";
import { Config, Configure, IConfig, IConfigure } from "../Configure";
import IStoreConfigureDTO from "../DTO/StoreConfigureDTO";
import IUpdateConfigureDTO from "../DTO/UpdateConfigureDTO";

export default class ConfigureController {

    async store(storeConfigureDTO: IStoreConfigureDTO, userId: string): Promise<IConfig| null> {
        const project = await Project.findOne({ _id: storeConfigureDTO.project_id, userId }) as IProject;
        // const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        // project.configures.confi
        if (project) {
            const newConfig = new Config({
                description : storeConfigureDTO.config.description,
                request: storeConfigureDTO.config.request,
                response: storeConfigureDTO.config.response
            })
            project.configures.configs.push(newConfig);
        
            await project.save();
            return newConfig
        }
        return null

    }

    //* Get configures by project ids
    async getAll(projectId: string, userId: string): Promise<IConfigure | null> {

        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            return project.configures
        }
        return null

    }

    async show(projectId: string, configureId: string, userId: string): Promise<IConfig | null> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject
        if (project) {
            let index = project.configures.configs.findIndex((element) => element._id == configureId);
            if (index >= 0) {
                return project.configures.configs[index];
            }
        }
        return null
    }

    async update(updateProjectDTO: IUpdateConfigureDTO, configureId: string, userId: string): Promise<IConfig| null> {
        const project = await Project.findOne({ _id: updateProjectDTO.project_id, userId }) as IProject
        if (project) {
            let index = project.configures.configs.findIndex((element) => element._id == configureId);
            if (index >= 0) {
                project.configures.configs[index].description = updateProjectDTO.config.description
                project.configures.configs[index].request.loop= updateProjectDTO.config.request.loop

                project.configures.configs[index].request.destination_url = updateProjectDTO.config.request.destination_url
                project.configures.configs[index].request.destination_path = updateProjectDTO.config.request.destination_path
                project.configures.configs[index].request.method = updateProjectDTO.config.request.method

                project.configures.configs[index].request.transform = updateProjectDTO.config.request.transform
                project.configures.configs[index].request.log_before_modify = updateProjectDTO.config.request.log_before_modify
                project.configures.configs[index].request.log_after_modify = updateProjectDTO.config.request.log_after_modify

                project.configures.configs[index].request.adds.header = updateProjectDTO.config.request.adds.header
                project.configures.configs[index].request.adds.body = updateProjectDTO.config.request.adds.body
                project.configures.configs[index].request.adds.query = updateProjectDTO.config.request.adds.query

                project.configures.configs[index].request.modifies.header = updateProjectDTO.config.request.modifies.header
                project.configures.configs[index].request.modifies.body = updateProjectDTO.config.request.modifies.body
                project.configures.configs[index].request.modifies.query = updateProjectDTO.config.request.modifies.query

                project.configures.configs[index].request.deletes.header = updateProjectDTO.config.request.deletes.header
                project.configures.configs[index].request.deletes.body = updateProjectDTO.config.request.deletes.body
                project.configures.configs[index].request.deletes.query = updateProjectDTO.config.request.deletes.query


                project.configures.configs[index].response.status_code= updateProjectDTO.config.response.status_code

                project.configures.configs[index].response.transform = updateProjectDTO.config.response.transform
                project.configures.configs[index].response.log_before_modify = updateProjectDTO.config.response.log_before_modify
                project.configures.configs[index].response.log_after_modify = updateProjectDTO.config.response.log_after_modify

                project.configures.configs[index].response.adds.header = updateProjectDTO.config.response.adds.header
                project.configures.configs[index].response.adds.body = updateProjectDTO.config.response.adds.body

                project.configures.configs[index].response.modifies.header = updateProjectDTO.config.response.modifies.header
                project.configures.configs[index].response.modifies.body = updateProjectDTO.config.response.modifies.body

                project.configures.configs[index].response.deletes.header = updateProjectDTO.config.request.deletes.header
                project.configures.configs[index].response.deletes.body = updateProjectDTO.config.request.deletes.body


                const updatedProject = await project.save();
                return updatedProject.configures.configs[index];
            }
        }
        return null
    }

    async delete(projectId: string, configureId: string, userId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            project.configures.configs = project.configures.configs.filter((element) => element._id != configureId)
            await project.save();
            return true
        }
        return false;
    }
}