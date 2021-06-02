import { Request, Response, Router } from 'express';
import { NodeSSH } from 'node-ssh';
import DockerImageController from 'src/modules/DockerImage/controller/DockerImageController'

const imageController = new DockerImageController()
const router = Router();

router.post("/", (req: Request, res: Response) => {
    let dockerfileDir = process.env.DOCKERFILE_DIR
    if (dockerfileDir) {
        let result = imageController.buildImage("tes3", dockerfileDir)

        return res.send(result);
    }
    return res.send("not found");
});

router.post('/mount', (req : Request, res :Response) => {
    const ssh = new NodeSSH()
    ssh.connect({
      host: 'localhost',
      username: 'steel',
      privateKey: '/home/steel/.ssh/id_rsa'
    })
})

export default router