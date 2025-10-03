import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import {
  usePromptsConfiguration,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
  useCreatePrompt,
  useUpdatePrompt,
  useDeletePrompt,
} from '../api/use-prompts';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Badge } from '@/ui/badge';
import type { ConversationStage, Prompt } from '@/shared/types/api';

export function PromptsConfiguration() {
  const { data: config, isLoading } = usePromptsConfiguration();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const deletePrompt = useDeletePrompt();

  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [newStage, setNewStage] = useState<Partial<ConversationStage> | null>(null);
  const [newPrompt, setNewPrompt] = useState<Partial<Prompt> | null>(null);

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

  const stages = config?.stages || [];
  const prompts = config?.prompts || [];

  const handleCreateStage = async () => {
    if (!newStage?.name) return;
    try {
      await createStage.mutateAsync({
        name: newStage.name,
        description: newStage.description || '',
        order: stages.length + 1,
      });
      setNewStage(null);
    } catch (error) {
      console.error('Failed to create stage:', error);
    }
  };

  const handleUpdateStage = async (id: string, updates: Partial<ConversationStage>) => {
    try {
      await updateStage.mutateAsync({ id, stage: updates });
      setEditingStage(null);
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const handleDeleteStage = async (id: string) => {
    if (confirm('Delete this stage and all its prompts?')) {
      try {
        await deleteStage.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete stage:', error);
      }
    }
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt?.stageId || !newPrompt?.content) return;
    try {
      await createPrompt.mutateAsync({
        stageId: newPrompt.stageId,
        content: newPrompt.content,
        order: prompts.filter((p) => p.stageId === newPrompt.stageId).length + 1,
        isActive: true,
        description: newPrompt.description,
      });
      setNewPrompt(null);
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  const handleUpdatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      await updatePrompt.mutateAsync({ id, prompt: updates });
      setEditingPrompt(null);
    } catch (error) {
      console.error('Failed to update prompt:', error);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Delete this prompt?')) {
      try {
        await deletePrompt.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete prompt:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversation Stages</CardTitle>
            <Button size="sm" onClick={() => setNewStage({ name: '', description: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.id} className="p-4 rounded-lg border bg-card">
                {editingStage === stage.id ? (
                  <div className="space-y-3">
                    <Input
                      defaultValue={stage.name}
                      placeholder="Stage name"
                      onBlur={(e) => handleUpdateStage(stage.id, { name: e.target.value })}
                    />
                    <Textarea
                      defaultValue={stage.description}
                      placeholder="Description"
                      onBlur={(e) => handleUpdateStage(stage.id, { description: e.target.value })}
                    />
                    <Button size="sm" onClick={() => setEditingStage(null)}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{stage.name}</h4>
                        <Badge variant="outline">Order: {stage.order}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingStage(stage.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteStage(stage.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {newStage && (
              <div className="p-4 rounded-lg border bg-accent">
                <div className="space-y-3">
                  <Input
                    placeholder="Stage name"
                    value={newStage.name || ''}
                    onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newStage.description || ''}
                    onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateStage}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setNewStage(null)}>
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

      {/* Prompts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prompts</CardTitle>
            <Button
              size="sm"
              onClick={() =>
                setNewPrompt({ stageId: stages[0]?.id || '', content: '', description: '' })
              }
              disabled={stages.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Create a stage first to add prompts
            </div>
          ) : (
            <div className="space-y-6">
              {stages.map((stage) => {
                const stagePrompts = prompts.filter((p) => p.stageId === stage.id);
                return (
                  <div key={stage.id}>
                    <h4 className="font-medium mb-3">{stage.name}</h4>
                    <div className="space-y-3">
                      {stagePrompts.map((prompt) => (
                        <div key={prompt.id} className="p-4 rounded-lg border bg-card">
                          {editingPrompt === prompt.id ? (
                            <div className="space-y-3">
                              <Textarea
                                defaultValue={prompt.content}
                                placeholder="Prompt content"
                                rows={4}
                                onBlur={(e) =>
                                  handleUpdatePrompt(prompt.id, { content: e.target.value })
                                }
                              />
                              <Input
                                defaultValue={prompt.description}
                                placeholder="Description (optional)"
                                onBlur={(e) =>
                                  handleUpdatePrompt(prompt.id, { description: e.target.value })
                                }
                              />
                              <Button size="sm" onClick={() => setEditingPrompt(null)}>
                                Done
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={prompt.isActive ? 'success' : 'secondary'}>
                                    {prompt.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                  <Badge variant="outline">Order: {prompt.order}</Badge>
                                </div>
                                <p className="text-sm mb-2 whitespace-pre-wrap">{prompt.content}</p>
                                {prompt.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {prompt.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingPrompt(prompt.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleUpdatePrompt(prompt.id, { isActive: !prompt.isActive })
                                  }
                                >
                                  {prompt.isActive ? '👁️' : '👁️‍🗨️'}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {newPrompt && (
                <div className="p-4 rounded-lg border bg-accent">
                  <div className="space-y-3">
                    <select
                      className="w-full p-2 rounded-md border bg-background"
                      value={newPrompt.stageId || ''}
                      onChange={(e) => setNewPrompt({ ...newPrompt, stageId: e.target.value })}
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                    <Textarea
                      placeholder="Prompt content"
                      rows={4}
                      value={newPrompt.content || ''}
                      onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newPrompt.description || ''}
                      onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreatePrompt}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setNewPrompt(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
