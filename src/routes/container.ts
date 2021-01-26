import { Request, Response, Router } from 'express';
import { Port } from 'src/models/Port';
import { Container as ContainerModel, IContainer } from 'src/models/Container';
import decodeToken from 'src/utils/decodeToken';
import Docker, { Container } from 'dockerode';
import { v4 as uuidv4, v4 } from 'uuid';

const router = Router();

let docker: Docker = new Docker({ socketPath: "/var/run/docker.sock" });

//* Store a container
router.post("/", async (req: Request, res: Response) => {

    const { name, description, projectIds, routers, port } = req.body;
    const user = decodeToken(req);

    if (user) {
        if (!port) {
            return res.status(400).send({
                "message": "No port specified"
            })
        }

        //* Check if port is already occupied
        const isPortOccupied = await Port.findOne({ port: port })

        if (isPortOccupied) {
            return res.status(400).send({
                "message": "Port already occupied"
            });
        }



        let DBcontainerId: string | null = null;
        try {
            // * Inserting to database

            const newDbContainer = new ContainerModel({
                userId: user.id,
                name,
                description,
                projectIds,
                routers,
             
            })

            let newDBContainer = await newDbContainer.save();

            DBcontainerId =  newDBContainer._id  

            //* port is where the image application running and exposed its port
            let ExposedPorts: { [port: string]: {} } = {}
            ExposedPorts[String(port) + "/tcp"] = {}

            //* Port binding is the host port
            let PortBindings: any = {}
            PortBindings[String(port) + "/tcp"] = [
                {
                    HostIp: "0.0.0.0",
                    HostPort: String(port),
                },
            ]
            //* actually creating docker container
            let newDockercontainer: Container = await docker.createContainer(
                {
                    Image: "go-body-parser:1.0",
                    Cmd: ["./build/Golang-Body-Parser"],
                    name : newDBContainer.slug,


                    ExposedPorts,
                    Volumes: {
                        "/volumes/data": {},
                    },
                    HostConfig: {
                        PortBindings,
                        Binds: [
                            "/home/nicholas/Desktop/clone/golang-body-parser/configures:/app/configures:rw",


                        ],
                    },
                },
            )

            // * Update containerId
            newDBContainer.containerId = v4();
             await newDBContainer.save()
            await newDockercontainer.start();
            return res.status(200).send(newDBContainer);
        } catch (err) {

            console.log("error is");
            console.log(err);
            //* Delete container from database.
            //* We need to find container from containerId 
            if (DBcontainerId) {
                ContainerModel.findOneAndDelete({ id: DBcontainerId });
            }


            return res.status(400).send(err);
        }




        try {

        } catch (error) {



            return res.status(400).send(error);
        }



    }
});

//* Get all container
router.get("/", async (req: Request, res: Response) => {

});





// * Update a container
router.put("/", async (req: Request, res: Response) => {

});

//* Delete a container
router.delete("/", async (req: Request, res: Response) => {

});

export default router