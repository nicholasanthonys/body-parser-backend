
import { Request, Response, Router } from 'express';
import { Configure, IConfig, IConfigure } from '../modules/Configure/Configure';
import { IProject, Project } from '../modules/Project/Project';
import decodeToken from '../utils/decodeToken';
import { storeConfigurevalidation } from '../validation/validation'
import ConfigureController from '../modules/Configure/controller/ConfigureController'
import IStoreConfigureDTO from 'src/modules/Configure/DTO/StoreConfigureDTO';
import IUpdateConfigureDTO from 'src/modules/Configure/DTO/UpdateConfigureDTO';
const router = Router();
const configureController = new ConfigureController();

router.post("/", async (req: Request, res: Response) => {
    const storeConfigureDTo = req.body as IStoreConfigureDTO;
    const user = decodeToken(req);
    if (!user) {
        return res.status(403)
    }
    const { error } = storeConfigurevalidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    //* Find project by id
    try {
        const newConfigure = await configureController.store(storeConfigureDTo, user.id)
        if (newConfigure != null) {
            return res.status(200).send(newConfigure)
        }

        return res.status(400).send({ "message": "No Project found." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});


//* Get Specific Configure
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { project_id, configure_id } = req.query;
    if (user == null) {
        return res.status(403);
    }
    try {
        const configure = await configureController.show(project_id as string, configure_id as string, user.id)
        if (configure) {
            return res.status(200).send(configure);
        }
        return res.status(400).send({ "message": "Configure not found" });

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});

router.put("/:configure_id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { configure_id } = req.params;

    const updateConfigureDTO = req.body as IUpdateConfigureDTO

    if (!user) {
        return res.status(403)
    }

    const { error } = storeConfigurevalidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }

    try {
        const configure = await configureController.update(updateConfigureDTO, configure_id, user.id);

        if (configure) {
            return res.status(200).send({
                configure,
            });
        }

        return res.status(400).send({ "message": "Configure not found" });
    } catch (error) {
        return res.status(400).send({ message: error.message });

    }

});

router.delete("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectId, configureId } = req.query;
    if (!user) {
        return res.status(403)
    }
    try {
        const isSuccess = await configureController.delete(projectId as string, configureId as string, user.id)
        if (isSuccess) {
            return res.status(200).send({ "message": "Configure deleted" });
        }

        return res.status(400).send({ "message": "No Project found." });
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }

});

export default router