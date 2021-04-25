
import ProjectController from 'src/modules/Project/Controller/ProjectController'
import { IProject, Project } from 'src/modules/Project/Project';
import { ConfigureFileSerial } from 'src/modules/SerialParallel/ConfigureFileSerial'
import { CLogic, ICLogic } from 'src/modules/SerialParallel/CLogic'
import { IStoreParallelDTO, IStoreSingleConfigParallelDTO } from '../DTO/StoreParallelDTO'
import { IParallel, Parallel } from '../Parallel';
import { ConfigureFileParallel, IConfigureFileParallel } from '../ConfigureFileParallel';

import { IUpdateSingleConfigParallelDTO } from '../DTO/UpdateSerialDTO';
import { IStoreSingleCLogicItemDTO, IUpdateSingleCLogicItemDTO } from '../DTO/CLogicDTO'
import { FinalResponse, IFinalResponseConfig } from 'src/modules/Response';
import { IResponseDTO } from '../DTO/StoreResponseDTO';
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

    async storeNextFailure(storeNextFailure: IResponseDTO, projectId: string, userId: string): Promise<IFinalResponseConfig | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }
        if (project.parallel) {
            project.parallel.next_failure = new FinalResponse({
                status_code: storeNextFailure.status_code,
                transform: storeNextFailure.transform,
                adds: storeNextFailure.adds,
                modifies: storeNextFailure.modifies,
                deletes: storeNextFailure.deletes,
            })


            await project.save();
            return project.parallel?.next_failure
        }
        return null;
    }

    async storeSingleConfigParallel(storeSingleConfigParallelDTO: IStoreSingleConfigParallelDTO, projectId: string, userId: string): Promise<IConfigureFileParallel | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }
        project.parallel?.configures.push(new ConfigureFileParallel({
            configure_id: storeSingleConfigParallelDTO.configure_id,
            alias: storeSingleConfigParallelDTO.alias
        }));

        await project.save();
        return project.parallel?.configures[project.parallel.configures.length - 1]
    }

    async storeSingleCLogicParallel(storeSingleCLogicParallelDTO: IStoreSingleCLogicItemDTO, projectId: string, userId: string): Promise<ICLogic | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }
        project.parallel?.c_logics.push(new CLogic({
            rule: storeSingleCLogicParallelDTO.rule,
            data: storeSingleCLogicParallelDTO.data,
            next_success: storeSingleCLogicParallelDTO.next_success,
            response: storeSingleCLogicParallelDTO.response
        }));

        await project.save();
        return project.parallel?.c_logics[project.parallel.c_logics.length - 1]
    }

    async updateSingleConfigParallel(storeSingleConfigParallelDTO: IUpdateSingleConfigParallelDTO, projectId: string, userId: string): Promise<IConfigureFileParallel | null | undefined> {
        let project = await this.projectController.show(projectId, userId);

        if (!project) {
            return null;
        }

        let index = project.parallel?.configures.findIndex(e => e._id == storeSingleConfigParallelDTO.id);
        if (index != undefined && index >= 0) {
            if (project.parallel) {
                project.parallel.configures[index].configure_id = storeSingleConfigParallelDTO.configure_id
                project.parallel.configures[index].alias = storeSingleConfigParallelDTO.alias
                await project.save();
                return project.parallel.configures[index]
            }
            return null;
        }
        return null;
    }



    async updateSingleCLogicParallel(updateSingleCLogicParallelDTO: IUpdateSingleCLogicItemDTO, projectId: string, userId: string): Promise<ICLogic | null | undefined> {
        let project = await this.projectController.show(projectId, userId);

        if (!project) {
            return null;
        }

        let index = project.parallel?.c_logics.findIndex(e => e._id == updateSingleCLogicParallelDTO.id);
        if (index != undefined && index >= 0) {
            if (project.parallel) {
                project.parallel.c_logics[index].rule = updateSingleCLogicParallelDTO.rule,
                    project.parallel.c_logics[index].data = updateSingleCLogicParallelDTO.data,
                    project.parallel.c_logics[index].next_success = updateSingleCLogicParallelDTO.next_success,
                    project.parallel.c_logics[index].response = new FinalResponse({
                        status_code: updateSingleCLogicParallelDTO.response.status_code,
                        transform: updateSingleCLogicParallelDTO.response.transform,
                        adds: updateSingleCLogicParallelDTO.response.adds,
                        modifies: updateSingleCLogicParallelDTO.response.modifies,
                        deletes: updateSingleCLogicParallelDTO.response.deletes,
                    })
                await project.save();
                return project.parallel.c_logics[index]
            }
            return null;
        }
        return null;
    }

    async getParallel(projectId: string, userId: string): Promise<IParallel | null> {
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
                    configure_id: element.configure_id,
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