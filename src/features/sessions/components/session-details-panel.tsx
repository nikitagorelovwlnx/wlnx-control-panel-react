import { X, FileText, MessageSquare, Activity } from 'lucide-react';
import { useSession } from '../api/use-sessions';
import { useUIStore } from '@/shared/store/ui-store';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { formatDateTime } from '@/shared/lib/utils';
import { useEffect } from 'react';

export function SessionDetailsPanel() {
  const { isDetailsPanelOpen, selectedSessionId, closeDetailsPanel } = useUIStore();
  const { data: session, isLoading } = useSession(selectedSessionId);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDetailsPanelOpen) {
        closeDetailsPanel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDetailsPanelOpen, closeDetailsPanel]);

  if (!isDetailsPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeDetailsPanel}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-background border-l shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Session Details</h2>
            {session && (
              <p className="text-sm text-muted-foreground">{formatDateTime(session.created_at)}</p>
            )}
          </div>
          <Button size="icon" variant="ghost" onClick={closeDetailsPanel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !session ? (
            <div className="text-center py-8 text-muted-foreground">Session not found</div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              {session.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{session.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Wellness Data */}
              {session.wellness_data && Object.keys(session.wellness_data).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="h-4 w-4" />
                      Wellness Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {session.wellness_data.age !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground">Age</div>
                          <div className="font-medium">{session.wellness_data.age}</div>
                        </div>
                      )}
                      {session.wellness_data.weight !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground">Weight</div>
                          <div className="font-medium">{session.wellness_data.weight} kg</div>
                        </div>
                      )}
                      {session.wellness_data.height !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground">Height</div>
                          <div className="font-medium">{session.wellness_data.height} cm</div>
                        </div>
                      )}
                      {session.wellness_data.stress_level !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground">Stress Level</div>
                          <div className="font-medium">{session.wellness_data.stress_level}/10</div>
                        </div>
                      )}
                      {session.wellness_data.sleep_hours !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground">Sleep Hours</div>
                          <div className="font-medium">{session.wellness_data.sleep_hours}h</div>
                        </div>
                      )}
                      {session.wellness_data.activity_level && (
                        <div>
                          <div className="text-xs text-muted-foreground">Activity Level</div>
                          <div className="font-medium capitalize">
                            {session.wellness_data.activity_level}
                          </div>
                        </div>
                      )}
                      {session.wellness_data.goals && session.wellness_data.goals.length > 0 && (
                        <div className="col-span-2">
                          <div className="text-xs text-muted-foreground mb-2">Goals</div>
                          <div className="flex flex-wrap gap-2">
                            {session.wellness_data.goals.map((goal, idx) => (
                              <Badge key={idx} variant="secondary">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transcription */}
              {session.transcription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare className="h-4 w-4" />
                      Transcription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                      {session.transcription}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bot Conversation */}
              {session.bot_conversation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare className="h-4 w-4" />
                      Bot Conversation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                      {session.bot_conversation}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session ID</span>
                      <span className="font-mono">{session.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User</span>
                      <span>{session.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{formatDateTime(session.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span>{formatDateTime(session.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
