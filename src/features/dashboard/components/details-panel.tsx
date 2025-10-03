import { useState } from 'react';
import { X, Activity } from 'lucide-react';
import { useSession } from '@/features/sessions/api/use-sessions';
import { Button } from '@/ui/button';
import { formatDateTime } from '@/shared/lib/utils';
import { SummaryTab } from './details-tabs/summary-tab';
import { TranscriptTab } from './details-tabs/transcript-tab';
import { ChatGPTTab } from './details-tabs/chatgpt-tab';
import { WellnessTab } from './details-tabs/wellness-tab';

interface DetailsPanelProps {
  sessionId: string | null;
  onClose: () => void;
}

type TabType = 'summary' | 'transcript' | 'chatgpt' | 'wellness';

export function DetailsPanel({ sessionId, onClose }: DetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const { data: session, isLoading } = useSession(sessionId);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'transcript', label: 'Transcript' },
    { id: 'chatgpt', label: 'Chat GPT' },
    { id: 'wellness', label: 'Wellness' },
  ];

  if (!sessionId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Details</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Select a session to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold">Details</h2>
          {session && (
            <p className="text-xs text-muted-foreground">{formatDateTime(session.created_at)}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Polling indicator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Activity className="h-3 w-3 animate-pulse" />
            <span>Live</span>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !session ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Session not found</p>
          </div>
        ) : (
          <>
            {activeTab === 'summary' && <SummaryTab session={session} />}
            {activeTab === 'transcript' && <TranscriptTab session={session} />}
            {activeTab === 'chatgpt' && <ChatGPTTab session={session} />}
            {activeTab === 'wellness' && <WellnessTab session={session} />}
          </>
        )}
      </div>
    </div>
  );
}
