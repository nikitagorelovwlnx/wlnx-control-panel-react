import { ChevronLeft, Users, Calendar, Activity, Trash2 } from 'lucide-react';
import { useUsers, useDeleteAllUserSessions } from '@/features/users/api/use-users';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { formatRelativeTime, formatDate } from '@/shared/lib/utils';

interface UsersPanelProps {
  onUserSelect: (email: string) => void;
  selectedUserEmail: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function UsersPanel({
  onUserSelect,
  selectedUserEmail,
  collapsed,
  onToggleCollapse,
}: UsersPanelProps) {
  const { data: users, isLoading, error } = useUsers();
  const deleteAllSessions = useDeleteAllUserSessions();

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
          Users
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="font-semibold">Users</h2>
          {users && <Badge variant="secondary">{users.length}</Badge>}
        </div>
        <Button size="icon" variant="ghost" onClick={onToggleCollapse}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-sm text-destructive">
            Failed to load users
          </div>
        ) : !users || users.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No users found</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.email}
                onClick={() => onUserSelect(user.email)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                  selectedUserEmail === user.email
                    ? 'bg-accent border-primary'
                    : 'bg-card hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{user.email}</h3>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDeleteAll(user.email, e)}
                    disabled={deleteAllSessions.isPending}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {user.session_count} sessions
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>{formatRelativeTime(user.last_session)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(user.first_session)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
