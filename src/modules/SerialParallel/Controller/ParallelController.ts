
import ProjectController from 'src/modules/Project/Controller/ProjectController'
import { IProject, Project } from 'src/modules/Project/Project';
import { ConfigureFileSerial } from 'src/modules/SerialParallel/ConfigureFileSerial'
import { CLogic } from 'src/modules/SerialParallel/CLogic'
import { IStoreParallelDTO} from '../DTO/StoreParallelDTO'
import {IStoreSerialDTO } from '../DTO/StoreSerialDTO'
import { IParallel, Parallel } from '../Parallel';
import { ISerial, Serial } from '../Serial';
export default class ParallelController {

    projectController: ProjectController = new ProjectController()

    async storeParallel(storeParallelDTO: IStoreParallelDTO, projectId: string, userId: string): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }
        project.parallel = new Parallel({
            configures: storeParallelDTO.configures,
            next_failure: storeParallelDTO.next_failure,
            c_logics: storeParallelDTO.c_logics
        })
        await project.save();
        return project.parallel
    }


    async getParallel(projectId: string, userId: string ): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null
        }
        return project.parallel
    }

    async updateParallel(storeParallelDTO: IStoreParallelDTO, projectId: string, userId: string): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }

        if (project.parallel != null) {
            project.parallel.configures = [];
            storeParallelDTO.configures.forEach(element => {
                let configureFile = new ConfigureFileSerial({
                    configure_id : element.configure_id,
                    alias: element.alias
                })
                project.parallel?.configures.push(configureFile)
            })

            project.parallel.next_failure.status_code = storeParallelDTO.next_failure.status_code
            project.parallel.next_failure.transform = storeParallelDTO.next_failure.transform


            project.parallel.next_failure.adds.header = storeParallelDTO.next_failure.adds.header
            project.parallel.next_failure.adds.body = storeParallelDTO.next_failure.adds.body

            project.parallel.next_failure.modifies.header = storeParallelDTO.next_failure.modifies.header
            project.parallel.next_failure.modifies.body = storeParallelDTO.next_failure.modifies.body

            project.parallel.c_logics = [];
            storeParallelDTO.c_logics.forEach(element => {
                let cLogicItem = new CLogic({
                    rule: element.rule,
                    data: element.data,
                    next_success: element.next_success,
                    response: element.response
                })
                project.parallel?.c_logics.push(cLogicItem)
            })

            let updatedProject = await project.save();
            return updatedProject.parallel
        }
        return null;
    }

    async deleteParallel(projectId: string, userId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            project.parallel = null;
            await project.save();
            return true
        }
        return false
    }

}