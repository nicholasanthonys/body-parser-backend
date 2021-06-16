import { IStoreContainerDTO } from "../DTO/StoreContainerDTO";
import { IUpdateContainerDTO } from "../DTO/UpdateContainerDTO";
import { Container as ContainerModel, IContainer, IContainerCustom } from 'src/modules/Container/Container';
import { IProject, Project } from "src/modules/Project/Project";
import Docker, { Container } from 'dockerode';
import { RouterModel } from "src/modules/RouterModel";
import shell from "shelljs"
import jsonfile from 'jsonfile'
let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });
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

    async find(dbContainerId: string, userId: string): Promise<IContainer | null> {
        let dbContainer = await ContainerModel.findOne({
            _id: dbContainerId,
            user_id: userId,
        });
        if (dbContainer) {
            return dbContainer
        }
        return null;
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
            return null
        }
    }

    async writeContainerProjects(dbContainerId: string, userId: string): Promise<NodeJS.ErrnoException | null> {
        let dbContainer = await ContainerModel.findOne({
            _id: dbContainerId,
            user_id: userId
        }).select('+routers.project_directory') as IContainer;
        if (!dbContainer) {

            return new Error('Container not found')
        }

        //* To store error
        let operationError: NodeJS.ErrnoException | null = null

        //* write projects and configures
        const projects = await Project.find({
            '_id': { $in: dbContainer.project_ids }
        }) as Array<IProject>

        //* Create directory for containers
        let dir = `${process.env.TMP_PATH}/containers/${dbContainerId}/configures`
        console.log("dir is ")
        console.log(dir);

        shell.mkdir('-p', dir)

        console.log("db container project is is ")
        console.log(dbContainer.project_ids);
        console.log("projects length : ")
        console.log(projects.length);

        projects.forEach(async (project) => {

            //* Create container for each project
            shell.mkdir('-p', dir + `/${project._id}`)
            let projectDir = `${dir}/${project._id}`

            //* write serial.json
            console.log("serial json is ")
            console.log(project.serial.toJSON())
            let serialFileName = `${projectDir}/serial.json`
            jsonfile.writeFile(serialFileName, project.serial.toJSON(), { spaces: 2, }, function (err) {
                if (err) {
                    console.log("error write serial.json is");
                    console.log(err);
                    operationError = err;
                    throw Error(err.message)
                }

            })

            //* Write base.json
            let baseFileName = `${projectDir}/base.json`
            jsonfile.writeFile(baseFileName, project.base.toJSON(), { spaces: 2, }, function (err) {
                if (err) {
                    console.log("error write base.json is");
                    console.log(err);
                    operationError = err;
                    throw Error(err.message)
                }

            })

            if (operationError) {
                console.log("error write serial.json")
                console.log(operationError);
                throw Error(operationError.message)
            }

            //* write parallel.json
            let parallelFileName = `${projectDir}/parallel.json`
            jsonfile.writeFile(parallelFileName, project.parallel.toJSON(), { spaces: 2,  }, function (err) {
                if (err) {
                    console.log("error write parallel.json ");
                    console.log(err);
                    operationError = err
                    throw Error(err.message)
                }
            })


            if (operationError) {
                console.log("error write parallel.json")
                console.log(operationError);
                throw Error(operationError)
            }

            // * Write configure-n.json for each configures
            project.configures.configs.forEach((config) => {

                //* set configure file name with id 
                let fileName = config._id;

                let file = `${projectDir}/${fileName}.json`

                jsonfile.writeFile(file, config.toJSON(), { spaces: 2 }, function (err) {
                    if (err) {
                        console.log("error  write file configure ");
                        console.log(err);
                        operationError = err;
                        throw Error(err.message)
                    }
                })
            })

        })

        if (operationError) {
            console.log("error write each config project")
            console.log(operationError);
            throw Error(operationError);
        }

        // //* write router
        let file = `${dir}/router.json`
        jsonfile.writeFile(file, dbContainer.routers, { spaces: 1 }, function (err) {
            if (err) {
                console.log("error write router is");
                console.log(err);
                operationError = err;
            }

        })


        if (operationError) {
            console.log("error write router")
            return operationError;
        }
        return null;

    }


    async createContainer(dbContainer: IContainer): Promise<Docker.Container> {

        let port = 80

        //* port is where the image application running and exposed its port
        let ExposedPorts: { [port: string]: {} } = {}
        ExposedPorts[String(port) + "/tcp"] = {}

        //* Port binding is the host port
        let PortBindings: any = {}
        PortBindings[String(port) + "/tcp"] = [
            {
                HostIp: "0.0.0.0",
                HostPort: String(port),
            },
        ]

        //* Delete container if already created
        if (dbContainer.container_id) {
            // * Delete Container
            try {
                const container = docker.getContainer(dbContainer.container_id);
                if (container) {
                    let inspect = await container.inspect();
                    if (inspect.State.Running) {
                        await container.stop();
                    };
                    await container.remove();
                }
            } catch (err : any) {
                throw Error(err)
            }
        }

        //* Set docker network
        let dockerNetwork = process.env.DOCKER_NETWORK_NAME || "proxy_middleware_net"
        let EndpointsConfig: { [dockerNetwork: string]: {} } = {}
        EndpointsConfig[dockerNetwork] = {}

        //* Set docker volume
        let dockerContainerVolumeMountpoint = process.env.DOCKER_CONTAINER_VOLUME_MOUNTPOINT || "/app/src/configures"
        let Volumes: { [dockerContainerVolumeMountpoint: string]: {} } = {}
        Volumes[dockerContainerVolumeMountpoint] = {}

        return await docker.createContainer(
            {
                Image: process.env.SINGLE_MIDDLEWARE_IMAGE_NAME,
                Cmd: ["./build/go-single-middleware"],
                name: dbContainer._id.toString(),
                ExposedPorts,
                Volumes,
                NetworkingConfig: {
                    EndpointsConfig
                }
            },
        ).then(async (container) => {

            let pathToConfigures = `${process.env.TMP_PATH}/containers/` + dbContainer._id + '/configures/.'
            shell.exec(`docker cp ${pathToConfigures} ${container.id}:${dockerContainerVolumeMountpoint}`)
            dbContainer.container_id = container.id;
            await dbContainer.save();
            return container;


        }).catch((error) => {
            console.log("error when creating container");
            console.log(error);
            throw Error(error);
        })

    }

    async startDockerContainer(dockerContainer: Docker.Container): Promise<Boolean> {

        await dockerContainer.start();
        return true;
    }

    async toggleStartStopContainer(dbContainerId: string, userId: string): Promise<IContainerCustom> {
        let dbContainer = await ContainerModel.findOne({ _id: dbContainerId, user_id: userId }) as IContainer
        if (!dbContainer) {
            throw new Error('db Container not found')
        }
        if (!dbContainer.container_id) {
            throw new Error('docker not container not created')
        }

        let dockerContainer = docker.getContainer(dbContainer.container_id);
        let inspect = await dockerContainer.inspect()
        let running = false;
        if (inspect.State.Running) {
            //* Stop
            await dockerContainer.stop();
            running = false;
        } else {
            //* start
            await dockerContainer.start();
            running = true;
        }

        let containerWithStatus: IContainerCustom = {
            _id: dbContainer._id,
            user_id: dbContainer.user_id,
            container_id: dbContainer.container_id,
            name: dbContainer.name,
            description: dbContainer.description,
            project_ids: dbContainer.project_ids,
            routers: dbContainer.routers,
            date: dbContainer.date,
            running,
        }
        return containerWithStatus;

    }

    async findDockerContainer(dbContainerId: string): Promise<Docker.Container> {

        const dockerContainer = docker.getContainer(dbContainerId);
        return dockerContainer
    }
}