import { IProject, Project } from "src/modules/Project/Project";
import { FinalResponse } from "src/modules/Response";
import { CLogic, ICLogic } from "src/modules/SerialParallel/CLogic";
import {
  IStoreRequestSingleCLogicItemDTO,
  IStoreSingleCLogicItemDTO,
  IUpdateConfigureSingleCLogicItemDTO,
  IUpdateSingleCLogicItemDTO,
} from "src/modules/SerialParallel/DTO/CLogicDTO";
import { Config, Configure, IConfig, IConfigure } from "../Configure";
import IStoreConfigureDTO from "../DTO/StoreConfigureDTO";
import IUpdateConfigureDTO from "../DTO/UpdateConfigureDTO";

export default class ConfigureController {
  async store(
    storeConfigureDTO: IStoreConfigureDTO,
    userId: string
  ): Promise<IConfig> {
    const project = (await Project.findOne({
      _id: storeConfigureDTO.project_id,
      userId,
    })) as IProject;
    // const project = await Project.findOne({ _id: projectId, userId }) as IProject;
    // project.configures.confi
    if (project) {
      const newConfig = new Config({
        description: storeConfigureDTO.config.description,
        request: storeConfigureDTO.config.request,
        response: storeConfigureDTO.config.response,
      });
      project.configures.configs.push(newConfig);

      await project.save();
      return newConfig;
    }
    throw new Error("Project not found");
  }

  //* Get configures by project ids
  async getAll(projectId: string, userId: string): Promise<IConfigure> {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (project) {
      return project.configures;
    }
    throw new Error("Project not found");
  }

  async show(
    projectId: string,
    configureId: string,
    userId: string
  ): Promise<IConfig | null> {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (project) {
      let index = project.configures.configs.findIndex(
        (element) => element._id == configureId
      );
      if (index >= 0) {
        return project.configures.configs[index];
      }
      throw new Error("Config not found");
    }
    throw new Error("Project not found");
  }

  async update(
    updateProjectDTO: IUpdateConfigureDTO,
    configureId: string,
    userId: string
  ): Promise<IConfig | null> {
    const project = (await Project.findOne({
      _id: updateProjectDTO.project_id,
      userId,
    })) as IProject;
    if (project) {
      let index = project.configures.configs.findIndex(
        (element) => element._id == configureId
      );
      if (index >= 0) {
        project.configures.configs[index].description =
          updateProjectDTO.config.description;

        project.configures.configs[index].request.destination_url =
          updateProjectDTO.config.request.destination_url;
        project.configures.configs[index].request.destination_path =
          updateProjectDTO.config.request.destination_path;
        project.configures.configs[index].request.method =
          updateProjectDTO.config.request.method;

        project.configures.configs[index].request.transform =
          updateProjectDTO.config.request.transform;
        project.configures.configs[index].request.log_before_modify =
          updateProjectDTO.config.request.log_before_modify;
        project.configures.configs[index].request.log_after_modify =
          updateProjectDTO.config.request.log_after_modify;

        project.configures.configs[index].request.adds.header =
          updateProjectDTO.config.request.adds.header;
        project.configures.configs[index].request.adds.body =
          updateProjectDTO.config.request.adds.body;
        project.configures.configs[index].request.adds.query =
          updateProjectDTO.config.request.adds.query;

        project.configures.configs[index].request.modifies.header =
          updateProjectDTO.config.request.modifies.header;
        project.configures.configs[index].request.modifies.body =
          updateProjectDTO.config.request.modifies.body;
        project.configures.configs[index].request.modifies.query =
          updateProjectDTO.config.request.modifies.query;

        project.configures.configs[index].request.deletes.header =
          updateProjectDTO.config.request.deletes.header;
        project.configures.configs[index].request.deletes.body =
          updateProjectDTO.config.request.deletes.body;
        project.configures.configs[index].request.deletes.query =
          updateProjectDTO.config.request.deletes.query;

        project.configures.configs[index].response.status_code =
          updateProjectDTO.config.response.status_code;

        project.configures.configs[index].response.transform =
          updateProjectDTO.config.response.transform;
        project.configures.configs[index].response.log_before_modify =
          updateProjectDTO.config.response.log_before_modify;
        project.configures.configs[index].response.log_after_modify =
          updateProjectDTO.config.response.log_after_modify;

        project.configures.configs[index].response.adds.header =
          updateProjectDTO.config.response.adds.header;
        project.configures.configs[index].response.adds.body =
          updateProjectDTO.config.response.adds.body;

        project.configures.configs[index].response.modifies.header =
          updateProjectDTO.config.response.modifies.header;
        project.configures.configs[index].response.modifies.body =
          updateProjectDTO.config.response.modifies.body;

        project.configures.configs[index].response.deletes.header =
          updateProjectDTO.config.request.deletes.header;
        project.configures.configs[index].response.deletes.body =
          updateProjectDTO.config.request.deletes.body;

        const updatedProject = await project.save();
        return updatedProject.configures.configs[index];
      }
    }
    throw new Error("Project not found");
  }

