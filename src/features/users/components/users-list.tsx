import { Users, Calendar, Activity } from 'lucide-react';
import { useUsers, useDeleteAllUserSessions } from '../api/use-users';
import { useUIStore } from '@/shared/store/ui-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { formatRelativeTime, formatDate } from '@/shared/lib/utils';

export function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const { openSessionsPanel } = useUIStore();
  const deleteAllSessions = useDeleteAllUserSessions();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-destructive">
            Failed to load users. Please check if the API server is running.
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteAll = async (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete all sessions for ${email}?`)) {
      try {
        await deleteAllSessions.mutateAsync(email);
      } catch (error) {
        console.error('Failed to delete sessions:', error);
        alert('Failed to delete sessions');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users ({users?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!users || users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.email}
                onClick={() => openSessionsPanel(user.email)}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{user.email}</h3>
                      <Badge variant="secondary">{user.session_count} sessions</Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        <span>Last session: {formatRelativeTime(user.last_session)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>First session: {formatDate(user.first_session)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => handleDeleteAll(user.email, e)}
                      disabled={deleteAllSessions.isPending}
                    >
                      Delete All
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
