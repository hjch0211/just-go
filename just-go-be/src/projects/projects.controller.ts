import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectRequest } from './_requests';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Request() req, @Body() request: CreateProjectRequest) {
    return this.projectsService.create(req.user._id, request);
  }

  @Get()
  async findAll(@Request() req) {
    return this.projectsService.findAll(req.user._id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.projectsService.findOne(req.user._id, id);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.projectsService.delete(req.user._id, id);
  }

  @Put(':id/regenerate-api-key')
  async regenerateApiKey(@Request() req, @Param('id') id: string) {
    return this.projectsService.regenerateApiKey(req.user._id, id);
  }
}
