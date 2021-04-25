import { Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import { storeProjectValidation, updateProjectValidation } from "src/modules/Project/validation/ProjectRequestValidation";
import ProjectController from '../modules/Project/Controller/ProjectController'
import IUpdateProjectDTO from "src/modules/Project/DTO/UpdateProjectDTO";
import IStoreProjectDTO from 'src/modules/Project/DTO/StoreProjectDTO'
import { IStoreParallelDTO, IStoreSingleConfigParallelDTO } from "src/modules/SerialParallel/DTO/StoreParallelDTO";
import { IStoreSerialDTO , ISerialConfigDTO, IUpdateSingleConfigureFileSerialDTO, IStoreSingleSerialConfigDTO} from "src/modules/SerialParallel/DTO/StoreSerialDTO"
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import { responseSchema, storeOrUpdateParallelValidation, storeOrUpdateSerialValidation, storeResponseValidation, storeSingleCLogicParallelValidation, storeSingleCLogicSerialValidation, storeSingleConfigParallelValidation, storeSingleConfigSerialValidation, updateSingleCLogicParallelValidation, updateSingleCLogicSerialValidation, updateSingleConfigParallelValidation, updateSingleConfigSerialValidation } from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
import { IUpdateSingleConfigParallelDTO } from "src/modules/SerialParallel/DTO/UpdateParallelDTO";
import { IStoreSingleCLogicItemDTO, IUpdateSingleCLogicItemDTO } from "src/modules/SerialParallel/DTO/CLogicDTO";
import { IResponseDTO } from "src/modules/SerialParallel/DTO/StoreResponseDTO";

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
    if (!serial) {
        return res.status(400).send({
            message: "Project not found"
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
        if (!serial) {
            return res.status(400).send({
                message: "No Project found"
            })
        }

        return res.status(200).send(serial);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/:project_id/serial/config/new", async (req: Request, res: Response) => {
    const storeSingleConfigSerialDTO = req.body as IStoreSingleSerialConfigDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeSingleConfigSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const serialConfig = await serialController.storeSingleConfig(storeSingleConfigSerialDTO, project_id, user.id)
        if (!serialConfig) {
            return res.status(400).send({
                message: "No Project found"
            })
        }

        return res.status(200).send(serialConfig);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


router.put("/:project_id/serial/config", async (req: Request, res: Response) => {
    const updateSingleConfigSerialDTO = req.body as IUpdateSingleConfigureFileSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = updateSingleConfigSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const serialConfig = await serialController.updateSingleConfig(updateSingleConfigSerialDTO, project_id, user.id)
        if (!serialConfig) {
            return res.status(400).send({
                message: "No Project found"
            })
        }

        return res.status(200).send(serialConfig);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/:project_id/serial/config/:config_id/clogic/new", async (req: Request, res: Response) => {
    const storeSingleCLogicDTO = req.body as IStoreSingleCLogicItemDTO;
    const { project_id, config_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeSingleCLogicSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const cLogic = await serialController.storeSingleCLogic(storeSingleCLogicDTO, project_id, user.id, config_id)
        if (!cLogic) {
            return res.status(400).send({
                message: "No Project found"
            })
        }

        return res.status(200).send(cLogic);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.put("/:project_id/serial/config/:config_id/clogic", async (req: Request, res: Response) => {
    const updateSingleCLogicDTO = req.body as IUpdateSingleCLogicItemDTO;
    const { project_id, config_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = updateSingleCLogicSerialValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const cLogic = await serialController.updateSingleCLogic(updateSingleCLogicDTO, project_id, user.id, config_id)
        if (!cLogic) {
            return res.status(400).send({
                message: "No Project found"
            })
        }

        return res.status(200).send(cLogic);
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
        if (!serial) {
            return res.status(400).send({
                message: "No Project found"
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
    if (!parallel) {
        return res.status(400).send({
            message: "Project not found"
        })
    }
    return res.status(200).send(parallel)
});

router.post("/:project_id/parallel", async (req: Request, res: Response) => {
    const storeParallelDTO = req.body as IStoreParallelDTO;
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
        const parallel = await parallelController.storeParallel(storeParallelDTO, project_id, user.id)
        if (!parallel) {
            return res.status(400).send({
                message: "No Project found"
            })
        }
        return res.status(200).send(parallel);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/:project_id/parallel/next-failure", async (req: Request, res: Response) => {
    const storeNextFailureDTO = req.body as IResponseDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeResponseValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const nextFailure = await parallelController.storeNextFailure(storeNextFailureDTO, project_id, user.id)
        if (!nextFailure) {
            return res.status(400).send({
                message: "Item not found"
            })
        }
        return res.status(200).send(nextFailure);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/:project_id/parallel/config/new", async (req: Request, res: Response) => {
    const storeSingleConfigParallelDTO = req.body as IStoreSingleConfigParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeSingleConfigParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const configParallel = await parallelController.storeSingleConfigParallel(storeSingleConfigParallelDTO, project_id, user.id)
        if (!configParallel) {
            return res.status(400).send({
                message: "No Project found"
            })
        }
        return res.status(200).send(configParallel);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/:project_id/parallel/clogic/new", async (req: Request, res: Response) => {
    const storeSingleCLogicParallelDTO = req.body as IStoreSingleCLogicItemDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = storeSingleCLogicParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const cLogicParallel = await parallelController.storeSingleCLogicParallel(storeSingleCLogicParallelDTO, project_id, user.id)
        if (!cLogicParallel) {
            return res.status(400).send({
                message: "Item not found"
            })
        }
        return res.status(200).send(cLogicParallel);
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
        if (!parallel) {
            return res.status(400).send({
                message: "No Project found"
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

router.put("/:project_id/parallel/config", async (req: Request, res: Response) => {
    const updateSingleConfigParallelDTO = req.body as IUpdateSingleConfigParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = updateSingleConfigParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const configParallel = await parallelController.updateSingleConfigParallel(updateSingleConfigParallelDTO, project_id, user.id)
        if (!configParallel) {
            return res.status(400).send({
                message: "Item not found"
            })
        }
        return res.status(200).send(configParallel);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


router.put("/:project_id/parallel/clogic", async (req: Request, res: Response) => {
    const updateSingleCLogicParallelDTO = req.body as IUpdateSingleCLogicItemDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403);
    }
    const { error } = updateSingleCLogicParallelValidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.message
        })
    }

    try {
        const cLogicParallel = await parallelController.updateSingleCLogicParallel(updateSingleCLogicParallelDTO, project_id, user.id)
        if (!cLogicParallel) {
            return res.status(400).send({
                message: "Item not found"
            })
        }
        return res.status(200).send(cLogicParallel);
    } catch (err) {
        return res.status(400).send(err.message);
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
