import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TrackEventsRequest {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsArray()
  @IsNotEmpty()
  events: any[];

  @IsString()
  userAgent?: string;

  @IsString()
  ip?: string;
}
