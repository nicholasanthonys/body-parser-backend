import { IProject, Project } from "../Project/Project";

export default class CLogicController {
  async deleteCLogicParallel(
    projectId: string,
    userId: string,
    cLogicId: string
  ) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    project.parallel.c_logics = project.parallel.c_logics.filter(
      (c) => c._id != cLogicId
    );
    await project.save();
  }

  async deleteCLogicSerial(
    projectId: string,
    userId: string,
    configId: string,
    cLogicId: string
  ) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    let configIndex = project.serial.configures.findIndex(
      (config) => config._id == configId
    );
    if (configIndex >= 0) {
      project.serial.configures[configIndex].c_logics =
        project.serial.configures[configIndex].c_logics.filter(
          (c) => c._id != cLogicId
        );
    }
    await project.save();
  }
}
