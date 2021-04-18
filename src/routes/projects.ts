import { Request, Response, Router } from "express";
import decodeToken from "src/utils/decodeToken";
import { storeProjectValidation, updateProjectValidation } from "src/modules/Project/validation/ProjectRequestValidation";
import ProjectController from '../modules/Project/Controller/ProjectController'
import IUpdateProjectDTO from "src/modules/Project/DTO/UpdateProjectDTO";
import IStoreProjectDTO from 'src/modules/Project/DTO/StoreProjectDTO'
const router = Router();

const projectControler = new ProjectController();
//* Store a project
router.post("/", async (req: Request, res: Response) => {
    const storeProjectDTO = req.body as IStoreProjectDTO;
    const user = decodeToken(req);
    if (user) {
        const { error } = storeProjectValidation(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }

        try {
            const project = await projectControler.store(storeProjectDTO, user.id)
            return res.status(200).send(project);
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
});

//* Get all projects
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user) {
        //* Get project without its configures, and sort by date (newest or descending)
        const projects = await projectControler.getAll(user.id)
        return res.status(200).send(projects);
    }
});

//* Get project detail and its configures
router.get("/:id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { id } = req.params;

    if (user) {
        try {
            const project = await projectControler.show(id, user.id);
            if (project) {
                return res.status(200).send({
                    project,
                });
            }
            return res.status(400).send({ message: "No project found" });
        } catch (error) {
            return res.status(400).send({ message: error.message });
        }
    }
});

// * Update a project
router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const updateProjectDTO = req.body as IUpdateProjectDTO;

    if (user) {
        const { error } = updateProjectValidation(req.body);
        if (error) {
            return res.status(400).send({
                message: error.message
            })
        }
        try {
            const updatedProject = await projectControler.update(updateProjectDTO)

            return res.status(200).send(updatedProject);
        } catch (err) {
            return res.status(400).send({ message: err.message });
        }
    }
    return res.sendStatus(403).send({ message: "Not authenticated" });
});

//* Delete a project
router.delete("/:id", async (req: Request, res: Response) => {

    const user = decodeToken(req);
    const { id } = req.params;
    if (user) {
        try {
            //* retrieve project by id
            let isSuccess: boolean = await projectControler.delete(id, user.id)
            if (isSuccess) {
                return res.status(200).send({ message: "Project has been deleted" });
            }

            return res.status(400).send({ message: "Project not found" });

        } catch (err) {
            return res.status(400).send({ message: err.message() });
        }
    }
    return res.sendStatus(403);
});

export default router;
