import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { EventsService } from '../events/events.service';
import { ProjectsService } from '../projects/projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly eventsService: EventsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  async findByProject(
    @Request() req,
    @Query('projectId') projectId: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    // Verify project belongs to user
    await this.projectsService.findOne(req.user._id, projectId);

    return this.sessionsService.findByProject(
      projectId,
      limit ? +limit : 50,
      skip ? +skip : 0,
    );
  }

  @Get(':sessionId')
  async findOne(@Param('sessionId') sessionId: string) {
    const session = await this.sessionsService.findOne(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  @Get(':sessionId/events')
  async getEvents(@Param('sessionId') sessionId: string) {
    const events = await this.eventsService.getEventsBySession(sessionId);
    return { events };
  }
}
