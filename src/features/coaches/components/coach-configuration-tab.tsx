import { useState } from 'react';
import { Save, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCoaches, useCreateCoach, useUpdateCoach, useDeleteCoach } from '../api/use-coaches';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Badge } from '@/ui/badge';
import { formatDateTime } from '@/shared/lib/utils';
import type { Coach } from '@/shared/types/api';

export function CoachConfigurationTab() {
  const { data: coaches, isLoading } = useCoaches();
  const createCoach = useCreateCoach();
  const updateCoach = useUpdateCoach();
  const deleteCoach = useDeleteCoach();

  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coach_prompt_content: '',
  });

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      description: coach.description || '',
      coach_prompt_content: coach.coach_prompt_content,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingCoach(null);
    setFormData({
      name: '',
      description: '',
      coach_prompt_content: '',
    });
  };

  const handleSave = async () => {
    try {
      if (editingCoach) {
        await updateCoach.mutateAsync({
          id: editingCoach.id,
          coach: formData,
        });
      } else if (isCreating) {
        await createCoach.mutateAsync({
          ...formData,
          isActive: true,
        });
      }
      setEditingCoach(null);
      setIsCreating(false);
      setFormData({ name: '', description: '', coach_prompt_content: '' });
    } catch (error) {
      console.error('Failed to save coach:', error);
      alert('Failed to save coach');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this coach?')) {
      try {
        await deleteCoach.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete coach:', error);
        alert('Failed to delete coach');
      }
    }
  };

  const handleCancel = () => {
    setEditingCoach(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', coach_prompt_content: '' });
  };

  const handleToggleActive = async (coach: Coach) => {
    try {
      await updateCoach.mutateAsync({
        id: coach.id,
        coach: { isActive: !coach.isActive },
      });
    } catch (error) {
      console.error('Failed to toggle coach status:', error);
      alert('Failed to update coach status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show edit/create form
  if (editingCoach || isCreating) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingCoach ? 'Edit Coach' : 'Create New Coach'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Coach Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter coach name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Coach Prompt Content</label>
              <Textarea
                value={formData.coach_prompt_content}
                onChange={(e) =>
                  setFormData({ ...formData, coach_prompt_content: e.target.value })
                }
                placeholder="Enter coach prompt content"
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.coach_prompt_content}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show coaches list
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coach Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage coach profiles and their prompt configurations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coach
        </Button>
      </div>

      {!coaches || coaches.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No coaches configured</p>
              <Button variant="link" onClick={handleCreate} className="mt-2">
                Create your first coach
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {coaches.map((coach) => (
            <Card key={coach.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{coach.name}</CardTitle>
                      <Badge variant={coach.isActive ? 'success' : 'secondary'}>
                        {coach.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {coach.description && (
                      <p className="text-sm text-muted-foreground">{coach.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {formatDateTime(coach.createdAt)} • Updated:{' '}
                      {formatDateTime(coach.updatedAt)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleActive(coach)}
                      title={coach.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {coach.isActive ? '👁️' : '👁️‍🗨️'}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(coach)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(coach.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Prompt Content:
                  </div>
                  <pre className="text-xs whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                    {coach.coach_prompt_content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
