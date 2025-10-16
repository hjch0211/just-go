import { ProjectDocument } from '../schemas/project.schema';
import { ProjectResponse } from './_responses';

export class ProjectConverter {
  static toResponse(project: ProjectDocument): ProjectResponse {
    return {
      id: project._id.toString(),
      name: project.name,
      domain: project.domain,
      apiKey: project.apiKey,
      isActive: project.isActive,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  static toResponseList(projects: ProjectDocument[]): ProjectResponse[] {
    return projects.map((project) => this.toResponse(project));
  }
}
