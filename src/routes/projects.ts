import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import {
  storeProjectValidation,
  updateProjectValidation,
} from "src/modules/Project/validation/ProjectRequestValidation";
import ProjectController from "../modules/Project/Controller/ProjectController";
import IUpdateProjectDTO from "src/modules/Project/DTO/UpdateProjectDTO";
import IStoreProjectDTO from "src/modules/Project/DTO/StoreProjectDTO";
import {
  IStoreParallelDTO,
  IStoreSingleConfigParallelDTO,
} from "src/modules/SerialParallel/DTO/StoreParallelDTO";
import {
  IStoreSerialDTO,
  IUpdateSingleConfigureFileSerialDTO,
  IStoreSingleSerialConfigDTO,
} from "src/modules/SerialParallel/DTO/StoreSerialDTO";
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import {
  storeOrUpdateParallelValidation,
  storeOrUpdateSerialValidation,
  storeResponseValidation,
  storeSingleCLogicParallelValidation,
  storeSingleCLogicSerialValidation,
  storeSingleConfigParallelValidation,
  storeSingleConfigSerialValidation,
  updateSingleCLogicParallelValidation,
  updateSingleCLogicSerialValidation,
  updateSingleConfigParallelValidation,
  updateSingleConfigSerialValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
import { IUpdateSingleConfigParallelDTO } from "src/modules/SerialParallel/DTO/UpdateParallelDTO";
import {
  IStoreSingleCLogicItemDTO,
  IUpdateSingleCLogicItemDTO,
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import { IResponseDTO } from "src/modules/SerialParallel/DTO/StoreResponseDTO";
import { decode } from "jsonwebtoken";
import CLogicController from "src/modules/CLogic/CLogicController";
import ConfigureController from "src/modules/Configure/controller/ConfigureController";
import ConfigureFileController from "src/modules/ConfigureFile/ConfigureFileController";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";

const router = Router();

const projectControler = new ProjectController();
const parallelController = new ParallelController();
const serialController = new SerialController();
const cLogicController = new CLogicController();
const configureController = new ConfigureController();
const configureFileController = new ConfigureFileController();

//* Store a project
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const storeProjectDTO = req.body as IStoreProjectDTO;
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }
  const { error } = storeProjectValidation(req.body);
  if (error) {
    return new InvalidRequestException(error.message);
  }

  try {
    const project = await projectControler.store(storeProjectDTO, user.id);
    return res.status(200).send(project);
  } catch (err) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
  }
});

router.get(
  "/:project_id/serial",
  async (req: Request, res: Response, next: NextFunction) => {
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }

    try {
      const serial = await serialController.getSerial(project_id, user.id);
      return res.status(200).send(serial);
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
    }
  }
);

router.post(
  "/:project_id/serial",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSerialDTO = req.body as IStoreSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeOrUpdateSerialValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.message));
    }

    try {
      const serial = await serialController.storeSerial(
        storeSerialDTO,
        project_id,
        user.id
      );
      return res.status(200).send(serial);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
    }
  }
);

router.post(
  "/:project_id/serial/config/new",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSingleConfigSerialDTO = req.body as IStoreSingleSerialConfigDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeSingleConfigSerialValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.message));
    }

    try {
      const serialConfig = await serialController.storeSingleConfig(
        storeSingleConfigSerialDTO,
        project_id,
        user.id
      );

      return res.status(200).send(serialConfig);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.put(
  "/:project_id/serial/config",
  async (req: Request, res: Response, next: NextFunction) => {
    const updateSingleConfigSerialDTO =
      req.body as IUpdateSingleConfigureFileSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateSingleConfigSerialValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const serialConfig = await serialController.updateSingleConfig(
        updateSingleConfigSerialDTO,
        project_id,
        user.id
      );

      return res.status(200).send(serialConfig);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.post(
  "/:project_id/serial/config/:config_id/clogic/new",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSingleCLogicDTO = req.body as IStoreSingleCLogicItemDTO;
    const { project_id, config_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeSingleCLogicSerialValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const cLogic = await serialController.storeSingleCLogic(
        storeSingleCLogicDTO,
        project_id,
        user.id,
        config_id
      );

      return res.status(200).send(cLogic);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.put(
  "/:project_id/serial/config/:config_id/clogic",
  async (req: Request, res: Response, next: NextFunction) => {
    const updateSingleCLogicDTO = req.body as IUpdateSingleCLogicItemDTO;
    const { project_id, config_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateSingleCLogicSerialValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const cLogic = await serialController.updateSingleCLogic(
        updateSingleCLogicDTO,
        project_id,
        user.id,
        config_id
      );

      return res.status(200).send(cLogic);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.put(
  "/:project_id/serial",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSerialOrParallelDTO = req.body as IStoreSerialDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return res.sendStatus(403);
    }
    const { error } = storeOrUpdateSerialValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: error.message,
      });
    }

    try {
      const serial = await serialController.updateSerial(
        storeSerialOrParallelDTO,
        project_id,
        user.id
      );

      return res.status(200).send(serial);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.get(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return res.sendStatus(403);
    }

    const parallel = await parallelController.getParallel(project_id, user.id);
    if (!parallel) {
      return res.status(400).send({
        message: "Project not found",
      });
    }
    return res.status(200).send(parallel);
  }
);

router.post(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return res.sendStatus(403);
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: error.message,
      });
    }

    try {
      const parallel = await parallelController.storeParallel(
        storeParallelDTO,
        project_id,
        user.id
      );

      return res.status(200).send(parallel);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.post(
  "/:project_id/parallel/failure-response",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeNextFailureDTO = req.body as IResponseDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeResponseValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const nextFailure = await parallelController.storeNextFailure(
        storeNextFailureDTO,
        project_id,
        user.id
      );
      if (!nextFailure) {
        return res.status(400).send({
          message: "Item not found",
        });
      }
      return res.status(200).send(nextFailure);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.post(
  "/:project_id/parallel/config/new",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSingleConfigParallelDTO =
      req.body as IStoreSingleConfigParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeSingleConfigParallelValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const configParallel = await parallelController.storeSingleConfigParallel(
        storeSingleConfigParallelDTO,
        project_id,
        user.id
      );

      return res.status(200).send(configParallel);
    } catch (err: any) {
      console.log("error is ");
      console.log(err);
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.post(
  "/:project_id/parallel/clogic/new",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSingleCLogicParallelDTO = req.body as IStoreSingleCLogicItemDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeSingleCLogicParallelValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const cLogicParallel = await parallelController.storeSingleCLogicParallel(
        storeSingleCLogicParallelDTO,
        project_id,
        user.id
      );
      if (!cLogicParallel) {
        return res.status(400).send({
          message: "Item not found",
        });
      }
      return res.status(200).send(cLogicParallel);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.put(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSerialOrParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return res.sendStatus(403);
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: error.message,
      });
    }

    try {
      const parallel = await parallelController.storeParallel(
        storeSerialOrParallelDTO,
        project_id,
        user.id
      );

      return res.status(200).send(parallel);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

//* Get all projects
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }
  //* Get project without its configures, and sort by date (newest or descending)
  const projects = await projectControler.getAll(user.id);
  return res.status(200).send(projects);
});

//* Get project detail and its configures
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  const { id } = req.params;

  if (user) {
    try {
      const project = await projectControler.show(id, user.id);
      if (project) {
        return res.status(200).send(project);
      }
      return res.status(400).send({ message: "No project found" });
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
    }
  }
});

