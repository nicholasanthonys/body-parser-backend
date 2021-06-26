import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import {
  IStoreSerialDTO,
} from "src/modules/SerialParallel/DTO/StoreSerialDTO";
import {
  storeOrUpdateSerialValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
import {
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";
import ConfigureFileController from "src/modules/ConfigureFile/ConfigureFileController";
import SerialConfig from './config/SerialConfig'

const router = Router();

const serialController = new SerialController();
const configureFileController = new ConfigureFileController();

router.use(SerialConfig);


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
      return next(new BadRequestException("Something happened"));
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
      return next(new BadRequestException("Something happened"));
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

export default router;
