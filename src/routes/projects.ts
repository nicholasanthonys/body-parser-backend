
import { Request, Response, Router } from 'express';
import { Project } from '../models/Project';
import decodeToken from '../utils/decodeToken';
const router = Router();
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

router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user) {
        const projects = await Project.find({ userId: user.id })

        return res.status(200).send(projects);
    }
});

router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const {name,description} = req.body;
    if (user) {
        try{
            const projects = await Project.findOneAndUpdate({ userId: user.id },{name,description} ,{
                new : true
            })
    
            return res.status(200).send(projects);
        }catch (err) {
            return res.status(400).send({message : err.message});
        }

    }
});

router.delete("/:projectId", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectId } = req.params;
    if (user) {
        try {
            await Project.deleteOne({ userId: user.id, _id: projectId });

            return res.status(204).send({ message: "Project has been deleted" });

        } catch (err) {
            return res.status(400).send({ message: err.toString() });
        }
    }
});

export default router