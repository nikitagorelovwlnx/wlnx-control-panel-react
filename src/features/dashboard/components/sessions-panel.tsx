import { ChevronLeft, X, FileText, Calendar, Trash2 } from 'lucide-react';
import { useUserSessions } from '@/features/users/api/use-users';
import { useDeleteSession } from '@/features/sessions/api/use-sessions';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { formatDateTime, truncate } from '@/shared/lib/utils';

interface SessionsPanelProps {
  userEmail: string;
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId: string | null;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SessionsPanel({
  userEmail,
  onSessionSelect,
  selectedSessionId,
  onClose,
  collapsed,
  onToggleCollapse,
}: SessionsPanelProps) {
  const { data: sessions, isLoading } = useUserSessions(userEmail);
  const deleteSession = useDeleteSession();

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this session?')) {
      try {
        await deleteSession.mutateAsync(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('Failed to delete session');
      }
    }
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 h-full">
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </Button>
        <div className="writing-mode-vertical text-sm font-medium text-muted-foreground">
          Sessions
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold">Sessions</h2>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={onToggleCollapse}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No sessions found</div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                  selectedSessionId === session.id
                    ? 'bg-accent border-primary'
                    : 'bg-card hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Session {session.id.slice(0, 8)}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDelete(session.id, e)}
                    disabled={deleteSession.isPending}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDateTime(session.created_at)}</span>
                </div>

                {session.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {truncate(session.summary, 80)}
                  </p>
                )}

                {session.wellness_data && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {session.wellness_data.stress_level !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Stress: {session.wellness_data.stress_level}
                      </Badge>
                    )}
                    {session.wellness_data.sleep_hours !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Sleep: {session.wellness_data.sleep_hours}h
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
