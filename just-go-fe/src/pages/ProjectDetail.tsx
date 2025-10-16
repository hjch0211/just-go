import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { sessionsApi } from '../api/sessions';
import type { Project, Session } from '../types';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const [projectData, sessionsData] = await Promise.all([
        projectsApi.getOne(projectId!),
        sessionsApi.getByProject(projectId!),
      ]);
      setProject(projectData);
      setSessions(sessionsData.sessions);
    } catch (err: any) {
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Are you sure you want to regenerate the API key? The old key will stop working.')) {
      return;
    }

    try {
      const updatedProject = await projectsApi.regenerateApiKey(projectId!);
      setProject(updatedProject);
    } catch (err: any) {
      setError('Failed to regenerate API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const trackingScript = `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
  script.onload = function() {
    var events = [];
    var sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    rrweb.record({
      emit(event) {
        events.push(event);

        // Send events every 10 seconds or when 50 events are collected
        if (events.length >= 50) {
          sendEvents();
        }
      },
    });

    // Send events periodically
    setInterval(sendEvents, 10000);

    // Send events before page unload
    window.addEventListener('beforeunload', sendEvents);

    function sendEvents() {
      if (events.length === 0) return;

      var eventsToSend = events.slice();
      events = [];

      fetch('${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '${project.apiKey}'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          events: eventsToSend,
          userAgent: navigator.userAgent
        }),
        keepalive: true
      });
    }
  };
  document.head.appendChild(script);
})();
</script>`;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {project.name}
          </h3>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Domain</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {project.domain}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      project.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">API Key</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {showApiKey ? project.apiKey : '••••••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(project.apiKey)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleRegenerateApiKey}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Regenerate
                    </button>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Tracking Script
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Add this script to your website's HTML to start tracking sessions.
            Place it in the <code>&lt;head&gt;</code> or before the closing <code>&lt;/body&gt;</code> tag.
          </p>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {trackingScript}
            </pre>
            <button
              onClick={() => copyToClipboard(trackingScript)}
              className="absolute top-2 right-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Copy Script
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recorded Sessions
          </h3>

          {sessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No sessions recorded yet. Add the tracking script to your website to start recording.
            </p>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Session ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Started At
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Events
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sessions.map((session) => (
                    <tr key={session._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <code className="text-xs">{session.sessionId}</code>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(session.startedAt).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {Math.round(session.duration / 1000)}s
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {session.eventCount}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/sessions/${session._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Replay
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
