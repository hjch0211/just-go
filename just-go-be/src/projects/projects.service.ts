import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { CreateProjectRequest } from './_requests';
import { ProjectConverter } from './_converters';
import { ProjectResponse } from './_responses';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    userId: string,
    request: CreateProjectRequest,
  ): Promise<ProjectResponse> {
    const { name, domain } = request;

    // Generate unique API key
    const apiKey = this.generateApiKey();

    const project = await this.projectModel.create({
      userId,
      name,
      domain,
      apiKey,
    });

    return ProjectConverter.toResponse(project);
  }

  async findAll(userId: string): Promise<ProjectResponse[]> {
    const projects = await this.projectModel
      .find({ userId })
      .sort({ createdAt: -1 });
    return ProjectConverter.toResponseList(projects);
  }

  async findOne(userId: string, projectId: string): Promise<ProjectResponse> {
    const project = await this.projectModel.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectConverter.toResponse(project);
  }

  async findByApiKey(apiKey: string) {
    const project = await this.projectModel.findOne({ apiKey, isActive: true });
    return project;
  }

  async delete(userId: string, projectId: string) {
    const result = await this.projectModel.deleteOne({
      _id: projectId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Project not found');
    }

    return { message: 'Project deleted successfully' };
  }

  async regenerateApiKey(
    userId: string,
    projectId: string,
  ): Promise<ProjectResponse> {
    const project = await this.projectModel.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.apiKey = this.generateApiKey();
    await project.save();

    return ProjectConverter.toResponse(project);
  }

  private generateApiKey(): string {
    return `jg_${randomBytes(32).toString('hex')}`;
  }
}
