import { X, Trash2, FileText, Calendar } from 'lucide-react';
import { useUserSessions } from '@/features/users/api/use-users';
import { useDeleteSession } from '../api/use-sessions';
import { useUIStore } from '@/shared/store/ui-store';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { formatDateTime, truncate } from '@/shared/lib/utils';
import { useEffect } from 'react';

export function SessionsPanel() {
  const { isSessionsPanelOpen, selectedUserEmail, closeSessionsPanel, openDetailsPanel } =
    useUIStore();
  const { data: sessions, isLoading } = useUserSessions(selectedUserEmail);
  const deleteSession = useDeleteSession();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSessionsPanelOpen) {
        closeSessionsPanel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSessionsPanelOpen, closeSessionsPanel]);

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

  if (!isSessionsPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeSessionsPanel}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Sessions</h2>
            <p className="text-sm text-muted-foreground truncate">{selectedUserEmail}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={closeSessionsPanel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No sessions found</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => openDetailsPanel(session.id)}
                  className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Session {session.id.slice(0, 8)}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDelete(session.id, e)}
                      disabled={deleteSession.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateTime(session.created_at)}</span>
                  </div>

                  {session.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {truncate(session.summary, 100)}
                    </p>
                  )}

                  {session.wellness_data && (
                    <div className="flex gap-2 mt-2 flex-wrap">
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
    </>
  );
}
