import { Request, Response, Router } from 'express';
import { Container as ContainerModel, IContainer } from 'src/modules/Container/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { IProject, Project } from 'src/modules/Project/Project';
import jsonfile from 'jsonfile'
import shell from "shelljs";
import { IRouterModel } from 'src/modules/RouterModel';
import { storeOrUpdateConfigContainer } from 'src/validation/validation';

const router = Router();
let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

//* Store a container
router.post("/", async (req: Request, res: Response) => {

    const { name, description, projectIds, routers, } = req.body;
    const user = decodeToken(req);


    if (user) {
        const { error } = storeOrUpdateConfigContainer(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }
        try {
            // * Inserting to database
            const newDbContainer = new ContainerModel({
                userId: user.id,
                name,
                description,
                projectIds,
                routers,

            })

            let newDBContainer = await newDbContainer.save();

            return res.status(200).send(newDBContainer);
        } catch (err) {

            return res.status(400).send(err);
        }

    }
});

//* Get all container
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user) {
        try {
            let containers = await ContainerModel.find({
                userId: user.id,
            }).sort({ date: "desc" });

            return res.status(200).send(containers);
        } catch (error) {
            return res.status(400).send(error);
        }

    }
});

//* Get a container by id
router.get("/:id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { id } = req.params;
    if (user) {
        try {
            const container = await ContainerModel.findById(id) as IContainer
            if (container) {

                const projects = await Project.find({
                    '_id': { $in: container.projectIds }
                }).select(['-configures', '-finalResponse'])


                let running = false

                if (container.containerId) {
                    //get Status container
                    const dockerContainer = docker.getContainer(container.containerId)
                    if (dockerContainer) {
                        let state = (await dockerContainer.inspect()).State;
                        running = state.Running
                    }
                }

                let temp: any = {
                    id: container.id,
                    containerId: container.containerId,
                    name: container.name,
                    running,
                    description: container.description,
                    routers: container.routers,
                    projects: projects,
                }

                return res.status(200).send({
                    container: temp

                })
            }
            return res.status(400).send({ message: "No container found" });
        } catch (error) {
            return res.status(400).send({ message: error.message });
        }

    }

})




// * Update a container
router.put("/", async (req: Request, res: Response) => {
    try {
        const user = decodeToken(req);

        if (user) {
            const { error } = storeOrUpdateConfigContainer(req.body);
            if (error) {
                return res.status(400).send({
                    message: error.message
                })
            }

            const { projectIds, name, description, routers, id } = req.body;
            console.log("projectIds is");
            console.log(projectIds);

            let updatedContainer = await ContainerModel.findOne({ userId: user.id, _id: id }) as IContainer;
            if (!updatedContainer) {
                return res.status(400).send({ message: 'No configuration container found' })
            }
            updatedContainer.projectIds = projectIds
            updatedContainer.name = name;
            updatedContainer.description = description;
            updatedContainer.routers = routers;
            await updatedContainer.save()



            const projects = await Project.find({
                '_id': { $in: updatedContainer.projectIds }
            }).select(['-configures', '-finalResponse'])


            let running = false

            if (updatedContainer.containerId) {
                //get Status container
                const dockerContainer = docker.getContainer(updatedContainer.containerId)
                if (dockerContainer) {
                    let state = (await dockerContainer.inspect()).State;
                    running = state.Running
                }
            }

            let temp: any = {
                id: updatedContainer.id,
                containerId: updatedContainer.containerId,
                name: updatedContainer.name,
                running,
                description: updatedContainer.description,
                routers: updatedContainer.routers,
                projects: projects,
            }

            return res.status(200).send({ container: temp });
        }


    } catch (error) {
        console.log("error is");
        console.log(error);
        return res.status(400).send({ message: error.message });
    }

});

//* Delete a container (config and docker container)
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params

    const user = decodeToken(req);
    if (user) {
        try {
            //* Find user related container 
            const containerModel = await ContainerModel.findOne({ _id: id, userId: user.id }) as IContainer;
            if (containerModel) {
                //* remove from database
                await ContainerModel.deleteOne({ _id: id });
                if (containerModel.containerId) {
                    let container = await docker.getContainer(containerModel.containerId)
                    //* Remove from docker
                    let error = null
                    try {
                        await container.remove();
                    } catch (err) {
                        return res.status(400).send({ message: error });
                    }
                }
                return res.status(200).send({
                    message: "Container Deleted"
                });

            } else {
                return res.status(400).send({
                    message: "Container not found"
                })
            }
        } catch (error) {
            return res.status(400).send({ message: error })
        }
    }

    return res.sendStatus(403)
});


