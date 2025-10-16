import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async findByProject(projectId: string, limit = 50, skip = 0) {
    const sessions = await this.sessionModel
      .find({ projectId })
      .sort({ startedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await this.sessionModel.countDocuments({ projectId });

    return {
      sessions,
      total,
      limit,
      skip,
    };
  }

  async findOne(sessionId: string) {
    return this.sessionModel.findOne({ sessionId }).lean();
  }
}
