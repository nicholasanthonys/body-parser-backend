
import { Request, Response, Router } from 'express';
import { Configure, IConfig, IConfigure } from '../models/Configure';
import { Project } from '../models/Project';
import decodeToken from '../utils/decodeToken';
const router = Router();
router.post("/", async (req: Request, res: Response) => {
    const { projectId, config, description } = req.body;
    console.log("project id: ", projectId)
    const user = decodeToken(req);
    if (user) {
        //* Find project by id


        try {
            const project = await Project.findOne({_id : projectId});
            if (project) {
                console.log("project is");
                console.log(project);
                const newConfigure = new Configure({
                    projectId,
                    config,
                    description

                });
                await newConfigure.save({checkKeys: false });
                return res.status(200).send(newConfigure)
            }

        } catch (error) {
            return res.status(400).send({message : error.message});
        }

    }
});

router.get("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);

});

router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { name, description } = req.body;
    if (user) {

    }
});

router.delete("/:projectId", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectId } = req.params;
    if (user) {
        // try {
        //     await Project.deleteOne({ userId: user.id, _id: projectId });

        //     return res.status(204).send({ message: "Project has been deleted" });

        // } catch (err) {
        //     return res.status(400).send({ message: err.toString() });
        // }
    }
});

export default router