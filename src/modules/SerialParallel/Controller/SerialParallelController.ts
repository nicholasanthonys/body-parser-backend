
import ProjectController from 'src/modules/Project/Controller/ProjectController'
import { IProject, Project } from 'src/modules/Project/Project';
import { ConfigureFileSerial } from 'src/modules/SerialParallel/ConfigureFileSerial'
import { CLogic } from 'src/modules/SerialParallel/CLogic'
import { IStoreParallelDTO} from '../DTO/StoreParallelDTO'
import {IStoreSerialDTO} from '../DTO/StoreSerialDTO'
import { IParallel } from '../Parallel';
import { ISerial, Serial } from '../Serial';
import { Config } from 'src/modules/Configure/Configure';
import { FinalResponse } from 'src/modules/Response';
export default class SerialParallelController {

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

    async storeParallel(storeSerialOrParallelDTO: IStoreParallelDTO, projectId: string, userId: string): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }
        project.parallel = new Serial({
            configures: storeSerialOrParallelDTO.configures,
            next_failure: storeSerialOrParallelDTO.next_failure,
            c_logics: storeSerialOrParallelDTO.c_logics
        })
        await project.save();
        return project.parallel
    }

    async getSerial(projectId: string, userId: string, requestType: string): Promise<ISerial | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null
        }
        return project.serial
    }

    async getParallel(projectId: string, userId: string, requestType: string): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null
        }
        return project.parallel
    }

    async updateParallel(storeSerialOrParallelDTO: IStoreParallelDTO, projectId: string, userId: string): Promise<IParallel | null> {
        let project = await this.projectController.show(projectId, userId);
        if (!project) {
            return null;
        }

        if (project.parallel != null) {
            project.parallel.configures = [];
            storeSerialOrParallelDTO.configures.forEach(element => {
                let configureFile = new ConfigureFileSerial({
                    file_name: element.file_name,
                    alias: element.alias
                })
                project.parallel?.configures.push(configureFile)
            })

            project.parallel.next_failure.status_code = storeSerialOrParallelDTO.next_failure.status_code
            project.parallel.next_failure.transform = storeSerialOrParallelDTO.next_failure.transform


            project.parallel.next_failure.adds.header = storeSerialOrParallelDTO.next_failure.adds.header
            project.parallel.next_failure.adds.body = storeSerialOrParallelDTO.next_failure.adds.body

            project.parallel.next_failure.modifies.header = storeSerialOrParallelDTO.next_failure.modifies.header
            project.parallel.next_failure.modifies.body = storeSerialOrParallelDTO.next_failure.modifies.body

            project.parallel.c_logics = [];
            storeSerialOrParallelDTO.c_logics.forEach(element => {
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



    async updateSerial(storeSerialOrParallelDTO: IStoreParallelDTO, projectId: string, userId: string): Promise<ISerial | null> {
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
            storeSerialOrParallelDTO.configures.forEach(element => {
                let configureFile = new ConfigureFileSerial({
                    file_name: element.file_name,
                    alias: element.alias
                })
                project.serial?.configures.push(configureFile)
            })

            project.serial.next_failure.status_code = storeSerialOrParallelDTO.next_failure.status_code
            project.serial.next_failure.transform = storeSerialOrParallelDTO.next_failure.transform

            project.serial.next_failure.adds.header = storeSerialOrParallelDTO.next_failure.adds.header
            project.serial.next_failure.adds.body = storeSerialOrParallelDTO.next_failure.adds.body

            project.serial.next_failure.modifies.header = storeSerialOrParallelDTO.next_failure.modifies.header
            project.serial.next_failure.modifies.body = storeSerialOrParallelDTO.next_failure.modifies.body

            project.serial.c_logics = [];
            storeSerialOrParallelDTO.c_logics.forEach(element => {
                let cLogicItem = new CLogic({
                    rule: element.rule,
                    data: element.data,
                    next_success: element.next_success,
                    response: element.response
                })
                project.serial?.c_logics.push(cLogicItem)
            })

            let updatedProject = await project.save();
            return updatedProject.serial;
        }
        console.log("project serial is null")
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

    async deleteSerial(projectId: string, userId: string): Promise<boolean> {
        const project = await Project.findOne({ _id: projectId, userId }) as IProject;
        if (project) {
            project.serial = null;
            await project.save();

            return true
        }
        return false
    }
}