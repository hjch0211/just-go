import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const project = await this.projectsService.findByApiKey(apiKey);

    if (!project) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.project = project;
    return true;
  }
}
