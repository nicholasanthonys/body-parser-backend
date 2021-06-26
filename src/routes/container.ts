import { NextFunction, Request, Response, Router } from "express";
import {
  Container as ContainerModel,
  IContainer,
} from "src/modules/Container/Container";
import decodeToken from "src/utils/decodeToken";
import Docker, { Container } from "dockerode";
import { IProject, Project } from "src/modules/Project/Project";
import jsonfile from "jsonfile";
import shell from "shelljs";
import { IRouterModel } from "src/modules/RouterModel";
import {
  storeContainerValidation,
  updateContainerValidation,
} from "src/modules/Container/validation/ContainerRequestValidation";
import ContainerController from "src/modules/Container/controller/ContainerController";
import { IStoreContainerDTO } from "src/modules/Container/DTO/StoreContainerDTO";
import { IUpdateContainerDTO } from "src/modules/Container/DTO/UpdateContainerDTO";
import ForbiddenException from "src/exceptions/ForbiddenException";
import BadRequestException from "src/exceptions/BadRequestException";
const router = Router();
let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

const containerController = new ContainerController();
//* Store a container
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const storeContainerDTO = req.body as IStoreContainerDTO;
  const user = decodeToken(req);

  if (!user) {
    return next(new ForbiddenException());
  }

  const { error } = storeContainerValidation(req.body);
  if (error) {
    return next(new BadRequestException(error.message));
  }

  try {
    let newDBContainer = await containerController.store(
      storeContainerDTO,
      user.id
    );
    return res.status(200).send(newDBContainer);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//* Get all container
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }
  try {
    let containers = await containerController.getAll(user.id);
    return res.status(200).send(containers);
  } catch (err) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
    return next(new BadRequestException("Something happened"));
  }
});

//* Get a container by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }

  const { id } = req.params;
  try {
    const containerWithStatus = await containerController.show(id, user.id);

    return res.status(200).send({
      ...containerWithStatus,
    });
  } catch (err) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
    return next(new BadRequestException("Something happened"));
  }
});

// * Update a container
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    const { error } = updateContainerValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: error.message,
      });
    }

    let updateContainerDTO = req.body as IUpdateContainerDTO;
    let updatedContainer = await containerController.update(
      updateContainerDTO,
      user.id
    );

    return res.status(200).send(updatedContainer);
  } catch (err) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
    return next(new BadRequestException("Something happened"));
  }
});

//* Delete a container (config and docker container)
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = decodeToken(req);
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      await containerController.delete(id, user.id);

      return res.status(200).send({ message: "Delete Success" });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happened"));
    }
  }
);

router.post(
  "/docker-container",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = decodeToken(req);
      if (!user) {
        return next(new ForbiddenException());
      }
      const { id } = req.body;

      let dbContainer = await containerController.find(id, user.id);

      await containerController.writeContainerProjects(id, user.id);

      const dockerContainer = await containerController.createContainer(
        dbContainer
      );
      return res.status(200).send({
        container_id: dockerContainer.id,
        message: "Docker Container created",
      });
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happened"));
    }
  }
);

router.put(
  "/docker-container",
  async (req: Request, res: Response, next: NextFunction) => {
    // * Toggle start or stop container
    const user = decodeToken(req);
    const { id }: { id: string } = req.body;
    if (!user) {
      return next(new ForbiddenException());
    }
    try {
      let customInfoContainer =
        await containerController.toggleStartStopContainer(id, user.id);
      return res.status(200).send(customInfoContainer);
    } catch (err) {
      if (err instanceof Error) {
        return next(new BadRequestException(err.message));
      }
      return next(new BadRequestException("Something happened"));
    }
  }
);

export default router;
