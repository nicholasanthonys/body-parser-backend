import { Request, Response, Router } from "express";
import { Project } from "src/models/Project";
import { Configure } from "src/models/Configure";
import decodeToken from "src/utils/decodeToken";
const router = Router();

//* Store a project
router.post("/", async (req: Request, res: Response) => {
    const { name, description, configures, finalResponse } = req.body;
    const user = decodeToken(req);

    if (user) {
        const newProject = new Project({
            userId: user.id,
            name,
            description,
            configures,
            finalResponse,
        });

        try {
            await newProject.save({ checkKeys: false }); //* Set check keys = false in order to insert key with ($) or (.)
            return res.status(200).send(newProject);
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
        const projects = await Project.find({ userId: user.id })
            .sort({ date: "desc" })
            .select("-configures");

        return res.status(200).send(projects);
    }
});

//* Get project detail and its configures
router.get("/:id", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { id } = req.params;

    if (user) {
        try {
            const project = await Project.findById(id);
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
    const { project } = req.body;
    if (user) {
        try {
            const updatedProject = await Project.findOneAndUpdate(
                { userId: user.id, _id: project.id },
                project,
                {
                    new: true,
                }
            );

            return res.status(200).send({ project: updatedProject });
        } catch (err) {
            return res.status(400).send({ message: err.message });
        }
    }
    return res.status(403).send({ message: "Not authenticated" });
});

//* Delete a project
router.delete("/:id", async (req: Request, res: Response) => {

    const user = decodeToken(req);
    const { id } = req.params;
    if (user) {
        try {
            //* retrieve project by id
            const project = Project.findById(id);
            const projectId = project._id;
            if (project) {
                await project.deleteOne({ userId: user.id, id });
                //* Delete related configures
                await Configure.deleteMany({ projectId });

                return res.status(200).send({ message: "Project has been deleted" });
            }
            return res.status(400).send({ message: "Project not found" });

        } catch (err) {
            return res.status(400).send({ message: err.message() });
        }
    }
    return res.status(403);
});

export default router;
