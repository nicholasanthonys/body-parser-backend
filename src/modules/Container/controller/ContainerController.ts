import { IStoreContainerDTO } from "../DTO/StoreContainerDTO";
import { IUpdateContainerDTO } from "../DTO/UpdateContainerDTO";
import { Container as ContainerModel, IContainer, IContainerCustom } from 'src/modules/Container/Container';
import { IProject, Project } from "src/modules/Project/Project";

import Docker, { Container } from 'dockerode';
import { RouterModel } from "src/modules/RouterModel";

export default class ContainerController {

    docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

    async store(storeContainerDTO: IStoreContainerDTO, userId: string): Promise<IContainer> {
        return await new ContainerModel({
            user_id: userId,
            name: storeContainerDTO.name,
            description: storeContainerDTO.description,
            project_ids: storeContainerDTO.project_ids,
            routers: storeContainerDTO.routers
        }).save();

    }

    async getAll(userId: string): Promise<Array<IContainer>> {
        // //* Get project without its configures, and sort by date (newest or descending)
        return await ContainerModel.find({
            user_id: userId,
        }).sort({ date: "desc" });

    }

    async show(dbContainerId: string, userId: string): Promise<IContainerCustom | null> {

        const container = await ContainerModel.findOne({
            _id: dbContainerId,
            user_id: userId
        }) as IContainer

        if (!container) {
            return null;
        }


        let running = false;

        const dockerContainerInspect = await this.getDockerContainerInspectInfo(container.id)
        console.log("dockercontainer inspect is")
        console.log(dockerContainerInspect)

        if (dockerContainerInspect) {
            running = dockerContainerInspect.State.Running
        }


        let containerWithStatus: IContainerCustom = {
            _id: container._id,
            user_id: container.user_id,
            container_id: container.container_id,
            name: container.name,
            description: container.description,
            project_ids: container.project_ids,
            routers: container.routers,
            date: container.date,
            running,
        }

        return containerWithStatus;

    }

    async getProjects(dbContainerId: string, userId: string): Promise<Array<IProject> | null> {
        const container = await ContainerModel.findOne({
            _id: dbContainerId,
            user_id: userId
        }) as IContainer

        if (!container) {
            return null
        }

        const projects = await Project.find({
            '_id': { $in: container.project_ids }
        }).select(['-configures', '-finalResponse'])

        return projects;

    }

    async update(updateContainerDTO: IUpdateContainerDTO, userId: string): Promise<IContainerCustom | null> {
        let container = await ContainerModel.findOne({ user_id: userId, _id: updateContainerDTO.id }) as IContainer;
        if (!container) {
            return null;
        }
        container.project_ids = updateContainerDTO.project_ids
        container.name = updateContainerDTO.name;
        container.description = updateContainerDTO.description;
        container.routers = []
        updateContainerDTO.routers.forEach((element) => {
            const newRouter = new RouterModel({
                path: element.path,
                project_id: element.project_id,
                project_directory: element.project_id,
                type: element.type,
                method: element.method
            })
            container.routers.push(newRouter)
        });
        let updatedContainer = await container.save()

        let dockerContainerInspect = null;

        //get Status container'
        let running = false;
        dockerContainerInspect = await this.getDockerContainerInspectInfo(updatedContainer.container_id);
        if (dockerContainerInspect) {
            running = dockerContainerInspect.State.Running
        }

        let updatedContainerWithStatus: IContainerCustom = {
            _id: updatedContainer._id,
            user_id: updatedContainer.user_id,
            container_id: updatedContainer.container_id,
            name: updatedContainer.name,
            description: updatedContainer.description,
            project_ids: updatedContainer.project_ids,
            routers: updatedContainer.routers,
            date: updatedContainer.date,
            running,
        }
        return updatedContainerWithStatus

    }

    async delete(containerId: string, userId: string): Promise<boolean> {
        const containerModel = await ContainerModel.findOne({ _id: containerId, user_id: userId }) as IContainer;

        if (!containerModel) {
            return false;
        }
        //* remove from database
        await ContainerModel.deleteOne({ _id: containerId });

        try {
            //* remove from docker
            let dockerContainer = await this.docker.getContainer(containerId)

            if (dockerContainer) {
                await dockerContainer.remove();
            }
        } catch (error) {
            console.log(error);
        }

        return true;

    }

    async getDockerContainerInspectInfo(containerId: string): Promise<Docker.ContainerInspectInfo | null> {
        try {

            const dockerContainer = this.docker.getContainer(containerId)
            if (!dockerContainer) {
                return null
            }

            let state = (await dockerContainer.inspect());
            return state;

        } catch (error) {
            console.log(error)
            return null
        }
    }

}