import { IProject, Project } from "../Project/Project";

export default class ConfigureFileController {
  async deleteConfigureFileParallel(
    projectId: string,
    userId: string,
    configureFileId: string
  ) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    project.parallel.configures = project.parallel.configures.filter(
      (c) => c._id != configureFileId
    );
    await project.save();
  }

  async deleteConfigureFileSerial(
    projectId: string,
    userId: string,
    configureFileId: string
  ) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    project.serial.configures = project.serial.configures.filter(
      (c) => c._id != configureFileId
    );
    await project.save();
  }
}
