

import ProjectController from 'src/modules/Project/Controller/ProjectController'
import { IProject, Project } from 'src/modules/Project/Project';
import { ConfigureFileSerial } from 'src/modules/SerialParallel/ConfigureFileSerial'
import {IStoreSerialDTO } from '../DTO/StoreSerialDTO'
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



    async getSerial(projectId: string, userId: string ): Promise<ISerial | null> {
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
                    c_logics : element.c_logics,
                    next_failure : element.next_failure

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
            project.serial = null;
            await project.save();

            return true
        }
        return false
    }
}