  async delete(projectId: string, configureId: string, userId: string) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (!project) {
      throw new Error("Project not found");
    }
    project.configures.configs = project.configures.configs.filter(
      (element) => element._id != configureId
    );
    await project.save();
  }

  async storeSingleCLogicRequest(
    storeSingleCLogicRequestDTO: IStoreRequestSingleCLogicItemDTO,
    configureId: string,
    userId: string
  ): Promise<ICLogic> {
    const project = (await Project.findOne({
      _id: storeSingleCLogicRequestDTO.project_id,
      userId,
    })) as IProject;
    if (project) {
      let index = project.configures.configs.findIndex(
        (element) => element._id == configureId
      );
      if (index >= 0) {
        project.configures.configs[index].request.c_logics.push(
          new CLogic({
            rule: storeSingleCLogicRequestDTO.c_logic.rule,
            data: storeSingleCLogicRequestDTO.c_logic.data,
            next_success: storeSingleCLogicRequestDTO.c_logic.next_success,
            response: storeSingleCLogicRequestDTO.c_logic.response,
            next_failure: storeSingleCLogicRequestDTO.c_logic.next_failure,
            failure_response:
              storeSingleCLogicRequestDTO.c_logic.failure_response,
          })
        );

        console.log("Clogic is ");
        console.log(project.configures.configs[index].request.c_logics);
        console.log("clogic dto");
        console.log(storeSingleCLogicRequestDTO.c_logic);
        await project.save();
        return project.configures.configs[index].request.c_logics[
          project.configures.configs[index].request.c_logics.length - 1
        ];
      }
    }
    throw new Error("Project not found");
  }

  async updateSingleCLogicRequest(
    updateSingleCLogicRequestDTO: IUpdateConfigureSingleCLogicItemDTO,
    userId: string,
    configureId: string
  ): Promise<ICLogic> {
    const project = (await Project.findOne({
      _id: updateSingleCLogicRequestDTO.project_id,
      userId,
    })) as IProject;
    if (project) {
      let index = project.configures.configs.findIndex(
        (element) => element._id == configureId
      );
      if (index >= 0) {
        let cLogicIndex = project.configures.configs[
          index
        ].request.c_logics.findIndex(
          (e) => e._id == updateSingleCLogicRequestDTO.c_logic.id
        );
        if (cLogicIndex >= 0) {
          project.configures.configs[index].request.c_logics[cLogicIndex].rule =
            updateSingleCLogicRequestDTO.c_logic.rule;
          project.configures.configs[index].request.c_logics[cLogicIndex].data =
            updateSingleCLogicRequestDTO.c_logic.data;
          project.configures.configs[index].request.c_logics[
            cLogicIndex
          ].next_success = updateSingleCLogicRequestDTO.c_logic.next_success;

          if (
            project.configures.configs[index].request.c_logics[cLogicIndex]
              .response != null
          ) {
            project.configures.configs[index].request.c_logics[
              cLogicIndex
            ].response = new FinalResponse({
              status_code:
                updateSingleCLogicRequestDTO.c_logic.response.status_code,
              transform:
                updateSingleCLogicRequestDTO.c_logic.response.transform,
              adds: updateSingleCLogicRequestDTO.c_logic.response.adds,
              modifies: updateSingleCLogicRequestDTO.c_logic.response.modifies,
              deletes: updateSingleCLogicRequestDTO.c_logic.response.deletes,
            });
          } else {
            project.configures.configs[index].request.c_logics[
              cLogicIndex
            ].response = null;
          }

          project.configures.configs[index].request.c_logics[
            cLogicIndex
          ].next_failure = updateSingleCLogicRequestDTO.c_logic.next_failure;

          if (
            project.configures.configs[index].request.c_logics[cLogicIndex]
              .failure_response != null
          ) {
            project.configures.configs[index].request.c_logics[
              cLogicIndex
            ].failure_response = new FinalResponse({
              status_code:
                updateSingleCLogicRequestDTO.c_logic.failure_response
                  .status_code,
              transform:
                updateSingleCLogicRequestDTO.c_logic.failure_response.transform,
              adds: updateSingleCLogicRequestDTO.c_logic.failure_response.adds,
              modifies:
                updateSingleCLogicRequestDTO.c_logic.failure_response.modifies,
              deletes:
                updateSingleCLogicRequestDTO.c_logic.failure_response.deletes,
            });
          } else {
            project.configures.configs[index].request.c_logics[
              cLogicIndex
            ].failure_response = null;
          }

          await project.save();
          return project.configures.configs[index].request.c_logics[
            cLogicIndex
          ];
        }
      }
    }
    throw new Error("Project not found");
  }

  async deleteCLogic(
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
    let index = project.configures.configs.findIndex(
      (element) => element._id == configId
    );
    if (index >= 0) {
      project.configures.configs[index].request.c_logics =
        project.configures.configs[index].request.c_logics.filter(
          (cLogic) => cLogic._id != cLogicId
        );
      await project.save();
    }
    throw new Error("Config not found");
  }
}
