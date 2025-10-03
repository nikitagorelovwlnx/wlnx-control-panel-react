import type { Interview } from '@/shared/types/api';

interface ChatGPTTabProps {
  session: Interview;
}

export function ChatGPTTab({ session }: ChatGPTTabProps) {
  if (!session.bot_conversation) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No Chat GPT conversation available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-muted rounded-lg p-4">
        <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
          {session.bot_conversation}
        </pre>
      </div>
    </div>
  );
}
