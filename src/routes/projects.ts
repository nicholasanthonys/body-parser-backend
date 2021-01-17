
import { Request, Response, Router } from 'express';
import { Project } from '../models/Project';
import { Configure } from '../models/Configure';
import decodeToken from '../utils/decodeToken';
const router = Router();

//* Store a project
router.post("/", async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const user = decodeToken(req);
    if (user) {
        const newProject = new Project({
            userId: user.id,
            name,
            description
        });

        try {
            await newProject.save();
            return res.status(200).send(newProject);
        } catch (err) {
            return res.send(400).send(err);
        }
    }
});

//* Get all projects
router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user) {
        const projects = await Project.find({ userId: user.id })

        return res.status(200).send(projects);
    }
});

//* Get project detail and its configures
router.get("/:projectSlug", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectSlug } = req.params;
    if (user) {
        try {
            const project = await Project.findOne({ slug: projectSlug })
            if (project) {
                // cast to IProject

                const configures = await Configure.find({ projectId: project._id }).select('_id');
                return res.status(200).send({
                    project,
                    configures
                })
            }
            return res.status(400).send({ message: "No project found" });
        } catch (error) {
            return res.status(400).send({ message: error.message });
        }

    }
});



// * Update a project
router.put("/:projectId", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { name, description } = req.body;
    const {projectId} = req.params;
    if (user) {
        try {
            const projects = await Project.findOneAndUpdate({ userId: user.id, _id : projectId }, { name, description }, {
                new: true
            })
            

            return res.status(200).send(projects);
        } catch (err) {
            return res.status(400).send({ message: err.message });
        }

    }
});

//* Delete a project
router.delete("/:projectSlug", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectSlug } = req.params;
    if (user) {
        try {
            //* retrieve project from project slug: projectSlug 
            const project = Project.findOne({ slug: projectSlug });
            const projectId = project._id;
            if (project) {
                await project.deleteOne({ userId: user.id, slug: projectSlug });
                //* Delete related configures 
                await Configure.deleteMany({  projectId })

                return res.status(204).send({ message: "Project has been deleted" });
            }


        } catch (err) {
            return res.status(400).send({ message: err.toString() });
        }
    }
});

export default router