
import { Request, Response, Router } from 'express';
import { Configure, IConfig, IConfigure } from '../models/Configure';
import { IProject, Project } from '../models/Project';
import decodeToken from '../utils/decodeToken';
const router = Router();
router.post("/", async (req: Request, res: Response) => {
    const { projectSlug, config, description } = req.body;
    const user = decodeToken(req);
    if (user) {
        //* Find project by id
        try {
            const project = await Project.findOne({ slug: projectSlug }) as IProject;
            if (project) {
                const newConfigure = new Configure({
                    config,
                    description

                });
                project.configures.push(newConfigure);
                await project.save();

                return res.status(200).send(newConfigure)
            }

        } catch (error) {
            return res.status(400).send({ message: error.message });
        }

    }
});


//* Get Specific Configure
router.get("/", async (req: Request, res: Response) => {

    const user = decodeToken(req);
    const { projectSlug, configureId } = req.query;
    if (user) {
        try {
            const project = await Project.findOne({ slug: projectSlug }) as IProject
            console.log("project is");
            console.log(project);
            console.log(project.configures);
            if (project) {
                let index = project.configures.findIndex((element) => element._id == configureId);
                
                if (index >= 0) {
                    return res.status(200).send(project.configures[index]);

                }
                return res.status(400).send({ "message": "Configure not found" });
            }
            return res.status(400).send({ "message": "Project not found" });

        } catch (error) {
            return res.status(400).send({ message: error.message });
        }

    }
});

router.put("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectSlug, configureId } = req.query;
    const configure = req.body
    if (user) {
        try {
            const project = await Project.findOne({ slug: projectSlug }) as IProject
            let index = project.configures.findIndex((element) => element._id == configureId);
            if (index >= 0) {
                project.configures[index] = configure
                await project.save();
                return res.status(200).send({ "message": "Configure updated" });
            }
            return res.status(400).send({ "message": "Configure not found" });

        } catch (error) {
            return res.status(400).send({ message: error.message });

        }
    }

});

router.delete("/", async (req: Request, res: Response) => {
    const user = decodeToken(req);
    const { projectSlug, configureId } = req.query;
    if (user) {
        try {
            const project = await Project.findOne({ slug: projectSlug }) as IProject;
            if (project) {
               project.configures =  project.configures.filter((element) => element._id != configureId)
                await project.save();
                return res.status(200).send({ "message": "Configure deleted" });
            }
            return res.status(400).send({ "message": "Configure not found" });
        } catch (error) {
            res.status(400).send({ "message": error.message });
        }
    }

});

export default router