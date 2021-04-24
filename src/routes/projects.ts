import { Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import { storeProjectValidation, updateProjectValidation } from "src/modules/Project/validation/ProjectRequestValidation";
import ProjectController from '../modules/Project/Controller/ProjectController'
import IUpdateProjectDTO from "src/modules/Project/DTO/UpdateProjectDTO";
import IStoreProjectDTO from 'src/modules/Project/DTO/StoreProjectDTO'
import { IStoreParallelDTO } from "src/modules/SerialParallel/DTO/StoreParallelDTO";
import {IStoreSerialDTO} from "src/modules/SerialParallel/DTO/StoreSerialDTO"
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import { storeOrUpdateParallelValidation, storeOrUpdateSerialValidation } from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
const router = Router();

const projectControler = new ProjectController();
const parallelController = new ParallelController();
const serialController = new SerialController

//* Store a project
router.post("/", async (req: Request, res: Response) => {
    const storeProjectDTO = req.body as IStoreProjectDTO;
    const user = decodeToken(req);
    if (user) {
        const { error } = storeProjectValidation(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        try {
            const project = await projectControler.store(storeProjectDTO, user.id)
            return res.status(200).send(project);
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
});
router.get("/:project_id/serial", async (req: Request, res: Response) => {
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }

    const serial = await serialController.getSerial(project_id, user.id);
    if(!serial){
        return res.status(400).send({
            message : "Project not found"
        })
    }
    return res.status(200).send(serial)
});

router.post("/:project_id/serial", async (req: Request, res: Response) => {
    const storeSerialDTO = req.body as IStoreSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeOrUpdateSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const serial = await serialController.storeSerial(storeSerialDTO, project_id, user.id)
        if(!serial){
            return res.status(400).send({
                message : "No Project found"
            })
        }

        return res.status(200).send(serial);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.put("/:project_id/serial", async (req: Request, res: Response) => {
    const storeSerialOrParallelDTO = req.body as IStoreSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeOrUpdateSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const serial = await serialController.updateSerial(storeSerialOrParallelDTO, project_id, user.id)
        if(!serial){
            return res.status(400).send({
                message : "No Project found"
            })
        }
        return res.status(200).send(serial);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.get("/:project_id/parallel", async (req: Request, res: Response) => {
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }

    const parallel = await parallelController.getParallel(project_id, user.id);
    if(!parallel){
        return res.status(400).send({
            message : "Project not found"
        })
    }
    return res.status(200).send(parallel)
});

router.post("/:project_id/parallel", async (req: Request, res: Response) => {
    const storeSerialOrParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const parallel = await parallelController.storeParallel(storeSerialOrParallelDTO, project_id, user.id)
        if(!parallel){
            return res.status(400).send({
                message : "No Project found"
            })
        }
        return res.status(200).send(parallel);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.put("/:project_id/parallel", async (req: Request, res: Response) => {
    const storeSerialOrParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const parallel = await parallelController.storeParallel(storeSerialOrParallelDTO, project_id, user.id)
        if(!parallel){
            return res.status(400).send({
                message : "No Project found"
            })
        }
        return res.status(200).send(parallel);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

//* Get all projects
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user) {
        //* Get project without its configures, and sort by date (newest or descending)
        const projects = await projectControler.getAll(user.id)
        return res.status(200).send(projects);
    }
});

//* Get project detail and its configures
router.get("/:id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { id } = req.params;

    if (user) {
        try {
            const project = await projectControler.show(id, user.id);
            if (project) {
                return res.status(200).send(
                    project,
                );
            }
            return res.status(400).send({ message: "No project found" });
        } catch (error) {
            return res.status(400).send({ message: error.message });
        }
    }
});

// * Update a project
router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const updateProjectDTO = req.body as IUpdateProjectDTO;

    if (user) {
        const { error } = updateProjectValidation(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }
        try {
            const updatedProject = await projectControler.update(updateProjectDTO)

            return res.status(200).send(updatedProject);
        } catch (err) {
            return res.status(400).send({ message: err.message });
        }
    }
    return res.sendStatus(403).send({ message: "Not authenticated" });
});

//* Delete a project
router.delete("/:id", async (req: Request, res: Response) => {

    const user = decodeToken(req);
    const { id } = req.params;
    if (user) {
        try {
            //* retrieve project by id
            let isSuccess: boolean = await projectControler.delete(id, user.id)
            if (isSuccess) {
                return res.status(200).send({ message: "Project has been deleted" });
            }

            return res.status(400).send({ message: "Project not found" });

        } catch (err) {
            return res.status(400).send({ message: err.message() });
        }
    }
    return res.sendStatus(403);
});

export default router;
