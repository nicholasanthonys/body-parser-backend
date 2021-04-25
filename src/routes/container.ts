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
            ...containerWithStatus
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
    if (!user) {
        return res.sendStatus(403);
    }
    try {
        let isDeleted = await containerController.delete(id, user.id);
        if (!isDeleted) {
            return res.status(400).send({ message: "Container not found" })

        }
        return res.status(200).send({ message: "Delete Success" })

    } catch (error) {
        return res.status(400).send({ message: error })
    }

});


router.post('/docker-container', async (req: Request, res: Response) => {
    try {
        const user = decodeToken(req);
        if (!user) {
            return res.sendStatus(403);
        }
        const { id } = req.body;


        let dbContainer = await containerController.find(id, user.id);
        if (!dbContainer) {
            return res.status(400).send({
                message: "Container not found"
            })
        }

        await containerController.writeContainerProjects(id, user.id);

        const dockerContainer =  await containerController.createContainer(dbContainer)
        return res.status(200).send({
            container_id : dockerContainer.id,
            message: "Docker Container created"
        })

    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }

})


router.put('/docker-container', async (req: Request, res: Response) => {
    // * Toggle start or stop container
    const user = decodeToken(req);
    const { id } : {id : string} = req.body;
    if (!user) {
        return res.sendStatus(403);
    }
    try {
       let customInfoContainer = await containerController.toggleStartStopContainer(id, user.id) ;
       return res.status(200).send(customInfoContainer)
    } catch (error) {
       return res.status(400).send({
           message : error
       })
    }
})



export default router