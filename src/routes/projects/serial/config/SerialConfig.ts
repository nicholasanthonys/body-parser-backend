import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import {
  IUpdateSingleConfigureFileSerialDTO,
  IStoreSingleSerialConfigDTO,
} from "src/modules/SerialParallel/DTO/StoreSerialDTO";
import {
  storeSingleConfigSerialValidation,
  updateSingleConfigSerialValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
import {
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";
import SerialConfigClogic from './clogic/SerialConfigClogic'

const router = Router();

const serialController = new SerialController();

router.use(SerialConfigClogic);

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

export default router;