import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import {
  storeSingleCLogicParallelValidation,
  updateSingleCLogicParallelValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import {
  IStoreSingleCLogicItemDTO,
  IUpdateSingleCLogicItemDTO,
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import CLogicController from "src/modules/CLogic/CLogicController";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";

const router = Router();

const parallelController = new ParallelController();
const cLogicController = new CLogicController();

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

export default router