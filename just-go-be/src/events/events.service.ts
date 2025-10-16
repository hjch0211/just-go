import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Session, SessionDocument } from '../schemas/session.schema';
import { TrackEventsRequest } from './_requests';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async trackEvents(projectId: string, request: TrackEventsRequest) {
    const { sessionId, events, userAgent, ip } = request;

    // Find or create session
    let session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      session = await this.sessionModel.create({
        projectId,
        sessionId,
        userAgent,
        ip,
        startedAt: new Date(),
        lastActivityAt: new Date(),
        eventCount: events.length,
      });
    } else {
      // Update session
      session.lastActivityAt = new Date();
      session.eventCount += events.length;
      session.duration = session.lastActivityAt.getTime() - session.startedAt.getTime();
      await session.save();
    }

    // Save events
    await this.eventModel.create({
      sessionId: session._id,
      projectId,
      events,
    });

    return { success: true };
  }

  async getEventsBySession(sessionId: string) {
    const session = await this.sessionModel.findOne({ sessionId });
    if (!session) {
      return [];
    }

    const events = await this.eventModel
      .find({ sessionId: session._id })
      .sort({ createdAt: 1 });

    // Flatten all events
    const allEvents = events.reduce((acc, eventDoc) => {
      return acc.concat(eventDoc.events);
    }, []);

    return allEvents;
  }
}
