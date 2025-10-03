import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { usePromptsConfiguration } from '../api/use-prompts';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { CoachConfigurationTab } from '@/features/coaches/components/coach-configuration-tab';

export function PromptsConfigurationNew() {
  const { data: config, isLoading } = usePromptsConfiguration();
  const [activeStage, setActiveStage] = useState<string>('coach');
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({});

  // Load saved active stage from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wlnx-active-prompts-stage');
    if (saved) {
      setActiveStage(saved);
    }
  }, []);

  // Save active stage to localStorage
  useEffect(() => {
    if (activeStage) {
      localStorage.setItem('wlnx-active-prompts-stage', activeStage);
    }
  }, [activeStage]);

  // Initialize edited prompts when config loads
  useEffect(() => {
    if (config?.prompts) {
      const initial: Record<string, string> = {};
      config.prompts.forEach(prompt => {
        initial[prompt.id] = prompt.content;
      });
      setEditedPrompts(initial);
    }
  }, [config]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load configuration</p>
      </div>
    );
  }

  const handlePromptChange = (promptId: string, value: string) => {
    setEditedPrompts(prev => ({
      ...prev,
      [promptId]: value,
    }));
  };

  const handleSaveStage = async (stageId: string) => {
    console.log('Saving stage:', stageId);
    // TODO: Implement save functionality
    alert('Save functionality will be implemented');
  };

  const handleRestoreDefaults = async (stageId: string) => {
    if (confirm('Restore default prompts for this stage?')) {
      console.log('Restoring defaults for stage:', stageId);
      // TODO: Implement restore functionality
      alert('Restore functionality will be implemented');
    }
  };

  const getStagePrompts = (stageId: string) => {
    return config.prompts.filter(p => p.stageId === stageId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stage Tabs */}
      <div className="flex border-b bg-background sticky top-0 z-10">
        <button
          onClick={() => setActiveStage('coach')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeStage === 'coach'
              ? 'border-primary text-primary bg-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          Coach
        </button>
        {config.stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeStage === stage.id
                ? 'border-primary text-primary bg-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {stage.name}
          </button>
        ))}
      </div>

      {/* Stage Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeStage === 'coach' ? (
          <CoachConfigurationTab />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stage Header with Actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {config.stages.find(s => s.id === activeStage)?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {config.stages.find(s => s.id === activeStage)?.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleRestoreDefaults(activeStage)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore Defaults
                </Button>
                <Button
                  onClick={() => handleSaveStage(activeStage)}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Stage
                </Button>
              </div>
            </div>

            {/* Prompts */}
            <div className="space-y-6">
              {getStagePrompts(activeStage).map((prompt) => (
                <div key={prompt.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        #{prompt.order}
                      </span>
                      <h3 className="font-medium">{prompt.description || 'Prompt'}</h3>
                    </div>
                  </div>
                  <Textarea
                    value={editedPrompts[prompt.id] || prompt.content}
                    onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder="Enter prompt text..."
                  />
                </div>
              ))}

              {getStagePrompts(activeStage).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No prompts configured for this stage
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
