

import ProjectController from 'src/modules/Project/Controller/ProjectController'
import { IProject, Project } from 'src/modules/Project/Project';
import { FinalResponse } from 'src/modules/Response';
import { ConfigureFileSerial, IConfigureFileSerial } from 'src/modules/SerialParallel/ConfigureFileSerial'
import { CLogic, ICLogic } from '../CLogic';
import { IStoreSingleCLogicItemDTO, IUpdateSingleCLogicItemDTO } from '../DTO/CLogicDTO';
import { ISerialConfigDTO, IStoreSerialDTO, IStoreSingleSerialConfigDTO, IUpdateSingleConfigureFileSerialDTO } from '../DTO/StoreSerialDTO'
import { ISerial, Serial } from '../Serial';
export default class SerialController {

    projectController: ProjectController = new ProjectController()

    async storeSerial(storeSerialDTO: IStoreSerialDTO, projectId: string, userId: string): Promise<ISerial | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            console.log("project is null");
            return null;
        }

        project.serial = new Serial();

        project.serial = new Serial({
            configures: storeSerialDTO.configures
        })
        await project.save();
        return project.serial;

    }

    async storeSingleCLogic(storeCLogicDTO: IStoreSingleCLogicItemDTO, projectId: string, userId: string, configId: string): Promise<ICLogic | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            console.log("project is null");
            return null;
        }
        let confIndex = project.serial.configures.findIndex(e => e.id == configId);
        console.log("conf index i s")
        console.log(confIndex);
        if (confIndex >= 0) {
            project.serial.configures[confIndex].c_logics.push(new CLogic({
                rule: storeCLogicDTO.rule,
                data: storeCLogicDTO.data,
                next_success: storeCLogicDTO.next_success,
                response: storeCLogicDTO.response,
                next_failure: storeCLogicDTO.next_failure,
                failure_response: storeCLogicDTO.failure_response
            }))
            await project.save();
            return project.serial.configures[confIndex].c_logics[project.serial.configures[confIndex].c_logics.length - 1];
        }

    }

    async updateSingleCLogic(storeCLogicDTO: IUpdateSingleCLogicItemDTO, projectId: string, userId: string, configId: string): Promise<ICLogic | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            console.log("project is null");
            return null;
        }

        let confIndex = project.serial.configures.findIndex(e => e.id == configId);
        if (confIndex >= 0) {
            let cLogicIndex = project.serial.configures[confIndex].c_logics.findIndex(c => c.id == storeCLogicDTO.id);
            if (cLogicIndex >= 0) {
                project.serial.configures[confIndex].c_logics[cLogicIndex].rule = storeCLogicDTO.rule
                project.serial.configures[confIndex].c_logics[cLogicIndex].data = storeCLogicDTO.data
                project.serial.configures[confIndex].c_logics[cLogicIndex].next_success = storeCLogicDTO.next_success,
                project.serial.configures[confIndex].c_logics[cLogicIndex].next_failure= storeCLogicDTO.next_failure
                if (storeCLogicDTO.response) {
                    project.serial.configures[confIndex].c_logics[cLogicIndex].response = new FinalResponse({
                        status_code: storeCLogicDTO.response.status_code,
                        transform: storeCLogicDTO.response.transform,
                        log_before_modify: {},
                        log_after_modify: {},
                        adds: {
                            header: storeCLogicDTO.response.adds.header,
                            body: storeCLogicDTO.response.adds.body,
                        },
                        modifies: {
                            header: storeCLogicDTO.response.modifies.header,
                            body: storeCLogicDTO.response.modifies.body
                        },
                        deletes: {
                            header: storeCLogicDTO.response.deletes.header,
                            body: storeCLogicDTO.response.deletes.body
                        }
                    })
                }else{
                    project.serial.configures[confIndex].c_logics[cLogicIndex].response = null
                }

                if (storeCLogicDTO.failure_response) {
                    project.serial.configures[confIndex].c_logics[cLogicIndex].failure_response = new FinalResponse({
                        status_code: storeCLogicDTO.failure_response.status_code,
                        transform: storeCLogicDTO.failure_response.transform,
                        log_before_modify: {},
                        log_after_modify: {},
                        adds: {
                            header: storeCLogicDTO.failure_response.adds.header,
                            body: storeCLogicDTO.failure_response.adds.body,
                        },
                        modifies: {
                            header: storeCLogicDTO.failure_response.modifies.header,
                            body: storeCLogicDTO.failure_response.modifies.body
                        },
                        deletes: {
                            header: storeCLogicDTO.failure_response.deletes.header,
                            body: storeCLogicDTO.failure_response.deletes.body
                        }
                    })
                }else{
                    project.serial.configures[confIndex].c_logics[cLogicIndex].failure_response = null
                }


                await project.save();
                return project.serial.configures[confIndex].c_logics[cLogicIndex]
            }
            return null;

        }
        return null;
    }

    async storeSingleConfig(configFileSerialDTO: IStoreSingleSerialConfigDTO, projectId: string, userId: string): Promise<IConfigureFileSerial | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            console.log("project is null");
            return null;
        }

        project.serial.configures.push(new ConfigureFileSerial({
            configure_id: configFileSerialDTO.configure_id,
            alias: configFileSerialDTO.alias,
            failure_response: configFileSerialDTO.failure_response,
        }))

        await project.save();
        return project.serial.configures[project.serial.configures.length - 1];

    }

    async updateSingleConfig(configFileSerialDTO: IUpdateSingleConfigureFileSerialDTO, projectId: string, userId: string): Promise<IConfigureFileSerial | null | undefined> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            console.log("project is null");
            return null;
        }

        let index = project.serial.configures.findIndex(e => e.id == configFileSerialDTO.id);
        if (index >= 0) {
            project.serial.configures[index].configure_id = configFileSerialDTO.configure_id;
            project.serial.configures[index].alias = configFileSerialDTO.alias,
                project.serial.configures[index].c_logics = [],
                project.serial.configures[index].failure_response = new FinalResponse({
                    status_code: configFileSerialDTO.failure_response.status_code,
                    transform: configFileSerialDTO.failure_response.transform,
                    log_before_modify: {},
                    log_after_modify: {},
                    adds: {
                        header: configFileSerialDTO.failure_response.adds.header,
                        body: configFileSerialDTO.failure_response.adds.body,
                    },
                    modifies: {
                        header: configFileSerialDTO.failure_response.modifies.header,
                        body: configFileSerialDTO.failure_response.modifies.body
                    },
                    deletes: {
                        header: configFileSerialDTO.failure_response.deletes.header,
                        body: configFileSerialDTO.failure_response.deletes.body
                    }
                })
        }
        await project.save();
        return project.serial.configures[project.serial.configures.length - 1];

    }


    async getSerial(projectId: string, userId: string): Promise<ISerial | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null
        }
        return project.serial
    }


    async updateSerial(storeSerialDTO: IStoreSerialDTO, projectId: string, userId: string): Promise<ISerial | null> {
        let project = await this.projectController.show(projectId, userId);
        console.log("project i d")
        console.log(projectId)
        if (!project) {
            console.log("project is null");
            return null;
        }

        if (project.serial != null) {
            console.log("serial is not null");
            project.serial.configures = [];
            storeSerialDTO.configures.forEach(element => {
                let configureFile = new ConfigureFileSerial({
                    alias: element.alias,
                    c_logics: element.c_logics,
                    failure_response: element.failure_response

                })
                project.serial?.configures.push(configureFile)
            })

            let updatedProject = await project.save();
            return updatedProject.serial;
        }
        console.log("project serial is null")
        return null;
    }

    async deleteSerial(projectId: string, userId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            project.serial.delete();
            await project.save();

            return true
        }
        return false
    }
}