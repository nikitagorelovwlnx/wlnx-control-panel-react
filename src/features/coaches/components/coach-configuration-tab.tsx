import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useCoaches, useUpdateCoach } from '../api/use-coaches';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';

export function CoachConfigurationTab() {
  const { data: coaches, isLoading, refetch } = useCoaches();
  const updateCoach = useUpdateCoach();

  // Use the first (default) coach from server
  const defaultCoach = coaches?.[0];
  const [editedContent, setEditedContent] = useState('');

  // Initialize edited content when coach loads
  useEffect(() => {
    if (defaultCoach) {
      setEditedContent(defaultCoach.coach_prompt_content);
    }
  }, [defaultCoach]);

  const handleSave = async () => {
    if (!defaultCoach) return;
    
    try {
      await updateCoach.mutateAsync({
        id: defaultCoach.id,
        coach: { coach_prompt_content: editedContent },
      });
      alert('Coach prompt saved successfully!');
    } catch (error) {
      console.error('Failed to save coach:', error);
      alert('Failed to save coach');
    }
  };

  const handleRestore = async () => {
    if (!defaultCoach) return;
    
    try {
      // Restore by sending empty content - server will return default
      await updateCoach.mutateAsync({
        id: defaultCoach.id,
        coach: { coach_prompt_content: '' },
      });
      await refetch();
      alert('Coach prompt restored to default!');
    } catch (error) {
      console.error('Failed to restore coach:', error);
      alert('Failed to restore coach');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!defaultCoach) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No coach configuration found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coach Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure the default coach prompt (loaded from server)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRestore}
            disabled={updateCoach.isPending}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restore Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateCoach.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateCoach.isPending ? 'Saving...' : 'Save Coach'}
          </Button>
        </div>
      </div>

      {/* Coach Info */}
      <Card>
        <CardHeader>
          <CardTitle>{defaultCoach.name}</CardTitle>
          {defaultCoach.description && (
            <p className="text-sm text-muted-foreground">{defaultCoach.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium mb-2 block">Coach Prompt Content</label>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Enter coach prompt content"
              rows={20}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
