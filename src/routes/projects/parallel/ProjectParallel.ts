import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import { IStoreParallelDTO } from "src/modules/SerialParallel/DTO/StoreParallelDTO";
import {} from "src/modules/SerialParallel/DTO/StoreSerialDTO";
import ParallelController from "src/modules/SerialParallel/Controller/ParallelController";
import {
  storeOrUpdateParallelValidation,
  storeResponseValidation,
} from "src/modules/SerialParallel/validation/SerialorParallelRequestValidation";
import BadRequestException from "src/exceptions/BadRequestException";
import ForbiddenException from "src/exceptions/ForbiddenException";
import ConfigureFileController from "src/modules/ConfigureFile/ConfigureFileController";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import { IResponseDTO } from "src/modules/SerialParallel/DTO/StoreResponseDTO";
import ProjectParallelConfig from "./config/ProjectParallelConfig";
import HttpException from "src/exceptions/HttpException";
import ProjectParallelCLogic from './clogic/ProjectParallelCLogic';

const router = Router();

const parallelController = new ParallelController();

const configureFileController = new ConfigureFileController();

router.use(ProjectParallelConfig);
router.use(ProjectParallelCLogic);

router.get(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }

    try {
      const parallel = await parallelController.getParallel(
        project_id,
        user.id
      );

      return res.status(200).send(parallel);
    } catch (err) {
      if (err instanceof Error) {
        return next(new HttpException(400, err.message));
      }
      return next(
        new HttpException(
          400,
          "Something's wrong when trying to save configure"
        )
      );
    }
  }
);

router.post(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.message));
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

router.put(
  "/:project_id/parallel",
  async (req: Request, res: Response, next: NextFunction) => {
    const storeSerialOrParallelDTO = req.body as IStoreParallelDTO;
    const { project_id } = req.params;
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = storeOrUpdateParallelValidation(req.body);
    if (error) {
      return next(new InvalidRequestException(error.message));
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

router.use("/", ProjectParallelConfig);
export default router;
