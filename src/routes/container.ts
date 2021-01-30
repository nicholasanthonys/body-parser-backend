import { Request, response, Response, Router } from 'express';
import { Port } from 'src/models/Port';
import { Container as ContainerModel, IContainer } from 'src/models/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { v4 as uuidv4, v4 } from 'uuid';
import { Project } from 'src/models/Project';
import { Query } from 'mongoose';

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
            const container = await ContainerModel.findById(id ) as IContainer
            if (container) {

                const projects = await Project.find({
                    '_id': { $in: container.projectIds }
                }).select(['-configures', '-finalResponse'])
                
                console.log("projects is");
                console.log(projects);
                console.log(container.projectIds);

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
            const { projectIds, name, description, routers, id  } = req.body;


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