import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "../utils/decodeToken";
import {
  deleteRequestCLogiValidation,
  storeConfigurevalidation,
  storeRequestCLogiValidation,
  updateConfigurevalidation,
  updateRequestCLogiValidation,
} from "src/modules/Configure/validation/ConfigureRequestValidation";
import ConfigureController from "../modules/Configure/controller/ConfigureController";
import IStoreConfigureDTO from "src/modules/Configure/DTO/StoreConfigureDTO";
import IUpdateConfigureDTO from "src/modules/Configure/DTO/UpdateConfigureDTO";
import {
  IDeleteConfigureSingleCLogicItemDTO,
  IStoreRequestSingleCLogicItemDTO,
  IUpdateConfigureSingleCLogicItemDTO,
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import { nextTick } from "process";
import HttpException from "src/exceptions/HttpException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import ForbiddenException from "src/exceptions/ForbiddenException";
import BadRequestException from "src/exceptions/BadRequestException";
const router = Router();
const configureController = new ConfigureController();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const storeConfigureDTo = req.body as IStoreConfigureDTO;
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }
  const { error } = storeConfigurevalidation(req.body);
  if (error) {
    return next(new InvalidRequestException(error.details[0].message));
  }

  //* Find project by id
  try {
    const newConfigure = await configureController.store(
      storeConfigureDTo,
      user.id
    );
    return res.status(200).send(newConfigure);
  } catch (error) {
    if (error instanceof Error) {
      return next(new HttpException(400, error.message));
    }
    return next(
      new HttpException(400, "Something's wrong when trying to save configure")
    );
  }
});

router.post(
  "/:configure_id/request/c-logic",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeConfigureDTo = req.body as IStoreRequestSingleCLogicItemDTO;
    const { configure_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }

    const { error } = storeRequestCLogiValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.details[0].message));
    }

    //* Find project by id
    try {
      const newCLogic = await configureController.storeSingleCLogicRequest(
        storeConfigureDTo,
        configure_id,
        user.id
      );

      return res.status(200).send(newCLogic);
    } catch (error) {
      if (error instanceof Error) {
        return next(new HttpException(400, error.message));
      }
      return next(
        new HttpException(400, "Something's wrong when try to store new CLogic")
      );
    }
  }
);

router.put(
  "/:configure_id/request/c-logic",
  async (req: Request, res: Response, next: NextFunction) => {
    const updateConfigureDTO = req.body as IUpdateConfigureSingleCLogicItemDTO;
    const { configure_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateRequestCLogiValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.details[0].message));
    }

    //* Find project by id
    try {
      const updatedCLogic = await configureController.updateSingleCLogicRequest(
        updateConfigureDTO,
        user.id,
        configure_id
      );
      return res.status(200).send(updatedCLogic);
    } catch (error) {
      if (error instanceof Error) {
        return next(new HttpException(400, error.message));
      }
      return next(
        new HttpException(400, "Somethings wrong when try to update CLogic")
      );
    }
  }
);

// get all configure
router.get(
  "/project/:project_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    if (user == null) {
      return next(new ForbiddenException());
    }
    try {
      const { project_id } = req.params;
      const configure = await configureController.getAll(project_id, user.id);
      return res.status(200).send(configure);
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
    }
  }
);

//* Get Specific Configure
router.get(
  "/:configure_id/project/:project_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { configure_id, project_id } = req.params;
    if (user == null) {
      return next(new ForbiddenException());
    }
    try {
      const configure = await configureController.show(
        project_id as string,
        configure_id as string,
        user.id
      );
      return res.status(200).send(configure);
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestException(error.message));
      }
      return next(
        new BadRequestException("Something wrong when trying to get configure")
      );
    }
  }
);

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  const updateConfigureDTO = req.body as IUpdateConfigureDTO;

  if (!user) {
    return next(new ForbiddenException());
  }

  const { error } = updateConfigurevalidation(req.body);
  if (error) {
    return next(new InvalidRequestException(error.details[0].message));
  }

  try {
    const configure = await configureController.update(
      updateConfigureDTO,
      updateConfigureDTO.config.id,
      user.id
    );

    return res.status(200).send({
      configure,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(new BadRequestException(error.message));
    }
    return next(
      new BadRequestException("Something wrong when try to update configure")
    );
  }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  const { project_id, configure_id } = req.query;
  if (!user) {
    return next(new ForbiddenException());
  }
  try {
    await configureController.delete(
      project_id as string,
      configure_id as string,
      user.id
    );
    return res.status(200).send({ message: "Configure deleted" });
  } catch (error) {
    if (error instanceof Error) {
      return next(new BadRequestException(error.message));
    }
    return next(
      new BadRequestException("Something wrong when try to delete configure")
    );
  }
});

router.delete(
  "/:configure_id/request/c-logic",
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteCLogicRequestDTO =
      req.body as IDeleteConfigureSingleCLogicItemDTO;
    const { configure_id } = req.params;

    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = deleteRequestCLogiValidation(req.body);
    if (error) {
      return new BadRequestException(error.details[0].message);
    }

    //* Find project by id
    try {
      await configureController.deleteCLogic(
        deleteCLogicRequestDTO.project_id,
        user.id,
        configure_id,
        deleteCLogicRequestDTO.id
      );
      return res.status(200).send({
        message: "Delete Success",
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new BadRequestException(error.message));
      }
      return next(
        new BadRequestException("Something wrong when try to delete cLogic")
      );
    }
  }
);

export default router;
