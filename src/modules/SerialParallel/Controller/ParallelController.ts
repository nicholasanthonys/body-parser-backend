import ProjectController from "src/modules/Project/Controller/ProjectController";
import { IProject, Project } from "src/modules/Project/Project";
import { ConfigureFileSerial } from "src/modules/SerialParallel/ConfigureFileSerial";
import { CLogic, ICLogic } from "src/modules/SerialParallel/CLogic";
import {
  IStoreParallelDTO,
  IStoreSingleConfigParallelDTO,
} from "../DTO/StoreParallelDTO";
import { IParallel, Parallel } from "../Parallel";
import { ConfigureFile, IConfigureFile } from "../ConfigureFile";

import { IUpdateSingleConfigParallelDTO } from "../DTO/UpdateParallelDTO";
import {
  IStoreSingleCLogicItemDTO,
  IUpdateSingleCLogicItemDTO,
} from "../DTO/CLogicDTO";
import { FinalResponse, IFinalResponseConfig } from "src/modules/Response";
import { IResponseDTO } from "../DTO/StoreResponseDTO";
export default class ParallelController {
  projectController: ProjectController = new ProjectController();

  async storeParallel(
    storeParallelDTO: IStoreParallelDTO,
    projectId: string,
    userId: string
  ): Promise<IParallel> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    project.parallel = new Parallel({
      configures: storeParallelDTO.configures,
      failure_response: storeParallelDTO.failure_response,
      c_logics: storeParallelDTO.c_logics,
    });
    await project.save();
    return project.parallel;
  }

  async storeNextFailure(
    storeNextFailure: IResponseDTO,
    projectId: string,
    userId: string
  ): Promise<IFinalResponseConfig> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (project.parallel) {
      project.parallel.failure_response = new FinalResponse({
        status_code: storeNextFailure.status_code,
        transform: storeNextFailure.transform,
        adds: storeNextFailure.adds,
        modifies: storeNextFailure.modifies,
        deletes: storeNextFailure.deletes,
      });

      await project.save();
      return project.parallel?.failure_response;
    }
    throw new Error("Project's Parallel not defined");
  }

  async storeSingleConfigParallel(
    storeSingleConfigParallelDTO: IStoreSingleConfigParallelDTO,
    projectId: string,
    userId: string
  ): Promise<IConfigureFile> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    project.parallel?.configures.push(
      new ConfigureFile({
        configure_id: storeSingleConfigParallelDTO.configure_id,
        alias: storeSingleConfigParallelDTO.alias,
        loop: storeSingleConfigParallelDTO.loop,
      })
    );

    await project.save();
    return project.parallel?.configures[project.parallel.configures.length - 1];
  }

  async storeSingleCLogicParallel(
    storeSingleCLogicParallelDTO: IStoreSingleCLogicItemDTO,
    projectId: string,
    userId: string
  ): Promise<ICLogic> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    project.parallel?.c_logics.push(
      new CLogic({
        rule: storeSingleCLogicParallelDTO.rule,
        data: storeSingleCLogicParallelDTO.data,
        next_success: storeSingleCLogicParallelDTO.next_success,
        response: storeSingleCLogicParallelDTO.response,
        next_failure: storeSingleCLogicParallelDTO.next_failure,
        failure_response: storeSingleCLogicParallelDTO.failure_response,
      })
    );

    await project.save();
    return project.parallel?.c_logics[project.parallel.c_logics.length - 1];
  }

  async updateSingleConfigParallel(
    storeSingleConfigParallelDTO: IUpdateSingleConfigParallelDTO,
    projectId: string,
    userId: string
  ): Promise<IConfigureFile> {
    let project = await this.projectController.show(projectId, userId);

    if (!project) {
      throw new Error("Project not found");
    }
    if (!project.parallel) {
      throw new Error("Project's Parallel not defined");
    }

    let index = project.parallel.configures.findIndex(
      (e) => e._id == storeSingleConfigParallelDTO.id
    );
    if (index != undefined && index >= 0) {
      project.parallel.configures[index].configure_id =
        storeSingleConfigParallelDTO.configure_id;
      project.parallel.configures[index].alias =
        storeSingleConfigParallelDTO.alias;
      project.parallel.configures[index].loop =
        storeSingleConfigParallelDTO.loop;
      await project.save();
      return project.parallel.configures[index];
    }
    throw new Error("Project's Parallel configureation not found");
  }

  async updateSingleCLogicParallel(
    updateSingleCLogicParallelDTO: IUpdateSingleCLogicItemDTO,
    projectId: string,
    userId: string
  ): Promise<ICLogic> {
    let project = await this.projectController.show(projectId, userId);

    if (!project) {
      throw new Error("Project not defined");
    }

    if (!project.parallel) {
      throw new Error("Project's parallel not defined");
    }

    let index = project.parallel.c_logics.findIndex(
      (e) => e._id == updateSingleCLogicParallelDTO.id
    );
    if (index != undefined && index >= 0) {
      project.parallel.c_logics[index].rule =
        updateSingleCLogicParallelDTO.rule;
      project.parallel.c_logics[index].data =
        updateSingleCLogicParallelDTO.data;
      project.parallel.c_logics[index].next_success =
        updateSingleCLogicParallelDTO.next_success;

      if (updateSingleCLogicParallelDTO.response) {
        project.parallel.c_logics[index].response = new FinalResponse({
          status_code: updateSingleCLogicParallelDTO.response.status_code,
          transform: updateSingleCLogicParallelDTO.response.transform,
          adds: updateSingleCLogicParallelDTO.response.adds,
          modifies: updateSingleCLogicParallelDTO.response.modifies,
          deletes: updateSingleCLogicParallelDTO.response.deletes,
        });
      } else {
        project.parallel.c_logics[index].response = null;
      }

      project.parallel.c_logics[index].next_failure =
        updateSingleCLogicParallelDTO.next_failure;
      if (updateSingleCLogicParallelDTO.failure_response) {
        project.parallel.c_logics[index].failure_response = new FinalResponse({
          status_code:
            updateSingleCLogicParallelDTO.failure_response.status_code,
          transform: updateSingleCLogicParallelDTO.failure_response.transform,
          adds: updateSingleCLogicParallelDTO.failure_response.adds,
          modifies: updateSingleCLogicParallelDTO.failure_response.modifies,
          deletes: updateSingleCLogicParallelDTO.failure_response.deletes,
        });
      } else {
        project.parallel.c_logics[index].failure_response = null;
      }

      await project.save();
      return project.parallel.c_logics[index];
    }
    throw new Error("Project parallel logic not found");
  }

  async getParallel(projectId: string, userId: string): Promise<IParallel> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }
    return project.parallel;
  }

  async updateParallel(
    storeParallelDTO: IStoreParallelDTO,
    projectId: string,
    userId: string
  ): Promise<IParallel> {
    let project = await this.projectController.show(projectId, userId);
    if (!project) {
      throw new Error("Project's not defined");
    }

    if (project.parallel != null) {
      project.parallel.configures = [];
      storeParallelDTO.configures.forEach((element) => {
        let configureFile = new ConfigureFileSerial({
          configure_id: element.configure_id,
          alias: element.alias,
        });
        project.parallel?.configures.push(configureFile);
      });

      project.parallel.failure_response.status_code =
        storeParallelDTO.failure_response.status_code;
      project.parallel.failure_response.transform =
        storeParallelDTO.failure_response.transform;

      project.parallel.failure_response.adds.header =
        storeParallelDTO.failure_response.adds.header;
      project.parallel.failure_response.adds.body =
        storeParallelDTO.failure_response.adds.body;

      project.parallel.failure_response.modifies.header =
        storeParallelDTO.failure_response.modifies.header;
      project.parallel.failure_response.modifies.body =
        storeParallelDTO.failure_response.modifies.body;

      project.parallel.c_logics = [];
      storeParallelDTO.c_logics.forEach((element) => {
        let cLogicItem = new CLogic({
          rule: element.rule,
          data: element.data,
          next_success: element.next_success,
          response: element.response,
          next_failure: element.next_failure,
          failure_response: element.failure_response,
        });
        project.parallel?.c_logics.push(cLogicItem);
      });

      let updatedProject = await project.save();
      return updatedProject.parallel;
    }
    throw new Error("Project's parallel not defined");
  }

  async deleteParallel(projectId: string, userId: string) {
    const project = (await Project.findOne({
      _id: projectId,
      userId,
    })) as IProject;
    if (project) {
      project.parallel.delete();
      await project.save();
    }
    throw new Error("Projec not found");
  }
}
