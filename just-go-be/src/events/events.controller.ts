import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiKeyGuard } from './api-key.guard';
import { TrackEventsRequest } from './_requests';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('track')
  @UseGuards(ApiKeyGuard)
  async trackEvents(@Request() req, @Body() request: TrackEventsRequest) {
    const projectId = req.project._id;
    return this.eventsService.trackEvents(projectId, request);
  }
}
