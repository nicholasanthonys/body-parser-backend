
import { Request, Response, Router } from 'express';
import decodeToken from '../utils/decodeToken';
import { deleteRequestCLogiValidation, storeConfigurevalidation, storeRequestCLogiValidation, updateConfigurevalidation, updateRequestCLogiValidation } from 'src/modules/Configure/validation/ConfigureRequestValidation'
import ConfigureController from '../modules/Configure/controller/ConfigureController'
import IStoreConfigureDTO from 'src/modules/Configure/DTO/StoreConfigureDTO';
import IUpdateConfigureDTO from 'src/modules/Configure/DTO/UpdateConfigureDTO';
import { IDeleteConfigureSingleCLogicItemDTO, IStoreRequestSingleCLogicItemDTO, IStoreSingleCLogicItemDTO, IUpdateConfigureSingleCLogicItemDTO } from 'src/modules/SerialParallel/DTO/CLogicDTO';
const router = Router();
const configureController = new ConfigureController();

router.post("/", async (req: Request, res: Response) => {
    const storeConfigureDTo = req.body as IStoreConfigureDTO;
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403)
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

router.post("/:configure_id/request/c-logic", async (req: Request, res: Response) => {
    const storeConfigureDTo = req.body as IStoreRequestSingleCLogicItemDTO;
    const {configure_id} = req.params
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403)
    }
    const { error } = storeRequestCLogiValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    //* Find project by id
    try {
        const newCLogic = await configureController.storeSingleCLogicRequest(storeConfigureDTo, configure_id,user.id)
        if (newCLogic != null) {
            return res.status(200).send(newCLogic)
        }

        return res.status(400).send({ "message": "No Project found." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});


router.put("/:configure_id/request/c-logic", async (req: Request, res: Response) => {
    const updateConfigureDTO = req.body as IUpdateConfigureSingleCLogicItemDTO;
    const {configure_id} = req.params
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403)
    }
    const { error } = updateRequestCLogiValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    //* Find project by id
    try {
        const updatedCLogic = await configureController.updateSingleCLogicRequest(updateConfigureDTO, user.id, configure_id)
        if (updatedCLogic != null) {
            return res.status(200).send(updatedCLogic)
        }

        return res.status(400).send({ "message": "No Project found." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});



// get all configure
router.get('/project/:project_id', async (req: Request,  res: Response) => {
    const user = decodeToken(req);
    if (user == null) {
        return res.sendStatus(403);
    }
    const { project_id } =  req.params
    const configure = await configureController.getAll(project_id, user.id)
    if (configure == null) {
        return res.status(400).send({
            message: "Project not found"
        })
    }
    return res.status(200).send(configure)

});

//* Get Specific Configure
router.get("/:configure_id/project/:project_id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { configure_id, project_id } =  req.params
    if (user == null) {
        return res.sendStatus(403);
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

router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const updateConfigureDTO = req.body as IUpdateConfigureDTO

    if (!user) {
        return res.sendStatus(403)
    }

    const { error } = updateConfigurevalidation(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        })
    }

    try {
        const configure = await configureController.update(updateConfigureDTO, updateConfigureDTO.config.id, user.id);

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
    const {  project_id,  configure_id } = req.query;
    if (!user) {
        return res.sendStatus(403)
    }
    try {
        const isSuccess = await configureController.delete(project_id as string, configure_id as string, user.id)
        if (isSuccess) {
            return res.status(200).send({ "message": "Configure deleted" });
        }

        return res.status(400).send({ "message": "No Project found." });
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }

});

router.delete("/:configure_id/request/c-logic", async (req: Request, res: Response) => {
    const deleteCLogicRequestDTO = req.body as IDeleteConfigureSingleCLogicItemDTO;
    const {configure_id} = req.params
    
    const user = decodeToken(req);
    if (!user) {
        return res.sendStatus(403)
    }
    const { error } = deleteRequestCLogiValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    //* Find project by id
    try {
        const deleteResult= await configureController.deleteCLogic(deleteCLogicRequestDTO.project_id, user.id, configure_id, deleteCLogicRequestDTO.id)
        if (deleteResult) {
            return res.status(200).send({
                message : "Delete Success"
            })
        }

        return res.status(400).send({ "message": "Delete failed." });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

});

export default router