router.put(
  "/:project_id/parallel/config",
  async (req: Request, res: Response, next: NextFunction) => {
    const updateSingleConfigParallelDTO =
      req.body as IUpdateSingleConfigParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateSingleConfigParallelValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const configParallel =
        await parallelController.updateSingleConfigParallel(
          updateSingleConfigParallelDTO,
          project_id,
          user.id
        );
      if (!configParallel) {
        return res.status(400).send({
          message: "Item not found",
        });
      }
      return res.status(200).send(configParallel);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

router.put(
  "/:project_id/parallel/clogic",
  async (req: Request, res: Response, next: NextFunction) => {
    const updateSingleCLogicParallelDTO =
      req.body as IUpdateSingleCLogicItemDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateSingleCLogicParallelValidation(req.body);
    if (error) {
      if (error) {
        return next(new InvalidRequestException(error.message));
      }
    }

    try {
      const cLogicParallel =
        await parallelController.updateSingleCLogicParallel(
          updateSingleCLogicParallelDTO,
          project_id,
          user.id
        );
      if (!cLogicParallel) {
        return res.status(400).send({
          message: "Item not found",
        });
      }
      return res.status(200).send(cLogicParallel);
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }

      return next(new BadRequestException("Something happen"));
    }
  }
);

// * Update a project
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  const updateProjectDTO = req.body as IUpdateProjectDTO;

  const { error } = updateProjectValidation(req.body);
  if (error) {
    if (error) {
      return next(new InvalidRequestException(error.message));
    }
  }
  try {
    const updatedProject = await projectControler.update(updateProjectDTO);

    return res.status(200).send(updatedProject);
  } catch (err: any) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
  }
});

router.delete(
  "/:id/parallel/configure-file/:configureFileId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id, configureFileId } = req.params;
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      await configureFileController.deleteConfigureFileParallel(
        id,
        user.id,
        configureFileId
      );
      return res.status(201).send({ message: "Delete Success" });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happen"));
    }
  }
);

router.delete(
  "/:id/parallel/clogic/:cLogicId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id, cLogicId } = req.params;
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      await cLogicController.deleteCLogicParallel(id, user.id, cLogicId);

      return res.status(201).send({ message: "Delete Success" });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happen"));
    }
  }
);

router.delete(
  "/:id/serial/configure-file/:configureFileId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id, configureFileId } = req.params;
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      await configureFileController.deleteConfigureFileSerial(
        id,
        user.id,
        configureFileId
      );
      return res.status(201).send({ message: "Delete Success" });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happen"));
    }
  }
);

router.delete(
  "/:id/serial/config/:configId/clogic/:cLogicId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id, configId, cLogicId } = req.params;
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      await cLogicController.deleteCLogicSerial(
        id,
        user.id,
        configId,
        cLogicId
      );
      return res.status(201).send({ message: "Delete Success" });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happen"));
    }
  }
);

//* Delete a project
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id } = req.params;
    if(!user){
      return next(new ForbiddenException())
    }
    try {
      //* retrieve project by id
      await projectControler.delete(id, user.id);

      return res.status(200).send({ message: "Project has been deleted" });
    } catch (err: any) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happen"));
    }
  }
);

export default router;
