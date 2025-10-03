import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useCoaches, useCreateCoach, useUpdateCoach, useDeleteCoach } from '../api/use-coaches';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Badge } from '@/ui/badge';
import { formatDateTime } from '@/shared/lib/utils';
import type { Coach } from '@/shared/types/api';

export function CoachesConfiguration() {
  const { data: coaches, isLoading } = useCoaches();
  const createCoach = useCreateCoach();
  const updateCoach = useUpdateCoach();
  const deleteCoach = useDeleteCoach();

  const [editingCoach, setEditingCoach] = useState<string | null>(null);
  const [newCoach, setNewCoach] = useState<Partial<Coach> | null>(null);

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

  const handleCreateCoach = async () => {
    if (!newCoach?.name || !newCoach?.coach_prompt_content) return;
    try {
      await createCoach.mutateAsync({
        name: newCoach.name,
        description: newCoach.description || '',
        coach_prompt_content: newCoach.coach_prompt_content,
        isActive: true,
      });
      setNewCoach(null);
    } catch (error) {
      console.error('Failed to create coach:', error);
      alert('Failed to create coach');
    }
  };

  const handleUpdateCoach = async (id: string, updates: Partial<Coach>) => {
    try {
      await updateCoach.mutateAsync({ id, coach: updates });
      setEditingCoach(null);
    } catch (error) {
      console.error('Failed to update coach:', error);
      alert('Failed to update coach');
    }
  };

  const handleDeleteCoach = async (id: string) => {
    if (confirm('Delete this coach?')) {
      try {
        await deleteCoach.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete coach:', error);
        alert('Failed to delete coach');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Coaches Configuration</CardTitle>
          <Button
            size="sm"
            onClick={() =>
              setNewCoach({ name: '', description: '', coach_prompt_content: '', isActive: true })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coach
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!coaches || coaches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No coaches configured</div>
          ) : (
            coaches.map((coach) => (
              <div key={coach.id} className="p-4 rounded-lg border bg-card">
                {editingCoach === coach.id ? (
                  <div className="space-y-3">
                    <Input
                      defaultValue={coach.name}
                      placeholder="Coach name"
                      onBlur={(e) => handleUpdateCoach(coach.id, { name: e.target.value })}
                    />
                    <Textarea
                      defaultValue={coach.description}
                      placeholder="Description"
                      rows={2}
                      onBlur={(e) => handleUpdateCoach(coach.id, { description: e.target.value })}
                    />
                    <Textarea
                      defaultValue={coach.coach_prompt_content}
                      placeholder="Coach prompt content"
                      rows={6}
                      onBlur={(e) =>
                        handleUpdateCoach(coach.id, { coach_prompt_content: e.target.value })
                      }
                    />
                    <Button size="sm" onClick={() => setEditingCoach(null)}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{coach.name}</h4>
                          <Badge variant={coach.isActive ? 'success' : 'secondary'}>
                            {coach.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {coach.description && (
                          <p className="text-sm text-muted-foreground mb-2">{coach.description}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Created: {formatDateTime(coach.createdAt)} • Updated:{' '}
                          {formatDateTime(coach.updatedAt)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingCoach(coach.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateCoach(coach.id, { isActive: !coach.isActive })
                          }
                        >
                          {coach.isActive ? '👁️' : '👁️‍🗨️'}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteCoach(coach.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Prompt Content:
                      </div>
                      <div className="text-sm whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                        {coach.coach_prompt_content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {newCoach && (
            <div className="p-4 rounded-lg border bg-accent">
              <div className="space-y-3">
                <Input
                  placeholder="Coach name"
                  value={newCoach.name || ''}
                  onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  rows={2}
                  value={newCoach.description || ''}
                  onChange={(e) => setNewCoach({ ...newCoach, description: e.target.value })}
                />
                <Textarea
                  placeholder="Coach prompt content"
                  rows={6}
                  value={newCoach.coach_prompt_content || ''}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, coach_prompt_content: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateCoach}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setNewCoach(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
