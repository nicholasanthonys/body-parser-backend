import { NextFunction, Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import {
  storeProjectValidation,
  updateProjectValidation,
} from "src/modules/Project/validation/ProjectRequestValidation";
import ProjectController from "src/modules/Project/Controller/ProjectController";
import IUpdateProjectDTO from "src/modules/Project/DTO/UpdateProjectDTO";
import IStoreProjectDTO from "src/modules/Project/DTO/StoreProjectDTO";
import ForbiddenException from "src/exceptions/ForbiddenException";
import InvalidRequestException from "src/exceptions/InvalidRequest";
import BadRequestException from "src/exceptions/BadRequestException";
import ProjectParallel from './parallel/ProjectParallel'
import ProjectSerial from './serial/ProjectSerial'

const router = Router();

const projectControler = new ProjectController();

router.use(ProjectParallel)
router.use(ProjectSerial)

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

//* Store a project
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const storeProjectDTO = req.body as IStoreProjectDTO;
  const user = decodeToken(req);
  if (!user) {
    return next(new ForbiddenException());
  }
  const { error } = storeProjectValidation(req.body);
  if (error) {
    return next(new InvalidRequestException(error.message));
  }

  try {
    const project = await projectControler.store(storeProjectDTO, user.id);
    return res.status(200).send(project);
  } catch (err) {
    if (err instanceof Error) {
      return next(new BadRequestException(err.message));
    }
    return next(new BadRequestException("Something happened"));
  }
});

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

//* Delete a project
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = decodeToken(req);
    const { id } = req.params;
    if (!user) {
      return next(new ForbiddenException());
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
