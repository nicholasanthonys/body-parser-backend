import { Request, response, Response, Router } from 'express';
import { Port } from 'src/models/Port';
import { Container as ContainerModel, IContainer } from 'src/models/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { v4 as uuidv4, v4 } from 'uuid';
import { Project } from 'src/models/Project';

const router = Router();

let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

//* Store a container
router.post("/", async (req: Request, res: Response) => {

    const { name, description, projectIds, routers, } = req.body;
    const user = decodeToken(req);

    // return res.send(projectIds);
    if (user) {
        // if (!port) {
        //     return res.status(400).send({
        //         "message": "No port specified"
        //     })
        // }

        // //* Check if port is already occupied
        // const isPortOccupied = await Port.findOne({ port: port })

        // if (isPortOccupied) {
        //     return res.status(400).send({
        //         "message": "Port already occupied"
        //     });
        // }

        //TODO : Setting port proxy for docker container. For now set default port
        let port = 80

        let DBcontainerId: string | null = null;
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

            DBcontainerId = newDBContainer._id
            console.log("db containe rid is");
            console.log(DBcontainerId);
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
            //* actually creating docker container
            await docker.createContainer(
                {
                    Image: "go-body-parser:1.0",
                    Cmd: ["./build/Golang-Body-Parser"],
                    name: newDBContainer.slug,


                    ExposedPorts,
                    Volumes: {
                        "/volumes/data": {},
                    },
                    HostConfig: {
                        PortBindings,
                        Binds: [
                            "/home/nicholas/Desktop/clone/golang-body-parser/configures:/app/configures:rw",


                        ],
                    },
                },
            ).then(async (container) => {
                // * Update containerId
                newDBContainer.containerId = container.id;
                await newDBContainer.save()
            })
                .catch(async (error) => {
                    console.log("error is");
                    console.log(error);
                    console.log(DBcontainerId);
                    //* Delete container from database.
                    //* We need to find container from containerId 
                    if (DBcontainerId) {
                        await ContainerModel.deleteOne({ _id: DBcontainerId });
                    }

                    return res.status(400).send(error)
                })



            //* Dont auto start
            // await newDockercontainer.start();
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
        let containers = await ContainerModel.find({
            userId: user.id,
        }).sort({ date: "desc" }).select('-routers');
        return res.status(200).send(containers);
    }
});

//* Get a container by slug
router.get("/:containerSlug", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { containerSlug } = req.params;
    if (user) {
        try {
            const container = await ContainerModel.findOne({ slug: containerSlug }) as IContainer
            if (container) {

                const projects = await Project.find({
                    '_id': { $in: container.projectIds }
                }).select(['-configures', '-finalResponse'])

                let temp = {
                    id: container.id,
                    containerId: container.containerId,
                    slug: container.slug,
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
            const { status, projectIds, name, description, routers, slug } = req.body;

            // return res.send({
            //     id : user?.id,
            //     slug
            // })

            const updatedContainer = await ContainerModel.findOneAndUpdate({ userId: user.id, slug: slug }, {
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
                slug: updatedContainer.slug,
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

            // console.log("container model is");
            // console.log(containerModel);
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

export default router