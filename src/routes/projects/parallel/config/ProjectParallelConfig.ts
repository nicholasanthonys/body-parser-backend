import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import { IStoreSingleConfigParallelDTO } from "src/modules/SerialParallel/DTO/StoreParallelDTO";
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import {
  storeSingleConfigParallelValidation,
  updateSingleConfigParallelValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import { IUpdateSingleConfigParallelDTO } from "src/modules/SerialParallel/DTO/UpdateParallelDTO";

import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";

const router = Router();

const parallelController = new ParallelController();

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

export default router;