router.post('/docker-container', async (req: Request, res: Response) => {
    //* Get configuration container
    const { id, autoStart } = req.query

    if (id) {

        //* find container by id
        let dbContainer = await ContainerModel.findById(id).select('+routers.project_directory') as IContainer;

        if (dbContainer) {
            let isErr: NodeJS.ErrnoException | null = null //* To store error

            //* write projects and configures
            const projects = await Project.find({
                '_id': { $in: dbContainer.projectIds }
            }) as Array<IProject>

            let dir = `tmp/containers/${dbContainer._id}/configures`

            shell.mkdir('-p', dir)
            projects.forEach(async (project) => {
                shell.mkdir('-p', dir + `/${project.id}`)
                let projectDir = `${dir}/${project.id}`
                // * Write configure-n.json for each configures
                project.configures.configs.forEach((config, index) => {
                    let fileName = 'configure-' + index.toString();
                    let file = `${projectDir}/${fileName}.json`
                    jsonfile.writeFile(file, config, { spaces: 2, replacer: undefined }, function (err) {
                        if (err) {
                            console.log("error is");
                            console.log(err);
                            isErr = err;
                        }

                    })
                })

                if (isErr) {
                    return res.status(500).send({ message: isErr })
                }

                //* Write response for each project
                let file = `${projectDir}/response.json`

                // jsonfile.writeFile(file, project.finalResponse, { spaces: 2 }, function (err) {
                //     if (err) {

                //         isErr = err;
                //     }

                // })

                if (isErr) {
                    return res.status(500).send({ message: isErr })
                }

            })

            let file = `${dir}/router.json`

            //* write router.json for container
            let routers: [IRouterModel] = [...dbContainer.routers]
            routers.forEach((element) => {
                element['project_directory'] = element.project_id
            });
            console.log("routers is");
            console.log(routers);
            jsonfile.writeFile(file, routers, { spaces: 2 }, function (err) {
                if (err) {
                    console.log("error is");
                    console.log(err);
                    isErr = err;
                }

            })


            if (isErr) {
                return res.status(500).send({ message: isErr })
            }


            // TODO : Setting port proxy for docker container. For now set default port
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
            if (dbContainer.containerId) {
                // * Delete Container
                try {
                    const container = docker.getContainer(dbContainer.containerId);
                    if (container) {
                        let inspect = await container.inspect();
                        if (inspect.State.Running) {
                            await container.stop();
                        };
                        await container.remove();
                    }
                } catch (error) {
                    return res.send({
                        message: error
                    })
                }
            }

            let Binds = ['/home/nicholas/Desktop/clone/express-body-parser-backend/tmp/containers/' + id + '/configures:/app/configures:rw']
            console.log("Binds is");
            console.log(Binds)
            await docker.createContainer(
                {
                    Image: "go-body-parser:1.0",
                    Cmd: ["./build/Golang-Body-Parser"],
                    name: id.toString(),
                    ExposedPorts,
                    Volumes: {
                        "/volumes/data": {},
                    },
                    HostConfig: {
                        // PortBindings,
                        Binds
                    },
                    NetworkingConfig: {
                        EndpointsConfig: {
                            "proxy_middleware_net": {}
                        }
                    }
                },
            ).then(async (container) => {
                // * Update containerId
                dbContainer.containerId = container.id;

                if (autoStart == "true") {
                    //*  auto start
                    await container.start();
                }
                await dbContainer.save()



                return res.status(200).send({ message: "creating container success", containerId: container.id });
            }).catch(async (error) => {
                console.log("error is");
                console.log(error);


                return res.status(400).send(error)
            })
        } else {
            return res.status(400).send({ message: "Configuration container not found" })
        }

    } else {
        return res.status(400).send({ message: "No container configuration id specified" })
    }

})


router.put('/docker-container', async (req: Request, res: Response) => {
    // * Toggle start or stop container
    const user = decodeToken(req);
    const { id } = req.query;
    let idString = id as string
    if (user) {

        //* Find from database
        let dbContainer = await ContainerModel.findOne({ _id: idString, userId: user.id }) as IContainer
        if (!dbContainer) {
            return res.status(400).send({
                message: 'No Container found'

            })
        }
        if (dbContainer.containerId) {
            //* get docker letcontainer
            let dockerContainer = docker.getContainer(dbContainer.containerId);
            let inspect = await dockerContainer.inspect()

            try {
                if (inspect.State.Running) {
                    //* Stop
                    await dockerContainer.stop();
                } else {
                    //* start
                    await dockerContainer.start();
                }

                await dbContainer.save();
            } catch (err) {

            }
            return res.status(200).send({ container: dbContainer });
        }
        return res.status(400).send({ message: "No container found" })
    }
    return res.sendStatus(403);
})



export default router