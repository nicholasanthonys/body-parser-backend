import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import {
  storeSingleCLogicSerialValidation,
  updateSingleCLogicSerialValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import SerialController from "src/modules/SerialParallel/Controller/SerialController";
import {
  IStoreSingleCLogicItemDTO,
  IUpdateSingleCLogicItemDTO,
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import CLogicController from "src/modules/CLogic/CLogicController";
import ConfigureFileController from "src/modules/ConfigureFile/ConfigureFileController";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";

const router = Router();

const serialController = new SerialController();
const cLogicController = new CLogicController();


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


  export default router;