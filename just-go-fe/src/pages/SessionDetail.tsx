import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionsApi } from '../api/sessions';
import type { Session, RRWebEvent } from '../types';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current = null;
      }
    };
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      const [sessionData, eventsData] = await Promise.all([
        sessionsApi.getOne(sessionId!),
        sessionsApi.getEvents(sessionId!),
      ]);

      setSession(sessionData);

      // Initialize rrweb player
      if (playerRef.current && eventsData.events.length > 0) {
        playerInstanceRef.current = new rrwebPlayer({
          target: playerRef.current,
          props: {
            events: eventsData.events as any[],
            width: 1024,
            height: 768,
            autoPlay: false,
          },
        });
      }
    } catch (err: any) {
      setError('Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading session replay...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={`/projects/${session.projectId}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Project
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Session Details
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Session ID</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {session.sessionId}
                </code>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Started At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(session.startedAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Activity</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(session.lastActivityAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {Math.round(session.duration / 1000)} seconds
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Event Count</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.eventCount}</dd>
            </div>
            {session.userAgent && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">User Agent</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">
                  {session.userAgent}
                </dd>
              </div>
            )}
            {session.ip && (
              <div>
                <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.ip}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Session Replay
          </h3>
          <div className="flex justify-center">
            <div ref={playerRef} className="rrweb-player-wrapper" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
