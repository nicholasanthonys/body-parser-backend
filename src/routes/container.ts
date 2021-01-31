import { Request, Response, Router } from 'express';
import { Container as ContainerModel, IContainer } from 'src/models/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { IProject, Project } from 'src/models/Project';
import jsonfile from 'jsonfile'
import shell from "shelljs";

const router = Router();
let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

//* Store a container
router.post("/", async (req: Request, res: Response) => {

    const { name, description, projectIds, routers, } = req.body;
    const user = decodeToken(req);


    if (user) {

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



                let temp = {
                    id: container.id,
                    containerId: container.containerId,

                    name: container.name,
                    status: container.status,
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
            const { projectIds, name, description, routers, id } = req.body;


            const updatedContainer = await ContainerModel.findOneAndUpdate({ userId: user.id, id: id }, {
                projectIds,
                name, description,
                routers

            }, {
                new: true
            });

            const projects = await Project.find({
                '_id': { $in: updatedContainer.projectIds }
            }).select(['-configures', '-finalResponse'])

            let temp = {
                id: updatedContainer.id,
                containerId: updatedContainer.containerId,

                name: updatedContainer.name,
                status: updatedContainer.status,
                description: updatedContainer.description,
                routers: updatedContainer.routers,
                projects: projects,
            }

            return res.status(200).send({ container: temp });
        }


    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});

//* Delete a container
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params

    const user = decodeToken(req);
    if (user) {
        try {
            //* Find user related container 
            const containerModel = await ContainerModel.findOne({ _id: id, userId: user.id }) as IContainer;

            if (containerModel) {

                let container = docker.getContainer(containerModel.containerId)
                //* Remove from docker
                container.remove(async (err, data) => {
                    if (err) {
                        return res.status(400).send({ message: err });
                    } else {
                        // * Remove from database
                        await ContainerModel.deleteOne({ _id: id });
                        return res.status(204);
                    }
                })
            }

        } catch (error) {
            return res.status(400).send({ message: error })
        }
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
                '_id': { $in: dbContainer.projectIds }
            }) as Array<IProject>

            let dir = `tmp/containers/${dbContainer._id}/configures`

            shell.mkdir('-p', dir)
            projects.forEach(async (project) => {
                shell.mkdir('-p', dir + `/${project.id}`)
                let projectDir = `${dir}/${project.id}`
                // * Write configure-n.json for each configures
                project.configures.forEach((configure, index) => {
                    let fileName = 'configure-' + index.toString();
                    let file = `${projectDir}/${fileName}.json`
                    jsonfile.writeFile(file, configure.config, { spaces: 2, replacer: undefined }, function (err) {
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

                jsonfile.writeFile(file, project.finalResponse, { spaces: 2 }, function (err) {
                    if (err) {

                        isErr = err;
                    }

                })

                if (isErr) {
                    return res.status(500).send({ message: isErr })
                }

            })

            let file = `${dir}/router.json`

            //* write router.json for container

            jsonfile.writeFile(file, dbContainer.routers, { spaces: 2 }, function (err) {
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
                        PortBindings,
                        Binds: [

                            '/home/nicholas/Desktop/clone/express-body-parser-backend/tmp/containers/' + dbContainer._id.toString() + '/configures:/app/configures:rw', //! if toString() removed, id will be incremented (wrong)

                        ],
                    },
                },
            ).then(async (container) => {
                // * Update containerId
                dbContainer.containerId = container.id;
                dbContainer.isContainerCreated = true;

                if (autoStart == "true") {
                    //*  auto start
                    await container.start();
                    dbContainer.status = 'running'
                }
                await dbContainer.save()



                return res.status(200).send({ message: "creating container success" });
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
    const { id } = req.params;
    if (user) {

        //* Find from database
        let dbContainer = await ContainerModel.findOne({ id, userId: user.id }) as IContainer
        if (dbContainer) {
            //* get docker letcontainer
            let dockerContainer = await docker.getContainer(dbContainer.containerId);
            let inspect = await dockerContainer.inspect()
            let status = "stopped";

            try {
                if (dbContainer.status == "running") {
                    //* Stop
                    await dockerContainer.stop();
                    status = "stopped";
                } else {
                    //* start
                    await dockerContainer.start();
                    status = "running";
                }

                dbContainer.status = status;
                await dbContainer.save();
            } catch (err) {

            }
            return res.status(200).send({container : dbContainer});
        }
        return res.status(400).send({ message: "No container found" })
    }
    return res.sendStatus(403);
})



export default router