import { Configure } from "src/modules/Configure/Configure";
import { IProject, Project } from "../Project";
import IStoreProjectDTO from "../DTO/StoreProjectDTO";
import IUpdateProjectDTO from "../DTO/UpdateProjectDTO";

export default class ProjectController {
  async store(
    storeProjectDTO: IStoreProjectDTO,
    userId: string
  ): Promise<IProject> {
    return await new Project({
      userId,
      name: storeProjectDTO.name,
      description: storeProjectDTO.description,
      base: storeProjectDTO.base,
    }).save({
      //* Set check keys = false in order to insert key with ($) or (.)
      checkKeys: false,
    });
  }

  async getAll(userId: string) {
    //* Get project without its configures, and sort by date (newest or descending)
    return await Project.find({ userId })
      .sort({ date: "desc" })
      .select(["-configures", "-serial", "-parallel"]);
  }

  async show(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById({
      _id: projectId,
      userId,
    });
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  async update(updateProjectDTO: IUpdateProjectDTO) {
    const project = (await Project.findById(updateProjectDTO.id)) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    project.name = updateProjectDTO.name;
    project.description = updateProjectDTO.description;
    project.base.project_max_circular =
      updateProjectDTO.base.project_max_circular;
    project.base.circular_response.status_code =
      updateProjectDTO.base.circular_response.status_code;

    project.base.circular_response.log_before_modify =
      updateProjectDTO.base.circular_response.log_before_modify;
    project.base.circular_response.log_after_modify =
      updateProjectDTO.base.circular_response.log_after_modify;

    project.base.circular_response.adds.header =
      updateProjectDTO.base.circular_response.adds.header;

    project.base.circular_response.adds.header =
      updateProjectDTO.base.circular_response.adds.header;
    project.base.circular_response.adds.body =
      updateProjectDTO.base.circular_response.adds.body;

    project.base.circular_response.modifies.header =
      updateProjectDTO.base.circular_response.modifies.header;
    project.base.circular_response.modifies.body =
      updateProjectDTO.base.circular_response.modifies.body;

    project.base.circular_response.deletes.header =
      updateProjectDTO.base.circular_response.deletes.header;
    project.base.circular_response.deletes.body =
      updateProjectDTO.base.circular_response.deletes.body;

    return await project.save();
  }

  async delete(id: string, userId: string) {
    const project = await Project.findOne({ _id: id, userId });
    if(!project){
      throw new Error("Project not found");
    }
      await Project.deleteOne({ _id: id, userId });
      //* Delete related configures
      await Configure.deleteMany({ projectId: project._id });
  }
}
