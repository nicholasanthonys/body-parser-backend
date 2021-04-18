import { Request, Response, Router } from 'express';
import { Container as ContainerModel, IContainer } from 'src/modules/Container/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { IProject, Project } from 'src/modules/Project/Project';
import jsonfile from 'jsonfile'
import shell from "shelljs";
import { IRouterModel } from 'src/modules/RouterModel';
import { storeContainerValidation, updateContainerValidation } from 'src/modules/Container/validation/ContainerRequestValidation';
import ContainerController from 'src/modules/Container/controller/ContainerController';
import { IStoreContainerDTO } from 'src/modules/Container/DTO/StoreContainerDTO';
import { IUpdateContainerDTO } from 'src/modules/Container/DTO/UpdateContainerDTO';
const router = Router();
let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

const containerController = new ContainerController();
//* Store a container
router.post("/", async (req: Request, res: Response) => {

    const storeContainerDTO = req.body as IStoreContainerDTO;
    const user = decodeToken(req);

    if (!user) {
        return res.sendStatus(403);
    }

    const { error } = storeContainerValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        let newDBContainer = await containerController.store(storeContainerDTO, user.id)
        return res.status(200).send(newDBContainer);
    } catch (err) {
        return res.status(400).send(err);
    }

});

//* Get all container
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    try {
        let containers = await containerController.getAll(user.id);
        return res.status(200).send(containers);
    } catch (error) {
        return res.status(400).send(error);
    }
});

//* Get a container by id
router.get("/:id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }

    const { id } = req.params;
    try {

        const containerWithStatus = await containerController.show(id, user.id)
        if (!containerWithStatus) {
            return res.status(400).send({ message: "No container found" });
        }
        return res.status(200).send({
            container: containerWithStatus

        })

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

})




// * Update a container
router.put("/", async (req: Request, res: Response) => {
    try {
        const user = decodeToken(req);
        if (!user) {
            return res.sendStatus(403);
        }
        const { error } = updateContainerValidation(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        let updateContainerDTO = req.body as IUpdateContainerDTO
        let updatedContainer = await containerController.update(updateContainerDTO, user.id)

        if (!updateContainerDTO) {
            return res.status(400).send({ message: "Container not found" });
        }

        return res.status(200).send(updatedContainer);


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
    if(!user){
        return res.sendStatus(403);
    }
        try {
            let isDeleted = await containerController.delete(id, user.id);
            if(!isDeleted){
                return res.status(400).send({ message: "Container not found"})

            }
            return res.status(200).send({ message: "Delete Success"})

        } catch (error) {
            return res.status(400).send({ message: error })
        }

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
                '_id': { $in: dbContainer.project_ids }
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
            let routers: Array<IRouterModel> = [...dbContainer.routers]
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
                dbContainer.container_id = container.id;

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
        let dbContainer = await ContainerModel.findOne({ _id: idString, user_id: user.id }) as IContainer
        if (!dbContainer) {
            return res.status(400).send({
                message: 'No Container found'

            })
        }
        if (dbContainer.container_id) {
            //* get docker letcontainer
            let dockerContainer = docker.getContainer(dbContainer.container_id);
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